const categoryModel = require("../model/categoryModel");
const slugify = require("slugify");

const addcategorycontroller = async (req, res) => {
  const { categoryName, description } = req.body;
  const slugSingle = categoryName 

  try {
    const slug = slugify(slugSingle, {
        replacement: '-',  // replace spaces with replacement character, defaults to `-`
        lower: true,      // convert to lower case, defaults to `false`
      })
    let addCategory = new categoryModel({
      categoryName,
      description,
      image: `${process.env.SERVER_LINK}/${req.file.filename}`,
      slug
    });

    await addCategory.save();
    res
      .status(200)
      .json({ success: true, message: "File Uploaded Successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const allcategiresController = async (req, res) => {
  try {
    let getCategories = await categoryModel.find({});
    res.status(200).json({
      success: true,
      message: "File Uploaded Successfully",
      data: getCategories,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const singleCategory = async (req, res) => {
  let { slugname } = req.params;
  try {
 const slug = slugify(slugname, {
    replacement: '-',  // replace spaces with replacement character, defaults to `-`
    lower: true,      // convert to lower case, defaults to `false`
   })
    const category = await categoryModel.findOne({slug});
    res.status(200).json({
      success: true,
      message: "Single Category Found Successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addcategorycontroller,
  allcategiresController,
  singleCategory,
};
