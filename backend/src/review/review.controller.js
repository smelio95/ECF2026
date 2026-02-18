import prisma from '../../prisma.js';

// GET /api/reviews - Récupérer tous les reviews (avec filtres optionnels)
export const getAllReviews = async (req, res) => {
    try {
        const { status, service_id } = req.query;
        const where = {};

        // Filtre par statut
        if (status) {
            where.status = status;
        }

        // Filtre par service
        if (service_id) {
            where.service_id = parseInt(service_id);
        }

        const reviews = await prisma.review.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        firstname: true,
                        lastname: true,
                        email: true
                    }
                },
                service: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        res.json({
            count: reviews.length,
            reviews
        });
    } catch (error) {
        console.error('Erreur getAllReviews:', error);
        res.status(500).json({ 
            message: "Erreur lors de la récupération des reviews",
            error: error.message
        });
    }
};

// GET /api/reviews/:id - Récupérer un review par son ID
export const getReviewById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "ID invalide" });
        }

        const review = await prisma.review.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        firstname: true,
                        lastname: true
                    }
                },
                service: true
            }
        });

        if (!review) {
            return res.status(404).json({ message: "Review non trouvé" });
        }

        res.json(review);
    } catch (error) {
        console.error('Erreur getReviewById:', error);
        res.status(500).json({ 
            message: "Erreur lors de la récupération du review",
            error: error.message
        });
    }
};

// POST /api/reviews - Créer un nouveau review (utilisateur authentifié)
export const createReview = async (req, res) => {
    try {
        const { note, description, service_id } = req.body;
        
        // Vérifier que l'utilisateur est authentifié
        if (!req.user || !req.user.id) {
            return res.status(401).json({ 
                message: "Vous devez être connecté pour créer un avis" 
            });
        }
        
        const user_id = req.user.id;

        // Validation
        if (!note || !service_id) {
            return res.status(400).json({ 
                message: "La note et le service sont requis" 
            });
        }

        // Vérifier que la note est entre 1 et 5
        if (note < 1 || note > 5) {
            return res.status(400).json({ 
                message: "La note doit être entre 1 et 5" 
            });
        }

        // Vérifier que le service existe
        const service = await prisma.service.findUnique({
            where: { id: parseInt(service_id) }
        });

        if (!service) {
            return res.status(404).json({ message: "Service non trouvé" });
        }

        // Créer le review (statut PENDING par défaut)
        const review = await prisma.review.create({
            data: {
                note: parseInt(note),
                description: description || null,
                status: 'PENDING',
                user_id,
                service_id: parseInt(service_id)
            },
            include: {
                user: {
                    select: {
                        firstname: true,
                        lastname: true
                    }
                },
                service: true
            }
        });

        res.status(201).json({
            message: "Review créé avec succès (en attente de validation)",
            review
        });
    } catch (error) {
        console.error('Erreur createReview:', error);
        res.status(500).json({ 
            message: "Erreur lors de la création du review",
            error: error.message
        });
    }
};

// PUT /api/reviews/:id - Modifier le statut d'un review (ADMIN/EMPLOYEE uniquement)
export const updateReviewStatus = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { status } = req.body;

        if (isNaN(id)) {
            return res.status(400).json({ message: "ID invalide" });
        }

        // Vérifier que le statut est valide
        const validStatuses = ['PENDING', 'APPROVED', 'REJECTED'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                message: "Statut invalide. Valeurs possibles: PENDING, APPROVED, REJECTED" 
            });
        }

        const review = await prisma.review.update({
            where: { id },
            data: { status },
            include: {
                user: {
                    select: {
                        firstname: true,
                        lastname: true
                    }
                },
                service: true
            }
        });

        res.json({
            message: "Statut du review mis à jour",
            review
        });
    } catch (error) {
        console.error('Erreur updateReviewStatus:', error);

        if (error.code === 'P2025') {
            return res.status(404).json({ message: "Review non trouvé" });
        }

        res.status(500).json({ 
            message: "Erreur lors de la mise à jour du review",
            error: error.message
        });
    }
};

// DELETE /api/reviews/:id - Supprimer un review (ADMIN uniquement)
export const deleteReview = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "ID invalide" });
        }

        await prisma.review.delete({
            where: { id }
        });

        res.json({ message: "Review supprimé avec succès" });
    } catch (error) {
        console.error('Erreur deleteReview:', error);

        if (error.code === 'P2025') {
            return res.status(404).json({ message: "Review non trouvé" });
        }

        res.status(500).json({ 
            message: "Erreur lors de la suppression du review",
            error: error.message
        });
    }
};

// GET /api/reviews/service/:serviceId - Récupérer les reviews approuvés d'un service
export const getReviewsByService = async (req, res) => {
    try {
        const serviceId = parseInt(req.params.serviceId);

        if (isNaN(serviceId)) {
            return res.status(400).json({ message: "ID de service invalide" });
        }

        const reviews = await prisma.review.findMany({
            where: {
                service_id: serviceId,
                status: 'APPROVED'
            },
            include: {
                user: {
                    select: {
                        firstname: true,
                        lastname: true
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        // Calculer la moyenne des notes
        const averageNote = reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.note, 0) / reviews.length
            : 0;

        res.json({
            count: reviews.length,
            averageNote: Math.round(averageNote * 10) / 10,
            reviews
        });
    } catch (error) {
        console.error('Erreur getReviewsByService:', error);
        res.status(500).json({ 
            message: "Erreur lors de la récupération des reviews",
            error: error.message
        });
    }
};