const express = require("express");
const cors = require("cors");

const apiRoutes = require("./routes/api.routes");
const authRoutes = require("./routes/auth.routes");
const optionsRoutes = require("./routes/options.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const studentRoutes = require("./routes/students.routes");
const cadastrosRoutes = require("./routes/cadastros.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/sigaa", apiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/options", optionsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/students", studentRoutes);
app.use("/api", cadastrosRoutes);

app.listen(3001, () => console.log("Servidor rodando na porta 3001"));