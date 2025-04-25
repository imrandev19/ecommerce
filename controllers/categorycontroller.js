const categoryModel = require("../model/categoryModel");


const addcategorycontroller = async(req,res)=>{
    const { categoryName, description } = req.body; 

    try {
        let addCategory = new categoryModel({
            categoryName,description, image: `${process.env.SERVER_LINK}/${req.file.filename}`
        })
    
        await addCategory.save()
        res.status(200).json({success:true, message: "File Uploaded Successfully"})
    } catch (error) {
        res.status(500).json({success:false, message: error.message})
    }
    
    
}

module.exports = addcategorycontroller