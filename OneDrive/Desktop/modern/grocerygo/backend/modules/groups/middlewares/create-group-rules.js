const { body } = require("express-validator");
const checkValidation = require("../../../shared/middlewares/check-validation");

const createGroupRules = [
  body("name")
    .notEmpty()
    .isString()
    .isLength({ min: 3 })
    .withMessage("Group name is required and must be at least 3 characters long"),

  checkValidation,
];

module.exports = createGroupRules;
