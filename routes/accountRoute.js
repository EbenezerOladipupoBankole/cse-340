const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const accountValidation = require("../utilities/account-validation")

// Login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))
// Process Login
router.post("/login", utilities.handleErrors(accountController.accountLogin))

// Management View
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))

// Logout
router.get("/logout", utilities.handleErrors(accountController.logoutAccount))

// Update view
router.get("/update/:accountId", utilities.checkLogin, utilities.handleErrors(accountController.buildUpdateAccount))
// Process Account Update
router.post("/update",
    utilities.checkLogin,
    accountValidation.updateAccountRules(),
    accountValidation.checkUpdateData,
    utilities.handleErrors(accountController.updateAccount)
)
// Process Password Change
router.post("/change-password",
    utilities.checkLogin,
    accountValidation.changePasswordRules(),
    accountValidation.checkPasswordData,
    utilities.handleErrors(accountController.changePassword)
)

module.exports = router
