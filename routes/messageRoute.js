const express = require("express")
const router = new express.Router()
const messageController = require("../controllers/messageController")
const utilities = require("../utilities/")
const validate = require("../utilities/message-validation")

// Route to build contact view
router.get("/", utilities.handleErrors(messageController.buildContactView))

// Route to build thank you view
router.get("/thankyou", utilities.handleErrors(messageController.buildThankYou))

// Process the contact form
router.post(
    "/",
    validate.contactRules(),
    validate.checkMessageData,
    utilities.handleErrors(messageController.handleMessage)
)

module.exports = router