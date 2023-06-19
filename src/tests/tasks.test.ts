import request from "supertest";
import express from "express";
import { TaskService } from "../services/TaskService";
import { TaskState, TaskToCreate } from "../interfaces/Task";
import { setupApp } from "..";
import { InMemoryTaskRepository } from "../repositories/InMemoryTaskRepository";

const validationErrors = {
  titleRequired:
    "title is required. Must be a string with less than 100 characters",
  descriptionRequired:
    "description is required. Must be a string with less than 500 characters",
};

describe("POST /tasks", () => {
  const { app, server } = setupApp(
    { taskRepositories: new InMemoryTaskRepository() },
    { port: 3001 }
  );

  beforeAll((done) => {
    done();
  });

  afterAll((done) => {
    server.close(done);
  });

  it("on invalid task should return field are invalid and return 400 status", async () => {
    const taskNotSendTitle = {};

    const resNotSendTitle = await request(app)
      .post("/tasks")
      .send(taskNotSendTitle);
    expect(resNotSendTitle.status).toBe(400);
    expect(resNotSendTitle.body).toHaveProperty("message");
    expect(resNotSendTitle.body.message).toEqual(
      validationErrors.titleRequired
    );

    const taskTitleEmpty = { title: "" };

    const resTitleEmpty = await request(app)
      .post("/tasks")
      .send(taskTitleEmpty);
    expect(resTitleEmpty.status).toBe(400);
    expect(resTitleEmpty.body).toHaveProperty("message");
    expect(resTitleEmpty.body.message).toEqual(validationErrors.titleRequired);

    const taskObjTitle = { title: { key: "title" } };

    const resObjTitle = await request(app).post("/tasks").send(taskObjTitle);
    expect(resObjTitle.status).toBe(400);
    expect(resObjTitle.body).toHaveProperty("message");
    expect(resObjTitle.body.message).toEqual(validationErrors.titleRequired);

    const taskTitleLength = { title: new Array(101).join("a") };

    const resTitleLength = await request(app)
      .post("/tasks")
      .send(taskTitleLength);
    expect(resTitleLength.status).toBe(400);
    expect(resTitleLength.body).toHaveProperty("message");
    expect(resTitleLength.body.message).toEqual(validationErrors.titleRequired);

    const taskNotSendDescription = { title: "title" };

    const resNotSendDescription = await request(app)
      .post("/tasks")
      .send(taskNotSendDescription);
    expect(resNotSendDescription.status).toBe(400);
    expect(resNotSendDescription.body).toHaveProperty("message");
    expect(resNotSendDescription.body.message).toEqual(
      validationErrors.descriptionRequired
    );

    const taskEmptyDescription = { title: "title", description: "" };
    const resEmptyDescription = await request(app)
      .post("/tasks")
      .send(taskEmptyDescription);
    expect(resEmptyDescription.status).toBe(400);
    expect(resEmptyDescription.body).toHaveProperty("message");
    expect(resEmptyDescription.body.message).toEqual(
      validationErrors.descriptionRequired
    );

    const taskObjDescription = { title: "title", description: { key: "0" } };
    const resObjDescription = await request(app)
      .post("/tasks")
      .send(taskObjDescription);
    expect(resObjDescription.status).toBe(400);
    expect(resObjDescription.body).toHaveProperty("message");
    expect(resObjDescription.body.message).toEqual(
      validationErrors.descriptionRequired
    );

    const taskDescriptionLength = {
      title: "title",
      description: new Array(501).join("a"),
    };

    const resDescriptionLength = await request(app)
      .post("/tasks")
      .send(taskDescriptionLength);
    expect(resDescriptionLength.status).toBe(400);
    expect(resDescriptionLength.body).toHaveProperty("message");
    expect(resDescriptionLength.body.message).toEqual(
      validationErrors.descriptionRequired
    );
  });

  it("on valid task, should create a new task and return a 201 status", async () => {
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
  });
});

