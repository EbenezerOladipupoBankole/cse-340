/* ******************************************
 * EXPERIMENTAL SCRIPT
 * I created this script to programmatically update the database records.
 * The image paths were missing the '/vehicles' segment, causing 404 errors.
 * This script fixes those paths using SQL REPLACE.
 * **************************************** */
const pool = require("./database/")

const sql = `
    UPDATE public.inventory
    SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
        inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/')
    WHERE inv_image LIKE '/images/%'
    AND inv_image NOT LIKE '/images/vehicles/%'
    AND inv_image NOT LIKE '/images/upgrades/%'
`

pool.query(sql, (err, res) => {
    if (err) {
        console.error("Error updating paths:", err.message)
    } else {
        console.log("Success! Updated paths for", res.rowCount, "rows.")
    }
    process.exit()
})