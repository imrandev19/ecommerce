const emailValidation = require("../helpers/emailvalidation");
const userModel = require("../model/userModel")
const bcrypt = require('bcrypt');
const signupController = async (req,res)=>{
    let {username, email, password} = req.body
    
    try {
        bcrypt.hash(password, 10, async function(err, hash) {
         if(err){
            return res.status(400).json({success:false, message: err.message || "something went wrong"})
         }
         else{
            if (!emailValidation(email)){
                return res.send("not a valid mail")
             }
             
             let user = new userModel({
                 username,
                 email,
                 password: hash
             });
             await user.save()
             return res.status(201).json({success:true, message: "Data send successfully to the server", user})
         }
        });
        
    } catch (error) {
        return res.status(404).json({success:false, message: error.message || "Something went wrong"})
    }
   
}

const loginController = (req,res)=>{
    res.send("Login Route")
}

module.exports = {signupController, loginController}