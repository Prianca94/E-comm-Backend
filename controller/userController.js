const User = require("../model/userModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwToken");
const validateMongoDbId = require("../utils/validateMongodb");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt=require('jsonwebtoken');
const sendEmail = require("./nodemailer");
const crypto=require('crypto');


const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const finduser = await User.findOne({ email: email });
  if (!finduser) {
    //create user

    const newUser = User.create(req.body);
    res.json(newUser);
  } else {
    //Already exist
    // res.json({msg:"User Already Exist",success:false});
    throw new Error("User Already Exist in db");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //check if user exist or not

  const findUser = await User.findOne({ email });

  //const passMatched=;
  //console.log(passMatched);

  if (findUser && (await findUser.isPasswordMatched(password))) {
    
    const refreshToken=await generateRefreshToken(findUser?._id);

    const updateduser=await User.findByIdAndUpdate(findUser._id,
      {
        refreshToken:refreshToken
      },{
        new:true
      });

      res.cookie("refreshToken",refreshToken,{httpOnly:true,maxAge:72*60*60*1000})

    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error("Invalid credentials");
  }
});

const handleRefreshToken=asyncHandler(async(req,res)=>{
  const cookie=req.cookies;
  
  if(!cookie.refreshToken){
    throw new Error("No Refresh Token in cookie");
  }
  const refreshToken=cookie.refreshToken;
  const user=await User.findOne({refreshToken});
  
  if(!user){
    throw new Error("No Refresh token present in db");
  }
  jwt.verify(refreshToken,process.env.JWT_SECRET,(err,decoded)=>{
  
    if(err || user.id!==decoded.id){
      throw new Error("There is something wrong with refresh token");
    }
    const accessToken=generateToken(user.id);
    res.json({accessToken});
  })

});

const updatePassword=asyncHandler(async(req,res)=>{
  const {id}=req.user;
  const {password}=req.body;
  validateMongoDbId(id);
  const user=await User.findById(id);
  //console.log(user);
//console.log(password);
  if(password){
    user.password=password;
    console.log(user.password);
    const updatedPassword=await user.save();
    res.json(user);
  }
  else{
    res.json(user);
  }
});

const forgotPasswordToken=asyncHandler(async(req,res)=>{
const {email}=req.body;
const user =await User.findOne({email});
if(!user){
  throw new Error("User not found in this email");
}
  try{
    const token=await user.createPasswordResetToken();
    await user.save();
    const resetURL=`Please follow this link to reset your password.This link expires in 10 minutes <a href="http://localhost:5000/api/user/reset-password/${token}">Click Here</a>`;
    const data={
      to:email,
      subject:"Forgot Password Link",
      text:"Hey",
      html:resetURL
    }
    sendEmail(data);
    res.json(token);
  }catch(error){
    throw new Error(error)
  }
})

const resetPassword=asyncHandler(async(req,res)=>{
  const {password}=req.body;
  const {token}=req.params;
  const hashedToken=crypto.createHash('sha256').update(token).digest("hex");
  const user=await User.findOne({passwordResetToken:hashedToken,passwordResetExpires:{$gt:Date.now()}});
if(!user){
  throw new Error("Token expired try later")
}
user.password=password;
user.passwordResetToken=undefined;
user.passwordResetExpires=undefined;
await user.save();
res.json(user);
})

const logOut=asyncHandler(async(req,res)=>{
  const cookie=req.cookies;
  
if(!cookie.refreshToken){
  throw new Error("No Refresh Token in cookie");
}
const refreshToken=cookie.refreshToken;
const user=await User.findOne({refreshToken});
if(!user){
  res.clearCookie("refreshToken",{httpOnly:true,secure:true});
  return res.sendStatus(204);
}
await User.findOneAndUpdate({refreshToken},{refreshToken:"",});

res.clearCookie("refreshToken",{httpOnly:true,secure:true});
return res.sendStatus(204);

});



const getAllUsers=asyncHandler(async(req,res)=>{
    try{
    const getUsers=await User.find();
    res.json(getUsers);
    }
catch(error){
    throw new Error(error);
}
});

const updateUser=asyncHandler(async(req,res)=>{
    const {id}=req.user;
    validateMongoDbId(id);
    try{

        const updateuser=await User.findByIdAndUpdate(id,{
            firstname:req?.body?.firstname,
            lastname:req?.body?.lastname,
            email:req?.body?.email,
            mobile:req?.body?.mobile
        },{
            new:true
        });

         res.json(updateuser);

    }catch(error){
         console.log(error);
    }
})

const getUser=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongoDbId(id);
    
    try{
           const getUser=await User.findById(id);
           res.json(getUser);
    }
    catch(error){
      throw new Error(error);
    }
    // const getuser = await User.findOne;
    // res.json(getuser);
});


const deleteUser=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongoDbId(id);
  
    try{
           const deletedUser=await User.findByIdAndDelete(id);
           res.json(deletedUser);
    }
    catch(error){
      throw new Error(error);
    }
    // const getuser = await User.findOne;
    // res.json(getuser);
});

const blockUser=asyncHandler(async(req,res)=>{

  const {id}=req.params;
  validateMongoDbId(id);
  try{
    const block=await User.findByIdAndUpdate(id,{
      isBlocked:true
    },{new:true});

    res.json({message:"User Blocked"});

  }catch(error){
    throw new Error(error);
  }
});

const unblockUser=asyncHandler(async(req,res)=>{
  const {id}=req.params;
  validateMongoDbId(id);
  try{
    const unblock=await User.findByIdAndUpdate(id,{
      isBlocked:false
    },{new:true});

    res.json({message:"User UnBlocked"});

  }catch(error){
    throw new Error(error);
  }
});



module.exports = { createUser, loginUser,getAllUsers ,getUser,deleteUser,updateUser,forgotPasswordToken,resetPassword,blockUser,unblockUser,handleRefreshToken,updatePassword,logOut};
