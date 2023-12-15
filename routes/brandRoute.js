const express=require('express');
const { createBrand, updateBrand, deleteBrand, getBrand, getBrandList } = require('../controller/brandController');
const { isAdmin, authMiddleware } = require('../middleware/authMiddleware');
const router=express.Router();


router.post('/',authMiddleware,isAdmin,createBrand);
router.put('/:id',authMiddleware,isAdmin,updateBrand);
router.delete('/:id',authMiddleware,isAdmin,deleteBrand);
router.get('/:id',getBrand);
router.get('/',getBrandList);


module.exports=router;