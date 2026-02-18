import express from 'express';
import { 
    getAllReviews, 
    getReviewById, 
    createReview, 
    updateReviewStatus, 
    deleteReview,
    getReviewsByService 
} from './review.controller.js';
import { authenticateToken } from '../auth/auth.middleware.js';
import { requireRole } from '../role/role.middleware.js';

const router = express.Router();

// Routes publiques
router.get('/service/:serviceId', getReviewsByService); // Reviews approuvés d'un service

// Routes authentifiées - Utilisateur peut créer un review
router.post('/', authenticateToken, createReview);

// Routes ADMIN/EMPLOYEE - Gestion des reviews
router.get('/', authenticateToken, requireRole(['ADMIN', 'EMPLOYEE']), getAllReviews);
router.get('/:id', authenticateToken, requireRole(['ADMIN', 'EMPLOYEE']), getReviewById);
router.put('/:id', authenticateToken, requireRole(['ADMIN', 'EMPLOYEE']), updateReviewStatus);

// Route ADMIN uniquement - Suppression
router.delete('/:id', authenticateToken, requireRole(['ADMIN']), deleteReview);

export default router;