// src/repositories/InMemoryTaskRepository.ts
import { Task, TaskState, TaskToCreate } from "../interfaces/Task";
import { TaskRepository } from "../interfaces/TaskRepository";
import { v4 as uuidv4 } from "uuid";

export class InMemoryTaskRepository implements TaskRepository {
  private tasks: Map<string, Task> = new Map();

  constructor(initialTasks?: Task[]) {
    if (!initialTasks) {
      return;
    }
    for (let task of initialTasks) {
      this.tasks.set(task.id, task);
    }
  }

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

  async getAll(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async getById(id: string): Promise<Task | null> {
    const task = this.tasks.get(id);
    return task ? task : null;
  }

  async update(task: Task): Promise<Task> {
    this.tasks.set(task.id, task);
    return task;
  }

}
