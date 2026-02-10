// Importation du module Express pour créer des routes
import express from 'express';

// Importation de la fonction de contrôle pour l'inscription des utilisateurs
import { registerUser } from '../controllers/user.controller.js';

// Création d'un routeur Express pour les routes liées aux utilisateurs
const router = express.Router();

// Route pour l'inscription d'un nouvel utilisateur
router.post('/users', registerUser);

// Exportation du routeur pour l'utiliser dans d'autres parties de l'application
export default router;