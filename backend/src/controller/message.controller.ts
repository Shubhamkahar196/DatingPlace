import  type {Request,Response} from 'express';
import Message from '../model/Message.model.js';
import { getConnectedUsers, getIO } from '../socket/socket.server.js';
import { Server } from 'socket.io';

interface AuthRequest extends Request {
    user?: any;
}

export const sendMessage = async(req: AuthRequest, res:Response) =>{
    try {
        
        const {content,receiverId} = req.body;

        const newMessage = await Message.create({
            sender: req?.user._id,
            receiver: receiverId,
            content
        })
        

        const io = getIO() as Server;
        const connectedUser = getConnectedUsers();
        const receiverUserSocketId = connectedUser.get(receiverId);

        if(receiverUserSocketId){
            io.to(receiverUserSocketId).emit('newMessage',{
                message: newMessage,
            });
        }
       
        res.status(200).json({
            success: true,
            message: newMessage
        })

    } catch (error) {
        console.log("Error in sending message", error);
        res.status(400).json({
            success: false,
            message: 'Internal server Error'
        })
    }
}

export const getConversation = async(req:AuthRequest,res:Response) =>{
    const {userId} = req.params;

    try {
        const message = await Message.find({
            $or: [
                {sender: req.user._id, receiver: userId},
                {sender: userId, receiver: req.user._id}
            ]
        }).sort('createdAt');

        res.status(200).json({
            success: true,
            message
        })
        return;
    } catch (error) {
        console.log('Error in getting conversation', error);
        res.status(400).json({
            success: false,
            message: 'Internal server error'
        });
    }
}