import os
import pytest

os.environ["TESTING"] = "1"
os.environ["DB_HOST"] = "localhost"
os.environ["POSTGRES_DB"] = "testdb"

@pytest.fixture(scope="session", autouse=True)
def env_setup():
    """S'assure que l'environnement est bien configuré pour toute la session."""
    os.environ["TESTING"] = "1"