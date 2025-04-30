const emailValidation = require("../helpers/emailvalidation");
const optVerification = require("../helpers/otpVerification");
const sendEmail = require("../helpers/sendEmail");
const userModel = require("../model/userModel")
const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');


const signupController = async (req,res)=>{
    let {username, email, password} = req.body
    
    try {
        const otp = optVerification()
        bcrypt.hash(password, 10, async function(err, hash) {
         if(err){
            return res.status(400).json({success:false, message: err.message || "something went wrong"})
         }
         else{
            if (!emailValidation(email)){
                return res.status(400).json({success:false, message: "Your email is not a valid email"})
             }
             
             let user = new userModel({
                 username,
                 email,
                 password: hash,
                 otp
             });
             await user.save()
             sendEmail(email, otp)
             setTimeout(async() => {
                 await userModel.findOneAndUpdate({email}, {otp:null}).then(()=>{
                     console.log("OTP Deleted")
                 })
                 user.save()
             }, 300000);
             return res.status(201).json({success:true, message: "Data send successfully to the server", user})
             
         }
        });
        
    } catch (error) {
        return res.status(404).json({success:false, message: error.message || "Something went wrong"})
    }
   
}
const otpVerify = async (req,res)=>{
    const {email,otp} = req.body
    try {
        
    const id = await userModel.findOne({email})
    if(id.otp == otp){
        id.isVerfied = true,
        id.otp = null,
        id.save()
        return res.status(200).json({success:true, message: "opt is verified"})
        
    }
    else{
        return res.status(400).json({success:false, message: "Otp is incorrect"}) 
    }
    } catch (error) {
        return res.status(500).json({success:false, message: error.message || "Something Went Wrong"})
    }
    
}

const loginController = async (req,res)=>{
    let {email, password} = req.body

    try {
        
        const existingUser = await userModel.findOne({email})
        
        if(!existingUser){
            return res.status(400).json({success:false, message: "Invalid Email"}) 
        }
        else{
            bcrypt.compare(password, existingUser.password, function(err, result){
                if(!err){
                    if(result){
                      
                    let userData = {
                        id: existingUser._id,
                        email: existingUser.email,
                        role: existingUser.role,
                        
                    }
                    req.session.user = userData
                    if(existingUser.role == "admin"){
                        req.session.cookie.maxAge = 5*60*1000
                    }
                    // const token = jwt.sign({userData}, process.env.JWTSECREET, {expiresIn:"1m"});
                    // res.cookie("ecommerce", token)
                    return res.status(200).json({ message: "Login Successful",data: userData })
                    }else{
                        return res.status(400).json({success:false, message:  "Wrong Password"})  
                    }
                }else{
                    return res.status(400).json({success:false, message:  err.message ||"bcrypt failed"})  
                }
            });
            
        }
        
    } catch (error) {
        return res.status(500).json({success:false, message: error.message || "Something Went Wrong"}) 
    }
    
}
const logoutController =async(req,res)=>{
    res.clearCookie("ecommerceSessionCookie")
    req.session.destroy(function(err) {
        
        if(err){
            return res.status(500).json({success:false, message: err.message})
        }
        else{
            return  res.status(200).json({success:true, message: "Logout successfully"})
        }
      })
}
const changePassword = async(req,res)=>{
 let {email, oldpassword, newpassword} = req.body

 try {
    
        let existingUser = await userModel.findOne({email})
        bcrypt.compare(oldpassword, existingUser.password, function(err, result) {
            if(err){
                return res.status(500).json({success:false, message: err.message })
            }else{
                if(!result){
                    return res.status(400).json({success:false, message: "Password Not Match" })
                }else{
                    bcrypt.hash(newpassword, 10, async function(err, hashnew) {
                        if(err){
                            return res.status(500).json({success:false, message: err.message }) 
                        }else{
                          await userModel.findOneAndUpdate({email},{password:hashnew}, {new:true})
                          return res.status(200).json({success:true, message: "Password Changed Successfully"})
                        }
                        
                    });
                }
            }
            
        });
    
 } catch (error) {
    return res.status(500).json({success:false, message: error.message || "Issue facing to password change function"})
 }
}
const resendOtp = async (req,res)=>{
    let {email} = req.body
    try {
        let existingUser = await userModel.find({email})
     if(!existingUser){
                return res.status(400).json({success:false, message:  "User Not Found" })
    }else{
        const otp = optVerification()
       let user= await userModel.findOneAndUpdate({email},{otp}, {new:true})
                sendEmail(email, otp)
                
                setTimeout(async() => {
                    await userModel.findOneAndUpdate({email}, {otp:null}).then(()=>{
                        console.log("OTP Deleted")
                    })
                    user.save()
                }, 300000);
                return res.status(200).json({success:true, message: "Otp Resend Successfully"})
            }

    
    } catch (error) {
        return res.status(500).json({success:false, message: error.message || "Failed to Resend OTP" })
    }
}
// First Go to resend otp route for new otp then resetpassword route
const resetPassword = async (req,res)=>{
    let {email, otp, newpassword} = req.body
    try {
        const existingUser = await userModel.find({email})
        if(!existingUser){
            return res.status(400).json({success:false, message:  "User Not Found" })
        }else{
            let user = await userModel.findOne({email})
                    
                    if(otp == user.otp){
                        bcrypt.hash(newpassword, 10, async function(err, hash) {
                            if(err){
                                return res.status(500).json({success:false, message: err.message || "Failed to Encript Password" })
                            }
                            else{
                                await userModel.findOneAndUpdate({email}, {password:hash})
                                return res.status(200).json({success:true, message: "Password Reset Successfully"})
                            }
                        });
                    }else{
                        return res.status(400).json({success:true, message: "Wrong OTP"})
                    }
                    
                     

        }
    } catch (error) {
        return res.status(500).json({success:false, message: error.message || "Failed to Reset Password" })
    }
}

module.exports = {signupController, loginController, otpVerify, logoutController, changePassword, resendOtp,resetPassword}