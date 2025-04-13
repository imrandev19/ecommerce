const express = require ("express")
const { signupController, loginController } = require("../../controllers/authcontroller")
const router = express.Router()
// http://localhost:4000/api/auth/v1/signup
router.post('/signup', signupController)
router.post('/login', loginController)

module.exports = router