const Coupon = require("../model/couponModel");
const validateMongodb = require("../utils/validateMongodb");
const asyncHandler = require("express-async-handler");

const createCoupon = asyncHandler(async (req, res) => {
  try {
    const newCoupon = await Coupon.create(req.body);
    res.json({ status: "success", newCoupon });
  } catch (error) {
    throw new Error(error);
  }
});

const getCouponList = asyncHandler(async (req, res) => {
  try {
    const CouponList = await Coupon.find();
    res.json(CouponList);
  } catch (error) {
    throw new Error(error);
  }
});

const updateCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  

  try {
    const updatedCoupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true });
    console.log(updatedCoupon);
    res.json(updatedCoupon);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
  
    try {
      const deletedCoupon = await Coupon.findByIdAndDelete(id);
      res.json(deletedCoupon);
    } catch (error) {
      throw new Error(error);
    }
  });
  

module.exports = { createCoupon, getCouponList, updateCoupon,deleteCoupon };
