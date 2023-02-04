const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {
  const sql = "SELECT * FROM students";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).send({ message: err.message });
    console.log(result);
    return res.status(200).json(result);
  });
});

router.post("/", (req, res) => {
  const { name } = req.body;
  var sql = `INSERT INTO students (name) VALUES ('${name}')`;

  db.query(sql, name, (err, result) => {
    if (err) return res.status(500).send({ message: err.message });
    return res.status(201).send({
      id: result.insertId,
      status: true,
      message: "Students Record Saved",
    });
  });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const sql = `UPDATE students SET name = '${name}' WHERE id = '${id}'`;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).send({ message: err.message });
    return res
      .status(200)
      .send({ status: true, message: "Students Record Updated" });
  });
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM students WHERE id=${id}`;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).send({ message: err.message });
    return res
      .status(200)
      .send({ status: true, message: `Student ${id} Record Deleted` });
  });
});

module.exports = router;
