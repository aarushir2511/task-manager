import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { getTasks, createTask, updateTask, deleteTask, toggleTask } from "../controllers/task.controller";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getTasks);
router.post("/", createTask);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);
router.patch("/:id/toggle", toggleTask);

export default router;