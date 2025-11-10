import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParse from 'cookie-parser'


import connectDb from './config/db.js'
import authRouter from './routes/auth.router.js'
import UserRouter from './routes/user.router.js'
import MessageRouter from './routes/message.router.js'
import MatchRouter from './routes/match.router.js'

import { initializeSocket } from './socket/socket.server.js'
import { createServer } from 'http'

const app = express();

dotenv.config();
 
const httpServer = createServer(app);


const PORT = process.env.PORT || 8080
initializeSocket(httpServer);

connectDb();

app.use(express.json());
app.use(cookieParse());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use("/api/v1/auth",authRouter);
app.use("/api/v1/user",UserRouter)
app.use("/api/v1/message",MessageRouter);
app.use("/api/v1/match",MatchRouter);


// app.listen(8080,()=>{
//     console.log("Server is running on port 8080")
// })

httpServer.listen(PORT,()=>{
    console.log(`Server as started at ports ${PORT}`);
    
})
