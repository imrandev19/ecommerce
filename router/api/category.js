const express = require("express")
const addcategorycontroller = require("../../controllers/categorycontroller")
const router =express.Router()
router.post('/addCategory', addcategorycontroller)


module.exports = router