import prisma from '../../prisma.js';

// GET /api/allergenes - Récupérer tous les allergènes
export const getAll = async (req, res) => {
  try {
    const allergenes = await prisma.allergene.findMany({
      orderBy: {
        label: 'asc'
      }
    });

    res.json({
      count: allergenes.length,
      allergenes
    });
  } catch (error) {
    console.error('Erreur getAllergenes:', error);
    res.status(500).json({ 
      message: "Erreur lors de la récupération des allergènes",
      error: error.message
    });
  }
};

// GET /api/allergenes/:id - Récupérer un allergène par son ID
export const getById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const allergene = await prisma.allergene.findUnique({
      where: { id },
      include: {
        plats: {
          select: {
            id: true,
            title: true,
            photo: true
          }
        }
      }
    });

    if (!allergene) {
      return res.status(404).json({ message: "Allergène non trouvé" });
    }

    res.json(allergene);
  } catch (error) {
    console.error('Erreur getAllergeneById:', error);
    res.status(500).json({ 
      message: "Erreur lors de la récupération de l'allergène",
      error: error.message
    });
  }
};