const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,   
        trim: true,
    },
    price: {
      type: Number, 
        required: true,
    },
    category: {
      type: String,
        required: true,
    },
    stock: {
      type: Number,
        required: true,
        min: 0,
    },

    avaliable: {
      type: Boolean,
      default: true,    
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt 
})
module.exports = mongoose.model("Product", productSchema)