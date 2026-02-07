const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const accountModel = require("../models/account-model")

/*  **********************************
 *  Account Update Rules
 * ********************************* */
validate.updateAccountRules = () => {
    return [
        body("account_firstname")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a first name."),
        body("account_lastname")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a last name."),
        body("account_email")
            .trim()
            .isEmail()
            .normalizeEmail()
            .withMessage("A valid email is required.")
            .custom(async (account_email, { req }) => {
                const account_id = req.body.account_id
                const account = await accountModel.getAccountById(account_id)
                // Check if email exists and is NOT the current user's email
                if (account_email != account.account_email) {
                    const emailExists = await accountModel.getAccountByEmail(account_email)
                    if (emailExists) {
                        throw new Error("Email exists. Please use a different email")
                    }
                }
            })
    ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email, account_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/update", {
            errors: errors.array(),
            title: "Update Account",
            nav,
            account_firstname,
            account_lastname,
            account_email,
            account_id,
        })
        return
    }
    next()
}

/*  **********************************
 *  Change Password Rules
 * ********************************* */
validate.changePasswordRules = () => {
    return [
        // password is required and must be strong
        body("account_password")
            .trim()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),
    ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkPasswordData = async (req, res, next) => {
    const { account_id } = req.body // account_password is not passed back
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const accountData = await accountModel.getAccountById(account_id)
        res.render("account/update", {
            errors: errors.array(),
            title: "Update Account",
            nav,
            account_firstname: accountData.account_firstname, // Keep other form data populated 
            account_lastname: accountData.account_lastname,
            account_email: accountData.account_email,
            account_id,
        })
        return
    }
    next()
}

module.exports = validate
