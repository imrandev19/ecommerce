const { default: slugify } = require("slugify");
const categoryModel = require("../model/categoryModel")
const subcategoryModel = require("../model/subcategoryModel")

const addsubcategory = async (req,res)=>{
    let {name, description, category} = req.body
    const slugSingle = name;
    try {
        const slug = slugify(slugSingle, {
              replacement: "-", // replace spaces with replacement character, defaults to `-`
              lower: true, // convert to lower case, defaults to `false`
            });
        let subcategory = new subcategoryModel({
            name, description, category, slug
        })
        await subcategory.save()
        const updateCategory = await categoryModel.findOneAndUpdate({_id:category}, {$push:{subcategory:subcategory._id}},{new:true})
        await updateCategory.save()
        return res.status(200).json({
            success:true,
            message: "Subcategory created Successfully",
            data:subcategory
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: error.message
        })
    }
}

module.exports = addsubcategory