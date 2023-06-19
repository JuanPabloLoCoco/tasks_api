// src/services/TaskService.ts
import { Task } from "../interfaces/Task";
import { TaskRepository } from "../interfaces/TaskRepository";

export class TaskService {
  constructor(private taskRepository: TaskRepository) {}

  async createTask(title: string, description: string): Promise<Task> {
    return await this.taskRepository.create({ title, description });
  }

  async getAllTasks(): Promise<Task[]> {
    return await this.taskRepository.getAll();
  }

  async getTaskById(id: string): Promise<Task | null> {
    return await this.taskRepository.getById(id);
  }

  async updateTask(task: Task): Promise<Task> {
    return await this.taskRepository.update(task);
  }
}
