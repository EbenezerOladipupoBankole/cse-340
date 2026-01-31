const errorController = {}

/* ****************************************
 *  Trigger an error
 * *************************************** */
errorController.triggerError = async function (req, res, next) {
  throw new Error("Intentional 500 Error")
}

module.exports = errorController