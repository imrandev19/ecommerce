const categoryModel = require("../model/categoryModel");
const slugify = require("slugify");
const path = require("path");
const fs = require("fs");
const addcategorycontroller = async (req, res) => {
  const { categoryName, description } = req.body;
  const slugSingle = categoryName;

  try {
    const slug = slugify(slugSingle, {
      replacement: "-", // replace spaces with replacement character, defaults to `-`
      lower: true, // convert to lower case, defaults to `false`
    });
    let addCategory = new categoryModel({
      categoryName,
      description,
      image: `${process.env.SERVER_LINK}/${req.file.filename}`,
      slug,
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
      replacement: "-", // replace spaces with replacement character, defaults to `-`
      lower: true, // convert to lower case, defaults to `false`
    });
    const category = await categoryModel.findOne({ slug });
    res.status(200).json({
      success: true,
      message: "Single Category Found Successfully",
      data: category,
    });
    if (!category) {
      return res
        .status(400)
        .json({ success: false, message: "route not found" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
const deleteCategory = async (req, res) => {
  let { id } = req.params;
  try {
    const selectCategory = await categoryModel.findOneAndDelete({ _id: id });
    const imageName = selectCategory.image.split("/");
    const cutImageName = imageName[imageName.length - 1];
    const serverImageFolder = path.join(__dirname, "../uploads");
    const serverImageLink = `${serverImageFolder}/${cutImageName}`;
    fs.unlink(serverImageLink, (err) => {
      if (err) {
        return res
          .status(400)
          .json({ success: false, message: "Image not found" });
      }
    });

    if (!selectCategory) {
      return res
        .status(400)
        .json({ success: false, message: "category not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "category deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateCategory = async (req, res) => {
  let { id } = req.params;
  let { categoryName, description } = req.body;
  const slugSingle = categoryName;
  try {
    
    const slug = slugify(slugSingle, {
      replacement: "-", // replace spaces with replacement character, defaults to `-`
      lower: true, // convert to lower case, defaults to `false`
    });

    let updateCategory = await categoryModel.findOneAndUpdate(
      { _id: id },
      {
        categoryName,
        description,
        image: `${process.env.SERVER_LINK}/${req.file.filename}`,
        slug,
      }
    );
    if (!updateCategory) {
      return res
        .status(400)
        .json({ success: false, message: "category not found" });
    } else {
      const imageName = updateCategory.image.split("/");
    const cutImageName = imageName[imageName.length - 1];
    const serverImageFolder = path.join(__dirname, "../uploads");
    const serverImageLink = `${serverImageFolder}/${cutImageName}`;
    console.log(serverImageLink);
    fs.unlink(serverImageLink, (err) => {
      if (err) {
        return res
          .status(400)
          .json({ success: false, message: "Image not found" });
      }
    });
     await  updateCategory.save();
      return res
        .status(200)
        .json({
          success: true,
          message: "category changed/updated successfully",
        });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message||"category error"});
  }
};

module.exports = {
  addcategorycontroller,
  allcategiresController,
  singleCategory,
  deleteCategory,
  updateCategory,
};
