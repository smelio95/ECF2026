import { 
  createAppointment,
  getUserAppointments,
  deleteAppointment,
  getAppointments,
  updateAppointmentStatus
} from './appointment.model.js';

// POST /api/appointments - Créer une commande (utilisateur connecté)
export const create = async (req, res) => {
  try {
    const appointment = await createAppointment({
      ...req.body,
      user_id: req.user.id
    });

    res.status(201).json({
      message: "Commande créée avec succès",
      appointment
    });
  } catch (error) {
    console.error('Erreur create appointment:', error);
    res.status(500).json({ message: "Erreur lors de la création de la commande", error: error.message });
  }
};

// GET /api/appointments - Toutes les commandes (selon le rôle)
export const getAll = async (req, res) => {
  try {
    const appointments = await getAppointments(req.user);
    res.json(appointments);
  } catch (error) {
    console.error('Erreur getAll appointments:', error);
    res.status(500).json({ message: "Erreur lors de la récupération des commandes" });
  }
};

// GET /api/appointments/me - Mes commandes (utilisateur connecté)
export const getMine = async (req, res) => {
  try {
    const appointments = await getUserAppointments(req.user.id); 
    res.json(appointments);
  } catch (error) {
    console.error('Erreur getMine appointments:', error);
    res.status(500).json({ message: "Erreur lors de la récupération de vos commandes" });
  }
};

// DELETE /api/appointments/:id - Annuler une commande
export const remove = async (req, res) => {
  try {
    await deleteAppointment(
      parseInt(req.params.id),
      req.user
);
    res.json({ message: "Commande annulée avec succès" });
  } catch (error) {
    console.error('Erreur remove appointment:', error);
    res.status(500).json({ message: "Erreur lors de l'annulation" });
  }
};

// PUT /api/appointments/:id - Modifier le statut (ADMIN/EMPLOYEE)
export const updateStatus = async (req, res) => {
  try {
    const updated = await updateAppointmentStatus(
      parseInt(req.params.id),
      req.body.status,
      req.user
    );
    res.json({
      message: "Statut mis à jour",
      appointment: updated
    });
  } catch (error) {
    console.error('Erreur updateStatus appointment:', error);
    res.status(403).json({ message: error.message });
  }
};