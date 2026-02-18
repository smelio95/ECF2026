import jwt from 'jsonwebtoken';
import prisma from '../../prisma.js';

export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({ 
                message: "Token d'authentification manquant" 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Récupérer l'utilisateur complet depuis la base
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId }, // ou decoded.id selon votre JWT
            include: {
                role: true
            }
        });

        if (!user) {
            return res.status(403).json({ 
                message: "Utilisateur non trouvé" 
            });
        }

        // IMPORTANT : Attacher l'utilisateur à req
        req.user = user;
        
        next();
    } catch (error) {
        console.error('Erreur authentification:', error);
        return res.status(403).json({ 
            message: "Token invalide ou expiré" 
        });
    }
};