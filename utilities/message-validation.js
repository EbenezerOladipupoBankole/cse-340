const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  Contact Data Validation Rules
 * ********************************* */
validate.contactRules = () => {
    return [
        body("message_first_name")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a first name."),

        body("message_last_name")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a last name."),

        body("message_email")
            .trim()
            .isEmail()
            .normalizeEmail()
            .withMessage("A valid email is required."),

        body("message_subject")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a subject."),

        body("message_body")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide a message.")
    ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkMessageData = async (req, res, next) => {
    const { message_first_name, message_last_name, message_email, message_subject, message_body } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("message/index", {
            errors,
            title: "Contact Us",
            nav,
            message_first_name,
            message_last_name,
            message_email,
            message_subject,
            message_body,
        })
        return
    }
    next()
}

module.exports = validate