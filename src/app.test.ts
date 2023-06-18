import request from "supertest";
import express, { Express } from "express";

const app: Express = express();

app.get("/test", (req, res) => {
  res.send("Hello, test route!");
});

describe("Test route", () => {
  it('should return "Hello, test route!"', async () => {
    const response = await request(app).get("/test");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Hello, test route!");
  });
});
