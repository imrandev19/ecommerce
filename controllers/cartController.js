const cartModel = require("../model/cartModel");

const addtoCartController = async (req,res)=>{
    try {
        let {product, variant, user, quantity} = req.body
        const addCart = await cartModel({
            product, variant, user, quantity
        })

        addCart.save()
return res
      .status(200)
      .json({ success: true, message: "Cart Added Successfully", data:addCart });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
module.exports = addtoCartController