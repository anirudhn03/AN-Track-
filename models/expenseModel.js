const mongoose=require('mongoose');

const expenseSchema=new mongoose.Schema({
    name:{type:String,required:true},
    amount:{type:Number,required:true},
    date:{type:Date,default:Date.now},
    budget: { type:String,required:true },
    budgetdue:{type:Date}
});

module.exports=mongoose.model('expense',expenseSchema);