// Importation du client Prisma pour interagir avec la base de données
import { PrismaClient } from '@prisma/client';

// Création d'une instance du client Prisma
const prisma = new PrismaClient();

// Fonction pour créer un nouvel utilisateur dans la base de données
export const createUser = async (userData) => {
    const { email, password, firstname, lastname, roleId } = userData;
    
    return prisma.user.create({
        data : {
            email,
            password,
            firstname,
            lastname,
            role: {
                connect: { id: roleId }
            }
        }
    });
};