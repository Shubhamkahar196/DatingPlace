import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParse from 'cookie-parser'


import connectDb from './config/db.js'
import authRouter from './routes/auth.router.js'
import UserRouter from './routes/user.router.js'
import MessageRouter from './routes/message.router.js'


import { initializeSocket } from './socket/socket.server.js'

const app = express();

dotenv.config();

connectDb();

app.use(express.json());

app.use("/api/v1/auth",authRouter);
app.use("/api/v1/user",UserRouter)
app.use("/api/v1/message",MessageRouter);



app.listen(8080,()=>{
    console.log("Server is running on port 8080")
})
