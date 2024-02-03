const express=require('express');
const { createCoupon, getCouponList, updateCoupon, deleteCoupon } = require('../controller/couponController');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');
const router=express.Router();


router.post('/',authMiddleware,isAdmin,createCoupon);
router.put('/:id',authMiddleware,isAdmin,updateCoupon);
router.get('/',authMiddleware,isAdmin,getCouponList);
router.delete('/:id',authMiddleware,isAdmin,deleteCoupon);


module.exports=router;