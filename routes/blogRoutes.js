const express=require('express');
const { createBlog, updateBlog, getBlog, getBlogList, deleteBlog, likeBlog, disLiketheBlog } = require('../controller/blogController');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');
const router=express.Router();


router.post('/',authMiddleware,isAdmin,createBlog);

router.put('/likes',authMiddleware,likeBlog);

router.post('/dislikes',authMiddleware,disLiketheBlog);
router.put('/:id',authMiddleware,isAdmin,updateBlog);
router.get('/:id',getBlog);
router.get('/',getBlogList);
router.delete('/:id',authMiddleware,isAdmin,deleteBlog);


module.exports=router;