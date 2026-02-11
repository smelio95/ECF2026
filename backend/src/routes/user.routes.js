/** I M P O R T A T I O N S */
// Importation du module Express pour créer des routes
import express from 'express';
// Importation de la fonction de contrôle pour l'inscription des utilisateurs
import { registerUser } from '../controllers/user.controller.js';
// Importation de la fonction de contrôle pour la connexion des utilisateurs
import { login } from '../controllers/user.controller.js';


/** R O U T E S */
// Création d'un routeur Express pour les routes liées aux utilisateurs
const router = express.Router();

// Route pour l'inscription d'un nouvel utilisateur
router.post('/users', registerUser);

// Route pour la connexion d'un utilisateur
router.post('/login', login);

// Exportation du routeur pour l'utiliser dans le serveur principal
export default router;