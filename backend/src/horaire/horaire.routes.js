import express from 'express';
import { getAll, getById } from './horaire.controller.js';

const router = express.Router();

// Routes publiques
router.get('/', getAll);           // Lister tous les horaires
router.get('/:id', getById);       // Détail d'un horaire

export default router;