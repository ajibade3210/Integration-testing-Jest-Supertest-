const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const verifyToken = require("../middleware/auth");

router.get("/", async (req, res) => {
  const data = await db.query("SELECT * FROM students");
  return res.json(data.rows);
});

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);
    var sql = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;

    db.query(sql, [name, email, encryptedPassword], (err, result) => {
      user_id = result.insertId;

      // Create token
      const token = jwt.sign({ user_id }, process.env.SECRET, {
        expiresIn: "2h",
      });
      return res.status(201).send({
        id: result.insertId,
        status: true,
        message: "User Registered",
        token,
      });
    });
  } catch (err) {
    return res.status(400).send({
      status: false,
      message: "User Registration Failed",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }

    const sql = "SELECT * FROM Users WHERE email = ?";
    db.query(sql, [email], async (err, result) => {
      console.log("RESULT", result[0].password);
      if (result && (await bcrypt.compare(password, result[0].password))) {
        const token = jwt.sign(
          { user_id: result[0].id, user_name: result[0].name },
          process.env.SECRET,
          {
            expiresIn: "2h",
          }
        );
        return res.status(201).send({
          status: true,
          user: result[0],
          message: "User Login successful",
          token,
        });
      }
    });
  } catch (err) {
    console.log("ERROR:--", err.message);
    return res.status(400).send({
      status: false,
      message: "User Login Failed",
    });
  }
});

router.get("/dashboard", verifyToken, (req, res) => {
  try {
    res.status(200).send("Welcome 🙌 to the user dashboard");
  } catch (err) {
    res.send({ message: failed });
  }
});

router.get("/all", verifyToken, (req, res) => {
  try {
    const sql = "SELECT * FROM users";
    db.query(sql, (err, result) => {
    return res.status(201).send({
        status: true,
        result,
      });
    })
  } catch (err) {
    return res.status(401).send({
      status: false,
      message: "Login is required",
    });
  }
});

module.exports = router;
