from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.database import get_db
from src.schemas import DataUser, UserCreate, UserLogin, UserSchema, UserUpdate
from src.models import User, Favorite
from src.repositories.user_repo import UserRepository
from src.security import verify_password

from passlib.context import CryptContext

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

# --- Création de compte ----
@router.post("/register", response_model=DataUser)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    repo = UserRepository(db)

    if repo.get_by_pseudo(user_in.pseudo):
        raise HTTPException(status_code=400, detail="Ce pseudo est déjà utilisé.")

    return repo.create(user_in)


# --- Connexion et vérification du mot de passe ---
@router.post("/login", response_model=DataUser)
def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    repo = UserRepository(db)

    user = repo.get_by_pseudo(user_credentials.pseudo)

    if not user:
        raise HTTPException(status_code=401, detail="Pseudo ou mot de passe incorrect")

    if not verify_password(user_credentials.password, user.password):
        raise HTTPException(status_code=401, detail="Pseudo ou mot de passe incorrect")

    return user

# --- Mise à jour des données d'un utilisateur ---
@router.patch("/{user_id}")
def update_user(user_id: int, update_data: UserUpdate, db: Session = Depends(get_db)):
    repo = UserRepository(db)

    user = repo.update(user_id, update_data)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user

# --- Ajout dans liste des favoris ---
@router.post("/{user_id}/favorites/{movie_id}")
def add_to_favorites(user_id: int, movie_id: int, db: Session = Depends(get_db)):
    repo = UserRepository(db)
    return repo.add_favorite(user_id, movie_id)

# --- Tous les favoris d'un utilisateur donné ---
@router.get("/{user_id}/favorites")
def list_favorites(user_id: int, db: Session = Depends(get_db)):
    repo = UserRepository(db)
    return repo.get_favorites(user_id)

# --- Suppression d'un film favoris ---
@router.delete("/{user_id}/favorites/{movie_id}")
def delete_favorite(user_id: int, movie_id: int, db: Session = Depends(get_db)):
    favorite = (
        db.query(Favorite)
        .filter(
            Favorite.user_id == user_id,
            Favorite.movie_id == movie_id
        )
        .first()
    )

    if not favorite:
        raise HTTPException(status_code=404, detail="Favorite not found")

    db.delete(favorite)
    db.commit()

    return {"message": "Favorite deleted"}

# --- Tous les utilisateurs ---
@router.get("/", response_model=list[UserSchema])
def read_users(db: Session = Depends(get_db)):
    return db.query(User).all()