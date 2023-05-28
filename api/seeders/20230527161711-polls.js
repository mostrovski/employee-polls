"use strict";

const polls = [
  {
    key: "8xf0y6ziyjabvozdd253nd",
    authorId: 1,
    createdAt: new Date(1467166872634),
  },
  {
    key: "6ni6ok3ym7mf1p33lnez",
    authorId: 3,
    createdAt: new Date(1468479767190),
  },
  {
    key: "am8ehyc8byjqgar0jgpub9",
    authorId: 1,
    createdAt: new Date(1488579767190),
  },
  {
    key: "loxhs1bqm25b708cmbf3g",
    authorId: 2,
    createdAt: new Date(1482579767190),
  },
  {
    key: "vthrdm985a262al8qx3do",
    authorId: 2,
    createdAt: new Date(1489579767190),
  },
  {
    key: "xj352vofupe1dqz9emx13r",
    authorId: 3,
    createdAt: new Date(1493579767190),
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    if ((await queryInterface.select(null, "polls")).length) {
      console.log(">> Table is not empty, skip seeding.");

      return;
    }

    await queryInterface.bulkInsert("polls", polls, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("polls", null, {});
  },
};
