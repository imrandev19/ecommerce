const cartModel = require("../model/cartModel");

const addtoCartController = async (req, res) => {
  try {
    let { product, variant, user, quantity } = req.body;
    const addCart = await cartModel({
      product,
      variant,
      user,
      quantity,
    });

    addCart.save();
    return res
      .status(200)
      .json({
        success: true,
        message: "Cart Added Successfully",
        data: addCart,
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

let getCartController = async (req, res) => {
  try {
    let { id } = req.params;
    const getcart = await cartModel
      .find({ user: id })
      .populate("variant product user");
    if (getcart.length == 0) {
      return res.status(200).json({ success: true, message: "Cart is Empty" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Cart found", data: getcart });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
let deleteCartController =async (req,res)=>{
  try {
    let { id } = req.params;
    await cartModel.findOneAndDelete({_id:id})
      
    
    return res
      .status(200)
      .json({ success: true, message: "Cart Item Deleted"});
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
module.exports = { addtoCartController, getCartController, deleteCartController };
