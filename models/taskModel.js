const mongoose=require('mongoose');

const taskSchema=new mongoose.Schema({
    name:{type:String,required:true},
    users: { type: [String], required: true },
    assigned:{type:String,required:true},
    date:{type:Date,default:Date.now},
    due:{type:Date,required:true}
});

module.exports=mongoose.model('task',taskSchema);