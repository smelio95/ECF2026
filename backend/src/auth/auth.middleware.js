import jwt from 'jsonwebtoken';
import prisma from '../../prisma.js';

export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization']; // Récupérer l'en-tête d'authentification pour extraire le token pour les routes protégées de l'API. Le token est généralement envoyé dans l'en-tête Authorization sous la forme "Bearer TOKEN". req.headers['authorization'] est utilisé pour accéder à cet en-tête. Si l'en-tête est présent, il contient la chaîne "Bearer TOKEN". La méthode split(' ')[1] est utilisée pour extraire uniquement la partie du token, en séparant la chaîne par l'espace et en prenant le deuxième élément du tableau résultant (index 1), qui correspond au token lui-même.
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