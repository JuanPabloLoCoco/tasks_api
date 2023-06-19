import request from "supertest";
import app, { server } from ".";
import admin from "firebase-admin";
import { FirestoreTaskRepository } from "./repositories/FirestoreTaskRepository";

beforeAll((done) => {
  done();
});

afterAll((done) => {
  server.close(done);
});

describe("Test route", () => {
  it('should return "Hello, test route!"', async () => {
    const response = await request(app).get("/test");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Hello, test route!");
  });
});

describe("404 route", () => {
  it(`should return a 404 status and a "Sorry, can't find that!" message`, async () => {
    const response = await request(app).get("/nonexistent-route");
    expect(response.status).toBe(404);
    expect(response.text).toBe("Sorry, can't find that!");
  });
});

describe("POST /tasks", () => {
  it("should create a new task and return a 201 status", async () => {
    const newTask = {
      title: "New Task",
      description: "This is a new task",
    };

    const response = await request(app).post("/tasks").send(newTask);

    expect(response.status).toBe(201);
    expect(response.body.title).toEqual(newTask.title);
    expect(response.body.description).toEqual(newTask.description);
    expect(response.body.id).toBeDefined();
    expect(response.body.createdAt).toBeDefined();
  }, 10000);
});
