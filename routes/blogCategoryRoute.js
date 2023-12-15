const express=require('express');
const { createBlogCategory, updateBlogCategory, deleteBlogCategory, getBlogCategory,getBlogCategoryList } = require('../controller/blogCategController');
const { isAdmin, authMiddleware } = require('../middleware/authMiddleware');
const router=express.Router();

router.post('/',authMiddleware,isAdmin,createBlogCategory);
router.put('/:id',authMiddleware,isAdmin,updateBlogCategory);
router.delete('/:id',authMiddleware,isAdmin,deleteBlogCategory);
router.get('/:id',getBlogCategory);
router.get('/',getBlogCategoryList);





module.exports=router;