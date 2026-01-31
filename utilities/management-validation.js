const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invSupport = require("./inventory-support")
const validate = {}

validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a classification name.")
      .matches(/^[a-zA-Z0-9]+$/)
      .withMessage("Classification name cannot contain spaces or special characters.")
  ]
}

validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors: errors.array(),
      title: "Add New Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

validate.inventoryRules = () => {
  return [
    body("classification_id").trim().isNumeric().withMessage("Please select a classification."),
    body("inv_make").trim().isLength({ min: 3 }).withMessage("Please provide a make."),
    body("inv_model").trim().isLength({ min: 3 }).withMessage("Please provide a model."),
    body("inv_year").trim().isNumeric().withMessage("Please provide a valid year."),
    body("inv_description").trim().isLength({ min: 1 }).withMessage("Please provide a description."),
    body("inv_image").trim().isLength({ min: 1 }).withMessage("Please provide an image path."),
    body("inv_thumbnail").trim().isLength({ min: 1 }).withMessage("Please provide a thumbnail path."),
    body("inv_price").trim().isNumeric().withMessage("Please provide a valid price."),
    body("inv_miles").trim().isNumeric().withMessage("Please provide valid miles."),
    body("inv_color").trim().isLength({ min: 1 }).withMessage("Please provide a color."),
  ]
}

validate.checkInventoryData = async (req, res, next) => {
  const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await invSupport.buildClassificationList(classification_id)
    res.render("inventory/add-inventory", {
      errors: errors.array(),
      title: "Add New Vehicle",
      nav,
      classificationList,
      classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
    })
    return
  }
  next()
}

module.exports = validate