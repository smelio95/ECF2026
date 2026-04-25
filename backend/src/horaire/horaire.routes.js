import express from 'express';
import { getAll, getById, update } from './horaire.controller.js';
import { authenticateToken } from "../auth/auth.middleware.js";
import { requireRole } from "../role/role.middleware.js";

const router = express.Router();

// Routes publiques
router.get('/', getAll);           // Lister tous les horaires
router.get('/:id', getById);       // Détail d'un horaire
router.put('/:id', authenticateToken, requireRole(['ADMIN']), update);

export default router;