const express = require("express")
const {addsubcategory, deletesubcategory, updatesubcategory, getSubCategory} = require("../../controllers/subcategorycontroller")
const authMiddleware = require("../../middleware/authMiddleware")
const adminMiddleware = require("../../middleware/adminMiddleware")

const router = express.Router()
// http://localhost:4000/api/subcategory/addsubcategory
router.post("/addsubcategory", authMiddleware, adminMiddleware, addsubcategory)
// http://localhost:4000/api/subcategory/deletesubcategory
router.delete("/deletesubcategory/:id", authMiddleware, adminMiddleware, deletesubcategory)
// http://localhost:4000/api/subcategory/updatesubcategory
router.patch("/updatesubcategory/:id", authMiddleware, adminMiddleware, updatesubcategory)
// http://localhost:4000/api/subcategory/getsubcategory
router.get("/getsubcategory/:id", getSubCategory)
module.exports = router