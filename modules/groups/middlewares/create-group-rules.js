const validator = require("express-validator");

const createGroupRules = [
  validator.body("name")
    .notEmpty()
    .isString()
    .isLength({ min: 3 })
    .withMessage("Name is required and must be at least 3 characters long"),
];

function validateCreateGroup(req, res, next) {
  const errors = validator.validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

module.exports = { createGroupRules, validateCreateGroup };
