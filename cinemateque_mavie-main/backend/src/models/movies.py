from .base import Base
from sqlalchemy import create_engine, Column, Integer, String, Date, Float, select, inspect, UniqueConstraint

class Movies(Base):

    __tablename__ = "movies"

    id = Column(Integer, primary_key=True, autoincrement=True)
    release_date = Column(Date)
    title = Column(String, unique=True, nullable=False)
    overview = Column(String)
    popularity = Column(Float)
    vote_count = Column(Integer)
    vote_average = Column(Float)
    original_language = Column(String)
    genre = Column(String)
    poster_url = Column(String)