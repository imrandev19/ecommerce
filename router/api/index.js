const express = require ("express")
const router = express.Router()
const authRouter = require ("./auth")
const category = require ("./category")
// http://localhost:4000/api/auth
router.use("/auth", authRouter)
// http://localhost:4000/api/category
router.use("/category", category)

module.exports = router