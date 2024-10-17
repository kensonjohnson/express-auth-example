import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "../db.js";
import bcrypt from "bcrypt";

const usersRouter = Router();

usersRouter.post("/", createUserHandler);

type CreateUserBodyParams = {
  name: string;
  email: string;
  password: string;
};

const emailRx =
  "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$";

async function createUserHandler(req: Request, res: Response) {
  console.log("Body: ", req.body);

  // Validate body parameters
  const {
    name,
    email,
    password: plaintextPassword,
  } = req.body as CreateUserBodyParams;
  const errors: string[] = [];

  if (!name) {
    errors.push("name is required");
  } else if (name.length > 500) {
    errors.push("name must be shorter than 500 charaters");
  }

  if (!email) {
    errors.push("email is required");
  } else if (!email.match(emailRx)) {
    errors.push("invalid email address");
  }

  if (!plaintextPassword) {
    errors.push("password is required");
  } else if (plaintextPassword.length < 8 || plaintextPassword.length > 500) {
    errors.push("password must be between 8 and 500 characters");
  }

  // If we have any errors, send all errors down and stop execution
  if (errors.length > 0) {
    res.status(422).json({ errors });
    return;
  }

  // Attempt to insert user into database
  try {
    const hash = await bcrypt.hash(plaintextPassword, 10);
    const user = await db.Models.Users.insert(name, email, hash);
    if (user === null) {
      throw new Error("something went wrong inserting user");
    }
    res
      .status(201)
      .json({ user: { id: user.id, name, email, created_at: user.createdAt } });
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      res.status(500).json({
        error: error.message,
      });
    }
  }
}

usersRouter.post("/login", verifyLoginCredentialsHandler);

type VerifyLoginCredentialsBodyParams = {
  email: string;
  password: string;
};

async function verifyLoginCredentialsHandler(req: Request, res: Response) {
  const { email, password: plaintextPassword } =
    req.body as VerifyLoginCredentialsBodyParams;

  // Validate body params
  const errors: string[] = [];

  if (!email) {
    errors.push("email is required");
  } else if (!email.match(emailRx)) {
    errors.push("invalid email address");
  }

  if (!plaintextPassword) {
    errors.push("password is required");
  } else if (plaintextPassword.length < 8 || plaintextPassword.length > 500) {
    errors.push("password must be between 8 and 500 characters");
  }

  // If we have any errors, send all errors down and stop execution
  if (errors.length > 0) {
    res.status(422).json({ errors });
    return;
  }

  try {
    const user = await db.Models.Users.getByEmail(email);
    if (user === null) {
      // TODO: improve error handling
      throw new Error("Something went wrong fetching user");
    }

    const valid = await bcrypt.compare(plaintextPassword, user.passwordHash);

    if (!valid) {
      res.status(401).json({ error: "invalid credentials" });
      return;
    }
    // TODO: create an auth token to pass down
    res.json({ message: "login successful" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        error:
          "an unexpected error occurred and the server could not complete your request",
      });
  }
}

export { usersRouter };
