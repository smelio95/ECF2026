import prisma from '../../prisma.js';

// Créer une commande
export const createAppointment = async (data) => {
  const { date, service_id, employee_id, user_id } = data;

  // Vérifications
  if (!date || !service_id || !employee_id || !user_id) {
    throw new Error("date, service_id, employee_id et user_id sont requis");
  }

  return prisma.appointment.create({
    data: {
      date: new Date(date),
      status: 'PENDING',
      service:  { connect: { id: parseInt(service_id) } },
      user:     { connect: { id: parseInt(user_id) } },
      employee: { connect: { id: parseInt(employee_id) } }
    },
    include: {
      service:  { select: { id: true, name: true, price: true } },
      user:     { select: { id: true, firstname: true, lastname: true, email: true } },
      employee: { select: { id: true, firstname: true, lastname: true } }
    }
  });
};

// Mes commandes (utilisateur connecté)
export const getUserAppointments = async (userId) => {
  return prisma.appointment.findMany({
    where: { user_id: parseInt(userId) },
    include: {
      service:  { select: { id: true, name: true, price: true } },
      employee: { select: { id: true, firstname: true, lastname: true } }
    },
    orderBy: { date: 'desc' }
  });
};

// Supprimer une commande (uniquement la sienne)
export const deleteAppointment = async (id, user) => {
  const appointment = await prisma.appointment.findUnique({ where: { id } });

  if (!appointment) {
    throw new Error("Commande non trouvée");
  }

  const roleLabel = user.role?.label || user.role;

  if (roleLabel !== 'ADMIN' && appointment.user_id !== parseInt(user.id)) {
    throw new Error("Vous ne pouvez pas supprimer cette commande");
  }

  return prisma.appointment.delete({ where: { id } });
};

// Toutes les commandes selon le rôle
export const getAppointments = async (user) => {
  // ✅ CORRIGÉ : user.role.label (objet complet) et non user.role (string)
  const roleLabel = user.role?.label || user.role;

  if (roleLabel === 'ADMIN') {
    return prisma.appointment.findMany({
      include: {
        user:     { select: { id: true, firstname: true, lastname: true, email: true, phone: true } },
        employee: { select: { id: true, firstname: true, lastname: true } },
        service:  { select: { id: true, name: true, price: true } }
      },
      orderBy: { date: 'desc' }
    });
  }

  if (roleLabel === 'EMPLOYEE') {
    return prisma.appointment.findMany({
      where: { employee_id: parseInt(user.id) }, // ✅ CORRIGÉ : user.id
      include: {
        user:    { select: { id: true, firstname: true, lastname: true, email: true, phone: true } },
        service: { select: { id: true, name: true, price: true } }
      },
      orderBy: { date: 'desc' }
    });
  }

  // UTILISATEUR : ses propres commandes
  return prisma.appointment.findMany({
    where: { user_id: parseInt(user.id) }, // ✅ CORRIGÉ : user.id
    include: {
      employee: { select: { id: true, firstname: true, lastname: true } },
      service:  { select: { id: true, name: true, price: true } }
    },
    orderBy: { date: 'desc' }
  });
};

// Mettre à jour le statut (ADMIN ou EMPLOYEE)
export const updateAppointmentStatus = async (id, status, user) => {
  const roleLabel = user.role?.label || user.role; // ✅ CORRIGÉ

  if (roleLabel !== 'ADMIN' && roleLabel !== 'EMPLOYEE') {
    throw new Error("Accès refusé : réservé aux employés et administrateurs");
  }

  const appointment = await prisma.appointment.findUnique({ where: { id } });
  if (!appointment) throw new Error("Commande introuvable");

  // Vérifier que les statuts sont valides
  const validStatuses = ['PENDING', 'ACCEPTE', 'EN_PREPARATION', 'TERMINE', 'ANNULE'];
  if (!validStatuses.includes(status)) {
    throw new Error(`Statut invalide. Valeurs possibles: ${validStatuses.join(', ')}`);
  }

  return prisma.appointment.update({
    where: { id },
    data: { status },
    include: {
      user:     { select: { firstname: true, lastname: true, email: true } },
      employee: { select: { firstname: true, lastname: true } },
      service:  { select: { name: true, price: true } }
    }
  });
};