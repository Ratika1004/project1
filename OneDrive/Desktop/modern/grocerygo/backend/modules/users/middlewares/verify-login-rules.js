const { body } = require("express-validator");
const checkValidation = require("../../../shared/middlewares/check-validation");

const verifyLoginRules = [
  body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Email must be valid").normalizeEmail(),
  body("otp")
    .notEmpty()
    .withMessage("OTP is required")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be 6 digits")
    .isNumeric()
    .withMessage("OTP must be numeric"),
  checkValidation,
];

module.exports = verifyLoginRules;
