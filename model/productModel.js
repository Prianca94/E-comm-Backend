const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,

      // type:mongoose.Schema.Types.ObjectId,
      // ref:"category"
    },
    brand: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    // brand: {
    //   type: String,
    //   enum: ["Apple", "Sony", "Samsung"],
    // },
    sold: {
      type: Number,
      default: 0,
    },
    images: {
      type: Array,
    },
    color: {
      // type:String,
      // enum:["Black","Brown","Red"]
      type: String,
      required: true,
    },
    ratings: [{
      star: Number,
      postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      }
     
  }],
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Product", productSchema);