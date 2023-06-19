import express from "express";
import { TaskService } from "../services/TaskService";
import { TaskRepository } from "../interfaces/TaskRepository";

export const tasksRouterBuilder = (taskRepository: TaskRepository) => {
  const router = express.Router();
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

  router.get("/", async (req, res) => {
    const tasks = await taskService.getAllTasks();
    return res.status(200).json({ tasks });
  });

  router.get("/:id", async (req, res) => {
    const taskId = req.params.id;

    const taskFound = await taskService.getTaskById(taskId);
    if (taskFound) {
      return res.status(200).json(taskFound);
    }
    return res
      .status(400)
      .json({ message: `task with id=${taskId} was not found` });
  });
  return router;
};
