const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the HTML for the vehicle detail view
 * ************************ */
Util.buildInventoryDetailHtml = async function (data) {
    if (data) {
        return `
            <div id="inv-detail">
                <div class="inv-img">
                    <img src="${data.inv_image}" alt="Image of ${data.inv_year} ${data.inv_make} ${data.inv_model}">
                </div>
                <div class="inv-info">
                    <h2>${data.inv_year} ${data.inv_make} ${data.inv_model}</h2>
                    <p class="price"><strong>Price: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.inv_price)}</strong></p>
                    <p class="desc"><strong>Description:</strong> ${data.inv_description}</p>
                    <p class="color"><strong>Color:</strong> ${data.inv_color}</p>
                    <p class="miles"><strong>Miles:</strong> ${new Intl.NumberFormat('en-US').format(data.inv_miles)}</p>
                </div>
            </div>`;
    } else {
        return '<p class="notice">Sorry, no details could be found for this vehicle.</p>';
    }
}

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
    let grid
    if (data.length > 0) {
        grid = '<ul id="inv-display">'
        data.forEach((vehicle) => {
            grid += "<li>"
            grid +=
                '<a href="/inv/detail/' +
                vehicle.inv_id +
                '" title="View ' +
                vehicle.inv_make +
                " " +
                vehicle.inv_model +
                ' details"><img src="' +
                vehicle.inv_thumbnail +
                '" alt="Image of ' +
                vehicle.inv_make +
                " " +
                vehicle.inv_model +
                ' on CSE Motors" /></a>'
            grid += '<div class="namePrice">'
            grid += "<hr />"
            grid += "<h2>"
            grid +=
                '<a href="/inv/detail/' +
                vehicle.inv_id +
                '" title="View ' +
                vehicle.inv_make +
                " " +
                vehicle.inv_model +
                ' details">' +
                vehicle.inv_make +
                " " +
                vehicle.inv_model +
                "</a>"
            grid += "</h2>"
            grid +=
                "<span>$" +
                new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
                "</span>"
            grid += "</div>"
            grid += "</li>"
        })
        grid += "</ul>"
    } else {
        grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}


/* ************************
 * Constructs the nav HTML list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}


/* ************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 * ************************ */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
    if (req.cookies.jwt) {
        jwt.verify(
            req.cookies.jwt,
            process.env.ACCESS_TOKEN_SECRET,
            function (err, accountData) {
                if (err) {
                    req.flash("notice", "Please log in")
                    res.clearCookie("jwt")
                    return res.redirect("/account/login")
                }
                res.locals.accountData = accountData
                res.locals.loggedin = 1
                next()
            })
    } else {
        next()
    }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
    if (res.locals.loggedin) {
        next()
    } else {
        req.flash("notice", "Please log in.")
        return res.redirect("/account/login")
    }
}

/* ****************************************
 *  Check Account Type (Admin/Employee)
 * ************************************ */
Util.checkAccountType = (req, res, next) => {
    if (res.locals.loggedin) {
        const accountData = res.locals.accountData
        if (accountData.account_type === 'Employee' || accountData.account_type === 'Admin') {
            next()
        } else {
            req.flash("notice", "You do not have permission to access that resource.")
            return res.redirect("/account/login")
        }
    } else {
        req.flash("notice", "Please log in to access that resource.")
        return res.redirect("/account/login")
    }
}

module.exports = Util
