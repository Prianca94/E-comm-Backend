const express =require('express');
const {createUser,loginUser, getAllUsers, getUser, deleteUser, forgotPasswordToken,
    updateUser,updatePassword, blockUser, unblockUser, handleRefreshToken, logOut, 
    resetPassword, loginAdmin, getWishList, saveAddress, getCartInfo, deleteCart,
     addUserCart, applyCoupon} = require('../controller/userController');
const {authMiddleware,isAdmin} = require('../middleware/authMiddleware');

const router=express.Router();

router.post("/register",createUser);
router.post("/login",loginUser);
router.post("/adminLogin",loginAdmin);
router.post("/forgot-password-token",forgotPasswordToken);
router.post("/addUserCart",authMiddleware,addUserCart);


router.put("/reset-password/:token",resetPassword);

router.post("/cart/applyCoupon",authMiddleware,applyCoupon);

router.delete("/deleteCartInfo",authMiddleware,deleteCart);
router.put("/updatePassword",authMiddleware,updatePassword);
router.get("/getCartInfo",authMiddleware,getCartInfo);
router.get("/userList",getAllUsers);
router.get("/refreshToken",handleRefreshToken);
router.get("/logout",logOut);
router.get("/wishlist",authMiddleware,getWishList);
router.get("/:id",authMiddleware,isAdmin,getUser);
router.put("/saveAddress",authMiddleware,saveAddress);
router.delete("/:id",deleteUser);
router.put("/:id",authMiddleware,updateUser);

router.put("/blockuser/:id",authMiddleware,isAdmin,blockUser);
router.put("/unblockuser/:id",authMiddleware,isAdmin,unblockUser);




module.exports=router;