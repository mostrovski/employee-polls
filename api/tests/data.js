const users = [
  {
    id: 1,
    username: "sarahedo",
    firstName: "Sarah",
    lastName: "Edo",
    avatar: "https://i.pravatar.cc/250?img=47",
    polls: [
      {
        id: 1,
        key: "8xf0y6ziyjabvozdd253nd",
      },
      {
        id: 3,
        key: "am8ehyc8byjqgar0jgpub9",
      },
    ],
    votes: [
      {
        optionId: 1,
        poll: {
          id: 1,
          key: "8xf0y6ziyjabvozdd253nd",
        },
      },
      {
        optionId: 4,
        poll: {
          id: 2,
          key: "6ni6ok3ym7mf1p33lnez",
        },
      },
      {
        optionId: 6,
        poll: {
          id: 3,
          key: "am8ehyc8byjqgar0jgpub9",
        },
      },
      {
        optionId: 8,
        poll: {
          id: 4,
          key: "loxhs1bqm25b708cmbf3g",
        },
      },
    ],
  },
  {
    id: 3,
    username: "mtsamis",
    firstName: "Mike",
    lastName: "Tsamis",
    avatar: "https://i.pravatar.cc/250?img=59",
    polls: [
      {
        id: 2,
        key: "6ni6ok3ym7mf1p33lnez",
      },
      {
        id: 6,
        key: "xj352vofupe1dqz9emx13r",
      },
    ],
    votes: [
      {
        optionId: 4,
        poll: {
          id: 2,
          key: "6ni6ok3ym7mf1p33lnez",
        },
      },
      {
        optionId: 10,
        poll: {
          id: 5,
          key: "vthrdm985a262al8qx3do",
        },
      },
      {
        optionId: 11,
        poll: {
          id: 6,
          key: "xj352vofupe1dqz9emx13r",
        },
      },
    ],
  },
  {
    id: 2,
    username: "tylermcginnis",
    firstName: "Tyler",
    lastName: "McGinnis",
    avatar: "https://i.pravatar.cc/250?img=67",
    polls: [
      {
        id: 4,
        key: "loxhs1bqm25b708cmbf3g",
      },
      {
        id: 5,
        key: "vthrdm985a262al8qx3do",
      },
    ],
    votes: [
      {
        optionId: 9,
        poll: {
          id: 5,
          key: "vthrdm985a262al8qx3do",
        },
      },
      {
        optionId: 12,
        poll: {
          id: 6,
          key: "xj352vofupe1dqz9emx13r",
        },
      },
    ],
  },
  {
    id: 4,
    username: "zoshikanlu",
    firstName: "Zenobia",
    lastName: "Oshikanlu",
    avatar: "https://i.pravatar.cc/250?img=49",
    polls: [],
    votes: [
      {
        optionId: 11,
        poll: {
          id: 6,
          key: "xj352vofupe1dqz9emx13r",
        },
      },
    ],
  },
];

const polls = [
  {
    id: 1,
    key: "8xf0y6ziyjabvozdd253nd",
    authorId: 1,
    createdAt: "2016-06-29T02:21:12.000Z",
    author: {
      id: 1,
      username: "sarahedo",
    },
    options: [
      {
        id: 1,
        text: "Build our new application with Javascript",
        voters: [
          {
            id: 1,
            username: "sarahedo",
          },
        ],
      },
      {
        id: 2,
        text: "Build our new application with Typescript",
        voters: [],
      },
    ],
  },
  {
    id: 2,
    key: "6ni6ok3ym7mf1p33lnez",
    authorId: 3,
    createdAt: "2016-07-14T07:02:47.000Z",
    author: {
      id: 3,
      username: "mtsamis",
    },
    options: [
      {
        id: 3,
        text: "hire more frontend developers",
        voters: [],
      },
      {
        id: 4,
        text: "hire more backend developers",
        voters: [
          {
            id: 3,
            username: "mtsamis",
          },
          {
            id: 1,
            username: "sarahedo",
          },
        ],
      },
    ],
  },
  {
    id: 3,
    key: "am8ehyc8byjqgar0jgpub9",
    authorId: 1,
    createdAt: "2017-03-03T22:22:47.000Z",
    author: {
      id: 1,
      username: "sarahedo",
    },
    options: [
      {
        id: 5,
        text: "conduct a release retrospective 1 week after a release",
        voters: [],
      },
      {
        id: 6,
        text: "conduct release retrospectives quarterly",
        voters: [
          {
            id: 1,
            username: "sarahedo",
          },
        ],
      },
    ],
  },
  {
    id: 4,
    key: "loxhs1bqm25b708cmbf3g",
    authorId: 2,
    createdAt: "2016-12-24T11:42:47.000Z",
    author: {
      id: 2,
      username: "tylermcginnis",
    },
    options: [
      {
        id: 7,
        text: "have code reviews conducted by peers",
        voters: [],
      },
      {
        id: 8,
        text: "have code reviews conducted by managers",
        voters: [
          {
            id: 1,
            username: "sarahedo",
          },
        ],
      },
    ],
  },
  {
    id: 5,
    key: "vthrdm985a262al8qx3do",
    authorId: 2,
    createdAt: "2017-03-15T12:09:27.000Z",
    author: {
      id: 2,
      username: "tylermcginnis",
    },
    options: [
      {
        id: 9,
        text: "take a course on ReactJS",
        voters: [
          {
            id: 2,
            username: "tylermcginnis",
          },
        ],
      },
      {
        id: 10,
        text: "take a course on unit testing with Jest",
        voters: [
          {
            id: 3,
            username: "mtsamis",
          },
        ],
      },
    ],
  },
  {
    id: 6,
    key: "xj352vofupe1dqz9emx13r",
    authorId: 3,
    createdAt: "2017-04-30T19:16:07.000Z",
    author: {
      id: 3,
      username: "mtsamis",
    },
    options: [
      {
        id: 11,
        text: "deploy to production once every two weeks",
        voters: [
          {
            id: 3,
            username: "mtsamis",
          },
          {
            id: 4,
            username: "zoshikanlu",
          },
        ],
      },
      {
        id: 12,
        text: "deploy to production once every month",
        voters: [
          {
            id: 2,
            username: "tylermcginnis",
          },
        ],
      },
    ],
  },
];

module.exports = { usersData: users, pollsData: polls };
