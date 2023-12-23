import { Errback, NextFunction, Request, Response } from "express";
import CustomError from "../errors/CustomError";

export default (
  err: CustomError | Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = "statusCode" in err ? err.statusCode : 500;
  res
    .status(statusCode)
    .send({ type: "error", status: statusCode, message: err.message });
};
