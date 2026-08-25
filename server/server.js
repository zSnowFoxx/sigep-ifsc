const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const studentRoutes = require("./routes/students.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/students", studentRoutes);

app.listen(3001, () => console.log("API REST relacional rodando em http://localhost:3001"));