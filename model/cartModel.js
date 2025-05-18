const { default: mongoose } = require("mongoose");

const cartModel = new mongoose.Schema({
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
    },
     variant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Variant",
        
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    price:{
        type: Number
    },
    quantity:{
        type: Number,
        default:1
    }


},{timestamps:true}
)

module.exports = mongoose.model("Cart", cartModel)