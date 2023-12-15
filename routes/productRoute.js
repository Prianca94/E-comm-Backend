const express=require("express");
const {createProduct,getProduct, getProductList, updateProduct, deleteProduct, addToWishlist, rating} = require("../controller/productController");
const {isAdmin,authMiddleware} =require('../middleware/authMiddleware');


const router=express.Router();
router.post("/",authMiddleware,isAdmin,createProduct);
router.get("/productList",getProductList);

router.put('/wishlist',authMiddleware,addToWishlist)
router.put('/rating',authMiddleware,rating);
router.get("/:id",getProduct);
router.put("/:id",authMiddleware,isAdmin,updateProduct);
router.delete("/:id",authMiddleware,isAdmin,deleteProduct);


module.exports=router;