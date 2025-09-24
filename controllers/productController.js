const { default: slugify } = require("slugify");
const categoryModel = require("../model/categoryModel");
const productModel = require("../model/productModel");
const subcategoryModel = require("../model/subcategoryModel");
const variantModel = require("../model/variantModel");
const path = require("path");
const fs = require("fs");
const { default: mongoose } = require("mongoose");

const addproductController = async (req, res) => {
  try {
    let {
      title,
      description,
      price,
      rating,
      subcategory,
      discountPercentage,
      featured,
    } = req.body;
    const slugSingle = title;
    const slug = slugify(slugSingle, {
      replacement: "-", // replace spaces with replacement character, defaults to `-`
      lower: true, // convert to lower case, defaults to `false`
    });

    const subcategoryforCategory = await subcategoryModel.findOne({
      _id: subcategory,
    });
    const category = subcategoryforCategory.category;
    // Parse numbers safely
    price = parseFloat(price) || 0;
    discountPercentage = parseFloat(discountPercentage) || 0;
    rating = parseFloat(rating) || 0;
    const discountprice = price - (price * discountPercentage) / 100;
    const addproduct = new productModel({
      title,
      slug,
      description,
      price,
      thumbnail: `${process.env.SERVER_LINK}/${req.file.filename}`,
      discountprice,
      discountPercentage,
      rating,
      category,
      subcategory,
      featured,
    });
    await addproduct.save();

    await categoryModel.findByIdAndUpdate(
      { _id: subcategoryforCategory.category },
      { $push: { product: addproduct._id } },
      { new: true }
    );
    await subcategoryModel.findByIdAndUpdate(
      { _id: subcategory },
      { $push: { product: addproduct._id } },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Product Added Sucessfully",
      data: addproduct,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getAllProductsController = async (req, res) => {
  try {
    const { category, subcategory, search, minPrice, maxPrice, brand, popular } = req.query;

    let filter = {};

    // ✅ Category filter
    if (category && category !== "all") {
      filter.category = category;
    }

    // ✅ Subcategory filter
    if (subcategory && subcategory !== "all") {
      filter.subcategory = subcategory;
    }

    // ✅ Brand filter
    if (brand && brand !== "all") {
      filter.brand = brand; // make sure your productModel has a `brand` field
    }

    // ✅ Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // ✅ Search filter (by product title or description)
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    // ✅ Popular products (assuming you have a boolean `popular` field)
    if (popular) {
      filter.popular = popular === "true";
    }

    const products = await productModel
      .find(filter)
      .populate("variant category subcategory");

    return res.status(200).json({
      success: true,
      message: "Products Fetched Successfully",
      count: products.length,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};


const getSingleProductsController = async (req, res) => {
  try {
    let { id } = req.params;
    const getSingleProduct = await productModel
      .findById(id)
      .populate("variant category subcategory");
    if (!getSingleProduct) {
      return res
        .status(400)
        .json({ success: false, message: "Product Not Found" });
    } else {
      return res.status(200).json({
        success: true,
        message: "Product Added Sucessfully",
        data: getSingleProduct,
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
const delteteProductController = async (req, res) => {
  try {
    let { id } = req.params;
    const product = await productModel.findOneAndDelete({ _id: id });
    const variants = await variantModel.find({ product: id });
    variants.forEach((variant) => {
      if (variant.image) {
        const cutLink = variant.image.split("/");
        const imagePath = cutLink[cutLink.length - 1];
        const serverPath = path.join(__dirname, "../uploads");
        const finalImage = `${serverPath}/${imagePath}`;
        fs.unlink(finalImage, (err) => {
          if (err) {
            return res
              .status(400)
              .json({ success: false, message: "Image not found" });
          }
        });
      }
    });
    await variantModel.deleteMany({ product: id });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Product Deleted Sucessfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
const getFeaturedProductsController = async (req, res) => {
  try {
    const featuredProducts = await productModel
      .find({ featured: true })
      .populate("category subcategory");
    if (featuredProducts.length == 0) {
      return res
        .status(400)
        .json({ success: true, message: "No Featured Products Found" });
    }
    return res.status(201).json({
      success: true,
      data: featuredProducts,
      message: "Featured Product Get",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
const searchProductController = async (req, res) => {
  try {
    const { search } = req.query;
    if(!search){
      return res.status(201).json({success:true, message: "data fetch successfully", data: []})
    }
    const searchProduct = await productModel.find({
      $or: [
        {
          title: { $regex: search, $options: "i" },
        },
        {description: {$regex: search, $options:"i"}}
      ],
    });
    return res.status(201).json({success:true, message: "data fetch successfully", data: searchProduct})
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


const getProductsBySubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const products = await Product.find({ subcategory: id });
    res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = {
  addproductController,
  getAllProductsController,
  getSingleProductsController,
  delteteProductController,
  getFeaturedProductsController,
  searchProductController,
  getProductsBySubcategory
};
