const fetch = require("cross-fetch");
const { usersData, pollsData } = require("./data.js");
const { db } = require("../models/index.js");

const baseUrl = "http://localhost:8080";

const headers = {
  Accept: "application/json",
};

afterAll(() => {
  db.sequelize.close();
});

describe("Authentication", () => {
  const authenticate = async (credentials) =>
    fetch(`${baseUrl}/auth`, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

  it("accepts correct credentials", async () => {
    const credentials = {
      username: "tylermcginnis",
      password: "abc321",
    };

    const response = await authenticate(credentials);

    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);
    expect(response.json()).resolves.toStrictEqual({ user: "tylermcginnis" });
  });

  it("rejects wrong credentials", async () => {
    const credentials = {
      username: "tylermcginnis",
      password: "test",
    };

    const response = await authenticate(credentials);

    expect(response.ok).toBe(false);
    expect(response.status).toBe(404);
    expect(response.json()).resolves.toStrictEqual({
      error: "Not found",
    });
  });

  it("handles bad requests", async () => {
    let response = await authenticate({});

    expect(response.ok).toBe(false);
    expect(response.status).toBe(400);
    expect(response.json()).resolves.toStrictEqual({
      error: "Bad Request",
    });

    const credentials = {
      username: "tylermcginnis",
      password: "",
    };

    response = await authenticate(credentials);

    expect(response.ok).toBe(false);
    expect(response.status).toBe(400);
    expect(response.json()).resolves.toStrictEqual({
      error: "Bad Request",
    });

    credentials.password = "abc321";
    credentials.username = "";

    response = await authenticate(credentials);

    expect(response.ok).toBe(false);
    expect(response.status).toBe(400);
    expect(response.json()).resolves.toStrictEqual({
      error: "Bad Request",
    });
  });
});

describe("Users", () => {
  it("delivers the list of users", async () => {
    const response = await fetch(`${baseUrl}/users`, { headers });

    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);

    const users = await response.json();
    expect(users.data).toBeInstanceOf(Array);

    usersData.forEach((user) => {
      expect(users.data).toContainEqual(user);
    });
  });
});

describe("Polls", () => {
  const createPoll = async (payload) =>
    fetch(`${baseUrl}/polls`, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

  it("delivers the list of polls", async () => {
    const response = await fetch(`${baseUrl}/polls`, { headers });

    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);

    const polls = await response.json();
    expect(polls.data).toBeInstanceOf(Array);

    pollsData.forEach((poll) => {
      expect(polls.data).toContainEqual(poll);
    });
  });

  it("creates a new poll", async () => {
    const pollsCount = await db.poll.count();
    const optionsCount = await db.option.count();

    expect(optionsCount / pollsCount).toBe(2);

    const newPoll = {
      username: "sarahedo",
      optionOneText: "take a walk",
      optionTwoText: "take a sleep",
    };

    const response = await createPoll(newPoll);

    expect(response.ok).toBe(true);
    expect(response.status).toBe(201);

    const newPollResponse = await response.json();

    expect(newPollResponse.data.options).toBeInstanceOf(Array);
    expect(newPollResponse.data.options.length).toBe(2);
    expect(newPollResponse.data.options[0].text).toEqual(newPoll.optionOneText);
    expect(newPollResponse.data.options[1].text).toEqual(newPoll.optionTwoText);

    expect(db.poll.count()).resolves.toBe(pollsCount + 1);
    expect(db.option.count()).resolves.toBe(optionsCount + 2);

    const newPollRecord = await db.poll.findByPk(newPollResponse.data.id, {
      include: [
        {
          model: db.user,
          as: "author",
          attributes: ["id", "username"],
        },
        {
          model: db.option,
          attributes: ["id", "text"],
        },
      ],
    });

    expect(newPollRecord.key).toEqual(newPollResponse.data.key);
    expect(newPollRecord.options[0].id).toEqual(
      newPollResponse.data.options[0].id
    );
    expect(newPollRecord.options[1].id).toEqual(
      newPollResponse.data.options[1].id
    );
    expect(newPollRecord.options[0].text).toEqual(newPoll.optionOneText);
    expect(newPollRecord.options[1].text).toEqual(newPoll.optionTwoText);
    expect(newPollRecord.author.username).toEqual(newPoll.username);
  });

  it("handles cases with unknown authors", async () => {
    const pollsCount = await db.poll.count();
    const optionsCount = await db.option.count();

    let response = await createPoll({
      username: "someone::unknown",
      optionOneText: "take a walk",
      optionTwoText: "take a sleep",
    });

    expect(response.ok).toBe(false);
    expect(response.status).toBe(404);
    expect(response.json()).resolves.toStrictEqual({
      error: "Author not found",
    });
    expect(db.poll.count()).resolves.toBe(pollsCount);
    expect(db.option.count()).resolves.toBe(optionsCount);
  });

  it("handles cases with identical options", async () => {
    const pollsCount = await db.poll.count();
    const optionsCount = await db.option.count();

    let response = await createPoll({
      username: "sarahedo",
      optionOneText: "take a walk",
      optionTwoText: "take a walk",
    });

    expect(response.ok).toBe(false);
    expect(response.status).toBe(422);
    expect(response.json()).resolves.toStrictEqual({
      error: "Options cannot be identical",
    });
    expect(db.poll.count()).resolves.toBe(pollsCount);
    expect(db.option.count()).resolves.toBe(optionsCount);
  });

  it("handles bad requests", async () => {
    const pollsCount = await db.poll.count();
    const optionsCount = await db.option.count();

    let response = await createPoll({
      username: "",
      optionOneText: "take a walk",
      optionTwoText: "take a sleep",
    });

    expect(response.ok).toBe(false);
    expect(response.status).toBe(400);
    expect(response.json()).resolves.toStrictEqual({ error: "Bad Request" });
    expect(db.poll.count()).resolves.toBe(pollsCount);
    expect(db.option.count()).resolves.toBe(optionsCount);

    response = await createPoll({
      username: "sarahedo",
      optionOneText: "",
      optionTwoText: "take a sleep",
    });

    expect(response.ok).toBe(false);
    expect(response.status).toBe(400);
    expect(response.json()).resolves.toStrictEqual({ error: "Bad Request" });
    expect(db.poll.count()).resolves.toBe(pollsCount);
    expect(db.option.count()).resolves.toBe(optionsCount);

    response = await createPoll({
      username: "sarahedo",
      optionOneText: "take a walk",
      optionTwoText: "",
    });

    expect(response.ok).toBe(false);
    expect(response.status).toBe(400);
    expect(response.json()).resolves.toStrictEqual({ error: "Bad Request" });
    expect(db.poll.count()).resolves.toBe(pollsCount);
    expect(db.option.count()).resolves.toBe(optionsCount);
  });
});

