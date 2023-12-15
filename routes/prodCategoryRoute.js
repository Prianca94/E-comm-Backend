const express=require('express');
const { createProductCategory, updateProductCategory, deleteProductCategory, getProductCategory, getProductCategoryList } = require('../controller/prodCategoryController');
const { isAdmin, authMiddleware } = require('../middleware/authMiddleware');
const router=express.Router();


router.post('/',authMiddleware,isAdmin,createProductCategory);
router.put('/:id',authMiddleware,isAdmin,updateProductCategory);
router.delete('/:id',authMiddleware,isAdmin,deleteProductCategory);
router.get('/:id',getProductCategory);
router.get('/',getProductCategoryList);

module.exports=router;