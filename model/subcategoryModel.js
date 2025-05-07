const { default: mongoose } = require("mongoose");

const subcategoryModel = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Subcategory name must be required"],
        unique:[true,"Subcategory has already exists"]
    },
    description:{
        type:String
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
    },
    slug:{
        type:String,
        required:true,
        unique:true
    },
},
{timestamps:true}
)

module.exports = mongoose.model("Subcategory", subcategoryModel)