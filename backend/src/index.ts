import express from 'express'
import dotenv from 'dotenv'
import connectDb from './config/db.js'


const app = express();

dotenv.config();

connectDb();

app.use(express.json());


app.get("/",(req,res)=>{
    res.send("Hiii")
})

app.listen(8080,()=>{
    console.log("Server is running on port 8080")
})
