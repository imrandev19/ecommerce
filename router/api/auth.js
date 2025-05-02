const express = require ("express")
const { signupController, loginController, otpVerify, logoutController, changePassword, resendOtp, resetPassword } = require("../../controllers/authcontroller")
const authMiddleware = require("../../middleware/authMiddleware")
const userModel = require("../../model/userModel")
const router = express.Router()
// http://localhost:4000/api/auth/signup
router.post('/signup', signupController)
router.post('/otpverify', otpVerify)
// http://localhost:4000/api/auth/resendotp
router.patch("/resendotp", resendOtp)
//  
router.post('/login', loginController)
// http://localhost:4000/api/auth/authuser
router.get('/authuser', authMiddleware, async (req,res)=>{
    const userdata = await userModel.findOne({_id:req.session.user.id})
    res.send(userdata)
})
// http://localhost:4000/api/auth/logout
router.post('/logout',logoutController )
// http://localhost:4000/api/auth/changepassword
router.patch('/changepassword',changePassword )
// http://localhost:4000/api/auth/resetpassword
router.patch('/resetpassword', resetPassword )

module.exports = router