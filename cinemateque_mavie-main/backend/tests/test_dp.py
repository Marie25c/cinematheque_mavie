import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from src.models.base import Base
from src.models.movies import Movies
from src.repositories.movie_repo import MovieRepository
from src.strategies.sorting import SortByVote, SortByDate, NoSort
from datetime import date

# Base de données en mémoire pour une isolation parfaite des tests de pattern
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine_mem = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine_mem)

@pytest.fixture
def db():
    """Prépare une session propre avec des données fraîches pour chaque test."""
    Base.metadata.create_all(bind=engine_mem)
    session = TestingSessionLocal()
    
    m1 = Movies(title="Alpha", vote_average=5.0, release_date=date(2017,8,16), genre="Action")
    m2 = Movies(title="Toine", vote_average=9.0, release_date=date(2005,12,16), genre="Aventure")
    m3 = Movies(title="Zolu", vote_average=6.7, release_date=date(1990,12,31), genre="Horror")
    m4 = Movies(title="Mwahaha", vote_average=8.0, release_date=date(1990,2,21), genre="Action")
    
    session.add_all([m1, m2, m3, m4])
    session.commit()
    yield session
    session.close()
    Base.metadata.drop_all(bind=engine_mem)

def test_search_with_vote_strategy(db):
    repo = MovieRepository(db)
    strategy = SortByVote()
    results = repo.search_movies(strategy=strategy, classement="desc")
    
    assert len(results) == 4
    assert results[0].title == "Toine"  # 9.0
    assert results[1].title == "Mwahaha" # 8.0

def test_search_with_filter_and_no_sort(db):
    repo = MovieRepository(db) 
    strategy = NoSort()
    results = repo.search_movies(genre="Action", strategy=strategy)
    
    assert len(results) == 2
    for m in results:
        assert m.genre == "Action"

def test_strategy_switching_dynamic(db):
    repo = MovieRepository(db)
    res_vote = repo.search_movies(strategy=SortByVote(), classement="asc")
    assert res_vote[0].title == "Alpha"
    
    res_search = repo.search_movies(rech="Toine", strategy=NoSort()) 
    assert len(res_search) == 1
    assert res_search[0].title == "Toine"

def test_filter_by_dates(db):
    repo = MovieRepository(db)
    results = repo.search_movies(dateD=date(1990, 1, 1), dateF=date(1991, 1, 1))
    assert len(results) == 2

def test_filter_by_note(db):
    repo = MovieRepository(db)
    results = repo.search_movies(note=8.0)
    assert len(results) == 2

def test_combined_filters_and_sort(db):
    repo = MovieRepository(db)
    strategy = SortByVote()
    results = repo.search_movies(genre="Action", strategy=strategy, classement="desc")
    assert len(results) == 2
    assert results[0].title == "Mwahaha"