import 'dotenv/config';
import app from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur le port ${PORT}`);
  console.log(`🗄️  Base de données: ${process.env.DATABASE_URL ? 'Connectée' : '❌ Non configurée'}`);
});