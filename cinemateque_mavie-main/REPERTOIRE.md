# PYTHON VENV

```
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
# PYTEST

```
pytest --cov=src tests/

```
# GIT

```
git branch # -> branches locales
git branch -a # -> branches locales et distantes
```

# DOCKER

```
docker ps # -> Affiche les conteneurs
docker build -t <nom> # -> construit une image à partir du Dockerfile
docker run -d -p 5173:5173 --name frontend_container opsci_frontend # -> Lance le conteneur
docker stop frontend_container # -> Arrete le conteneur
docker rm frontend_container # -> Supprime le conteneur
docker images # -> affiche les images
docker exec -it my_container /bin/bash # entrer dans le conteneur
docker run -d -p 8000:8000 myfastapi # 
exit -> sortie de conteneur
docker rmi <images> # supprime image docker
```
## Docker-compose 

| Action                         | Commande                       |
| ------------------------------ | ------------------------------ |
| Lancer les conteneurs (logs)   | `docker-compose up`            |
| Lancer en arrière-plan         | `docker-compose up -d`         |
| Arrêter                        | `docker-compose stop`          |
| Supprimer conteneurs           | `docker-compose down`          |
| Supprimer conteneurs + volumes | `docker-compose down -v`       |
| Rebuild après modification     | `docker-compose up -d --build` |
| Voir l’état des conteneurs     | `docker-compose ps`            |

# POSTGRESQL

## Introduction

Crée par Michael Stonebraker
-> Moteur BDD transactionel
-> Langage : PL/PgSQL, SQL query language
-> OpenSource

## Installation

Dans PostgreSQL Downloads, download the installer, install database 
+ choix password, port number, plugins to install

https://youtu.be/xw5BennCNiM?si=dYMBfk4Vom4Itqao

### In Docker 
https://hub.docker.com/_/postgres

Start postgres instance

```
$ docker run --name <nom_container> -e POSTGRES_PASSWORD=<mysecretpassword> -d -p <port>:<port> postgres:<version>
```

Différences des versions :
[ ChatGpt ]

| Version              | Basée sur    | Taille | Risque                             |
| -------------------- | ------------ | ------ | ---------------------------------- |
| `postgres:16`        | Debian       | ~300MB | Très stable                        |
| `postgres:16-alpine` | Alpine Linux | ~70MB  | Rarement, petites incompatibilités |

lancer le conteneur :
```
docker exec -it <id> sh
```

lancer postgre
```
docker exec -it <nom_du_conteneur> psql -U <utilisateur> -d <nom_database>
```
| Commande         | Description                        |
| ---------------- | ---------------------------------- |
| `\l`             | Lister toutes les bases de données |
| `\c <nom_db>`    | Se connecter à une base spécifique |
| `\dt`            | Lister toutes les tables           |
| `\d <nom_table>` | Afficher la structure d’une table  |
| `\du`            | Lister les utilisateurs            |
| `\q`             | Quitter `psql`                     |

### secrets avec swarm
--------------------------------------------------------------

version: "3.9"

services:
  db:
    image: postgres:15
    container_name: postgres_db
    restart: always
    environment:
      POSTGRES_USER: myuser
      POSTGRES_DB: mydb
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:

secrets:
  db_password:
    external: true


cat /run/secrets/postgres_password
docker stack deploy -c docker-compose.yml my_stack
-------------------------------------------------------------

### TYPE SQLALCHEMY 

| SQLAlchemy type             | Usage / Exemple             | Postgres équivalent         |
| --------------------------- | --------------------------- | --------------------------- |
| `Integer`                   | Entiers                     | `INTEGER`                   |
| `BigInteger`                | Entiers très grands         | `BIGINT`                    |
| `String(length)`            | Chaîne de caractères courte | `VARCHAR(length)`           |
| `Text`                      | Texte long                  | `TEXT`                      |
| `Float`                     | Nombre à virgule flottante  | `REAL` / `DOUBLE PRECISION` |
| `Boolean`                   | True / False                | `BOOLEAN`                   |
| `Date`                      | Date uniquement             | `DATE`                      |
| `DateTime`                  | Date + heure                | `TIMESTAMP`                 |
| `Time`                      | Heure uniquement            | `TIME`                      |
| `Numeric(precision, scale)` | Nombre précis (ex: argent)  | `NUMERIC`                   |

### REQUETES

| Action                                  | SQLAlchemy (Python)                                                              | SQL Postgres                                                                                             |
| --------------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Créer un enregistrement**             | `db.add(obj); db.commit()`                                                       | `INSERT INTO movies (title, release_date) VALUES ('Inception', '2023-03-21');`                           |
| **Lire tous les enregistrements**       | `db.query(Movies).all()`                                                         | `SELECT * FROM movies;`                                                                                  |
| **Lire avec filtre**                    | `db.query(Movies).filter(Movies.title == "Inception").first()`                   | `SELECT * FROM movies WHERE title = 'Inception' LIMIT 1;`                                                |
| **Mettre à jour un enregistrement**     | `obj.popularity = 9.9; db.commit()`                                              | `UPDATE movies SET popularity = 9.9 WHERE id = 1;`                                                       |
| **Supprimer un enregistrement**         | `db.delete(obj); db.commit()`                                                    | `DELETE FROM movies WHERE id = 1;`                                                                       |
| **Compter le nombre d’enregistrements** | `db.query(Movies).count()`                                                       | `SELECT COUNT(*) FROM movies;`                                                                           |
| **Filtrer plusieurs conditions**        | `db.query(Movies).filter(Movies.popularity>8, Movies.genre=="Sci-Fi").all()`     | `SELECT * FROM movies WHERE popularity>8 AND genre='Sci-Fi';`                                            |
| **Ordre / tri**                         | `db.query(Movies).order_by(Movies.popularity.desc()).all()`                      | `SELECT * FROM movies ORDER BY popularity DESC;`                                                         |
| **Limiter le nombre de résultats**      | `db.query(Movies).limit(10).all()`                                               | `SELECT * FROM movies LIMIT 10;`                                                                         |
| **Grouper et compter**                  | `db.query(Movies.genre, func.count(Movies.id)).group_by(Movies.genre).all()`     | `SELECT genre, COUNT(id) FROM movies GROUP BY genre;`                                                    |
| **Jointure (avec une autre table)**     | `db.query(Movies, Director).join(Director).filter(Director.name=="Nolan").all()` | `SELECT * FROM movies JOIN directors ON movies.director_id = directors.id WHERE directors.name='Nolan';` |

# FRONTEND

## Prérequis: 
-> Dans frontend/react
```bash
npm install
npm install axios
npm install react-router-dom
```

## Exécuter : 
```bash
npm run dev
```













Archives :

* Lignes mise de coté car ne traite pas encore le frontend

* Changement apporté dans le frontend :
  package.json -> sript -> dev -> vite --host 0.0.0.0 # -> pour que ce soit accessible sur tout @IP