import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../db/db";
import CustomError from "../errors/CustomError";
import {
  signInValidation,
  signUpValidation,
} from "../middlewares/inputValidation";

const router = express.Router();

router.post("/signup", signUpValidation, async (req, res, next) => {
  const user = req.body;

  try {
    const existingUser = await User.findOne({ username: user.username });
    if (existingUser) throw new CustomError("User already exist", 403);
  } catch (err) {
    next(err);
  }

  const savedUser = new User(user);
  savedUser.save();

  res.send({ id: savedUser.id });
});

router.post("/signin", signInValidation, async (req, res, next) => {
  const user = req.body;
  let password;
  try {
    const existingUser = await User.findOne(user);
    if (!existingUser) throw new CustomError("Invalid credentials", 401);

    password = process.env.JWT_PASSWORD;
    if (!password) {
      throw new CustomError("Internal Server Error", 500);
    }
  } catch (err) {
    next(err);
  }

  const token = jwt.sign({ username: user.username }, password ?? "");

  res.send({ token });
});

export default router;
