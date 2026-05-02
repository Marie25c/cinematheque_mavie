from sqlalchemy import create_engine, Column, Integer, String, Date, Float, select, inspect, UniqueConstraint
from sqlalchemy.orm import declarative_base, sessionmaker
import csv
from datetime import datetime
import os
from src.database import engine, SessionLocal
from src.models.base import Base
from src.models.movies import Movies
from src.models.favorite import Favorite
from src.models.user import User

# ----------------------- Gestion Base des Données ----------------------------

# --------------------------- Import csv Movies -------------------------------

def parse_date(value: str):
    """Convertit une string en date ou retourne None si invalide"""
    try:
        return datetime.strptime(value, "%Y-%m-%d").date()
    except:
        return None

def import_csv(file_path: str):
    """Importe le CSV des films dans la base"""
    with SessionLocal() as db:
        existing_titles = {t[0] for t in db.query(Movies.title).all()}

        with open(file_path, newline='', encoding="utf-8") as csvfile:
            reader = csv.DictReader(csvfile, delimiter=",")

            for i, row in enumerate(reader, start=2): 
                try:
                    title = row.get("Title", "").strip()
                    if not title or title in existing_titles:
                        continue  

                    movie = Movies(
                        release_date=parse_date(row.get("Release_Date", "").strip()),
                        title=title,
                        overview=row.get("Overview", "").strip(),
                        popularity=float(row.get("Popularity") or 0.0),
                        vote_count=int(row.get("Vote_Count") or 0),
                        vote_average=float(row.get("Vote_Average") or 0.0),
                        original_language=row.get("Original_Language", "").strip(),
                        genre=row.get("Genre", "").strip(),
                        poster_url=row.get("Poster_Url", "").strip()
                    )

                    db.add(movie)
                    existing_titles.add(title) 

                except Exception as e:
                    print(f"Erreur ligne {i}: {e}")

            db.commit()
            print("Import terminé !")

# -------------------------------- DELETE ---------------------------------

def delete_table():
    with SessionLocal() as db:
        for table in reversed(Base.metadata.sorted_tables):
            db.execute(table.delete())
        db.commit()

def get_tables():
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print(tables)

def drop_all_tables():
    Base.metadata.drop_all(bind=engine)

# ------------------------------ Affichage ----------------------------------------------

def movie_to_dict(movie):
    return {
        "id": movie.id,
        "title": movie.title,
        "release_date": movie.release_date.isoformat() if movie.release_date else None,
        "overview": movie.overview,
        "popularity": movie.popularity,
        "vote_count": movie.vote_count,
        "original_language": movie.original_language,
        "genre": movie.genre,
        "poster_url": movie.poster_url,
    }

def results_mtod(movies):
    results=[]
    for m in movies:
        results.append(movie_to_dict(m))
    return results

def seed_if_empty():
    db = SessionLocal()
    try:
        if db.query(Movies).first() is None:
            print("DB vide → import initial...")
            import_csv("/app/database/Movie_Dataset.csv")
        else:
            print("DB déjà remplie → skip seed")
    finally:
        db.close()

