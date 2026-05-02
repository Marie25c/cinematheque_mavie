# DOCUMENTATION BACKEND

Dans ce markdown, je présente la structure du fichier.

## Exécution 

Si vous souhaitez simplement exécuter le backend, je vous propose 2 choix :

1. Assurez vous, d'avoir docker sur votre machine, puis lancez :

```
docker build -t backend_img .
docker run -d -p 8000:8000 --name backend_container backend_img
```

* A noter, de ne pas oublier de stopper vos container et de les supprimer !

2. Sinon, on va lancer le backend à travers une environnement virtuel :

```
python3 -m venv venv # <-- Permet de créer l'environnement virtuel
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Vous trouverez le backend sur : http://localhost:8000/

## Structure du fichier 

* Dockerfile 
* main.py : ce qui permet de créer le serveur API
* /src : dossier source du backend
    * models/ : définition des modèles des données de la base de donnée
    * repositories/ : définition des fonctions qui aggissent avec la base de donnée
    * routers/ : définition des routes mettant en lien la route et la bonne fonction de repositories
    * strategies/ : définition des strategies de tri
    * config.py : configuration des identifiants et mot de passe 
    * database.py : connexion avec la base de donnée
    * schemas.py : format JSON attendu
    * security.py : pour la sécurité des mot de passe
* /tests : les tests avec pytest, qui permettent de vérifier le bon fonctionnement de notre API et des fonctions définies

##  Tests 

````
pytest --cov=src tests/
```