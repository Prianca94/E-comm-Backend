const Product = require("../model/productModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const validateMongoDbId = require("../utils/validateMongodb");

const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const findproduct = await Product.findById(id);
    res.json(findproduct);
  } catch (error) {
    throw new Error(error);
  }
});

const getProductList = asyncHandler(async (req, res) => {
  try {
    //filtering

    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);
    //console.log(queryObj);
    let queryStr = JSON.stringify(queryObj);
    //console.log(queryStr);
    queryStr = queryStr.replace(/\bgte|gt|lte|lt\b/g, (match) => `$${match}`);
   // console.log(queryStr);
    let query = Product.find(JSON.parse(queryStr));

    //sorting
  
    if(req.query.sort){
     const sortBy=req.query.sort.split(",").join(" ");//(catergory brand) format
     query=query.sort(sortBy);
    
    }
    else{
      query=query.sort('-createdAt');
    }

    //limiting the fields
    if(req.query.fields){
      const fields=req.query.fields.split(",").join(" ");
      query=query.select(fields);
    }
    else{
      query=query.select("-__v");
    }

    //pagination
    const page=req.query.page;
    const limit=req.query.limit;
    const skip=(page-1)*limit;
    console.log(skip);
    query=query.skip(skip).limit(limit);
    if(req.query.page){
      const prodCount=await Product.countDocuments();
      console.log(prodCount);
      if(skip>=prodCount){
        throw new Error("Page does not exist");
      }
    }



    const productList = await query;
    res.json(productList);

  } catch (error) {
    throw new Error(error);
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params.id;
  //validateMongoDbId(id);

  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }

    const updatedProduct = await Product.findOneAndUpdate(id, req.body, { new: true });

    res.json(updatedProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params.id;
  //validateMongoDbId(id);

  try {
    const deletedProduct = await Product.findOneAndDelete(id);

    res.json({ message: "Product deleted" });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { createProduct, getProduct, getProductList, updateProduct, deleteProduct };
