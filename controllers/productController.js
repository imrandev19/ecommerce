const { default: slugify } = require("slugify");
const categoryModel = require("../model/categoryModel");
const productModel = require("../model/productModel");
const subcategoryModel = require("../model/subcategoryModel");

const addproductController = async (req, res) => {
  try {
    let { title, description, price, rating, subcategory, discountPercentage } = req.body;
    const slugSingle = title
     const slug = slugify(slugSingle, {
          replacement: "-", // replace spaces with replacement character, defaults to `-`
          lower: true, // convert to lower case, defaults to `false`
        });
    
    const subcategoryforCategory = await subcategoryModel.findOne({_id:subcategory})
    const category = subcategoryforCategory.category
    // Parse numbers safely
    price = parseFloat(price) || 0;
    discountPercentage = parseFloat(discountPercentage) || 0;
    rating = parseFloat(rating) || 0;
    const discountprice = price - (price * discountPercentage / 100); 
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
        subcategory
    });
    await addproduct.save()
    
    await categoryModel.findByIdAndUpdate({_id:subcategoryforCategory.category}, {$push:{product:addproduct._id}}, {new:true})
    await subcategoryModel.findByIdAndUpdate({_id:subcategory}, {$push:{product:addproduct._id}}, {new:true})
    return res.status(200).json({success:true, message: "Product Added Sucessfully", data: addproduct})
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getAllProductsController = async (req,res)=>{
try {
 
  const getAllProducts = await productModel.find({}).populate("variant")
  return res.status(200).json({success:true, message: "Product Added Sucessfully", data: getAllProducts})
} catch (error) {
  return res.status(500).json({ success: false, message: error.message });
}
}

module.exports = {addproductController, getAllProductsController};
