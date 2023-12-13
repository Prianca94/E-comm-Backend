const asyncHandler=require('express-async-handler');
const jwToken =require('jsonwebtoken');
const User=require('../model/userModel');

const authMiddleware=asyncHandler(
    async(req,res,next)=>{

        let token;
        if(req.headers.authorization.startsWith('Bearer')){
          
            token=req.headers.authorization.split(" ")[1];
           // console.log(req.headers.authorization.split(" "));

            try{
                if(token){
                     const decode=jwToken.verify(token,process.env.JWT_SECRET);
                
                     const user=await User.findById(decode?.id);
                     req.user=user;
                     next();
            
                }
                
            }
            catch(error){
                throw new Error("Token expired , Login again");
            }
        }
        else{
            throw new Error("Token not attached to header");
        }

    }
);

const isAdmin=asyncHandler(async(req,res,next)=>{
    const {email}=req.user;
    const adminUser=await User.findOne({email});

    if(adminUser.role !== 'admin'){
          throw new Error("You are not an admin");
    }
    else{
        
        next();
    }
});


module.exports={authMiddleware,isAdmin};