from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import Optional, List
from src.database import get_db
from src.schemas import MovieSchema
from src.models import Movies
from src.repositories.movie_repo import MovieRepository
from src.strategies.sorting import SortByVote, SortByDate, NoSort

router = APIRouter(
    prefix="/movies",
    tags=["Movies"] 
)

# --- Recherche et/ou combinaison critères ---
@router.get("/search", response_model=List[MovieSchema])
def search_movies(
    rech: Optional[str] = None,
    genre: Optional[str] = None,
    date_min: Optional[str] = None,
    date_max: Optional[str] = None,
    vote_average: Optional[float] = None,
    by_voteaverage: bool = False,
    by_date: bool = False,
    classement: str = "asc",
    nb: Optional[int] = None,
    db: Session = Depends(get_db)
):
    # On sélectionne la stratégie de tri
    if by_voteaverage:
        strategy = SortByVote()
    elif by_date:
        strategy = SortByDate()
    else:
        strategy = NoSort()

    # On délègue tout au Repository
    repo = MovieRepository(db)
    return repo.search_movies(rech=rech, genre=genre, dateD=date_min,dateF=date_max, note=vote_average, strategy=strategy, classement=classement, limit=nb)

# --- Tout les films ---
@router.get("/")
def read_movies(db: Session = Depends(get_db)):
    movies = db.query(Movies).all()
    return movies

# --- Données d'un film ---
@router.get("/data", response_model=MovieSchema)
def get_data(id: int, db: Session = Depends(get_db)):
    movie = db.query(Movies).filter(Movies.id == id).first()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    return movie

# --- Top 5 des films les plus similaires à un film donné ---
@router.get("/{movie_id}/similar", response_model=List[MovieSchema])
def get_similar_movies(movie_id: int, db: Session = Depends(get_db)):
    repo = MovieRepository(db)

    target_movie = repo.get_movie_by_id(movie_id)
    if not target_movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    return repo.get_similar_movies(target_movie)

