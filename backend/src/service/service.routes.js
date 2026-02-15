import express from 'express';
import { getAll, getById, create, update, remove, getStats } from './service.controller.js';
import { authenticateToken } from '../auth/auth.middleware.js';
import { requireRole } from '../role/role.middleware.js';

const router = express.Router();

// Routes publiques
router.get('/', getAll);           // Lister tous les services (avec filtres)
router.get('/:id', getById);       // Détail d'un service

// Routes protégées - ADMIN/EMPLOYEE
router.post(
  '/', 
  authenticateToken, 
  requireRole(['ADMIN', 'EMPLOYEE']), 
  create
);

router.put(
  '/:id', 
  authenticateToken, 
  requireRole(['ADMIN', 'EMPLOYEE']), 
  update
);

// Route protégée - ADMIN uniquement
router.delete(
  '/:id', 
  authenticateToken, 
  requireRole(['ADMIN']), 
  remove
);

// Statistiques - ADMIN uniquement
router.get(
  '/:id/stats', 
  authenticateToken, 
  requireRole(['ADMIN']), 
  getStats
);

export default router;