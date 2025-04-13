const userModel = require("../model/userModel")

const signupController = async (req,res)=>{
    let {username, email, password} = req.body
    try {
        let user = new userModel({
            username,
            email,
            password
        });
        await user.save()
        return res.status(201).json({success:true, message: "Data send successfully to the server", user})
    } catch (error) {
        return res.status(404).json({success:false, message: error.message || "Something went wrong"})
    }
   
}

const loginController = (req,res)=>{
    res.send("Login Route")
}

module.exports = {signupController, loginController}