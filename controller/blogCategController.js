const blogCategory = require("../model/blogCatModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodb");

const createBlogCategory = asyncHandler(async (req, res) => {
  try {
    const newBlogCategory = await blogCategory.create(req.body);
    res.json({ status: "Success", newBlogCategory });
  } catch (error) {
    throw new Error(error);
  }
});

const updateBlogCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const updateBlogCategory = await blogCategory.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updateBlogCategory);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteBlogCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deletedBlogCategory = await blogCategory.findByIdAndDelete(id);
    res.json(deletedBlogCategory);
  } catch (error) {
    throw new Error(error);
  }
});

const getBlogCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const getBlogCategory = await blogCategory.findById(id);
    res.json(getBlogCategory);
  } catch (error) {
    throw new Error(error);
  }
});

const getBlogCategoryList = asyncHandler(async (req, res) => {
  try {
    const getBlogCategoryList = await blogCategory.find();
    res.json(getBlogCategoryList);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { createBlogCategory, updateBlogCategory, deleteBlogCategory, getBlogCategory, getBlogCategoryList };
