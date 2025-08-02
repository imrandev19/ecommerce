const bannerOneModel = require("../model/bannerOneModel");

async function addBannerOneController(req,res){
try {
  const {href} = req.body;
  const addBannerOne = new bannerOneModel({
    image:`${process.env.SERVER_LINK}/${req.file.filename}`,
    href:href
  })
  await addBannerOne.save()
  return res.status(201).json({
    success:true,
    data: addBannerOne,
    message: "Banner One Uploaded Successfully",

  })
} catch (error) {
  return res.status(500).json({ success: false, message: error.message });
}
}

async function getBannerOneController(req,res)
{
  try {
    const getBannerOne = await bannerOneModel.find()
    return res.status(201).json({
    success:true,
    data: getBannerOne,
    message: "Banner One Get Successfully",

  })
  } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
  }
}
module.exports = {addBannerOneController, getBannerOneController}