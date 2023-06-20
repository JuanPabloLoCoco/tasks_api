// src/repositories/FirestoreTaskRepository.ts
import { Task, TaskState, TaskToCreate } from "../interfaces/Task";
import { TaskRepository } from "../interfaces/TaskRepository";
import * as admin from "firebase-admin";
const {
  initializeApp,
  applicationDefault,
  cert,
} = require("firebase-admin/app");
const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");

interface StoredTask {
  title: Task["title"];
  description: Task["description"];
  state: Task["state"];
  createdAt: number;
}

function convertStoredToTask(id: string, stored: StoredTask): Task {
  return { ...stored, createdAt: new Date(stored.createdAt), id };
}

export class FirestoreTaskRepository implements TaskRepository {
  private readonly tasksCollection; // = firestore.collection("tasks");

  constructor(firestore: admin.firestore.Firestore) {
    this.tasksCollection = firestore.collection("tasks");
  }

  async create(task: TaskToCreate): Promise<Task> {
    const newTaskRef = this.tasksCollection.doc();
    const newTask: StoredTask = {
      ...task,
      createdAt: new Date().getTime(),
      state: TaskState.PENDING,
    };
    await newTaskRef.set(newTask);
    return convertStoredToTask(newTaskRef.id, newTask);
  }

  async getAll(): Promise<Task[]> {
    const snapshot = await this.tasksCollection.get();
    const tasks: Task[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      tasks.push(
        convertStoredToTask(doc.id, {
          description: data.description,
          title: data.title,
          state: data.state,
          createdAt: data.createdAt,
        })
      );
    });
    return tasks;
  }

  async getById(id: string): Promise<Task | null> {
    const taskDoc = await this.tasksCollection.doc(id).get();

    if (!taskDoc || !taskDoc.exists) {
      return null;
    }
    const data = taskDoc.data();

    if (!data) {
      return null;
    }
    return convertStoredToTask(id, {
      description: data.description,
      title: data.title,
      state: data.state,
      createdAt: data.createdAt,
    });
  }

  async update(task: Task): Promise<Task> {
    await this.tasksCollection.doc(task.id).update({
      title: task.title,
      description: task.description,
      state: task.state,
    });
    return task;
  }
  async delete(id: string): Promise<void> {
    await this.tasksCollection.doc(id).delete();
    return;
  }
}
