const express = require ("express")
const router = express.Router()
const authRouter = require ("./auth")
const category = require ("./category")
router.use("/auth", authRouter)
router.use("/category", category)

module.exports = router
// http://localhost:4000/api/v1/auth