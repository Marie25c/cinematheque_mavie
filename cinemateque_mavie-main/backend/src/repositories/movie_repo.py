# app/repository/movie_repo.py
from sqlalchemy.orm import Session
from src.models import Movies

class MovieRepository:
    def __init__(self, db: Session):
        self.db = db

    # --- recherche avec combinaison de critère ---
    def search_movies(self, rech=None, genre=None, dateD=None, dateF=None, note=None,  limit=None, strategy=None, classement=None):
        query = self.db.query(Movies)
        if strategy:
            query = strategy.apply(query, classement)
        if rech:
            query = query.filter(Movies.title.ilike(f"%{rech}%"))
        if genre:
            query = query.filter(Movies.genre.ilike(f"%{genre}%"))
        if dateD and dateF:
            query =  query.filter(Movies.release_date.between(dateD, dateF))
        if note:
            query = query.filter(Movies.vote_average >= note)
        if limit:
            return query.limit(limit).all()
        return query.all()
    
    # --- accès film à travers un id ---
    def get_movie_by_id(self, id):
        return self.db.query(Movies).filter(Movies.id == id).first()

    # --- logique de similitude entre les films ---
    def get_prefix(self, title, n=3): 
        return title[:n].lower()

    def similarity_score(self, movie, other_movie):
        score = 0

        # préfixe titre
        if self.get_prefix(movie.title) == self.get_prefix(other_movie.title):
            score += 2

        # genres communs
        genres1 = set(g.strip().lower() for g in movie.genre.split(","))
        genres2 = set(g.strip().lower() for g in other_movie.genre.split(","))

        score += len(genres1 & genres2)

        return score

    # --- Films similaires ---
    def get_similar_movies(self, target_movie, top_n=5):
        all_movies = self.db.query(Movies).all()
        results = []

        for movie in all_movies:
            if movie.id == target_movie.id:
                continue

            score = self.similarity_score(target_movie, movie)

            if score > 0:
                results.append((movie, score))

        results.sort(key=lambda x: x[1], reverse=True)

        return [movie for movie, score in results[:top_n]]
