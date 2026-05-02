from .base import Base
from sqlalchemy import create_engine, Column, Integer, String, Date, Float, select, inspect, UniqueConstraint, ForeignKey, Text
from sqlalchemy.orm import relationship

class Favorite(Base):
    __tablename__ = "favorite"

    user_id = Column(Integer, ForeignKey("user.id"), primary_key=True)
    movie_id = Column(Integer, ForeignKey("movies.id"), primary_key=True)

    comment = Column(Text)
    created_at = Column(Date)

    user = relationship("User", backref="favorites")
    movie = relationship("Movies", backref="favorites")