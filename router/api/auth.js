const express = require ("express")
const { signupController, loginController, otpVerify, logoutController, changePassword } = require("../../controllers/authcontroller")
const authMiddleware = require("../../middleware/authMiddleware")
const userModel = require("../../model/userModel")
const router = express.Router()
// http://localhost:4000/api/auth/v1/signup
router.post('/signup', signupController)
router.post('/otpverify', otpVerify)
router.post('/login', loginController)
router.get('/authuser', authMiddleware, async (req,res)=>{
    const userdata = await userModel.findOne({_id:req.session.user.id})
    res.send(userdata)
    
})
router.post('/logout',logoutController )
router.patch('/changepassword',changePassword )

module.exports = router