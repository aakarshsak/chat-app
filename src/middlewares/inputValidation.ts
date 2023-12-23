import { NextFunction, Request, Response } from "express";
import zod from "zod";
import CustomError from "../errors/CustomError";

const signUp = zod.object({
  username: zod.string(),
  name: zod.string(),
  password: zod.string(),
});

const signIn = zod.object({
  username: zod.string(),
  password: zod.string(),
});

export const signUpValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validated = signUp.safeParse(req.body);
    if (!validated || !validated.success) {
      throw new CustomError("Invalid input", 400);
    }
  } catch (err) {
    next(err);
  }
  next();
};

export const signInValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validated = signIn.safeParse(req.body);
    if (!validated || !validated.success) {
      throw new CustomError("Invalid input", 400);
    }
  } catch (err) {
    next(err);
  }
  next();
};
