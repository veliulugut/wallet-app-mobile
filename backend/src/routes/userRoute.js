import express from "express";
import { createUser, getUserByEmail, deleteUserByID } from "../controllers/userController.js";

const router = express.Router();

// POST /api/users - Create new user
router.post("/", createUser);

// GET /api/users/email/:email - Get user by email
router.get("/email/:email", getUserByEmail);

// DELETE /api/users/:user_id - Delete user by ID
router.delete("/:user_id", deleteUserByID);

export default router;