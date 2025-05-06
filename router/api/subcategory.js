const express = require("express")
const addsubcategory = require("../../controllers/subcategorycontroller")
const router = express.Router()
// http://localhost:4000/api/subcategory/addsubcategory
router.post("/addsubcategory", addsubcategory)
module.exports = router