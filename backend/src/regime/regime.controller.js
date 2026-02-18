import prisma from '../../prisma.js';

// GET /api/regimes - Récupérer tous les régimes
export const getAllRegimes = async (req, res) => {
    try {
        const regimes = await prisma.regime.findMany({
            orderBy: {
                label: 'asc'
            }
        });

        res.json({
            count: regimes.length,
            regimes
        });
    } catch (error) {
        console.error('Erreur getAllRegimes:', error);
        res.status(500).json({ 
            message: "Erreur lors de la récupération des régimes",
            error: error.message
        });
    }
};

// GET /api/regimes/:id - Récupérer un régime par son ID avec ses services
export const getRegimeById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "ID invalide" });
        }

        const regime = await prisma.regime.findUnique({
            where: { id },
            include: {
                services: {
                    include: {
                        theme: true,
                        plats: {
                            include: {
                                allergenes: true
                            }
                        }
                    }
                }
            }
        });

        if (!regime) {
            return res.status(404).json({ message: "Régime non trouvé" });
        }

        res.json(regime);
    } catch (error) {
        console.error('Erreur getRegimeById:', error);
        res.status(500).json({ 
            message: "Erreur lors de la récupération du régime",
            error: error.message
        });
    }
};