const pool = require("../database/")

async function getClassifications() {
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}

async function addInventory(data) {
  try {
    const sql = `INSERT INTO public.inventory (
      inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`
    return await pool.query(sql, [
      data.inv_make, data.inv_model, data.inv_year, data.inv_description, data.inv_image, data.inv_thumbnail, data.inv_price, data.inv_miles, data.inv_color, data.classification_id
    ])
  } catch (error) {
    return error.message
  }
}

module.exports = { getClassifications, addClassification, addInventory }