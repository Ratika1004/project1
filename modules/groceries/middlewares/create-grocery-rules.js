const validator = require("express-validator");
const { getUserByID } = require("../../users/models/user-model");
const { getGroupByID } = require("../../groups/models/group-model");

const createGroceryRules = [
  validator.body("name")
    .notEmpty()
    .isString()
    .isLength({ min: 1 })
    .withMessage("Name is required and must be at least 1 character long"),

  validator.body("quantity")
    .notEmpty()
    .isInt({ gt: 0 })
    .withMessage("Quantity is required and must be a positive integer"),

  validator.body("addedBy")
    .notEmpty()
    .isInt({ gt: 0 })
    .withMessage("addedBy is required and must be a valid user ID")
    .bail()
    .custom(async (value) => {
      const user = await getUserByID(value);
      if (!user) return Promise.reject(`User with ID ${value} does not exist`);
    }),

  validator.body("groupId")
    .notEmpty()
    .isInt({ gt: 0 })
    .withMessage("groupId is required and must be a valid group ID")
    .bail()
    .custom(async (value) => {
      const group = await getGroupByID(value);
      if (!group) return Promise.reject(`Group with ID ${value} does not exist`);
    }),

  validator.body("isBought")
    .optional()
    .isBoolean()
    .withMessage("isBought must be true or false if provided"),
];

function validateCreateGrocery(req, res, next) {
  const errors = validator.validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
}

module.exports = { createGroceryRules, validateCreateGrocery };
