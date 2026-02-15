import { createAppointment, getUserAppointments, deleteAppointment, getAppointments, updateAppointmentStatus} from './appointment.model.js';

// POST /appointments
export const create = async (req, res) => {
  try {
    const appointment = await createAppointment({
      ...req.body,
      user_id: req.user.userId
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur création rendez-vous" });
  }
};

// GET /appointments
export const getAll = async (req, res) => {
  try {
    const appointments = await getAppointments(req.user);
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Erreur récupération rendez-vous" });
  }
};

// GET /appointments/me
export const getMine = async (req, res) => {
  try {
    const appointments = await getUserAppointments(req.user.userId);
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Erreur récupération rendez-vous" });
  }
};

// DELETE /appointments/:id
export const remove = async (req, res) => {
  try {
    await deleteAppointment(
      parseInt(req.params.id),
      req.user.userId
    );

    res.json({ message: "Rendez-vous supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur suppression" });
  }
};

// PUT /appointments/:id
export const updateStatus = async (req, res) => {
  try {
    const updated = await updateAppointmentStatus(
      parseInt(req.params.id),
      req.body.status,
      req.user
    );
    res.json(updated);
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};