const validator = require("express-validator");
const { getGroupByID } = require("../../groups/models/group-model");

const createUserRules = [
  validator.body("name")
    .notEmpty()
    .isString()
    .isLength({ min: 1 })
    .withMessage("Name is required and must be at least 1 character long"),

  validator.body("email")
    .notEmpty()
    .isEmail()
    .withMessage("Email is required and must be valid"),

  validator.body("groupId")
    .notEmpty()
    .isInt({ gt: 0 })
    .withMessage("groupId is required and must be a valid positive integer")
    .bail()
    .custom(async (value) => {
      const group = await getGroupByID(value);
      if (!group) throw new Error(`Group with ID ${value} does not exist`);
    }),
];

function validateCreateUser(req, res, next) {
  const errors = validator.validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

module.exports = { createUserRules, validateCreateUser };
