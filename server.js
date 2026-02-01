/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
require("dotenv").config()
const app = express()
const static = require("./routes/static")
const utilities = require("./utilities/")
const session = require("express-session")
const pool = require('./database/')
const flash = require('connect-flash')
const pgSession = require('connect-pg-simple')(session)
const expressMessages = require('express-messages')

/* ***********************
 * View Engine Setup
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new pgSession({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Express Messages Middleware
app.use(flash())
app.use(function(req, res, next){
  res.locals.messages = expressMessages(req, res)
  next()
})

app.use(express.urlencoded({ extended: true }))

/* ***********************
 * Routes
 *************************/
app.use(static)

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT || 5500
const host = process.env.HOST || 'localhost'

// Index static.route
app.get("/", utilities.handleErrors(async (req, res) => {
  const nav = await utilities.getNav()
  res.render("index", { title: "Home", nav })
}))

// Inventory routes
app.use("/inv", require("./routes/inventoryRoute"))

// File Not Found Route - must be last route but before error handler
app.use(async (req, res, next) => {
  next({ status: 404, message: 'Sorry, we appear to have lost that page.' })
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav
  try {
    nav = await utilities.getNav()
  } catch (navError) {
    console.error("Error generating navigation:", navError.message)
    nav = '<ul><li><a href="/" title="Home page">Home</a></li></ul>'
  }
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  let message
  if (err.status == 404) {
    message = err.message
  } else {
    message = err.message || 'Oh no! There was a crash. Maybe try a different route?'
  }
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

/* ***********************
 * Log statement to confirm server operation
 * *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
//
