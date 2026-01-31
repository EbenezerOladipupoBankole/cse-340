const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory item detail view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
    const inv_id = req.params.invId
    const data = await invModel.getInventoryByInvId(inv_id)
    const grid = await utilities.buildInventoryDetailHtml(data)
    let nav = await utilities.getNav()
    res.render("./inventory/detail", {
        title: data ? data.inv_make + " " + data.inv_model : "Vehicle Not Found",
        nav,
        grid,
    })
}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data.length > 0 ? data[0].classification_name : "Unknown"
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}


/* ***************************
 *  Trigger Intentional Error (Task 3)
 * ************************** */
invCont.triggerError = async function (req, res, next) {
    // Intentional error
    throw new Error("This is an intentional 500 error for Task 3 testing.")
}

module.exports = invCont
