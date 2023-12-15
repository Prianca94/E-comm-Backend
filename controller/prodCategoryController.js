const prodCategory=require('../model/prodCategoryModel');
const asyncHandler=require('express-async-handler');
const validateMongoDbId=require('../utils/validateMongodb');

const createProductCategory=asyncHandler(async(req,res)=>{
try{

    const newCategory=await prodCategory.create(req.body);
    res.json({status:"Success",newCategory});
}
catch(error){
  throw new Error(error);
}

});


const updateProductCategory=asyncHandler(async(req,res)=>{
  const {id}=req.params;
  try{
  
      const updatedCategory=await prodCategory.findByIdAndUpdate(id,req.body,{new:true});
      res.json(updatedCategory);
  }
  catch(error){
    throw new Error(error);
  }
  
  });

  
const deleteProductCategory=asyncHandler(async(req,res)=>{
  const {id}=req.params;
  try{
  
      const deletedCategory=await prodCategory.findByIdAndDelete(id);
      res.json(deletedCategory);
  }
  catch(error){
    throw new Error(error);
  }
  
  });

  
const getProductCategory=asyncHandler(async(req,res)=>{
  const {id}=req.params;
  try{
  
      const getCategory=await prodCategory.findById(id);
      res.json(getCategory);
  }
  catch(error){
    throw new Error(error);
  }
  
  });

  
const getProductCategoryList=asyncHandler(async(req,res)=>{
  
  try{
  
      const getCategoryList=await prodCategory.find();
      res.json(getCategoryList);
  }
  catch(error){
    throw new Error(error);
  }
  
  });


module.exports={createProductCategory,updateProductCategory,deleteProductCategory,getProductCategory,getProductCategoryList};