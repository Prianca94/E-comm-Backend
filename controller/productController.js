const Product = require("../model/productModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const validateMongoDbId = require("../utils/validateMongodb");
const User = require("../model/userModel");
const cloudinaryUploadImage=require("../utils/cloudinary");
const fs = require('node:fs');
const path=require('path');

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

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" "); //(catergory brand) format
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    //limiting the fields
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    //pagination
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    console.log(skip);
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const prodCount = await Product.countDocuments();
      console.log(prodCount);
      if (skip >= prodCount) {
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
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });

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

const addToWishlist = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { product_id } = req.body;
  console.log(product_id);

  try {
    const user = await User.findById(id);

    const alreadyAdded = await user.wishlist.find((id) => id.toString() === product_id);

    if (alreadyAdded) {
      let user = await User.findByIdAndUpdate(id, { $pull: { wishlist: product_id } }, { new: true });
      res.json(user);
    } else {
      let user = await User.findByIdAndUpdate(id, { $push: { wishlist: product_id } }, { new: true });
      res.json(user);
    }
  } catch (error) {
    throw new Error(error);
  }
});

const rating = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { star, product_id,comment } = req.body;
  console.log(product_id, star);
  try {
    const product = await Product.findById(product_id);
  
    let alreadyRated = product.ratings.find((userId) => userId.postedBy.toString() === id.toString());
    if (alreadyRated) {
      const updateRating = await Product.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        { $set: { "ratings.$.star": star ,"ratings.$.comment":comment} },
        {
          new: true,
        }
      );
    
    } else {
      const rateProduct = await Product.findByIdAndUpdate(
        product_id,
        {
          $push: {
            ratings: { star: star,comment:comment, postedBy: id },
          },
        },
        { new: true }
      );
    
    }

    const getallrating = await Product.findById(product_id);
    let totalRating = getallrating.ratings.length;
    let sumOfRating = getallrating.ratings.map((item) => item.star).reduce((prev, curr) => prev + curr, 0);
    let actualRating = Math.round(sumOfRating / totalRating);
    const ratedProduct=await Product.findByIdAndUpdate(product, { totalrating: actualRating }, { new: true });
    res.json(ratedProduct);
  } catch (error) {
    throw new Error(error);
  }
});


const uploadImages=asyncHandler(async(req,res,next)=>{
  
  const {id}=req.params;
  validateMongoDbId(id);
  try{
const uploader=((path)=>cloudinaryUploadImage(path,"images"));

  const urls=[];
  const files=req.files;
  for(const file of files){
    const {path}=file;
    const {filename}=file;
  
    const newpath =await uploader(path);
    
    urls.push(newpath);

   // const npath="D:/E-com-Node-Api/public/images/"+filename;
    console.log(path);
   //fs.unlink("D:/E-com-Node-Api/public/images/"+filename,(err) => {console.log(err)});  
  
 //fs.unlink('D:/E-com-Node-Api/public/images/images-1703011918374.jpeg',(err)=>{console.log(err)});
  //fs.unlinkSync(path,(err)=>{console.log(err)});
     
}

  const findProduct =await  Product.findByIdAndUpdate(id,
    {images:urls.map((file)=>{return file})}
    ,{new:true})

  res.json(findProduct);

  }catch(error){
throw new Error(error);
  }
  
  });
  
module.exports = { createProduct, getProduct, getProductList, updateProduct, deleteProduct,uploadImages, addToWishlist, rating };
