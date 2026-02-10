import { createUser } from "../services/user.service.js";

export const registerUser = async (req, res) => {
  try {
    const user = await createUser(req.body);

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de la création",
      error: error.message
    });
  }
};