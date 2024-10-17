import express from "express";

const port = process.env.PORT ?? 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

import { usersRouter } from "./controllers/users.js";

app.use("/users", usersRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
