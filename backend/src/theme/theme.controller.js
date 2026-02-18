import prisma from '../../prisma.js';

// GET /api/themes - Récupérer tous les thèmes
export const getAll = async (req, res) => {
  try {
    const themes = await prisma.theme.findMany({
      orderBy: {
        label: 'asc'
      }
    });

    res.json({
      count: themes.length,
      themes
    });
  } catch (error) {
    console.error('Erreur getThemes:', error);
    res.status(500).json({ 
      message: "Erreur lors de la récupération des thèmes",
      error: error.message
    });
  }
};

// GET /api/themes/:id - Récupérer un thème par son ID
export const getById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const theme = await prisma.theme.findUnique({
      where: { id },
      include: {
        services: {
          select: {
            id: true,
            name: true,
            price: true
          }
        }
      }
    });

    if (!theme) {
      return res.status(404).json({ message: "Thème non trouvé" });
    }

    res.json(theme);
  } catch (error) {
    console.error('Erreur getThemeById:', error);
    res.status(500).json({ 
      message: "Erreur lors de la récupération du thème",
      error: error.message
    });
  }
};