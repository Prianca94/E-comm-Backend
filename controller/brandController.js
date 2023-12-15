const Brand=require('../model/brandModel');
const asyncHandler=require('express-async-handler');
const validateMongoDbId=require('../utils/validateMongodb');

const createBrand=asyncHandler(async(req,res)=>{
try{

    const newBrand=await Brand.create(req.body);
    res.json({status:"Success",newBrand});
}
catch(error){
  throw new Error(error);
}

});


const updateBrand=asyncHandler(async(req,res)=>{
  const {id}=req.params;
  try{
  
      const updatedBrand=await Brand.findByIdAndUpdate(id,req.body,{new:true});
      res.json(updatedBrand);
  }
  catch(error){
    throw new Error(error);
  }
  });

const deleteBrand=asyncHandler(async(req,res)=>{
  const {id}=req.params;
  try{
  
      const deleteBrand=await Brand.findByIdAndDelete(id);
      res.json(deleteBrand);
  }
  catch(error){
    throw new Error(error);
  }
  
  });

  
const getBrand=asyncHandler(async(req,res)=>{
  const {id}=req.params;
  try{
  
      const getBrand=await Brand.findById(id);
      res.json(getBrand);
  }
  catch(error){
    throw new Error(error);
  }
  
  });

  
const getBrandList=asyncHandler(async(req,res)=>{
  
  try{
  
      const getBrandList=await Brand.find();
      res.json(getBrandList);
  }
  catch(error){
    throw new Error(error);
  }
});

module.exports={createBrand,updateBrand,deleteBrand,getBrand,getBrandList};