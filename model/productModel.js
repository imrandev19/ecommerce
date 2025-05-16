const { default: mongoose } = require("mongoose");

const productModel = new mongoose.Schema({
    title:{
        type:String,
        required:[true, "Category must be required"],
        trim:true
    },
    slug:{
        type:String,
        required:true,
    },
    thumbnail:{
        type:String,
        required:[true, "Image must be required"],        
    },
    description:{
        type:String,        
    },
    price:{
        type:Number,
        required:true,
    },
    discountprice:{
        type: Number,
         min: 0,
         default: 0
    },
    discountPercentage:{
        type: Number,
         min: 0,
         max: 100, 
         default: 0
    },
    rating:{
        type: Number,
         min: 0, 
         max: 5, 
         default: 0
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    subcategory:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subcategory"
    },
    variant:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Variant"
    }]
},
{timestamps:true}
)

module.exports = mongoose.model("Product", productModel)