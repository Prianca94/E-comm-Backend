const express=require("express");
const {createProduct,getProduct, getProductList, updateProduct, deleteProduct, addToWishlist, rating, uploadImages} = require("../controller/productController");
const {isAdmin,authMiddleware} =require('../middleware/authMiddleware');
const { uploadPhoto, prodImageResize } = require("../middleware/uploadImages");


const router=express.Router();
router.post("/",authMiddleware,isAdmin,createProduct);
router.get("/productList",getProductList);
router.put('/upload/:id',authMiddleware,isAdmin,uploadPhoto.array('images',10),uploadImages);

router.put('/wishlist',authMiddleware,addToWishlist)
router.put('/rating',authMiddleware,rating);
router.get("/:id",getProduct);
router.put("/:id",authMiddleware,isAdmin,updateProduct);
router.delete("/:id",authMiddleware,isAdmin,deleteProduct);



module.exports=router;