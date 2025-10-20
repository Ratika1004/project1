const validator = require("express-validator");
const { getUserByID } = require("../../users/models/user-model");
const { getGroupByID } = require("../../groups/models/group-model");

const updateGroceryRules = [
  validator.body("name")
    .optional()
    .isString()
    .isLength({ min: 1 })
    .withMessage("Name must be at least 1 character long if provided"),

  validator.body("quantity")
    .optional()
    .isInt({ gt: 0 })
    .withMessage("Quantity must be a positive integer if provided"),

  validator.body("addedBy")
    .optional()
    .isInt({ gt: 0 })
    .withMessage("addedBy must be a valid user ID if provided")
    .bail()
    .custom(async (value) => {
      const user = await getUserByID(value);
      if (!user) return Promise.reject(`User with ID ${value} does not exist`);
    }),

  validator.body("groupId")
    .optional()
    .isInt({ gt: 0 })
    .withMessage("groupId must be a valid group ID if provided")
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

function validateUpdateGrocery(req, res, next) {
  const errors = validator.validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
}

module.exports = { updateGroceryRules, validateUpdateGrocery };
