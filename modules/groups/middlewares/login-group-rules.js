const validator = require("express-validator");

const loginGroupRules = [
  validator.body("name")
    .notEmpty()
    .isString()
    .withMessage("Name is required and must be a string"),
];

function validateLoginGroup(req, res, next) {
  const errors = validator.validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

module.exports = { loginGroupRules, validateLoginGroup };
