const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "mysql123",
    database: "eventverse_db"
});

db.connect((err) => {
    if (err) {
        console.log("Database connection failed:", err);
    } else {
        console.log("Connected to MySQL database");
    }
});

app.get("/", (req, res) => {
    res.send("EventVerse Backend Running 🚀");
});

app.post("/student-register", (req, res) => {
    const { full_name, usn, email, password } = req.body;

    const sql = "INSERT INTO students (full_name, usn, email, password) VALUES (?, ?, ?, ?)";

    db.query(sql, [full_name, usn, email, password], (err, result) => {
        if (err) {
            res.json({ success: false, message: "Registration failed" });
        } else {
            res.json({ success: true, message: "Student registered successfully" });
        }
    });
});

app.post("/event-register", (req, res) => {
    const { full_name, usn, email, phone, department, event_name } = req.body;

    const sql = "INSERT INTO event_registrations (full_name, usn, email, phone, department, event_name) VALUES (?, ?, ?, ?, ?, ?)";

    db.query(sql, [full_name, usn, email, phone, department, event_name], (err, result) => {
        if (err) {
            res.json({ success: false, message: "Event registration failed" });
        } else {
            res.json({ success: true, message: "Event registered successfully" });
        }
    });
});
app.post("/student-login", (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM students WHERE email = ? AND password = ?";

    db.query(sql, [email, password], (err, results) => {
        if (err) {
            res.json({ success: false, message: "Login failed" });
        } else {
            if (results.length > 0) {
                res.json({ success: true, message: "Login successful" });
            } else {
                res.json({ success: false, message: "Invalid email or password" });
            }
        }
    });
});
app.get("/students", (req, res) => {
    db.query(
        "SELECT id, full_name, usn, email FROM students",
        (err, result) => {
        if(err){
            res.json([]);
        } else {
            res.json(result);
        }
    });
});

app.get("/registrations", (req, res) => {
    db.query("SELECT * FROM event_registrations", (err, result) => {
        if(err){
            res.json([]);
        } else {
            res.json(result);
        }
    });
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});