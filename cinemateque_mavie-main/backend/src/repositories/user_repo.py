from sqlalchemy.orm import Session
from src.models import User, Favorite, Movies
from src.schemas import UserCreate, UserUpdate
from src.security import hash_password

class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    # --- USER ---

    def get_by_id(self, user_id: int):
        return self.db.query(User).filter(User.id == user_id).first()

    def get_by_pseudo(self, pseudo: str):
        return self.db.query(User).filter(User.pseudo == pseudo).first()

    def create(self, user_data: UserCreate):
        new_user = User(
            pseudo=user_data.pseudo,
            password=hash_password(user_data.password),  
            nom=user_data.nom,
            prenom=user_data.prenom,
            mail=user_data.mail,
            birthdate=user_data.birthdate,
            biographie=user_data.biographie
        )

        self.db.add(new_user)
        self.db.commit()
        self.db.refresh(new_user)
        return new_user

    def update(self, user_id: int, update_data: UserUpdate):
        user = self.get_by_id(user_id)
        if user:
            data = update_data.model_dump(exclude_unset=True)

            # ⚠️ si password update un jour → à re-hasher côté router/service
            for key, value in data.items():
                setattr(user, key, value)

            self.db.commit()
            self.db.refresh(user)
        return user

    # --- FAVORITES ---

    def get_favorites(self, user_id: int):
        return (
            self.db.query(Favorite)
            .filter(Favorite.user_id == user_id)
            .all()
        )

    def add_favorite(self, user_id: int, movie_id: int):
        existing = (
            self.db.query(Favorite)
            .filter_by(user_id=user_id, movie_id=movie_id)
            .first()
        )

        if existing:
            return existing

        new_fav = Favorite(user_id=user_id, movie_id=movie_id)
        self.db.add(new_fav)
        self.db.commit()
        return new_fav

    def remove_favorite(self, user_id: int, movie_id: int):
        fav = (
            self.db.query(Favorite)
            .filter_by(user_id=user_id, movie_id=movie_id)
            .first()
        )

        if not fav:
            return False

        self.db.delete(fav)
        self.db.commit()
        return True