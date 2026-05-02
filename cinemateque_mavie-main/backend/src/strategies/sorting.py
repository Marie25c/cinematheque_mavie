from abc import ABC, abstractmethod
from sqlalchemy.orm import Query
from src.models import Movies

# Interface de stratégie
class SortStrategy(ABC):
    @abstractmethod
    def apply(self, query: Query, classement: str) -> Query:
        pass

# Tri par vote
class SortByVote(SortStrategy):
    def apply(self, query: Query, classement: str) -> Query:
        column = Movies.vote_average
        return query.order_by(column.desc() if classement == "desc" else column.asc())

# Tri par date
class SortByDate(SortStrategy):
    def apply(self, query: Query, classement: str) -> Query:
        column = Movies.release_date
        return query.order_by(column.desc() if classement == "desc" else column.asc())

# Sans strategie
class NoSort(SortStrategy):
    def apply(self, query: Query, classement: str) -> Query:
        query = query.order_by(Movies.title.desc() if classement == "desc" else Movies.title.asc())
        return query