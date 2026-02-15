import prisma from '../../prisma.js';

// Créer un rendez-vous
export const createAppointment = async (data) => {
  const { date, service_id, employee_id, user_id } = data;

  return prisma.appointment.create({
    data: {
      date: new Date(date),
      status: "PENDING",
      service: {
        connect: { id: service_id }
      },
      user: {
        connect: { id: user_id }
      },
      employee: {
        connect: { id: employee_id }
      }
    }
  });
};

// Voir les rendez-vous d'un utilisateur
export const getUserAppointments = async (userId) => {
  return prisma.appointment.findMany({
    where: { user_id: userId },
    include: {
      service: true,
      employee: true
    }
  });
};

// Supprimer un rendez-vous
export const deleteAppointment = async (id, userId) => {
  return prisma.appointment.deleteMany({
    where: {
      id: id,
      user_id: userId
    }
  });
};

// Récupérer les rendez-vous selon le rôle
export const getAppointments = async (user) => {
  if (user.role === "ADMIN") {
    return prisma.appointment.findMany({
      include: {
        user: true,
        employee: true,
        service: true
      }
    });
  }

  if (user.role === "EMPLOYEE") {
    return prisma.appointment.findMany({
      where: { employee_id: user.userId },
      include: {
        user: true,
        service: true
      }
    });
  }

  return prisma.appointment.findMany({
    where: { user_id: user.userId },
    include: {
      employee: true,
      service: true
    }
  });
};

// Mettre à jour le statut d'un rendez-vous
export const updateAppointmentStatus = async (id, status, user) => {
  const appointment = await prisma.appointment.findUnique({
    where: { id }
  });

  if (!appointment) throw new Error("Rendez-vous introuvable");

  // Seul ADMIN ou EMPLOYEE peut modifier
  if (user.role !== "ADMIN" && user.role !== "EMPLOYEE") {
    throw new Error("Non autorisé");
  }

  return prisma.appointment.update({
    where: { id },
    data: { status }
  });
};