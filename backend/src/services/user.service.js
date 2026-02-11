// Importation du client Prisma pour interagir avec la base de données
import { PrismaClient } from '@prisma/client';

// Importation de bcrypt pour le hachage des mots de passe
import bcrypt from 'bcrypt';

// Importation de jsonwebtoken pour la gestion des tokens JWT
import jwt from 'jsonwebtoken';

// Création d'une instance du client Prisma
const prisma = new PrismaClient();

// Fonction pour créer un nouvel utilisateur dans la base de données
export const createUser = async (userData) => {
    const { email, password, firstname, lastname, roleId } = userData;

    const hashedPassword = await bcrypt.hash(password, 10);

    return prisma.user.create({
        data : {
            email,
            password: hashedPassword,
            firstname,
            lastname,
            role: {
                connect: { id: roleId }
            }
        }
    });
};

// Fonction pour authentifier un utilisateur et générer un token JWT
export const loginUser = async (email, password) => {
    const user = await prisma.user.findUnique({ 
        where: { email }, 
        include: { role: true },
    });

    if (!user) {
        throw new Error('Utilisateur non trouvé');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error('Mot de passe incorrect');
    }

    const token = jwt.sign(
        { 
            userId: user.id, 
            role: user.role.name 
        },
        
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    return { token, user };
}