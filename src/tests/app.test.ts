import request from "supertest";
import app, { server } from "..";

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
