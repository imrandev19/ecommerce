const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: [true, "Username must be required"],
        unique:true,
        trim:true,
        minlength:[3, "username must be minimum 3 characters"],
        maxlength:[20, "username must be maximum 20 characters"]
    },
    email:{
        type: String,
        required: [true, "Email must be required"],
        unique:true,
        trim:true
    },
    password:{
        type: String,
        required: [true, "Password must be required"],
        minlength:[5, "password must be minimum 5 characters"],
        // maxlength:[50, "password must be maximum 50 characters"]
    },
    phone:{
        type: String,
        minlength:[10, "phone must be minimum 10 characters"],
        maxlength:[12, "phone must be maximum 12 characters"]
    },
    address:{
        type: String
    },
    city:{
        type:String
    },
    country:{
        type:String
    },
    role:{
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    isVerfied:{
        type:Boolean,
        default:false
    },
    otp:{
        type:String
    }
},
{
    timestamps:true
} 
)

module.exports = mongoose.model("User", userSchema)