describe("GET /tasks", () => {
  const { app, server } = setupApp(
    { taskRepositories: new InMemoryTaskRepository() },
    { port: 3002 }
  );

  beforeAll((done) => {
    done();
  });

  afterAll((done) => {
    server.close(done);
  });

  it("on no tasks, should return empty array", async () => {
    const res = await request(app).get("/tasks").send();
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("tasks");
    expect(Array.isArray(res.body.tasks)).toBe(true);
    expect(res.body.tasks).toHaveLength(0);
  });

  it("on create tasks, should return created task", async () => {
    const newTask = {
      title: "New Task",
      description: "This is a new task",
    };
    const response = await request(app).post("/tasks").send(newTask);
    expect(response.status).toBe(201);

    const resGet = await request(app).get("/tasks").send();
    expect(resGet.status).toBe(200);
    expect(resGet.body).toHaveProperty("tasks");
    expect(Array.isArray(resGet.body.tasks)).toBe(true);
    expect(resGet.body.tasks).toHaveLength(1);
    expect(resGet.body.tasks[0]).toHaveProperty("title");
    expect(resGet.body.tasks[0]).toHaveProperty("description");
    expect(resGet.body.tasks[0]).toHaveProperty("state");
    expect(resGet.body.tasks[0]).toHaveProperty("id");
    expect(resGet.body.tasks[0]).toHaveProperty("createdAt");
    expect(resGet.body.tasks[0].title).toEqual(newTask.title);
    expect(resGet.body.tasks[0].description).toEqual(newTask.description);
    expect(resGet.body.tasks[0].state).toEqual(TaskState.PENDING);
  });
});

describe("GET /tasks/{taskId}", () => {
  const { app, server } = setupApp(
    { taskRepositories: new InMemoryTaskRepository() },
    { port: 3003 }
  );

  beforeAll((done) => {
    done();
  });

  afterAll((done) => {
    server.close(done);
  });

  it("on asking for not found task  should return 404", async () => {
    const res = await request(app).get("/tasks/notFound").send();
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("task with id=notFound was not found");
  });

  it("on asking for found task, should return created task", async () => {
    const newTask = {
      title: "New Task",
      description: "This is a new task",
    };
    const response = await request(app).post("/tasks").send(newTask);
    expect(response.status).toBe(201);

    const task = response.body;

    const resGet = await request(app).get(`/tasks/${response.body.id}`).send();
    expect(resGet.status).toBe(200);

    expect(resGet.body).toHaveProperty("title");
    expect(resGet.body).toHaveProperty("description");
    expect(resGet.body).toHaveProperty("state");
    expect(resGet.body).toHaveProperty("id");
    expect(resGet.body).toHaveProperty("createdAt");

    expect(resGet.body).toStrictEqual(task);
  });
});

describe("Tasks Service", () => {
  it("Create task in task service", async () => {
    const mockCreateTask = jest.fn().mockReturnValue({
      title: "A",
      description: "B",
      createdAt: new Date(),
      id: 0,
      state: TaskState.PENDING,
    });

    const taskService = new TaskService({
      create: mockCreateTask,
      getAll: jest.fn(),
      getById: jest.fn(),
    });

    const taskCreated = await taskService.createTask("A", "B");
    expect(mockCreateTask).toHaveBeenCalled();
    expect(taskCreated).toHaveProperty("id");
    expect(taskCreated.id).toEqual(0);
  });

  it("Get all tasks", async () => {
    const mockGetAllTasks = jest.fn().mockReturnValue([
      {
        title: "A",
        description: "B",
        createdAt: new Date(),
        id: 0,
        state: TaskState.PENDING,
      },
      {
        title: "A",
        description: "C",
        createdAt: new Date(),
        id: 1,
        state: TaskState.COMPLETE,
      },
      {
        title: "C",
        description: "B",
        createdAt: new Date(),
        id: 2,
        state: TaskState.PENDING,
      },
    ]);
    const taskService = new TaskService({
      create: jest.fn(),
      getById: jest.fn(),
      getAll: mockGetAllTasks,
    });

    const tasksGetAll = await taskService.getAllTasks();
    expect(mockGetAllTasks).toHaveBeenCalled();
    expect(tasksGetAll).toHaveLength(3);
  });

  it("Get task by id", async () => {
    const mockGetTaskById = jest.fn().mockImplementation((id) => {
      if (id !== "0") {
        return null;
      }
      return {
        title: "A",
        description: "B",
        createdAt: new Date(),
        id: "0",
        state: TaskState.PENDING,
      };
    });

    const taskService = new TaskService({
      create: jest.fn(),
      getById: mockGetTaskById,
      getAll: jest.fn(),
    });

    const taskGetById = await taskService.getTaskById("1");
    expect(mockGetTaskById).toHaveBeenCalled();
    expect(taskGetById).toBeNull();

    const taskGetById2 = await taskService.getTaskById("0");
    expect(mockGetTaskById).toHaveBeenCalled();
    expect(taskGetById2).toStrictEqual({
      title: "A",
      description: "B",
      createdAt: new Date(),
      id: "0",
      state: TaskState.PENDING,
    });
  });
});
