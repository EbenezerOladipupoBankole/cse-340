const messageModel = require("../models/message-model")
const utilities = require("../utilities/")

const messageController = {}

/* ****************************************
*  Deliver Contact View
* *************************************** */
messageController.buildContactView = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("message/index", {
        title: "Contact Us",
        nav,
        errors: null,
        message_first_name: "",
        message_last_name: "",
        message_email: "",
        message_subject: "",
        message_body: "",
    })
}

/* ****************************************
*  Deliver Thank You View
* *************************************** */
messageController.buildThankYou = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("message/thankyou", {
        title: "Thank You",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Process Message
* *************************************** */
messageController.handleMessage = async function (req, res) {
    const { message_first_name, message_last_name, message_email, message_subject, message_body } = req.body

    const regResult = await messageModel.addMessage(
        message_first_name,
        message_last_name,
        message_email,
        message_subject,
        message_body
    )

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, ${message_first_name}. We received your message.`
        )
        res.redirect("/message/thankyou")
    } else {
        let nav = await utilities.getNav()
        req.flash("notice", "Sorry, the message processing failed.")
        res.status(501).render("message/index", {
            title: "Contact Us",
            nav,
            errors: null,
            message_first_name,
            message_last_name,
            message_email,
            message_subject,
            message_body,
        })
    }
}

module.exports = messageController