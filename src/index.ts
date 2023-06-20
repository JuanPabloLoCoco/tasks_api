import { setupApp } from "./app";
import { InMemoryTaskRepository } from "./repositories/InMemoryTaskRepository";

// import { FirestoreTaskRepository } from "./repositories/FirestoreTaskRepository";
// import { getFirestore } from "firebase-admin/firestore";
// import { initializeApp, cert } from "firebase-admin/app";
// const serviceAccount = require("../../serviceAccountKey.json");
// initializeApp({
//   credential: cert(serviceAccount),
// });
const taskRepository = new InMemoryTaskRepository(); // new FirestoreTaskRepository(getFirestore())

const { app, server } = setupApp({ taskRepository }, { port: 3000 });
export { app, server };
