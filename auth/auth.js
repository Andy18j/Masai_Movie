const jwt = require("jsonwebtoken")
require("dotenv").config()


module.exports = (req,res,next)=>{
    const token = req.header("token")
    
    if (!token){
        return res.status(401).json({msg:"authorization denied"})
      
    }
    try{
             const decoded = jwt.verify(token,process.env.key)
             req.userId = decoded.userId
             next()
    }
    catch(err){
        console.log(err)
        res.status(501).json({msg:"token is not valid"})
    }
}