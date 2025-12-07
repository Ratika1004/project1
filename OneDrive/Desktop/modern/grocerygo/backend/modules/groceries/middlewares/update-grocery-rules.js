
const { body } = require("express-validator");
const { Types } = require("mongoose");
const { getUserByID } = require("../../users/models/user-model");
const { getGroupByID } = require("../../groups/models/group-model");

const updateGroceryRules = [
  body("name").optional().isString().isLength({ min: 1 }).withMessage("Name must be at least 1 character long if provided"),
  body("quantity").optional().isInt({ gt: 0 }).withMessage("Quantity must be a positive integer if provided"),

  body("addedBy")
    .optional()
    .custom((value) => {
      if (!Types.ObjectId.isValid(value)) throw new Error("addedBy must be a valid user ID");
      return true;
    })
    .bail()
    .custom(async (value) => {
      const user = await getUserByID(value);
      if (!user) return Promise.reject(`User with ID ${value} does not exist`);
    }),

  body("groupId")
    .optional()
    .custom((value) => {
      if (!Types.ObjectId.isValid(value)) throw new Error("groupId must be a valid group ID");
      return true;
    })
    .bail()
    .custom(async (value) => {
      const group = await getGroupByID(value);
      if (!group) return Promise.reject(`Group with ID ${value} does not exist`);
    }),

  body("isBought").optional().isBoolean().withMessage("isBought must be true or false if provided"),
];

module.exports = updateGroceryRules;
