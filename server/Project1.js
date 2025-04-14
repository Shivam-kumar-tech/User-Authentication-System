const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = 3000;

// In-memory user store
let users = [];

app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, "..", "public")));

app.use(
  session({
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: false,
  })
);

// Authentication middleware
function authMiddleware(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/Project1login.html");
  }
}

// Routes
app.post("/register", (req, res) => {
  const { email, password } = req.body;

  const existingUser = users.find((user) => user.email === email);
  if (existingUser) return res.send("User already exists!");

  const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
  users.push({ email, password: hashedPassword });

  res.redirect("/Project1login.html");
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);
  if (!user) return res.send("Invalid credentials");

  const inputHashed = crypto.createHash("sha256").update(password).digest("hex");
  if (inputHashed === user.password) {
    req.session.user = user;
    res.redirect("/Project1dashboard.html");
  } else {
    res.send("Invalid credentials");
  }
});

app.get("/Project1dashboard.html", authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "Project1dashboard.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
