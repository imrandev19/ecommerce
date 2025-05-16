const express = require("express")
const addVariantController = require("../../controllers/variantController")
const upload = require("../../helpers/upload")
const authMiddleware = require("../../middleware/authMiddleware")
const adminMiddleware = require("../../middleware/adminMiddleware")
const router = express.Router()

// http://localhost:4000/api/variant/addvariant
router.post("/addvariant", upload.single("image"),authMiddleware, adminMiddleware,  addVariantController )
module.exports = router