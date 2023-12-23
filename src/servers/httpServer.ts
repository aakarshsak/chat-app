import express from "express";
import bodyParser from "body-parser";
import { connectDB, User } from "../db/db";
import userRoutes from "../routes/user";
import globalCatch from "../middlewares/globalCatch";
import { isNamedExportBindings } from "typescript";
import CustomError from "../errors/CustomError";

const app = express();

connectDB();

app.use(bodyParser.json());

// All universal routes
app.use("/users", userRoutes);

app.use("*", (req, res, next) => {
  const err = new CustomError("Route Not Found", 404);
  next(err);
});

app.use(globalCatch);

export default app;
