const jwToken=require('jsonwebtoken');

const generateToken=(id)=>{
    return jwToken.sign({id},process.env.JWT_SECRET,{expiresIn:"1d"});
}

module.exports={generateToken};
