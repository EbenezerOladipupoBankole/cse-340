const pool = require("../database/")

/* *****************************
*   Register a new message
* *************************** */
async function addMessage(message_first_name, message_last_name, message_email, message_subject, message_body) {
    try {
        const sql = "INSERT INTO message (message_first_name, message_last_name, message_email, message_subject, message_body) VALUES ($1, $2, $3, $4, $5) RETURNING *"
        return await pool.query(sql, [message_first_name, message_last_name, message_email, message_subject, message_body])
    } catch (error) {
        return error.message
    }
}

module.exports = { addMessage }