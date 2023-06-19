// src/repositories/InMemoryTaskRepository.ts
import { Task, TaskState, TaskToCreate } from "../interfaces/Task";
import { TaskRepository } from "../interfaces/TaskRepository";
import { v4 as uuidv4 } from "uuid";

export class InMemoryTaskRepository implements TaskRepository {
  private tasks: Map<string, Task> = new Map();

  async create(task: TaskToCreate): Promise<Task> {
    let taskId = uuidv4();
    const newTask: Task = {
      ...task,
      id: taskId,
      state: TaskState.PENDING,
      createdAt: new Date(),
    };
    this.tasks.set(taskId, newTask);
    return newTask;
  }

}
