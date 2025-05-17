const express = require("express")
const {addVariantController, deleteVariantController} = require("../../controllers/variantController")
const upload = require("../../helpers/upload")
const authMiddleware = require("../../middleware/authMiddleware")
const adminMiddleware = require("../../middleware/adminMiddleware")
const router = express.Router()

// http://localhost:4000/api/variant/addvariant
router.post("/addvariant", upload.single("image"),authMiddleware, adminMiddleware,  addVariantController )
// http://localhost:4000/api/variant/deletevariant
router.delete("/deletevariant/:id", authMiddleware, adminMiddleware,  deleteVariantController)
module.exports = router