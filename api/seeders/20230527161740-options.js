"use strict";

const options = [
  {
    text: "Build our new application with Javascript",
    pollId: 1,
  },
  {
    text: "Build our new application with Typescript",
    pollId: 1,
  },
  {
    text: "hire more frontend developers",
    pollId: 2,
  },
  {
    text: "hire more backend developers",
    pollId: 2,
  },
  {
    text: "conduct a release retrospective 1 week after a release",
    pollId: 3,
  },
  {
    text: "conduct release retrospectives quarterly",
    pollId: 3,
  },
  {
    text: "have code reviews conducted by peers",
    pollId: 4,
  },
  {
    text: "have code reviews conducted by managers",
    pollId: 4,
  },
  {
    text: "take a course on ReactJS",
    pollId: 5,
  },
  {
    text: "take a course on unit testing with Jest",
    pollId: 5,
  },
  {
    text: "deploy to production once every two weeks",
    pollId: 6,
  },
  {
    text: "deploy to production once every month",
    pollId: 6,
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
    if ((await queryInterface.select(null, "options")).length) {
      console.log(">> Table is not empty, skip seeding.");

      return;
    }

    await queryInterface.bulkInsert("options", options, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("options", null, {});
  },
};
