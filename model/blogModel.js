const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    numViews:{
        type:Number,
        default:0
    },
    isLiked:{
        type:Boolean,
        default:false
    },
    isDisLiked:{
        type:Boolean,
        default:false
    },
    likes:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    dislikes:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    image:{
        type:String,
        default:"https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-980x653.jpg"
    },
    images:[],
    author:{
        type:String,
        default:"Admin"
    }
},
{
toJSON:{
    virtuals:true
},
toObject:{
    virtuals:true
},
timestamps:true
});

//Export the model
module.exports = mongoose.model('Blog', blogSchema);