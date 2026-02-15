import express from 'express';
import { registerUser, login, getProfile, updateProfile, deleteProfile } from './user.controller.js';
import { authenticateToken } from "../auth/auth.middleware.js";

const router = express.Router();

// Routes publiques
router.post('/register', registerUser);  // Inscription
router.post('/login', login);            // Connexion

// Routes protégées
router.get('/me', authenticateToken, getProfile);      // Voir son profil
router.put('/me', authenticateToken, updateProfile);   // Modifier son profil
router.delete('/me', authenticateToken, deleteProfile);     // Supprimer son compte

export default router;