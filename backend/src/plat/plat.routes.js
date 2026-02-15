import express from 'express';
import { createPlat, getAllPlats, getPlatById, updatePlat, deletePlat } from './plat.controller.js';
import { authenticateToken } from '../auth/auth.middleware.js';
import { requireRole } from '../role/role.middleware.js';

const router = express.Router();

// CRUD pour les plats

// Créer un plat (ADMIN ou EMPLOYEE)
router.post('/', authenticateToken, requireRole(["ADMIN", "EMPLOYEE"]), createPlat);

// Récupérer tous les plats
router.get('/', getAllPlats);

// Récupérer un plat par son id
router.get('/:id', getPlatById);

// Mettre à jour un plat (ADMIN ou EMPLOYEE)
router.put('/:id', authenticateToken, requireRole(["ADMIN", "EMPLOYEE"]), updatePlat);

// Supprimer un plat (ADMIN uniquement)
router.delete('/:id', authenticateToken, requireRole(["ADMIN"]), deletePlat);

export default router;