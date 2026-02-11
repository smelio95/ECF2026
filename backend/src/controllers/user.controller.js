import { createUser } from "../services/user.service.js";
import { loginUser } from "../services/user.service.js";

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

export const login = async (req, res) => {
    //console.log("🔥 ROUTE /login ATTEINTE");
    //console.log("BODY 👉", req.body);

    try {
        const { email, password } = req.body;

        const result = await loginUser(email, password);

        res.json({
            message: "Connexion réussie",
            token: result.token,
            user: {
                id: result.user.id,
                email: result.user.email,
                role: result.user.role.name,
            }

        })

    } catch (error) {
        //console.error("LOGIN ERROR 👉", error);
        res.status(401).json({ message: error.message });
    }
}