const jwToken=require('jsonwebtoken');

const generateRefreshToken=(id)=>{
    return jwToken.sign({id},process.env.JWT_SECRET,{expiresIn:"3d"});
}

module.exports={generateRefreshToken};
