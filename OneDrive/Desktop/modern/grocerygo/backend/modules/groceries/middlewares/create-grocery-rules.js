const { body } = require("express-validator");
const { Types } = require("mongoose");
const GroupModel = require("../../groups/models/group-model");

const createGroceryRules = [
  body("name")
    .notEmpty()
    .isString()
    .isLength({ min: 1 })
    .withMessage("Name is required and must be at least 1 character long"),

  body("quantity")
    .notEmpty()
    .isInt({ gt: 0 })
    .withMessage("Quantity is required and must be a positive integer"),

  body("groupId")
    .notEmpty()
    .custom((value) => {
      if (!Types.ObjectId.isValid(value)) throw new Error("groupId must be a valid group ID");
      return true;
    })
    .bail()
    .custom(async (value) => {
      const group = await GroupModel.findById(value);
      if (!group) return Promise.reject(`Group with ID ${value} does not exist`);
    }),

  body("isBought")
    .optional()
    .isBoolean()
    .withMessage("isBought must be true or false if provided"),
];

module.exports = createGroceryRules;
