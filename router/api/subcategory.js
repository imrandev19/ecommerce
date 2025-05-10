const express = require("express")
const {addsubcategory, deletesubcategory, updatesubcategory} = require("../../controllers/subcategorycontroller")
const authMiddleware = require("../../middleware/authMiddleware")
const adminMiddleware = require("../../middleware/adminMiddleware")

const router = express.Router()
// http://localhost:4000/api/subcategory/addsubcategory
router.post("/addsubcategory", authMiddleware, adminMiddleware, addsubcategory)
// http://localhost:4000/api/subcategory/deletesubcategory
router.delete("/deletesubcategory/:id", authMiddleware, adminMiddleware, deletesubcategory)
router.patch("/updatesubcategory/:id", authMiddleware, adminMiddleware, updatesubcategory)
module.exports = router