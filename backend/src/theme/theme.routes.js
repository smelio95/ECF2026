import express from 'express';
import { getAll, getById } from './theme.controller.js';

const router = express.Router();

// Routes publiques
router.get('/', getAll);           // Lister tous les thèmes
router.get('/:id', getById);       // Détail d'un thème

export default router;