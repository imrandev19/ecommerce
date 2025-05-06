const express = require("express")
const {addcategorycontroller, allcategiresController, singleCategory, deleteCategory, updateCategory} = require("../../controllers/categorycontroller")
const router =express.Router()

const adminMiddleware = require("../../middleware/adminMiddleware");
const authMiddleware = require("../../middleware/authMiddleware");
const upload = require("../../helpers/upload");

// http://localhost:4000/api/category/addcategory
router.post('/addcategory',upload.single('image'),authMiddleware, adminMiddleware, addcategorycontroller)
// http://localhost:4000/api/category/allcategires
router.get("/allcategires", allcategiresController)
// http://localhost:4000/api/category/singlecategory/
router.get("/singlecategory/:slugname", singleCategory)
// http://localhost:4000/api/category/deletecategory/
router.delete("/deletecategory/:id", authMiddleware, adminMiddleware, deleteCategory )
// http://localhost:4000/api/category/updatecategory/
router.patch("/updatecategory/:id",upload.single('image'), authMiddleware, adminMiddleware, updateCategory)
module.exports = router