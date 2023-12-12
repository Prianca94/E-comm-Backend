const { default: mongoose } = require("mongoose")

const dbConnect=()=>{
    try{
        
    const connection=mongoose.connect(process.env.MONGODB_URL);
    console.log("db connected");
    }
    catch(error){
console.log(error);
    }
};

module.exports=dbConnect;