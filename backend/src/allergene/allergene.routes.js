import express from 'express';
import { getAll, getById } from './allergene.controller.js';

const router = express.Router();

// Routes publiques
router.get('/', getAll);           // Lister tous les allergènes
router.get('/:id', getById);       // Détail d'un allergène

export default router;