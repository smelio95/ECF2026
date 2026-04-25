import express from 'express';
import {
    registerUser,
    login,
    getProfile,
    updateProfile,
    deleteProfile,
    getAllUsers,
    getEmployees,
    updateUserByAdmin,
    deleteUserByAdmin
} from './user.controller.js';
import { authenticateToken } from "../auth/auth.middleware.js";
import { requireRole } from "../role/role.middleware.js";

const router = express.Router();

// ── Routes publiques ──────────────────────────────────────────
router.post('/register', registerUser);   // Inscription
router.post('/login', login);             // Connexion

// ── Routes utilisateur connecté ───────────────────────────────
router.get('/me', authenticateToken, getProfile);       // Voir son profil
router.put('/me', authenticateToken, updateProfile);    // Modifier son profil
router.delete('/me', authenticateToken, deleteProfile); // Supprimer son compte

// ── Routes admin : liste de tous les utilisateurs ─────────────
// Accessible uniquement par ADMIN
router.get('/', authenticateToken, requireRole(['ADMIN']), getAllUsers);



// ── Route employés : liste des employés disponibles ───────────
// Accessible par ADMIN et EMPLOYEE (pour la sélection du chef lors d'une réservation)
router.get('/employees', authenticateToken, getEmployees);

// ─── Routes admin : gestion des utilisateurs ─────────────────
router.post('/', authenticateToken, requireRole(['ADMIN']), registerUser);
router.put('/:id', authenticateToken, requireRole(['ADMIN']), updateUserByAdmin);
router.delete('/:id', authenticateToken, requireRole(['ADMIN']), deleteUserByAdmin);

export default router;