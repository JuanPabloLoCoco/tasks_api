// src/services/TaskService.ts
import { Task } from "../interfaces/Task";
import { TaskRepository } from "../interfaces/TaskRepository";

export class TaskService {
  constructor(private taskRepository: TaskRepository) {}

  async createTask(title: string, description: string): Promise<Task> {
    return await this.taskRepository.create({ title, description });
  }

}
