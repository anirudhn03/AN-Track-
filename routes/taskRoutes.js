const express=require('express');
const router=express.Router();
const Task=require('../models/taskModel');

//create

router.post('/add',async(req,res)=>{
    try{
        const {name,users,assigned,date,due}=req.body;
        const newtask=new Task({
            name,users,assigned,date,due
        });
        await newtask.save();
        res.status(201).json(newtask);
    }
    catch(err){
        res.status(500).send('error');
    }

});

//read

router.get('/',async(req,res)=>{
    try{
        const task=await Task.find();
        res.json(task);
    }
    catch(err){
        res.status(500).send('error');
    }
});

//readbyid

router.get('/:id',async(req,res)=>{
    try{
        const task=await Task.findById(req.params.id);
        if(!task)
            {
                res.status(404).send('not found');
            }
            res.json(task);}
        catch(err){
                res.status(500).send('error');
            }

});

//update

router.put('/:id',async(req,res)=>{
    try{
        const{name,assigned,date,due,users}=req.body;
        const task=await Task.findByIdAndUpdate(req.params.id,{name,users,assigned,date,due},{new:true});
        if(!task)
            {
                res.status(404).send('not found');
            }
            res.json(task);}
        catch(err){
                res.status(500).send('error');
            }  
});


//delete

router.delete('/:id',async(req,res)=>{
    try{
        const task=await Task.findByIdAndDelete(req.params.id);
        if(!task)
            {   
                res.status(404).send('not found');
            }
            res.json(task);
        }
        catch(err){
            res.status(500).send('error');
        }
});

module.exports=router;