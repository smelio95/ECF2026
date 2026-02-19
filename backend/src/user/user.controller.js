import prisma from '../prisma.js';
import { createUser, loginUser, getUserById, updateUser, deleteUser as deleteUserFromDB } from './user.model.js';

// Inscription d'un nouvel utilisateur
export const registerUser = async (req, res) => {
  try {
    const user = await createUser(req.body);

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      user: {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role.label
      }
    });
  } catch (error) {
    console.error(error);
    
    // Gestion des erreurs spécifiques
    if (error.code === 'P2002') {
      return res.status(400).json({
        message: "Cet email est déjà utilisé"
      });
    }
    
    res.status(500).json({
      message: "Erreur lors de la création de l'utilisateur",
      error: error.message
    });
  }
};

// Connexion d'un utilisateur
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation basique
    if (!email || !password) {
      return res.status(400).json({ 
        message: "Email et mot de passe requis" 
      });
    }

    const result = await loginUser(email, password);

    res.json({
      message: "Connexion réussie",
      token: result.token,
      user: {
        id: result.user.id,
        email: result.user.email,
        firstname: result.user.firstname,
        lastname: result.user.lastname,
        role: result.user.role.label,
      }
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(401).json({ 
      message: error.message 
    });
  }
};

// Récupérer le profil de l'utilisateur connecté
export const getProfile = async (req, res) => {
  try {
    const user = await getUserById(req.user.id); // ✅ CORRIGÉ

    if (!user) {
      return res.status(404).json({ 
        message: "Utilisateur non trouvé" 
      });
    }

    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: "Erreur lors de la récupération du profil" 
    });
  }
};

// Mettre à jour le profil de l'utilisateur connecté
export const updateProfile = async (req, res) => {
  try {
    const updatedUser = await updateUser(req.user.id, req.body); // ✅ CORRIGÉ

    res.json({
      message: "Profil mis à jour avec succès",
      user: updatedUser
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: "Erreur lors de la mise à jour du profil" 
    });
  }
};

// Supprimer le compte de l'utilisateur connecté
export const deleteProfile = async (req, res) => {
  try {
    await deleteUserFromDB(req.user.id); // ✅ CORRIGÉ
    res.json({ message: "Compte supprimé avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: "Erreur lors de la suppression du compte",
      error: error.message
    });
  }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
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
        res.json(users);
    } catch (error) {
        console.error('Erreur getAllUsers:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

export const getEmployees = async (req, res) => {
    try {
        const employees = await prisma.user.findMany({
            where: {
                role: {
                    label: { in: ['EMPLOYEE', 'ADMIN'] }
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
        res.json(employees);
    } catch (error) {
        console.error('Erreur getEmployees:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};