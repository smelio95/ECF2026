import prisma from '../../prisma.js';

// Récupérer tous les services avec filtres optionnels
export const getAllServices = async (filters = {}) => {
  const { 
    prixMax, 
    prixMin, 
    theme_id, 
    regime_id, 
    nbPersonnesMin 
  } = filters;

  const where = {};

  // Filtre par prix maximum
  if (prixMax) {
    where.price = { ...where.price, lte: parseFloat(prixMax) };
  }

  // Filtre par prix minimum
  if (prixMin) {
    where.price = { ...where.price, gte: parseFloat(prixMin) };
  }

  // Filtre par thème
  if (theme_id) {
    where.theme_id = parseInt(theme_id);
  }

  // Filtre par régime
  if (regime_id) {
    where.regime_id = parseInt(regime_id);
  }

  // Filtre par nombre de personnes minimum
  if (nbPersonnesMin) {
    where.duration = { ...where.duration, gte: parseInt(nbPersonnesMin) };
  }

  return prisma.service.findMany({
    where,
    include: {
      regime: true,
      theme: true,
      plats: {
        include: {
          allergenes: true
        }
      }
    },
    orderBy: {
      id: 'desc'
    }
  });
};

// Récupérer un service par son ID
export const getServiceById = async (id) => {
  return prisma.service.findUnique({
    where: { id },
    include: {
      regime: true,
      theme: true,
      plats: {
        include: {
          allergenes: true
        }
      },
      appointments: {
        include: {
          user: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              email: true
            }
          }
        }
      },
      reviews: {
        where: {
          status: 'APPROVED'
        },
        include: {
          user: {
            select: {
              firstname: true,
              lastname: true
            }
          }
        }
      }
    }
  });
};

// Créer un nouveau service
export const createService = async (data) => {
  const { 
    name, 
    description, 
    duration, 
    price, 
    regime_id, 
    theme_id,
    plat_ids // Array d'IDs de plats à associer
  } = data;

  return prisma.service.create({
    data: {
      name,
      description,
      duration,
      price,
      regime: regime_id ? { connect: { id: regime_id } } : undefined,
      theme: theme_id ? { connect: { id: theme_id } } : undefined,
      plats: plat_ids && plat_ids.length > 0 
        ? { connect: plat_ids.map(id => ({ id })) } 
        : undefined
    },
    include: {
      regime: true,
      theme: true,
      plats: {
        include: {
          allergenes: true
        }
      }
    }
  });
};

// Mettre à jour un service
export const updateService = async (id, data) => {
  const { 
    name, 
    description, 
    duration, 
    price, 
    regime_id, 
    theme_id,
    plat_ids 
  } = data;

  // Préparer les données de mise à jour
  const updateData = {
    name,
    description,
    duration,
    price
  };

  // Gestion des relations
  if (regime_id !== undefined) {
    updateData.regime = regime_id 
      ? { connect: { id: regime_id } } 
      : { disconnect: true };
  }

  if (theme_id !== undefined) {
    updateData.theme = theme_id 
      ? { connect: { id: theme_id } } 
      : { disconnect: true };
  }

  // Mise à jour des plats associés
  if (plat_ids !== undefined) {
    // D'abord, on déconnecte tous les plats existants
    await prisma.service.update({
      where: { id },
      data: {
        plats: {
          set: []
        }
      }
    });

    // Puis on connecte les nouveaux plats
    if (plat_ids.length > 0) {
      updateData.plats = {
        connect: plat_ids.map(platId => ({ id: platId }))
      };
    }
  }

  return prisma.service.update({
    where: { id },
    data: updateData,
    include: {
      regime: true,
      theme: true,
      plats: {
        include: {
          allergenes: true
        }
      }
    }
  });
};

// Supprimer un service
export const deleteService = async (id) => {
  // Vérifier s'il y a des rendez-vous associés
  const appointmentsCount = await prisma.appointment.count({
    where: { service_id: id }
  });

  if (appointmentsCount > 0) {
    throw new Error(
      `Impossible de supprimer ce service. ${appointmentsCount} rendez-vous y sont associés.`
    );
  }

  return prisma.service.delete({
    where: { id }
  });
};

// Récupérer les statistiques d'un service
export const getServiceStats = async (id) => {
  const totalAppointments = await prisma.appointment.count({
    where: { service_id: id }
  });

  const pendingAppointments = await prisma.appointment.count({
    where: { 
      service_id: id,
      status: 'PENDING'
    }
  });

  const completedAppointments = await prisma.appointment.count({
    where: { 
      service_id: id,
      status: 'TERMINE'
    }
  });

  const averageRating = await prisma.review.aggregate({
    where: { 
      service_id: id,
      status: 'APPROVED'
    },
    _avg: {
      note: true
    }
  });

  return {
    totalAppointments,
    pendingAppointments,
    completedAppointments,
    averageRating: averageRating._avg.note || 0,
    reviewCount: await prisma.review.count({
      where: { 
        service_id: id,
        status: 'APPROVED'
      }
    })
  };
};