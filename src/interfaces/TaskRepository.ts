// src/interfaces/TaskRepository.ts
import { Task, TaskToCreate } from "./Task";

export interface TaskRepository {
  create(task: TaskToCreate): Promise<Task>;
  getAll(): Promise<Task[]>;
  getById(id: string): Promise<Task | null>;
}
