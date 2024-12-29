const express=require('express');
const router=express.Router();
const Split=require('../models/splitModel');

//create

router.post('/add',async(req,res)=>{
    try{
        const {name,people,amount,date}=req.body;
        const newsplit=new Split({
            name,people,amount,date
        });
        await newsplit.save();
        res.status(201).json(newsplit);
    }
    catch(err){
        res.status(500).send('error');
    }

});

//read

router.get('/',async(req,res)=>{
    try{
        const split=await Split.find();
        res.json(split);
    }
    catch(err){
        res.status(500).send('error');
    }
});

//readbyid

router.get('/:id',async(req,res)=>{
    try{
        const split=await Split.findById(req.params.id);
        if(!split)
            {
                res.status(404).send('not found');
            }
            res.json(split);}
        catch(err){
                res.status(500).send('error');
            }

});

//update

router.put('/:id',async(req,res)=>{
    try{
        const{name,people,amount,date}=req.body;
        const split=await Split.findByIdAndUpdate(req.params.id,{name,people,amount,date},{new:true});
        if(!split)
            {
                res.status(404).send('not found');
            }
            res.json(split);}
        catch(err){
                res.status(500).send('error');
            }  
});


//delete

router.delete('/:id',async(req,res)=>{
    try{
        const split=await Split.findByIdAndDelete(req.params.id);
        if(!split)
            {   
                res.status(404).send('not found');
            }
            res.json(split);
        }
        catch(err){
            res.status(500).send('error');
        }
});

module.exports=router;