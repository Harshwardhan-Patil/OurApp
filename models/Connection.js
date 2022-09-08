const mongoose = require('mongoose');

const connectionSchema = mongoose.Schema({
    members:{
        type:Array,
        default:[],
        required:true,
    }
},{timestamp:true});


module.exports = mongoose.model("Connection",connectionSchema);