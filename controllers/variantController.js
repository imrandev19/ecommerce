const { default: slugify } = require("slugify");
const productModel = require("../model/productModel");
const variantModel = require("../model/variantModel");
const path = require("path");
const fs = require("fs");
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
      image: `${process.env.SERVER_LINK}/${req.file.filename}`,
    });
    const productVariant = await productModel.findOneAndUpdate(
      { _id: product },
      { $push: { variant: addVariant._id } },
      { new: true }
    );
    await productVariant.save();

    const RandomNum = `-${Math.floor(Math.random() * 9000) + 1000}`;
    const productTitle = slugify(productVariant.title.slice(0, 3), {
      lower: true,
    });
    const productSize = addVariant.size
      ? `-${slugify(addVariant.size, { lower: true })}`
      : "";
    const productColor = addVariant.color
      ? `-${slugify(addVariant.color, { lower: true })}`
      : "";
    const sku = `${productTitle}${productSize}${productColor}${RandomNum}`;
    addVariant.sku = sku;
    await addVariant.save();
    return res.status(200).json({
      success: true,
      mesage: "Variant Save Successfully",
      data: addVariant,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
const deleteVariantController = async (req, res) => {
  try {
    let { id } = req.params;

    const variant = await variantModel.findOneAndDelete({ _id: id });
    const serverImageLink = variant.image;
    const cutLink = serverImageLink.split("/");
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
    if (!variant) {
      return res
        .status(400)
        .json({ success: false, message: "variant not found" });
    }
    const delVariantFromProduct = await productModel.findOneAndUpdate(
      { variant: id },
      { $pull: { variant: id } },
      { new: true }
    );
    delVariantFromProduct.save();
    return res
      .status(200)
      .json({ success: true, mesage: "Variant Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateVariantController = async (req, res) => {
  try {
    let { id } = req.params;
    let { product, stock, color, size, discountPercentage, price } = req.body;
    if (req.file) {
      const variant = await variantModel.findById(id);
      const serverImageLink = variant.image;
      const cutLink = serverImageLink.split("/");
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
    const updateVariant = await variantModel.findOneAndUpdate(
      { _id: id },

      {
        product,
        stock,
        color,
        size,
        discountPercentage,
        price,
        image: req.file && `${process.env.SERVER_LINK}/${req.file.filename}`,
      },
      { new: true }
    );
    const productVariant = await productModel.find({ variant: id });
    const productId = productVariant[0].title;
    const RandomNum = `-${Math.floor(Math.random() * 9000) + 1000}`;
    const productTitle = slugify(productId.slice(0, 3), {
      lower: true,
    });
    const productSize = updateVariant.size
      ? `-${slugify(updateVariant.size, { lower: true })}`
      : "";
    const productColor = updateVariant.color
      ? `-${slugify(updateVariant.color, { lower: true })}`
      : "";
    const sku = `${productTitle}${productSize}${productColor}${RandomNum}`;
    updateVariant.sku = sku;
    updateVariant.save();
    if (product) {
      const updateProductCategory = await productModel.findOneAndUpdate(
        { variant: id },
        { $pull: { variant: id } },
        { new: true }
      );
      updateProductCategory.save();
      const addtoNewProductCategory = await productModel.findOneAndUpdate(
        { _id: product },
        { $push: { variant: updateVariant._id } },
        { new: true }
      );
      addtoNewProductCategory.save();
    }
    return res
      .status(200)
      .json({ success: true, message: "Variant Update Successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = {
  addVariantController,
  deleteVariantController,
  updateVariantController,
};
