//Fichier de configuration pour Prisma, qui exporte une instance de PrismaClient pour être utilisée dans toute l'application.
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;