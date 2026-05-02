from .base import Base
from sqlalchemy import create_engine, Column, Integer, String, Date, Float, select, inspect, UniqueConstraint, Text

class User(Base):

    __tablename__ = "user"

    id = Column(Integer, primary_key=True, autoincrement=True)
    pseudo = Column(String, unique=True, nullable=False)
    password = Column(String(128), nullable=False)
    nom = Column(String, nullable=False)
    prenom = Column(String)
    mail = Column(String)
    birthdate = Column(Date)
    biographie = Column(Text)


    