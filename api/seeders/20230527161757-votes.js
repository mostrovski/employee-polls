"use strict";

const votes = [
  {
    userId: 1,
    optionId: 1,
  },
  {
    userId: 3,
    optionId: 4,
  },
  {
    userId: 1,
    optionId: 4,
  },
  {
    userId: 1,
    optionId: 6,
  },
  {
    userId: 1,
    optionId: 8,
  },
  {
    userId: 2,
    optionId: 9,
  },
  {
    userId: 3,
    optionId: 10,
  },
  {
    userId: 3,
    optionId: 11,
  },
  {
    userId: 4,
    optionId: 11,
  },
  {
    userId: 2,
    optionId: 12,
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
    if ((await queryInterface.select(null, "votes")).length) {
      console.log(">> Table is not empty, skip seeding.");

      return;
    }

    await queryInterface.bulkInsert("votes", votes, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("votes", null, {});
  },
};
