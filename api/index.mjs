import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { db } from "./models/index.js";
import bcrypt from "bcrypt";
import cors from "cors";

// Read environment variables.
dotenv.config();

// Configure the server.
const app = express();
const port = 8080;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const generateUID = () =>
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15);

// Define routes.
app.post("/auth", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Bad Request" });
  }

  try {
    const user = await db.user.findOne({ where: { username } });
    if (
      user === null ||
      bcrypt.compareSync(password, user.password) === false
    ) {
      return res.status(404).json({ error: "Not found" });
    }

    // TODO: token logic
    return res.status(200).json({ user: username });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await db.user.findAll({
      attributes: { exclude: ["password", "createdAt", "updatedAt"] },
      include: [
        {
          model: db.poll,
          attributes: ["id", "key"],
        },
        {
          model: db.option,
          as: "votes",
          attributes: [["id", "optionId"]],
          through: {
            attributes: [],
          },
          include: {
            model: db.poll,
            attributes: ["id", "key"],
          },
        },
      ],
    });

    return res.status(200).json({
      data: users,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/polls", async (req, res) => {
  try {
    const polls = await db.poll.findAll({
      attributes: { exclude: ["updatedAt"] },
      include: [
        {
          model: db.user,
          as: "author",
          attributes: ["id", "username"],
        },
        {
          model: db.option,
          attributes: ["id", "text"],
          include: {
            model: db.user,
            as: "voters",
            attributes: ["id", "username"],
            through: {
              attributes: [],
            },
          },
        },
      ],
    });

    return res.status(200).json({
      data: polls,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/polls", async (req, res) => {
  const { username, optionOneText, optionTwoText } = req.body;

  if (!username || !optionOneText || !optionTwoText) {
    return res.status(400).json({ error: "Bad Request" });
  }

  try {
    const author = await db.user.findOne({ where: { username } });

    if (author === null) {
      return res.status(404).json({ error: "Author not found" });
    }

    const poll = await author.createPoll(
      {
        key: generateUID(),
        options: [
          {
            text: optionOneText,
          },
          {
            text: optionTwoText,
          },
        ],
      },
      {
        include: [db.poll.hasMany(db.option)],
      }
    );

    return res.status(201).json({ data: poll });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/options/:id/vote", async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Bad Request" });
  }

  try {
    const option = await db.option.findByPk(req.params.id);

    if (option === null) {
      return res.status(404).json({ error: "Poll option not found" });
    }

    const voter = await db.user.findOne({ where: { username } });

    if (voter === null) {
      return res.status(404).json({ error: "Voter not found" });
    }

    const alreadyVoted =
      (await voter.countVotes({ where: { pollId: option.pollId } })) > 0;

    if (alreadyVoted) {
      return res
        .status(422)
        .json({ error: "This vote has already been processed" });
    }

    await option.addVoter(voter);

    return res.status(204).json();
  } catch (error) {
    console.log(error);

    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start.
app.listen(port, () =>
  console.log(`Express is listening! Visit http://localhost:${port}`)
);
