"use strict";

const bcrypt = require("bcrypt");
const saltRounds = 10;

const users = [
  {
    username: "sarahedo",
    password: bcrypt.hashSync("password123", saltRounds),
    firstName: "Sarah",
    lastName: "Edo",
    avatar: "https://i.pravatar.cc/250?img=47",
  },
  {
    username: "tylermcginnis",
    password: bcrypt.hashSync("abc321", saltRounds),
    firstName: "Tyler",
    lastName: "McGinnis",
    avatar: "https://i.pravatar.cc/250?img=67",
  },
  {
    username: "mtsamis",
    password: bcrypt.hashSync("xyz123", saltRounds),
    firstName: "Mike",
    lastName: "Tsamis",
    avatar: "https://i.pravatar.cc/250?img=59",
  },
  {
    username: "zoshikanlu",
    password: bcrypt.hashSync("pass246", saltRounds),
    firstName: "Zenobia",
    lastName: "Oshikanlu",
    avatar: "https://i.pravatar.cc/250?img=49",
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
    if ((await queryInterface.select(null, "users")).length) {
      console.log(">> Table is not empty, skip seeding.");

      return;
    }

    await queryInterface.bulkInsert("users", users, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("users", null, {});
  },
};
