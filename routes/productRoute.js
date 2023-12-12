const express=require("express");
const {createProduct,getProduct, getProductList, updateProduct, deleteProduct} = require("../controller/productController");
const {isAdmin,authMiddleware} =require('../middleware/authMiddleware');


const router=express.Router();
router.post("/",authMiddleware,isAdmin,createProduct);
router.get("/productList",getProductList);
router.get("/:id",getProduct);
router.put("/:id",authMiddleware,isAdmin,updateProduct);
router.delete("/:id",authMiddleware,isAdmin,deleteProduct);


module.exports=router;