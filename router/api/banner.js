const express = require('express')
const { addBannerOneController, getBannerOneController } = require('../../controllers/bannerController')
const upload = require('../../helpers/upload')
const router = express.Router() 
// http://localhost:4000/api/banner/addbannerone
router.post("/addbannerone", upload.single("image"), addBannerOneController)
// http://localhost:4000/api/banner/getbannerone
router.get("/getbannerone", getBannerOneController)
module.exports = router