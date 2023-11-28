const express = require("express")

const {userModel} = require("../model/user.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const userRouter = express.Router()


userRouter.post("/register", async (req,res)=>{
    try{
        const {username,email,password} = req.body
        const hashpass = await bcrypt.hash(password,8)
        const user = new userModel ({username,email,password:hashpass})
        await user.save()
        res.status(201).json({msg:"User Sucessfully registerd"})
    }
    catch(err){
        console.log(err)
        res.status(502).json({msg:"Something went wrong"})
    }
})



userRouter.post("/login",async(req,res)=>{
     try{
        const {email,password} = req.body
        const user = await userModel.findOne({email})

        if (!user){
            return res.status(501).json({msg:"Email Not Found"})
        }
        const ispass = await bcrypt.compare(password,user.password)
        if (!ispass){
            return res.status(501).json({msg:"Incorrect password"})
        }
        const token = jwt.sign({userId:user._id},process.env.key)
        res.status(201).json({msg:"Login Sucessfullyy",token:token})
     } 
     catch(err){
        console.log(err)
        res.status(502).json({msg:"something went wrong"})
     }
})




module.exports = {
    userRouter
}