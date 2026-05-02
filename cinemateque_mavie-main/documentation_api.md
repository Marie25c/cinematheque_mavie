# Documentation de l'API - Cinémathèque MAVIE

Cette API permet la gestion d'un catalogue de films, des comptes utilisateurs et de leurs favoris. Elle suit une architecture modulaire pour faciliter la maintenance.

## 🎬 Section : Films (/movies)
### 🔍 Recherche et filtrage

* GET /movies/search

Permet de récupérer des films selon plusieurs critères combinables. Le tri est géré via un Strategy Pattern côté Backend.
Paramètre	Type	Description
rech	str	Recherche textuelle dans le titre (partielle).
genre	str	Filtre par genre (ex: "Action", "Drama").
vote_average	float	Filtre les films ayant une note supérieure ou égale.
nb	int	Limite le nombre de résultats (Pagination).
classement	asc / desc	Sens du tri (par défaut : asc).
by_vote	bool	Si true, active le tri par note moyenne.
by_date	bool	Si true, active le tri par date de sortie.

Exemple :
GET /movies/search?rech=spider&by_vote=true&classement=desc
(Recherche "Spider" trié par les meilleures notes en premier)

### 🎞️ Détails d'un film

* GET /movies/{movie_id}

Récupère toutes les informations d'un film spécifique via son identifiant unique.

    Réponse 200 : Objet JSON du film.

    Réponse 404 : Film non trouvé.

## 👤 Section : Utilisateurs (/users)

### ➕ Création de compte

* POST /users/register

Crée un nouvel utilisateur. Le mot de passe est automatiquement haché avant stockage.

Body (JSON) :
JSON

{
  "pseudo": "alex_dev",
  "password": "mon_password_securise",
  "nom": "Dupont",
  "prenom": "Alex",
  "mail": "alex@example.com",
  "birthdate": "1995-05-20",
  "biographie": "Passionné de cinéma."
}

### ⚙️ Modification du profil

* PATCH /users/{user_id}

Mise à jour partielle des informations. Seuls les champs envoyés seront modifiés.

## Section : Favoris
### Lister les favoris

* GET /users/{user_id}/favorites

Retourne la liste des films mis en favoris par l'utilisateur.

### Ajouter un favori

* POST /users/{user_id}/favorites/{movie_id}

Ajoute le film spécifié à la liste des favoris de l'utilisateur.

### Supprimer un favori

* DELETE /users/{user_id}/favorites/{movie_id}

Retire le film des favoris de l'utilisateur.
🛠️ Configuration Technique
🌐 CORS (Communication Front-Back)

Le Backend autorise les requêtes provenant du Frontend local :

    URL autorisée : http://localhost:5173 (Vite / React / Vue)

# Lancement

Mode Développement (avec auto-reload) :
Bash

uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Documentation Interactive

Une documentation interactive (Swagger UI) est générée automatiquement et permet de tester chaque route en direct :
-> http://localhost:8000/docs
http://localhost:8000/movies