from pydantic import BaseModel, ConfigDict
from datetime import date

# Utilisé dans : search_movies, get_data, get_similar_movies [routers]
class MovieSchema(BaseModel):
    id: int
    release_date: date | None
    title: str
    overview: str | None
    popularity: float | None
    vote_count: int | None
    vote_average: float | None
    original_language: str | None
    genre: str | None
    poster_url: str | None

    model_config = ConfigDict(from_attributes=True)

# Utilsé dans : register
class UserCreate(BaseModel):
    pseudo: str
    password: str
    nom: str
    prenom: str | None = None
    mail: str | None = None
    birthdate: date | None = None
    biographie: str | None = None


# Utilisé dans : register, login
class DataUser(BaseModel):
    id: int
    pseudo: str
    nom: str
    prenom: str | None
    mail: str | None
    birthdate: date | None
    biographie: str | None

    model_config = ConfigDict(from_attributes=True)

class FavoriteCreate(BaseModel):
    id_user: int
    id_movie: int
    comment: str | None = None

# Utilisé dans : update_user
class UserUpdate(BaseModel):
    pseudo: str | None = None
    nom: str | None = None
    prenom: str | None = None
    mail: str | None = None
    birthdate: date | None = None
    biographie: str | None = None
    password: str | None = None  
    
# Utilisé dans : read_users
class UserSchema(BaseModel):
    pseudo: str
    nom: str
    prenom: str | None = None
    mail: str | None = None
    birthdate: date | None = None
    biographie: str | None = None

# Utilisé dans : login [routers]
class UserLogin(BaseModel):
    pseudo: str
    password: str