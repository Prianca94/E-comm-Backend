const express=require('express');
const { createBlog, updateBlog, getBlog, getBlogList, deleteBlog, likeBlog, disLiketheBlog, uploadImages } = require('../controller/blogController');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');
const { blogImageResize, uploadPhoto } = require('../middleware/uploadImages');
const router=express.Router();

router.post('/',authMiddleware,isAdmin,createBlog);
router.put('/upload/:id',authMiddleware,isAdmin,uploadPhoto.array('images',10),uploadImages);
router.put('/likes',authMiddleware,likeBlog);
router.put('/dislikes',authMiddleware,disLiketheBlog);
router.put('/:id',authMiddleware,isAdmin,updateBlog);
router.get('/:id',getBlog);
router.get('/',getBlogList);
router.delete('/:id',authMiddleware,isAdmin,deleteBlog);

module.exports=router;