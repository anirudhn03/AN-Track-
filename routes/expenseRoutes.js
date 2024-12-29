const express=require('express');
const router=express.Router();
const Expense=require('../models/expenseModel');

//create

router.post('/add',async(req,res)=>{
    try{
        const {name,amount,date,budget,budgetdue}=req.body;
        const newexpense=new Expense({
            name,amount,date,budget,budgetdue
        });
        await newexpense.save();
        res.status(201).json(newexpense);
    }
    catch(err){
        res.status(500).send('error');
    }

});

//read

router.get('/',async(req,res)=>{
    try{
        const expense=await Expense.find();
        res.json(expense);
    }
    catch(err){
        res.status(500).send('error');
    }
});

//readbyid

router.get('/:id',async(req,res)=>{
    try{
        const expense=await Expense.findById(req.params.id);
        if(!expense)
            {
                res.status(404).send('not found');
            }
            res.json(expense);}
        catch(err){
                res.status(500).send('error');
            }

});

//updatebyid

router.put('/:id',async(req,res)=>{
    try{
        const{name,amount,date,budget,budgetdue}=req.body;
        const expense=await Expense.findByIdAndUpdate(req.params.id,{name,amount,date,budget,budgetdue},{new:true});
        if(!expense)
            {
                res.status(404).send('not found');
            }
            res.json(expense);}
        catch(err){
                res.status(500).send('error');
            }  
});


//delete

router.delete('/:id',async(req,res)=>{
    try{
        const expense=await Expense.findByIdAndDelete(req.params.id);
        if(!expense)
            {   
                res.status(404).send('not found');
            }
            res.json(expense);
        }
        catch(err){
            res.status(500).send('error');
        }
});

module.exports=router;