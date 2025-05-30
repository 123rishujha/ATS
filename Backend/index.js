const express = require("express");
require("dotenv").config();
const cors = require("cors");

//connection with mongodb database;
const { connection } = require("./config/db");
//routes
const { userRouter } = require("./routes/user.routes");
const { jobPostRouter } = require("./routes/jobpost.routes");
const { awsRouter } = require("./routes/aws.routes");
const { applicationRouter } = require("./routes/application.routes");
const { authMiddleware } = require("./middlewares/authMiddleware");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend URL (Vite's default port)
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "working" });
});

//routes
app.use("/api/user", userRouter);
app.use("/api/jobposts", jobPostRouter);
app.use("/api/applications", applicationRouter);

app.use("/api", awsRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "something went wrong";
  res.status(statusCode).json({
    status: statusCode,
    msg: message,
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
  console.log("server started at http://localhost:8080...");
  try {
    await connection;
    console.log("connected to database");
  } catch (err) {
    console.log(err);
    console.log("Not connected to database");
  }
});
