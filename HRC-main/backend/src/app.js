const express = require("express");
const cors = require("cors");
const healthRoutes = require("./routes/health");
const userRoutes = require("./routes/users");
const trackRoutes = require("./routes/tracks");
const lessonRoutes = require("./routes/lessons");

const app = express();

// CORS_ORIGIN aceita uma ou mais origens separadas por vírgula (ex.: http://localhost:5173).
// Sem a variável, qualquer origem é aceita, o que serve para o ambiente local.
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
  : true;

app.use(cors({ origin: allowedOrigins }));

app.use(express.json());

app.use("/api/health", healthRoutes);

app.use("/api/users", userRoutes);

app.use("/api/tracks", trackRoutes);

app.use("/api/lessons", lessonRoutes);

module.exports = app;
