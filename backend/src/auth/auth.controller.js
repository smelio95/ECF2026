import prisma from '../../config/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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
            role: user.role.label 
        },
        
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    return { token, user };
}