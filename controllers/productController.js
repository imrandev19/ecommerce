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
    
    const getAllProducts = await productModel
      .find({})
      .populate("variant category subcategory");
    if (!getAllProducts) {
      return res
        .status(400)
        .json({ success: false, message: "No Product Found" });
    } else {
      return res.status(200).json({
        success: true,
        message: "Products Get Sucessfully",
        data: getAllProducts,
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
  // try {
  //   const category = req.query.category || "";
  //   const minPrice = parseFloat(req.query.minPrice) || 0;
  //   const maxPrice = parseFloat(req.query.maxPrice) || Number.MAX_SAFE_INTEGER;
  //   const page = parseInt(req.query.page) || 1;
  //   const limit = parseInt(req.query.limit) || 6;
  //   const skip = (page - 1) * limit;

  //   // Build filter
  //   let filter = {
  //     price: { $gte: minPrice, $lte: maxPrice },
  //   };

  //   if (category && category !== "all") {
  //     // If category is ObjectId in DB
  //     if (mongoose.Types.ObjectId.isValid(category)) {
  //       filter.category = new mongoose.Types.ObjectId(category);
  //     } else {
  //       filter.category = category; // If stored as string
  //     }
  //   }

  //   // Get total count
  //   const totalProducts = await productModel.countDocuments(filter);

  //   // Get products with pagination
  //   const products = await productModel
  //     .find(filter)
  //     .skip(skip)
  //     .limit(limit)
  //     .sort({ createdAt: -1 });

  //   res.status(200).json({
  //     success: true,
  //     data: products,
  //     total: totalProducts,
  //     totalPages: Math.ceil(totalProducts / limit),
  //     currentPage: page,
  //   });
  // } catch (error) {
  //   console.error("Error fetching products:", error);
  //   res.status(500).json({
  //     success: false,
  //     message: "Server Error",
  //     error: error.message,
  //   });
  // }
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

module.exports = {
  addproductController,
  getAllProductsController,
  getSingleProductsController,
  delteteProductController,
  getFeaturedProductsController,
  searchProductController,
};
