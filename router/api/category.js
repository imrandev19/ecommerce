const express = require("express")
const {addcategorycontroller, allcategiresController} = require("../../controllers/categorycontroller")
const router =express.Router()
const path = require("path");
const multer  = require('multer');
const adminMiddleware = require("../../middleware/adminMiddleware");
const authMiddleware = require("../../middleware/authMiddleware");
function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif|webp/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if(mimetype && extname){
      return cb(null, true);
    } else {
      return cb(null, false);
    }
  }
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
      
    },
    
    filename: function (req, file, cb) {
      const fileExtension=  file.mimetype.split("/")
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix +"." + fileExtension[fileExtension.length-1])
    
    }
    
  })
  
const upload = multer({ storage: storage,  
    fileFilter: function(_req, file, cb){
    checkFileType(file, cb)},
    limits: { fileSize: 3000000 } })
// http://localhost:4000/api/category/addcategory
router.post('/addcategory',upload.single('image'),authMiddleware, adminMiddleware, addcategorycontroller)
router.get("/allcategires", allcategiresController)

module.exports = router