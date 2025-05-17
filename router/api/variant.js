const express = require("express")
const {addVariantController, deleteVariantController, updateVariantController} = require("../../controllers/variantController")
const upload = require("../../helpers/upload")
const authMiddleware = require("../../middleware/authMiddleware")
const adminMiddleware = require("../../middleware/adminMiddleware")
const router = express.Router()

// http://localhost:4000/api/variant/addvariant
router.post("/addvariant", upload.single("image"),authMiddleware, adminMiddleware,  addVariantController )
// http://localhost:4000/api/variant/deletevariant
router.delete("/deletevariant/:id", authMiddleware, adminMiddleware,  deleteVariantController)
// http://localhost:4000/api/variant/updatevariant
router.patch("/updatevariant/:id", upload.single("image"), updateVariantController)
module.exports = router