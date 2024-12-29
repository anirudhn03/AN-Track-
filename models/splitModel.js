const mongoose=require('mongoose');

const splitSchema=new mongoose.Schema({
    name:{type:String,required:true},
    people:{type:Number,required:true},
    amount:{type:Number,required:true},
    date:{type:Date,default:Date.now}
});

module.exports=mongoose.model('split',splitSchema);