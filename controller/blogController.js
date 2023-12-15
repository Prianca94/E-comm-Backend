const Blog = require("../model/blogModel");
const User = require("../model/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodb");

const createBlog = asyncHandler(async (req, res) => {
  try {
    const newBlog = await Blog.create(req.body);
    res.json({ status: "success", newBlog });
  } catch (error) {
    throw new Error(error);
  }
});

const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const updateBlog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ status: "success", updateBlog });
  } catch (error) {
    throw new Error(error);
  }
});

const getBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const blog = await Blog.findById(id).populate("likes").populate("dislikes");
    await Blog.findByIdAndUpdate(id, { $inc: { numViews: 1 } }, { new: true });
    res.json(blog);
  } catch (error) {
    throw new Error(error);
  }
});

const getBlogList = asyncHandler(async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const deletedBlog = await Blog.findByIdAndDelete(id);
    res.json(deletedBlog);
  } catch (error) {
    throw new Error(error);
  }
});

const likeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  validateMongoDbId(blogId);
  const blog = await Blog.findById(blogId);
  const loginUserId = req?.user?.id;
  const isLiked = blog?.isLiked;

  const alreadyDislike = blog?.dislikes?.find((userId) => userId?.toString() === loginUserId?.toString());

  if (alreadyDislike) {
    const blog = await Blog.findByIdAndUpdate(blogId, { $pull: { dislikes: loginUserId }, isDisliked: false }, { new: true });
    res.json(blog);
  }

  if (isLiked) {
    const blog = await Blog.findByIdAndUpdate(blogId, { $pull: { likes: loginUserId }, isLiked: false }, { new: true });
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(blogId,{$push: { likes: loginUserId },isLiked: true,},{ new: true }
    );
    res.json(blog);
  }
});

const disLiketheBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  console.log(blogId);
  validateMongoDbId(blogId);
  
  const blog = await Blog.findById(blogId);
  const loginUserId = req?.user?.id;
  const isDisLiked = blog?.isDisLiked;

  const alreadyLiked = blog?.likes?.find((userId) => userId?.toString() === loginUserId?.toString());

  if (alreadyLiked) {
    const blog = await Blog.findByIdAndUpdate(blogId, { $pull: { dislikes: loginUserId }, isDisliked: false }, { new: true });
    res.json(blog);
  }

  if (isDisLiked) {
    const blog = await Blog.findByIdAndUpdate(blogId, { $pull: { dislikes: loginUserId }, isDisLiked: false }, { new: true });
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(blogId,{$push: { dislikes: loginUserId },isDisLiked: true,},{ new: true }
    );
    res.json(blog);
  }
});


module.exports = { createBlog, updateBlog, getBlog, getBlogList, deleteBlog, likeBlog ,disLiketheBlog};
