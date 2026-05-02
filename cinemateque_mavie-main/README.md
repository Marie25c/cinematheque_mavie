# CINEMATEQUE_MAVIE

Pour lancer notre projet, assurez vous d'avoir docker sur votre machine .

Pour exécuter notre projet, tapez : 
```
docker compose up --build
```
Dès que le docker compose ait fonctionné, allez sur : http://localhost:3000 
Pour découvrir notre backend, allez sur : http://localhost:8000 ou http://localhost:8000/docs pour une documentation plus précise sur nos routes

Après avoir lancer notre projet et l'avoir contempler, n'oubliez-pas d'arrêter et de fermer vos conteneurs !

A noter : 

le dossier necessite un dossier .env :

POSTGRES_USER=myuser
POSTGRES_PASSWORD=le_super_pass_cine1
POSTGRES_DB=mydatabase
