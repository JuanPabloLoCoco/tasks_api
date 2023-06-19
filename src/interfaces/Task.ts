export enum TaskState {
  PENDING = "pending",
  COMPLETE = "complete",
}

export interface Task {
  id: string;
  title: string;
  description: string;
  state: TaskState;
  createdAt: Date;
}

export type TaskToCreate = Omit<Task, "id" | "state" | "createdAt">;
