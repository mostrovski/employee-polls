import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import db from "./models/index.js";

// Read environment variables.
dotenv.config();

// Configure the server.
const app = express();
const port = 8080;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Define routes.
app.get("/", async (req, res) => {
  return res.json({
    message:
      "Connection has been established successfully. Hello from a container!",
  });
});

// Start.
app.listen(port, () =>
  console.log(`Express is listening! Visit http://localhost:${port}`)
);
