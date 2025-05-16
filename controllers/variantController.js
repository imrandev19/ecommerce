const { default: slugify } = require("slugify");
const productModel = require("../model/productModel");
const variantModel = require("../model/variantModel");

const addVariantController = async (req, res) => {
  try {
    let { product, stock, color, size, discountPercentage, price } = req.body;
    
    const addVariant = new variantModel({
      product,
      stock,
      color,
      size,
      discountPercentage,
      price,
      image:`${process.env.SERVER_LINK}/${req.file.filename}`,
       
    });
    const productVariant = await productModel.findOneAndUpdate({_id: product}, {$push:{variant: addVariant._id}}, {new:true})
    await productVariant.save()
    
   
    const RandomNum = `-${Math.floor(Math.random() * 9000) + 1000}`;
    const productTitle = slugify(productVariant.title.slice(0,3), {lower: true})
    const productSize = addVariant.size? `-${slugify(addVariant.size, {lower: true})}`: "";
    const productColor = addVariant.color? `-${slugify(addVariant.color, {lower: true})}`: "";
    const sku = `${productTitle}${productSize}${productColor}${RandomNum}`
    addVariant.sku = sku;
    await addVariant.save();
    return res.status(200).json({success:true, mesage: "Variant Save Successfully", data: addVariant})
  } catch (error) {
    return res.status(500).json({success:false, message: error.message})
  }
};

module.exports = addVariantController;
