const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const accountValidation = require("../utilities/account-validation")

// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process the registration data
router.post("/register",
    accountValidation.registrationRules(),
    accountValidation.checkRegData,
    utilities.handleErrors(accountController.accountRegister)
)

// Login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))
// Process Login
router.post("/login",
    accountValidation.loginRules(),
    accountValidation.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)

// Management View
router.get("/", utilities.checkJWTToken, utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))

// Logout
router.get("/logout", utilities.handleErrors(accountController.logoutAccount))

// Update view
router.get("/update/:accountId", utilities.checkJWTToken, utilities.checkLogin, utilities.handleErrors(accountController.buildUpdateAccount))
// Process Account Update
router.post("/update",
    utilities.checkJWTToken,
    utilities.checkLogin,
    accountValidation.updateAccountRules(),
    accountValidation.checkUpdateData,
    utilities.handleErrors(accountController.updateAccount)
)
// Process Password Change
router.post("/change-password",
    utilities.checkJWTToken,
    utilities.checkLogin,
    accountValidation.changePasswordRules(),
    accountValidation.checkPasswordData,
    utilities.handleErrors(accountController.changePassword)
)

module.exports = router
