const { default: mongoose } = require("mongoose");

const categoryModel = new mongoose.Schema({
    categoryName:{
        type:String,
        required:[true, "Category must be required"],
        minlengh:[1, "Minimum 1 Characters"],
        maxlengh:[40, "Maximum 40 Characters"],
        trim:true
    },
    slug:{
        type:String,
        required:true,
        unique:true
    },
    image:{
        type:String,
        required:[true, "Image must be required"],        
    },
    description:{
        type:String,        
    },
    subcategory:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subcategory"
    }],
    product:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product"
        }],
},
{timestamps:true}
)

module.exports = mongoose.model("Category", categoryModel)