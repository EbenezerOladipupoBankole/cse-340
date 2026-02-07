const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const errorController = require("../controllers/errorController")
const utilities = require("../utilities/")
const invManagementController = require("../controllers/management-controller")
const invValidation = require("../utilities/management-validation")

// Route to build inventory management view
router.get("/", utilities.checkAccountType, utilities.handleErrors(invManagementController.buildManagement))

// Route to build add classification view
router.get("/add-classification", utilities.checkAccountType, utilities.handleErrors(invManagementController.buildAddClassification))
// Route to handle add classification form submission
router.post("/add-classification",
    invValidation.classificationRules(),
    invValidation.checkClassificationData,
    utilities.checkAccountType,
    utilities.handleErrors(invManagementController.addClassification)
)

// Route to build add inventory view
router.get("/add-inventory", utilities.checkAccountType, utilities.handleErrors(invManagementController.buildAddInventory))
// Route to handle add inventory form submission
router.post("/add-inventory",
    invValidation.inventoryRules(),
    invValidation.checkInventoryData,
    utilities.checkAccountType,
    utilities.handleErrors(invManagementController.addInventory)
)

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to build inventory by inv_id
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId))

// Route for Task 3 Intentional Error
router.get("/test-error", utilities.handleErrors(errorController.triggerError))

module.exports = router
