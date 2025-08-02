const { default: mongoose } = require("mongoose");
const bannerOneModelSchema = new mongoose.Schema(
    {
        image:{
            type:String,
            required:true
        },
        href:{
            type:String,
            required:true
        }
    },
    {timestamps:true}
)
module.exports = mongoose.model("BannerOne", bannerOneModelSchema) 