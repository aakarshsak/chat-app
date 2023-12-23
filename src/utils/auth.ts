import jwt from "jsonwebtoken";
import { User } from "../db/db";
import CustomError from "../errors/CustomError";

type JwtPayload = {
  username: string;
};

export const authenticateUsingToken = async (
  token: string
): Promise<string> => {
  try {
    const password = process.env.JWT_PASSWORD;
    if (!password) {
      console.log("Invaid cred..");
      throw new CustomError("Invalid cred...", 401);
    }

    const { username } = jwt.verify(token, password) as JwtPayload;
    if (!username) {
      console.log("invalid cred..");
      throw new CustomError("Invalid cred...", 401);
    }

    const existingUser = await User.findOne({ username });
    if (!existingUser || !existingUser.username) {
      console.log("Invalid cred..");
      throw new CustomError("Invalid cred...", 401);
    }
    return Promise.resolve(existingUser.username);
  } catch (err) {
    throw err;
  }
};
