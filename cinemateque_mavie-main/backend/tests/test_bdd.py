import pytest
import os
import csv
from sqlalchemy import inspect
from src.database import SessionLocal, engine
from src.models.base import Base
from src.models.movies import Movies
from src.gestion_bdd import import_csv, delete_table

TEST_CSV_PATH = "test_movies.csv"

@pytest.fixture(scope="module", autouse=True)
def setup_test_data():
    """Crée un fichier CSV temporaire et initialise la base."""
    header = ["Title", "Release_Date", "Overview", "Popularity", "Vote_Count", "Vote_Average", "Original_Language", "Genre", "Poster_Url"]
    data = [
        ["Inception", "2010-07-16", "A thief who steals corporate secrets...", "92.5", "1500", "8.8", "en", "Sci-Fi", "http://url1.com"],
        ["Interstellar", "2014-11-07", "A team of explorers travel through a wormhole...", "85.0", "1200", "8.6", "en", "Sci-Fi", "http://url2.com"],
        ["Inception", "2010-07-16", "Duplicate entry", "92.5", "1500", "8.8", "en", "Sci-Fi", "http://url1.com"]
    ]
    with open(TEST_CSV_PATH, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(header)
        writer.writerows(data)
    
    Base.metadata.create_all(bind=engine)
    yield
    
    if os.path.exists(TEST_CSV_PATH):
        os.remove(TEST_CSV_PATH)

def test_import_csv_logic():
    """Vérifie que l'import fonctionne et gère les doublons[cite: 3]."""
    # On vide la table avant le test pour repartir de zéro
    delete_table()
    
    # Importation via le script de gestion BDD
    import_csv(TEST_CSV_PATH)
    
    with SessionLocal() as db:
        movies = db.query(Movies).all()
        # On attend 2 films car le 3ème dans le CSV est un doublon de titre
        assert len(movies) == 2
        titles = [m.title for m in movies]
        assert "Inception" in titles
        assert "Interstellar" in titles

def test_database_schema():
    """Vérifie que les tables sont bien créées avec les bonnes colonnes[cite: 3]."""
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    
    assert "movies" in tables
    assert "user" in tables
    assert "favorite" in tables
    
    columns = [c["name"] for c in inspector.get_columns("movies")]
    assert "title" in columns
    assert "genre" in columns

def test_delete_table_content():
    """Vérifie que delete_table vide le contenu sans supprimer la structure[cite: 3]."""
    # On s'assure qu'il y a des données
    import_csv(TEST_CSV_PATH)
    
    # Action de suppression des données
    delete_table()
    
    with SessionLocal() as db:
        count = db.query(Movies).count()
        assert count == 0
    
    # Vérifie que la structure de la table existe toujours (schéma préservé)
    inspector = inspect(engine)
    assert "movies" in inspector.get_table_names()