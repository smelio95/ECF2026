import express from 'express';
import { getAllRegimes, getRegimeById } from './regime.controller.js';

const router = express.Router();

// Routes publiques
router.get('/', getAllRegimes); // Lister tous les régimes
router.get('/:id', getRegimeById); // Détail d'un régime

export default router;