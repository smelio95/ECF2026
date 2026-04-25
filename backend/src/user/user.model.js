import prisma from '../../prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Créer un nouvel utilisateur
export const createUser = async (userData) => {
  const { email, password, firstname, lastname, phone, address, city, country, role_id } = userData;

  // Hasher le mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  // Créer l'utilisateur
  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstname,
      lastname,
      phone,
      address,
      city,
      country,
      role: {
        connect: { id: role_id || 3 } // Par défaut role_id = 3 (UTILISATEUR)
      }
    },
    include: {
      role: true
    }
  });
};

// Authentifier un utilisateur et générer un token JWT
export const loginUser = async (email, password) => {
  // Rechercher l'utilisateur
  const user = await prisma.user.findUnique({ 
    where: { email }, 
    include: { role: true },
  });

  if (!user) {
    throw new Error('Utilisateur non trouvé');
  }

  // Vérifier le mot de passe
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Mot de passe incorrect');
  }

  // Générer le token JWT
  const token = jwt.sign(
    { 
      userId: user.id, 
      role: user.role.label 
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  return { token, user };
};

// Récupérer un utilisateur par son ID
export const getUserById = async (userId) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstname: true,
      lastname: true,
      phone: true,
      address: true,
      city: true,
      country: true,
      created_at: true,
      role: {
        select: {
          id: true,
          label: true
        }
      }
    }
  });
};

// Mettre à jour les informations d'un utilisateur
export const updateUser = async (userId, userData) => {
  const { firstname, lastname, phone, address, city, country, role_id, password } = userData;

  const dataToUpdate = {
    firstname,
    lastname,
    phone,
    address,
    city,
    country,
    ...(role_id && {
      role: {
        connect: { id: parseInt(role_id) }
      }
    })
  };

  if (password) {
    dataToUpdate.password = await bcrypt.hash(password, 10);
  }

  return prisma.user.update({
    where: { id: parseInt(userId) },
    data: dataToUpdate,
    select: {
      id: true,
      email: true,
      firstname: true,
      lastname: true,
      phone: true,
      address: true,
      city: true,
      country: true,
      role: {
        select: {
          id: true,
          label: true
        }
      }
    }
  });
};

// Supprimer un utilisateur
export const deleteUser = async (userId) => {
  return prisma.user.delete({
    where: { id: userId }
  });
};

// Récupérer tous les utilisateurs
export const getAllUsersFromDB = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      firstname: true,
      lastname: true,
      email: true,
      phone: true,
      address: true,
      city: true,
      role: {
        select: { label: true }
      },
      created_at: true
    },
    orderBy: { created_at: 'desc' }
  });
};

// Récupérer les employés et admins
export const getEmployeesFromDB = async () => {
  return prisma.user.findMany({
    where: {
      role: {
        label: { in: ['EMPLOYEE'] }
      }
    },
    select: {
      id: true,
      firstname: true,
      lastname: true,
      role: {
        select: { label: true }
      }
    },
    orderBy: { firstname: 'asc' }
  });
};