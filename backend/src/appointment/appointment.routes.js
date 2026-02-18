import express from "express";
import { create, getMine, remove, getAll, updateStatus } from "./appointment.controller.js";
import { authenticateToken } from "../auth/auth.middleware.js";
import { requireRole } from "../role/role.middleware.js";

const router = express.Router();

router.post("/", authenticateToken, create);
router.get("/me", authenticateToken, getMine);
router.delete("/:id", authenticateToken, remove);
router.get("/", authenticateToken, getAll);
router.put('/:id', authenticateToken, requireRole(['ADMIN', 'EMPLOYEE']), updateStatus);

export default router;