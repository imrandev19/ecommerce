const { default: mongoose } = require("mongoose");
const productModel = require("./productModel");

const variantModel = new mongoose.Schema(
  {
    color: {
      type: String,
    },
    storage: {
      type: String,
    },
    price: {
      type: Number,
    },
    discountprice: {
      type: Number,
      min: 0,
      default: 0,
    },
    discountPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    stock:{
        type: Number,
        required:true,
        trim:true
    },
    sku:{
        type:String,
        trim:true,
        required: true,
        unique: true,
    }
  },
  { timestamps: true }
);
// Middleware to set default price
variantModel.pre('save', async function (next) {
  if (this.price == null) {
    const product = await productModel.findById(this.product);
    if (product) {
      this.price = product.price;
    } else {
      return next(new Error('Product not found'));
    }
  }
  next();
});

module.exports = mongoose.model("Variant", variantModel);
