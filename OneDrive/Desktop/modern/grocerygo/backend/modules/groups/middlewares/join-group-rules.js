const { body } = require("express-validator");
const checkValidation = require("../../../shared/middlewares/check-validation");

const joinGroupRules = [
  body("code")
    .notEmpty()
    .withMessage("Group code is required"),

  checkValidation,
];

module.exports = joinGroupRules;