describe("Voting", () => {
  const sendVote = async (user, option) =>
    fetch(`${baseUrl}/options/${option}/vote`, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: user }),
    });

  it("persists the vote", async () => {
    const user = await db.user.findOne({
      where: { username: "zoshikanlu" },
    });
    const option = await db.option.findByPk(1);

    let votes = (await user.getVotes()).map((option) => option.id);
    let voters = (await option.getVoters()).map((voter) => voter.id);

    expect(votes).not.toContain(option.id);
    expect(voters).not.toContain(user.id);

    const response = await sendVote(user.username, option.id);

    expect(response.ok).toBe(true);
    expect(response.status).toBe(204);

    votes = (await user.getVotes()).map((option) => option.id);
    voters = (await option.getVoters()).map((voter) => voter.id);

    expect(votes).toContain(option.id);
    expect(voters).toContain(user.id);
  });

  it("rejects multiple votes for the same question", async () => {
    let response = await sendVote("sarahedo", 1);

    expect(response.ok).toBe(false);
    expect(response.status).toBe(422);
    expect(response.json()).resolves.toStrictEqual({
      error: "This vote has already been processed",
    });

    response = await sendVote("sarahedo", 2);

    expect(response.ok).toBe(false);
    expect(response.status).toBe(422);
    expect(response.json()).resolves.toStrictEqual({
      error: "This vote has already been processed",
    });
  });

  it("handles cases with unknown options", async () => {
    const response = await sendVote("mtsamis", 0);

    expect(response.ok).toBe(false);
    expect(response.status).toBe(404);
    expect(response.json()).resolves.toStrictEqual({
      error: "Poll option not found",
    });
  });

  it("handles cases with unknown voters", async () => {
    const response = await sendVote("someone::unknown", 1);

    expect(response.ok).toBe(false);
    expect(response.status).toBe(404);
    expect(response.json()).resolves.toStrictEqual({
      error: "Voter not found",
    });
  });

  it("handles bad requests", async () => {
    const response = await sendVote(null, 1);

    expect(response.ok).toBe(false);
    expect(response.status).toBe(400);
    expect(response.json()).resolves.toStrictEqual({ error: "Bad Request" });
  });
});
