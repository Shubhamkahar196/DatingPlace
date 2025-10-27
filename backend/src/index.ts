import express from 'express'
import dotenv from 'dotenv'
import connectDb from './config/db.js'
import authRouter from './routes/auth.router.js'

const app = express();

dotenv.config();

connectDb();

app.use(express.json());

app.use("/api/v1/auth",authRouter);

app.get("/",(req,res)=>{
    res.send("Hiii")
})

app.listen(8080,()=>{
    console.log("Server is running on port 8080")
})
