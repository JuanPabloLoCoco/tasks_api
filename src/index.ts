import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import morgan from "morgan";
import { TaskRepository } from "./interfaces/TaskRepository";
import { tasksRouterBuilder } from "./routers/tasksRouters";

interface AppRepositories {
  taskRepositories: TaskRepository;
}

interface AppProps {
  port: number;
  logger: boolean;
}

export const setupApp = (
  respositories: AppRepositories,
  props: Partial<AppProps>
) => {
  dotenv.config();

  const app = express();
  const port = props.port || process.env.TEST_PORT || 3000;

  app.use(bodyParser.json());

  if (props.logger) {
    app.use(morgan("combined"));
  }

  app.use("/tasks", tasksRouterBuilder(respositories.taskRepositories));

  app.get("/test", (_, res) => {
    res.send("Hello, test route!");
  });

  // 404 middleware
  app.use((_1, res, _2) => {
    res.status(404).send("Sorry, can't find that!");
  });

  const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  return {
    app,
    server,
  };
};
