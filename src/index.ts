import express, { Request, Response } from "express";
import { InMemoryTaskRepository } from "./repositories/InMemoryTaskRepository";
import { TaskService } from "./services/TaskService";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import morgan from "morgan";
// import { FirestoreTaskRepository } from "./repositories/FirestoreTaskRepository";
// import { initializeApp } from "firebase-admin/app";
// import serviceAccount from "../serviceAccountKey.json";
dotenv.config();

const app = express();
const port = 3000;

const taskRepository = new InMemoryTaskRepository();

var serviceAccount = require("../serviceAccountKey.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// const firestore = admin.firestore();
// const taskRepository = new FirestoreTaskRepository(firestore);
const taskService = new TaskService(taskRepository);

app.use(bodyParser.json());
app.use(morgan("combined"));

app.post("/tasks", async (req, res) => {
  console.log(req.body);
  const { title, description } = req.body;

  try {
    const newTask = await taskService.createTask(title, description);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: "Error creating task" });
  }
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Express and Jest!");
});

app.get("/test", (_, res) => {
  res.send("Hello, test route!");
});

// 404 middleware
app.use((_1, res, _2) => {
  res.status(404).send("Sorry, can't find that!");
});

export const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
