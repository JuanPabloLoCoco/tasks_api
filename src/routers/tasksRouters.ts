import express from "express";
import { TaskService } from "../services/TaskService";
import { TaskRepository } from "../interfaces/TaskRepository";
import { Task, TaskState } from "../interfaces/Task";

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
      .status(404)
      .json({ message: `task with id=${taskId} was not found` });
  });

  router.put("/:id", async (req, res) => {
    const taskId = req.params.id;

    const taskFound = await taskService.getTaskById(taskId);
    if (!taskFound) {
      return res
        .status(404)
        .json({ message: `task with id=${taskId} was not found` });
    }

    const { title, description, state } = req.body;

    const fieldToEdit: Partial<Omit<Task, "id" | "createdAt">> = {};

    if (title !== undefined) {
      if (
        typeof title !== "string" ||
        title.length === 0 ||
        title.length >= 100
      ) {
        return res.status(400).json({
          message: "field title must be a string with less than 100 characters",
        });
      }
      fieldToEdit["title"] = title;
    }

    if (description !== undefined) {
      if (
        typeof description !== "string" ||
        description.length === 0 ||
        description.length >= 500
      ) {
        return res.status(400).json({
          message:
            "field description must be a string with less than 500 characters",
        });
      }
      fieldToEdit["description"] = description;
    }

    if (state !== undefined) {
      if (
        typeof state !== "string" ||
        !["complete", "pending"].includes(state)
      ) {
        return res.status(400).json({
          message: `field state can be '${TaskState.PENDING}' or '${TaskState.COMPLETE}'`,
        });
      }
      fieldToEdit["state"] =
        state === "complete" ? TaskState.COMPLETE : TaskState.PENDING;
    }

    if (Object.keys(fieldToEdit).length === 0) {
      return res.status(200).json(taskFound);
    }

    const editedTask = await taskService.updateTask({
      ...taskFound,
      ...fieldToEdit,
    });

    return res.status(200).json(editedTask);
  });

  router.delete("/:id", async (req, res) => {
    const taskId = req.params.id;

    const taskFound = await taskService.getTaskById(taskId);
    if (!taskFound) {
      return res
        .status(404)
        .json({ message: `task with id=${taskId} was not found` });
    }

    const deleteTaskAwait = await taskService.deleteTask(taskId);

    return res
      .status(200)
      .json({ message: `task with id=${taskId} was deleted` });
  });

  return router;
};
