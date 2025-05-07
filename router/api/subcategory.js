const express = require("express")
const addsubcategory = require("../../controllers/subcategorycontroller")
const authMiddleware = require("../../middleware/authMiddleware")
const adminMiddleware = require("../../middleware/adminMiddleware")
const router = express.Router()
// http://localhost:4000/api/subcategory/addsubcategory
router.post("/addsubcategory",authMiddleware, adminMiddleware, addsubcategory)
module.exports = router