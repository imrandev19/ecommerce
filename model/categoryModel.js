const { default: mongoose } = require("mongoose");

const categoryModel = new mongoose.Schema({
    categoryName:{
        type:String,
        required:[true, "Category must be required"],
        minlengh:[3, "Minimum 3 Characters"],
        maxlengh:[40, "Maximum 40 Characters"],
        trim:true
    },
    image_link:{
        type:String,
        required:[true, "Category must be required"],
        trim:true
        
    },
    description:{
        type:String,        
    }
},
{timestamps:true}
)

module.exports = mongoose.model("Category", categoryModel)