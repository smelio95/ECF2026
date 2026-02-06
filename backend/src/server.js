import express from "express";

const app = express();
const PORT = 3000;

// Middleware JSON
app.use(express.json());

// Route de test
app.get("/health", (req, res) => {
  res.json({ status: "API OK" });
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur backend lancé sur http://localhost:${PORT}`);
});
