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
    { port: 30001 }
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
    { port: 30002 }
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
    { port: 30003 }
  );

  beforeAll((done) => {
    done();
  });

  afterAll((done) => {
    server.close(done);
  });

  it("on asking for not found task  should return 404", async () => {
    const res = await request(app).get("/tasks/notFound").send();
    expect(res.status).toBe(404);
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

describe("PUT /tasks/{taskId}", () => {
  const defaultTask = {
    id: "0",
    title: "title",
    description: "desc",
    createdAt: new Date(),
    state: TaskState.PENDING,
  };
  const taskRepository = new InMemoryTaskRepository([defaultTask]);

  const { app, server } = setupApp(
    { taskRepositories: taskRepository },
    { port: 30004 }
  );

  beforeAll((done) => {
    done();
  });

  afterAll((done) => {
    server.close(done);
  });

  it("on asking for not found task  should return 404", async () => {
    const res = await request(app).put("/tasks/notFound").send({});
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("task with id=notFound was not found");
  });

  it("on sending invalid fields (title) should not update", async () => {
    const res = await request(app)
      .put(`/tasks/${defaultTask.id}`)
      .send({ title: { key: "invalid title" } });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual(
      "field title must be a string with less than 100 characters"
    );

    const res2 = await request(app)
      .put(`/tasks/${defaultTask.id}`)
      .send({ title: new Array(101).join("a") });
    expect(res2.status).toBe(400);
    expect(res2.body).toHaveProperty("message");
    expect(res2.body.message).toEqual(
      "field title must be a string with less than 100 characters"
    );
  });

  it("on sending invalid fields (description) should not update", async () => {
    const res = await request(app)
      .put(`/tasks/${defaultTask.id}`)
      .send({ description: { key: "invalid description" } });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual(
      "field description must be a string with less than 500 characters"
    );

    const res2 = await request(app)
      .put(`/tasks/${defaultTask.id}`)
      .send({ description: new Array(501).join("a") });
    expect(res2.status).toBe(400);
    expect(res2.body).toHaveProperty("message");
    expect(res2.body.message).toEqual(
      "field description must be a string with less than 500 characters"
    );
  });

  it("on sending invalid fields (state) should not update", async () => {
    const res = await request(app)
      .put(`/tasks/${defaultTask.id}`)
      .send({ state: { key: "invalid state" } });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual(
      `field state can be '${TaskState.PENDING}' or '${TaskState.COMPLETE}'`
    );

    const res2 = await request(app)
      .put(`/tasks/${defaultTask.id}`)
      .send({ state: "not valid state" });
    expect(res2.status).toBe(400);
    expect(res2.body).toHaveProperty("message");
    expect(res2.body.message).toEqual(
      `field state can be '${TaskState.PENDING}' or '${TaskState.COMPLETE}'`
    );
  });

  it("On editing no field, should return 200", async () => {
    const newTask = {
      title: "Test 1",
      description: "Test 1",
    };
    const response = await request(app).post("/tasks").send(newTask);
    expect(response.status).toBe(201);

    const task = response.body;

    const resNoEdits = await request(app).put(`/tasks/${task.id}`).send({});

    expect(resNoEdits.status).toBe(200);

    const resGet = await request(app).get(`/tasks/${response.body.id}`).send();
    expect(resGet.status).toBe(200);
    expect(resGet.body).toStrictEqual({
      ...task,
    });
  });

  it("on editing found task, should be edited", async () => {
    const newTask = {
      title: "Test 1",
      description: "Test 1",
    };
    const response = await request(app).post("/tasks").send(newTask);
    expect(response.status).toBe(201);

    const task = response.body;

    // Edit title ----------------------------------------------------------------------------------
    const resEditTitle = await request(app)
      .put(`/tasks/${task.id}`)
      .send({ title: "Title 2" });
    expect(resEditTitle.status).toBe(200);

    // Check that title has changed
    const resGet = await request(app).get(`/tasks/${response.body.id}`).send();
    expect(resGet.status).toBe(200);
    expect(resGet.body).toStrictEqual({ ...task, title: "Title 2" });

    // Edit description ----------------------------------------------------------------------------
    const resEditDescription = await request(app)
      .put(`/tasks/${task.id}`)
      .send({ description: "Desc 2" });

    expect(resEditDescription.status).toBe(200);

    const resGet2 = await request(app).get(`/tasks/${response.body.id}`).send();
    expect(resGet2.status).toBe(200);
    expect(resGet2.body).toStrictEqual({
      ...task,
      title: "Title 2",
      description: "Desc 2",
    });

    // Edit State ----------------------------------------------------------------------------------
    const resEditState = await request(app)
      .put(`/tasks/${task.id}`)
      .send({ state: TaskState.COMPLETE });

    expect(resEditState.status).toBe(200);

    const resGet3 = await request(app).get(`/tasks/${response.body.id}`).send();
    expect(resGet3.status).toBe(200);
    expect(resGet3.body).toStrictEqual({
      ...task,
      title: "Title 2",
      description: "Desc 2",
      state: TaskState.COMPLETE,
    });

    // Edit Multiple states-------------------------------------------------------------------------
    const resEditMultiple = await request(app).put(`/tasks/${task.id}`).send({
      state: TaskState.PENDING,
      title: "new title",
      description: "new desc",
    });

    expect(resEditMultiple.status).toBe(200);

    const resGet4 = await request(app).get(`/tasks/${response.body.id}`).send();
    expect(resGet4.status).toBe(200);
    expect(resGet4.body).toStrictEqual({
      ...task,
      title: "new title",
      description: "new desc",
      state: TaskState.PENDING,
    });

    // No edits on object --------------------------------------------------------------------------
  });
});

describe("DELETE /tasks/{taskId}", () => {
  const taskRepository = new InMemoryTaskRepository();
  const { app, server } = setupApp(
    { taskRepositories: taskRepository },
    { port: 30005 }
  );

  beforeAll((done) => {
    done();
  });

  afterAll((done) => {
    server.close(done);
  });

  it("on deleting not found task should return 404", async () => {
    const res = await request(app).put("/tasks/notFound").send({});
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("task with id=notFound was not found");
  });

  it("on delete task should be deleted", async () => {
    const res = await request(app)
      .post(`/tasks`)
      .send({ title: "Task to delete", description: "Task to delete" });

    const task = res.body;

    const res2 = await request(app).get(`/tasks`).send();
    expect(res2.status).toBe(200);
    expect(res2.body).toStrictEqual({ tasks: [task] });

    const res3 = await request(app).get(`/tasks/${task.id}`).send();
    expect(res3.status).toBe(200);
    expect(res3.body).toStrictEqual(task);

    const deleteRes = await request(app).delete(`/tasks/${task.id}`).send();
    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body).toHaveProperty("message");
    expect(deleteRes.body.message).toEqual(
      `task with id=${task.id} was deleted`
    );

    const res4 = await request(app).get(`/tasks`).send();
    expect(res4.status).toBe(200);
    expect(res4.body).toStrictEqual({ tasks: [] });

    const res5 = await request(app).get(`/tasks/${task.id}`).send();
    expect(res5.status).toBe(404);
    expect(res5.body).toStrictEqual({
      message: `task with id=${task.id} was not found`,
    });

    const deleteRes2 = await request(app).delete(`/tasks/${task.id}`).send();
    expect(deleteRes2.status).toBe(404);
    expect(deleteRes2.body).toHaveProperty("message");
    expect(deleteRes2.body.message).toEqual(
      `task with id=${task.id} was not found`
    );
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
      update: jest.fn(),
      delete: jest.fn(),
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
      update: jest.fn(),
      delete: jest.fn(),
    });

    const tasksGetAll = await taskService.getAllTasks();
    expect(mockGetAllTasks).toHaveBeenCalled();
    expect(tasksGetAll).toHaveLength(3);
  });

  it("Get task by id", async () => {
    const mockedTask = {
      title: "A",
      description: "B",
      createdAt: new Date(),
      id: "0",
      state: TaskState.PENDING,
    };
    const mockGetTaskById = jest.fn().mockImplementation((id) => {
      if (id !== "0") {
        return null;
      }
      return mockedTask;
    });

    const taskService = new TaskService({
      create: jest.fn(),
      getById: mockGetTaskById,
      getAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    });

    const taskGetById = await taskService.getTaskById("1");
    expect(mockGetTaskById).toHaveBeenCalled();
    expect(taskGetById).toBeNull();

    const taskGetById2 = await taskService.getTaskById("0");
    expect(mockGetTaskById).toHaveBeenCalled();
    expect;
    expect(taskGetById2).toStrictEqual(mockedTask);
  });
});
