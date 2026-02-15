import prisma from '../../prisma.js';

// Créer un plat
export const createPlat = async (req, res) => {
  try {
    const { title, photo } = req.body;
    
    const plat = await prisma.plat.create({
      data: {
        title,
        photo,
      },
    });
    
    res.status(201).json(plat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Récupérer tous les plats
export const getAllPlats = async (req, res) => {
  try {
    const plats = await prisma.plat.findMany({
      include: {
        services: true,
        allergenes: true
      }
    });
    
    res.json(plats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Récupérer un plat par son ID
export const getPlatById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    const plat = await prisma.plat.findUnique({
      where: { id },
      include: {
        services: true,
        allergenes: true
      }
    });

    if (!plat) {
      return res.status(404).json({ error: 'Le plat n\'est pas trouvé' });
    }

    res.json(plat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour un plat
export const updatePlat = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, photo } = req.body;

    const plat = await prisma.plat.update({
      where: { id },
      data: {
        title,
        photo,
      },
    });
    
    res.json(plat);
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "Plat non trouvé" });
  }
};

// Supprimer un plat
export const deletePlat = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    await prisma.plat.delete({
      where: { id },
    });

    res.json({ message: "Plat supprimé avec succès" });
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "Plat non trouvé" });
  }
};