const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    userId:{
        type:String,
        required:true
    },
    username:{
      type:String,
      required:true
    },
    title: {
      type: String,
      required: true,
    },
    bodyContent: {
      type: String,
      required: true,
    },
    likes:{
        type:Array,
        default:[]
    }
  },
  { timestamps: true }
);


module.exports = mongoose.model('Post',postSchema);
