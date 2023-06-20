import { setupApp } from "./app";
import { InMemoryTaskRepository } from "./repositories/InMemoryTaskRepository";

const { app, server } = setupApp(
  { taskRepositories: new InMemoryTaskRepository() },
  { port: 3000 }
);
export { app, server };
