import assert from "assert";
import pg from "pg";
import { PostgresError } from "../db.js";

type UserModel = {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
};

enum Errors {
  DUPLICATE_EMAIL = PostgresError.UNIQUE_VIOLATION
}

class UsersTableError {
  code: string;
  constructor(error: pg.DatabaseError) {
    switch (error.code) {
      case PostgresError.UNIQUE_VIOLATION:
        this.code = Errors.DUPLICATE_EMAIL
        break;


      default:
        this.code = PostgresError.UNKNOWN_ERROR
        break;
    }
  }
}
export class Users {
  #pool: pg.Pool;

  constructor(pool: pg.Pool) {
    assert(!!pool, "pool is required");
    this.#pool = pool;
  }

  async insert(
    name: string,
    email: string,
    passwordHash: string,
  ): Promise<UserModel | null> {
    try {
      // Prepare password hash

      // Prepare the insert statement. We want to complete the user object
      // after the insert is done, so we use Postgres' RETURNING clause to
      // return those values automatically.
      const sql =
        "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, created_at";
      const params = [name, email, passwordHash];

      const query = await this.#pool.query(sql, params);

      // Build a user to return
      return {
        id: query.rows[0].id,
        name,
        email,
        passwordHash,
        createdAt: query.rows[0].created_at,
      };
    } catch (error) {
      // If anything goes wrong with the database query, we catch the error
      // here to log it out.
      console.error(error);
      if (error instanceof pg.DatabaseError) {
        throw error
      }
      return null;
    }
  }

  async getByEmail(email: string): Promise<UserModel | null> {
    try {
      const sql = "SELECT password_hash FROM users WHERE email = $1"
      const params = [email]
      const query = await this.#pool.query(sql, params)

      if (query.rows.length != 1) {
        // Report error
        return null
      }

      const data = query.rows[0]

      const user: UserModel = {
        id: data.id as number,
        name: data.name as string,
        email: data.email as string,
        passwordHash: data.password_hash.toString() as string,
        createdAt: data.created_at as Date,
      }

      return user
    } catch (error) {
      console.error(error)
      return null
    }
  }
}
