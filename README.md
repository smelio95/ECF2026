# ECF - 2026

Projet ECF du développeur web et web mobile

Appplication pour l'entreprise Vite et gourmand

Stack technique 
- Frontend : HTML / CSS
- Backend : Node.js / Express
- Base de données relationnelle : PostgreSQL (via Prisma)
- Base de données NoSQL : MongoDB

Profil (test) 
Administrateur : admin@vitegourmand.fr / Admin123!
Employe : jose@vitegourmand.fr / Employee123!
Client : client@example.com / User123!

## Variables d'environnement

Créer un fichier `.env` dans le dossier `backend/` :

```env
PORT=3000
DATABASE_URL=postgresql://postgres:motdepasse@db:5432/vite_gourmand
JWT_SECRET=un_secret_tres_long_et_complique
MONGODB_URL=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/vite-gourmand
```

> Pour MongoDB : créer un compte gratuit sur [MongoDB Atlas](https://www.mongodb.com/atlas), créer un cluster M0 gratuit, et remplacer `<user>` et `<password>` par vos identifiants.