// import { initializeApp, cert } from "firebase-admin/app";
// import { getFirestore } from "firebase-admin/firestore";
// import { FirestoreTaskRepository } from "../repositories/FirestoreTaskRepository";
// import { setupApp } from "../app";
// import request from "supertest";
// import { TaskState } from "../interfaces/Task";

// // This certificate allows you to write to production
// const serviceAccount = require("../../serviceAccountKey.json");
// initializeApp({
//   credential: cert(serviceAccount),
// });

// describe.skip("Firebase Repository Implementation", () => {
//   const { app, server } = setupApp(
//     { taskRepositories: new FirestoreTaskRepository(getFirestore()) },
//     { port: 30006 }
//   );

//   beforeAll((done) => {
//     done();
//   });

//   afterAll((done) => {
//     server.close(done);
//   });

//   it("complete tasks cycle", async () => {
//     const newTask = {
//       title: "New Task",
//       description: "This is a new task",
//     };

//     const resNewTask = await request(app).post("/tasks").send(newTask);

//     expect(resNewTask.status).toBe(201);
//     expect(resNewTask.body.title).toEqual(newTask.title);
//     expect(resNewTask.body.description).toEqual(newTask.description);
//     expect(resNewTask.body.id).toBeDefined();
//     expect(resNewTask.body.createdAt).toBeDefined();

//     const task = resNewTask.body;
//     const taskId = task.id;

//     const res0 = await request(app).get("/tasks").send();
//     expect(res0.status).toBe(200);
//     expect(res0.body).toHaveProperty("tasks");
//     expect(res0.body.tasks.length).toBeGreaterThanOrEqual(1);

//     const res2 = await request(app).get(`/tasks/${taskId}`).send();
//     expect(res2.status).toBe(200);
//     expect(res2.body).toHaveProperty("title");
//     expect(res2.body.title).toBe(task.title);
//     expect(res2.body.description).toBe(task.description);
//     expect(res2.body.state).toBe(task.state);

//     const res2NotFound = await request(app).get(`/tasks/notFound`).send();
//     expect(res2NotFound.status).toBe(404);

//     // EDIT Task
//     const res3 = await request(app)
//       .put(`/tasks/${res0.body.tasks[0].id}`)
//       .send({ state: TaskState.COMPLETE });
//     expect(res3.status).toBe(200);

//     // GET task by id should have the edited task
//     const res4 = await request(app)
//       .get(`/tasks/${res0.body.tasks[0].id}`)
//       .send();
//     expect(res4.status).toBe(200);
//     expect(res4.body.state).toBe(TaskState.COMPLETE);

//     // Delete task
//     const res5 = await request(app)
//       .delete(`/tasks/${res0.body.tasks[0].id}`)
//       .send();
//     expect(res5.status).toBe(200);
//   }, 10000);
// });

describe("Firebase test", () => {
  it("Ok === ok", () => {
    expect(true).toBe(true);
  });
});
