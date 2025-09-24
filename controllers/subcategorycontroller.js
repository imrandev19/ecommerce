const { default: slugify } = require("slugify");
const categoryModel = require("../model/categoryModel");
const subcategoryModel = require("../model/subcategoryModel");
const productModel = require("../model/productModel");

const addsubcategory = async (req, res) => {
  let { name, description, category } = req.body;
  const slugSingle = name;
  try {
    const slug = slugify(slugSingle, {
      replacement: "-", // replace spaces with replacement character, defaults to `-`
      lower: true, // convert to lower case, defaults to `false`
    });
    let subcategory = new subcategoryModel({
      name,
      description,
      category,
      slug,
    });
    await subcategory.save();
    const updateCategory = await categoryModel.findOneAndUpdate(
      { _id: category },
      { $push: { subcategory: subcategory._id } },
      { new: true }
    );
    await updateCategory.save();
    return res.status(200).json({
      success: true,
      message: "Subcategory created Successfully",
      data: subcategory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const deletesubcategory = async (req, res) => {
  try {
    let { id } = req.params;
    await subcategoryModel.findOneAndDelete({ _id: id });
    const updateCategry = await categoryModel.findOneAndUpdate(
      { subcategory: id },
      { $pull: { subcategory: id } },
      { new: true }
    );
    updateCategry.save();
    return res.status(200).json({
      success: true,
      message: "Subcategory Deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
const updatesubcategory = async (req, res) => {
  try {
    let { id } = req.params;
    let { name, description, category } = req.body;
    let slug = slugify(name, {
      replacement: "-", // replace spaces with replacement character, defaults to `-`
      lower: true, // convert to lower case, defaults to `false`
    });
    const updateSubcategory = await subcategoryModel.findOneAndUpdate(
      { _id: id },
      { name, description, category, slug },
      { new: true }
    );
    updateSubcategory.save();
    if (category) {
      await categoryModel.findOneAndUpdate(
        { subcategory: id },
        { $pull: { subcategory: id } },
        { new: true }
      );

      await categoryModel.findOneAndUpdate(
        { _id: category },
        { $push: { subcategory: id } },
        { new: true }
      );
    }
    return res
      .status(200)
      .json({
        success: true,
        message: "Subcategory Updated Successfully",
        data: updateSubcategory,
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
const getSubCategory = async(req,res)=>{
 try {
    let {id}= req.params
   const allsubcategory = await subcategoryModel.find({category:id}).sort({"created_at": -1})
   return res.status(200).json({success:true, message: "Data fetch successfully", data: allsubcategory})
 } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
 }
}


module.exports = { addsubcategory, deletesubcategory, updatesubcategory, getSubCategory,  };
