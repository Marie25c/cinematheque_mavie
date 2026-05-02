import pytest
from fastapi.testclient import TestClient
from src.database import Base, engine, get_db, SessionLocal
from main import app

# Override de la dépendance pour s'assurer que l'API utilise la session de test
def override_get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_database():
    """Initialise la structure de la base avant les tests du module."""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

def test_health_check():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "message": "API is running"}

def test_register_user():
    user_data = {
        "pseudo": "testuser",
        "password": "securepassword123",
        "nom": "Doe",
        "prenom": "John",
        "mail": "john@example.com",
        "birthdate": "1990-01-01",
        "biographie": "Cinéphile passionné"
    }
    response = client.post("/users/register", json=user_data)
    assert response.status_code == 200
    assert response.json()["pseudo"] == "testuser"

def test_register_duplicate_pseudo():
    user_data = {
        "pseudo": "testuser",
        "password": "anotherpassword",
        "nom": "Duplicate",
        "prenom": "User",
        "mail": "dup@example.com"
    }
    response = client.post("/users/register", json=user_data)
    assert response.status_code == 400
    assert response.json()["detail"] == "Ce pseudo est déjà utilisé."

def test_login_success():
    login_data = {"pseudo": "testuser", "password": "securepassword123"}
    response = client.post("/users/login", json=login_data)
    assert response.status_code == 200
    assert "id" in response.json()

def test_search_movies_empty():
    response = client.get("/movies/search?rech=Inception")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_add_favorite_flow():
    # Récupération dynamique de l'ID pour éviter les erreurs de foreign key
    with SessionLocal() as db:
        from src.models.user import User
        user = db.query(User).filter_by(pseudo="testuser").first()
        user_id = user.id if user else 1
    
    movie_id = 99
    # Ajouter un favori
    response = client.post(f"/users/{user_id}/favorites/{movie_id}")
    assert response.status_code == 200
    
    # Lister les favoris
    response = client.get(f"/users/{user_id}/favorites")
    assert response.status_code == 200
    assert any(f["movie_id"] == movie_id for f in response.json())

    # Supprimer le favori
    response = client.delete(f"/users/{user_id}/favorites/{movie_id}")
    assert response.status_code == 200
    assert response.json()["message"] == "Favorite deleted"