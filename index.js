const express = require("express")
const { connection } = require("./config/db")
const { userRouter } = require("./routes/user.routes")
const { movieRouter } = require("./routes/movie.route")
const { reviewRouter } = require("./routes/review.route")
require("dotenv").config()

const app = express()
app.use(express.json())


app.use("/api",userRouter)
app.use("/api",movieRouter)
app.use("/api",reviewRouter)

app.get("/",(req,res)=>{
    res.send("Masai Movies")
})


app.listen(process.env.PORT,async()=>{
    try{
     await connection
     console.log("CONNECTED TO THE DB")
    }
    catch(err){
        console.log("NOT CONNECTED TO THE DB")
    }
    
    console.log(`port is running at the ${process.env.PORT}`)
})