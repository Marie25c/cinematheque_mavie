from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.models import Base
from src.database import engine
from src.routers import movies, users
from src.gestion_bdd import seed_if_empty

app = FastAPI(title="Movie App API")

origins = [
    "http://localhost:3000"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    seed_if_empty()

# Routes
app.include_router(movies)
app.include_router(users)


@app.get("/")
def health_check():
    return {"status": "ok", "message": "API is running"}