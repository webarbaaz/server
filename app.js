const dotenv = require("dotenv");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const connect = require("./config/db");

// import all the routes
const authMiddleware = require("./middleware/authMiddleware");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const createError = require("./utils/createError");
const errorHandler = require("./utils/errorHandler");

// configuration
dotenv.config();
const PORT = process.env.SERVER_PORT || 5000;
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// spin the server
app.get("/api", (req, res) => {
  res.send("API is running");
});

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", authMiddleware, userRoutes);

app.get("*", (req, res, next) => {
  next(createError(404, "route does not found"));
});

//error handling middleware
app.use(errorHandler);

// listen the server
app.listen(PORT, async () => {
  await connect();
  console.log(`server started on port ${PORT}`);
});
