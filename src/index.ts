import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import morgan from "morgan";
import tasksRouter from "./routers/tasksRouters";
dotenv.config();

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(morgan("combined"));

app.use("/tasks", tasksRouter);

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
