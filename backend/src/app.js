import express from "express";
import cors from "cors";

// Import des routes
import userRoutes from "./user/user.routes.js";
import appointmentRoutes from "./appointment/appointment.routes.js";
import platRoutes from "./plat/plat.routes.js";
import serviceRoutes from "./service/service.routes.js";
import reviewRoutes from "./review/review.routes.js";
import horaireRoutes from "./horaire/horaire.routes.js";
import allergeneRoutes from "./allergene/allergene.routes.js";
import themeRoutes from "./theme/theme.routes.js";
import regimeRoutes from "./regime/regime.routes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", userRoutes); 
app.use("/api/appointments", appointmentRoutes); 
app.use("/api/plats", platRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/horaires", horaireRoutes);
app.use("/api/allergenes", allergeneRoutes);
app.use("/api/themes", themeRoutes);
app.use("/api/regimes", regimeRoutes);

// Route de test
app.get("/", (req, res) => {
  res.json({ 
    message: "API Vite & Gourmand - Serveur actif",
    version: "1.0.0"
  });
});

export default app;