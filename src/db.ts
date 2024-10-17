import assert from "assert";
import pg from "pg";
import { Users } from "./models/users.js";
const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;
assert(!!connectionString, "environment variable DATABASE_URL not set");

const pool = new Pool({ connectionString });

export const db = {
  Models: {
    Users: new Users(pool),
  },
};

export enum PostgresError {
  UNKNOWN_ERROR = "00000",
  NOT_NULL_VIOLATION = "23502",
  FOREIGN_KEY_VIOLATION = "23503",
  UNIQUE_VIOLATION = "23505",
}
