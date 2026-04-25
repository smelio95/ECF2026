import { getAllServices, getServiceById, createService, updateService, deleteService as deleteServiceFromDB, getServiceStats } from './service.model.js';

// GET /api/services - Récupérer tous les services avec filtres
export const getAll = async (req, res) => {
  try {
    // Extraire les paramètres de filtrage de la query string
    const filters = {
      prixMax: req.query.prixMax,
      prixMin: req.query.prixMin,
      theme_id: req.query.theme_id,
      regime_id: req.query.regime_id,
      nbPersonnesMin: req.query.nbPersonnesMin
    };

    const services = await getAllServices(filters);

    res.json({
      count: services.length,
      services
    });
  } catch (error) {
    console.error('Erreur getAllServices:', error);
    res.status(500).json({ 
      message: "Erreur lors de la récupération des services",
      error: error.message
    });
  }
};

// GET /api/services/:id - Récupérer un service par son ID
export const getById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ 
        message: "ID invalide" 
      });
    }

    const service = await getServiceById(id);

    if (!service) {
      return res.status(404).json({ 
        message: "Service non trouvé" 
      });
    }

    res.json(service);
  } catch (error) {
    console.error('Erreur getServiceById:', error);
    res.status(500).json({ 
      message: "Erreur lors de la récupération du service",
      error: error.message
    });
  }
};

// POST /api/services - Créer un nouveau service (ADMIN/EMPLOYEE)
export const create = async (req, res) => {
  try {
    const { name, description, duration, price, regime_id, theme_id, plat_ids } = req.body;

    // Validation des champs requis
    if (!name || !description || !price) {
      return res.status(400).json({ 
        message: "Les champs name, description et price sont requis" 
      });
    }

    // Validation du prix
    if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      return res.status(400).json({ 
        message: "Le prix doit être un nombre positif" 
      });
    }

    const service = await createService({
      name,
      description,
      duration: duration ? parseInt(duration) : 120, // Durée par défaut 120 min
      price: parseFloat(price),
      regime_id: regime_id ? parseInt(regime_id) : null,
      theme_id: theme_id ? parseInt(theme_id) : null,
      plat_ids: plat_ids || []
    });

    res.status(201).json({
      message: "Service créé avec succès",
      service
    });
  } catch (error) {
    console.error('Erreur createService:', error);
    
    // Erreur de clé étrangère (regime_id ou theme_id invalide)
    if (error.code === 'P2003') {
      return res.status(400).json({ 
        message: "Régime ou thème invalide" 
      });
    }

    res.status(500).json({ 
      message: "Erreur lors de la création du service",
      error: error.message
    });
  }
};

// PUT /api/services/:id - Mettre à jour un service (ADMIN/EMPLOYEE)
export const update = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ 
        message: "ID invalide" 
      });
    }

    const { name, description, duration, price, regime_id, theme_id, plat_ids } = req.body;

    // Validation du prix si fourni
    if (price !== undefined && (isNaN(parseFloat(price)) || parseFloat(price) <= 0)) {
      return res.status(400).json({ 
        message: "Le prix doit être un nombre positif" 
      });
    }

    const service = await updateService(id, {
      name,
      description,
      duration: duration ? parseInt(duration) : undefined,
      price: price ? parseFloat(price) : undefined,
      regime_id: regime_id !== undefined ? (regime_id ? parseInt(regime_id) : null) : undefined,
      theme_id: theme_id !== undefined ? (theme_id ? parseInt(theme_id) : null) : undefined,
      plat_ids: plat_ids !== undefined ? plat_ids : undefined
    });

    res.json({
      message: "Service mis à jour avec succès",
      service
    });
  } catch (error) {
    console.error('Erreur updateService:', error);

    // Service non trouvé
    if (error.code === 'P2025') {
      return res.status(404).json({ 
        message: "Service non trouvé" 
      });
    }

    // Clé étrangère invalide
    if (error.code === 'P2003') {
      return res.status(400).json({ 
        message: "Régime ou thème invalide" 
      });
    }

    res.status(500).json({ 
      message: "Erreur lors de la mise à jour du service",
      error: error.message
    });
  }
};

// DELETE /api/services/:id - Supprimer un service (ADMIN uniquement)
export const remove = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ 
        message: "ID invalide" 
      });
    }

    await deleteServiceFromDB(id);

    res.json({ 
      message: "Service supprimé avec succès" 
    });
  } catch (error) {
    console.error('Erreur deleteService:', error);

    // Service non trouvé
    if (error.code === 'P2025') {
      return res.status(404).json({ 
        message: "Service non trouvé" 
      });
    }

    // Erreur si rendez-vous associés
    if (
      error.message.includes('commande') || error.message.includes('avis')) {
      return res.status(400).json({ 
        message: error.message 
      });
    }

    res.status(500).json({ 
      message: "Erreur lors de la suppression du service",
      error: error.message
    });
  }
};

// GET /api/services/:id/stats - Récupérer les statistiques d'un service (ADMIN)
export const getStats = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ 
        message: "ID invalide" 
      });
    }

    const stats = await getServiceStats(id);

    res.json(stats);
  } catch (error) {
    console.error('Erreur getServiceStats:', error);
    res.status(500).json({ 
      message: "Erreur lors de la récupération des statistiques",
      error: error.message
    });
  }
};