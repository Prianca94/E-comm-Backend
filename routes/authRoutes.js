const express =require('express');
const {createUser,loginUser, getAllUsers, getUser, deleteUser, forgotPasswordToken,updateUser,updatePassword, blockUser, unblockUser, handleRefreshToken, logOut, resetPassword} = require('../controller/userController');
const {authMiddleware,isAdmin} = require('../middleware/authMiddleware');

const router=express.Router();
router.post("/register",createUser);
router.post("/login",loginUser);
router.post("/forgot-password-token",forgotPasswordToken);
router.put("/reset-password/:token",resetPassword)
router.put("/updatePassword",authMiddleware,updatePassword)
router.get("/userList",getAllUsers);
router.get("/refreshToken",handleRefreshToken);
router.get("/logout",logOut);
router.get("/:id",authMiddleware,isAdmin,getUser);
router.delete("/:id",deleteUser);
router.put("/:id",authMiddleware,updateUser);
router.put("/blockuser/:id",authMiddleware,isAdmin,blockUser);
router.put("/unblockuser/:id",authMiddleware,isAdmin,unblockUser);




module.exports=router;