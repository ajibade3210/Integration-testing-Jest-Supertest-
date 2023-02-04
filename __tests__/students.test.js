process.env.NODE_ENV = "test";
const db = require("../db");
const request = require("supertest");
const app = require("../app");

beforeAll(async () => {
  db.query(
    "CREATE TABLE students (id SERIAL PRIMARY KEY, name TEXT)",
    (err, data) => {
      if (err) {
        console.error("Error-1", err);
        return;
      }
    }
  );
});

beforeEach(async () => {
  // seed with some data
  db.query(
    "INSERT INTO students (name) VALUES ('Elie'), ('Matt')",
    (err, data) => {
      if (err) {
        console.error("Error-2", err);
        return;
      }
    }
  );
});

afterEach(async () => {
  db.query("DELETE FROM students", (err, data) => {
    if (err) {
      console.error("Error-3", err);
      return;
    }
  });
});

afterAll(async () => {
  db.query("DROP TABLE students", (err, rows) => {
    if (err) throw err;
    db.end();
  });
});

describe("GET / ", () => {
  test("It should respond with an array of students", async () => {
    const response = await request(app).get("/");
    expect(response.body).toEqual(["Elie", "Matt", "Joel", "Michael"]);
    expect(response.statusCode).toBe(200);
  });
});

describe("GET /students", () => {
  test("It responds with an array of students", async () => {
    const response = await request(app).get("/students");
    console.log(response.body);
    expect(response.body.length).toBe(2);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("name");
    expect(response.statusCode).toBe(200);
  });
});

describe("POST /students", () => {
  test("It responds with the newly created student", async () => {
    const newStudent = await request(app).post("/students").send({
      name: "New Student",
    });

    // make sure we add it correctly
    expect(newStudent.body).toHaveProperty("status", true);
    expect(newStudent.body.message).toBe("Students Record Saved");
    expect(newStudent.statusCode).toBe(201);

    // make sure we have 3 students now
    const response = await request(app).get("/students");
    expect(response.body.length).toBe(1);
  });
});

describe("PATCH /students/1", () => {
  test("It responds with an updated student", async () => {
    const newStudent = await request(app).post("/students").send({
      name: "Another one",
    });
    const updatedStudent = await request(app)
      .put(`/students/${newStudent.body.id}`)
      .send({ name: "updated" });
    expect(updatedStudent.statusCode).toBe(200);
    expect(updatedStudent.body.status).toBe(true);
    expect(updatedStudent.body).toHaveProperty(
      "message",
      "Students Record Updated"
    );

    // make sure we have 3 students
    const response = await request(app).get("/students");
    console.log("Dey Play-->", response.body);
    expect(response.body.length).toBe(3);
  });
});

describe("DELETE /students/1", () => {
  test("It responds with a message of Deleted", async () => {
    const newStudent = await request(app).post("/students").send({
      name: "Another one",
    });
    const removedStudent = await request(app).delete(
      `/students/${newStudent.body.id}`
    );
    expect(removedStudent.body).toEqual({
      status: true,
      message: `Student ${newStudent.body.id} Record Deleted`,
    });
    expect(removedStudent.statusCode).toBe(200);

    // make sure we still have 2 students
    const response = await request(app).get("/students");
    expect(response.body.length).toBe(2);
  });
});
