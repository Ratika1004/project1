const validator = require("express-validator");

const loginUserRules = [
  validator.body("email")
    .notEmpty()
    .isEmail()
    .withMessage("Email is required and must be valid"),
];

function validateLoginUser(req, res, next) {
  const errors = validator.validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

module.exports = { loginUserRules, validateLoginUser };
