import express, { Request, Response } from "express";
import { InMemoryTaskRepository } from "../repositories/InMemoryTaskRepository";
import { TaskService } from "../services/TaskService";

const router = express.Router();
const taskRepository = new InMemoryTaskRepository();
const taskService = new TaskService(taskRepository);

router.post("/", async (req, res) => {
  // Logica para creacion de rutas
  const { title, description } = req.body;

  if (!title || typeof title !== "string" || title.length >= 100) {
    return res.status(400).json({
      message:
        "title is required. Must be a string with less than 100 characters",
    });
  }

  if (
    !description ||
    typeof description !== "string" ||
    description.length >= 500
  ) {
    return res.status(400).json({
      message:
        "description is required. Must be a string with less than 500 characters",
    });
  }

  try {
    const newTask = await taskService.createTask(title, description);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: "Error creating task" });
  }
});

export default router;
