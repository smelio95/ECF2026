import 'dotenv/config';
import app from './app.js';
import { connectMongo } from '../mongodb.js';

const PORT = process.env.PORT || 3000;

connectMongo()
  .catch((err) => {
    console.warn('⚠️  MongoDB non disponible, démarrage sans NoSQL:', err.message);
  })
  .finally(() => {
    app.listen(PORT, () => {
      console.log(`✅ Serveur démarré sur le port ${PORT}`);
      console.log(`🗄️  Base de données: ${process.env.DATABASE_URL ? 'Connectée' : '❌ Non configurée'}`);
    });
  });