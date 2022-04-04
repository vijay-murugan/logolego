const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    img:{
        type:String,
        required:true
    }   
    ,
    comments:[{
        name: String,
        body:String
    }]
})

const Image = mongoose.model('images', imageSchema);
module.exports = Image;