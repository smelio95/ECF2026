import prisma from '../../prisma.js';

// GET /api/horaires - Récupérer tous les horaires
export const getAll = async (req, res) => {
  try {
    const horaires = await prisma.horaire.findMany({
      orderBy: {
        id: 'asc'
      }
    });

    res.json({
      count: horaires.length,
      horaires
    });
  } catch (error) {
    console.error('Erreur getHoraires:', error);
    res.status(500).json({ 
      message: "Erreur lors de la récupération des horaires",
      error: error.message
    });
  }
};

// GET /api/horaires/:id - Récupérer un horaire par son ID
export const getById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const horaire = await prisma.horaire.findUnique({
      where: { id }
    });

    if (!horaire) {
      return res.status(404).json({ message: "Horaire non trouvé" });
    }

    res.json(horaire);
  } catch (error) {
    console.error('Erreur getHoraireById:', error);
    res.status(500).json({ 
      message: "Erreur lors de la récupération de l'horaire",
      error: error.message
    });
  }
};