import type { Request,Response } from "express";
import User from '../model/user.model.js'
import cloudinary from "../config/cloudinary.js";
import { getConnectedUsers, getIO } from "../socket/socket.server.js";
import { Server } from "socket.io";

interface AuthRequest extends Request {
    user?: any;
}


export const updateProfile = async(req:AuthRequest,res:Response) =>{
    try {
        const {image, ...otherData} = req.body;

        let updatedData = otherData;

        if(image){
            // base 64 format:

            if(image.startsWith("data: image")){
                try {
                   const uploadRes = await cloudinary.uploader.upload(image)
                   updatedData.image =  uploadRes.secure_url;
                } catch (error) {
                    res.status(400).json({
                        success: false,
                        message: "Error uploading Image"
                    })
                    return;
                }
            }
        }

        const updatedUser = await User.findByIdAndUpdate(req.user._id, updatedData, {new: true})
        res.status(200).json({
            success: true,
            user: updatedUser
        })

        return;

    } catch (error) {
        console.log('Error in userController', error);
        res.status(500).json({
            success: false,
            message: "Error in server"
        });
        return;
    }
}

export const getAllUsers = async (req: AuthRequest, res: Response) => {
    try {
        const currentUser = await User.findById(req.user._id);
        const users = await User.find({
            _id: { $ne: currentUser?._id }
        }).select('name email age gender bio image');

        res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        console.log('Error in getAllUsers', error);
        res.status(500).json({
            success: false,
            message: "Error fetching users"
        });
    }
}

export const sendFriendRequest = async (req: AuthRequest, res: Response) => {
    try {
        const { recipientId } = req.params;
        const currentUser = await User.findById(req.user._id);
        const recipient = await User.findById(recipientId);

        if (!recipient) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (currentUser?.sentRequests.includes(recipientId as any) ||
            currentUser?.receivedRequests.includes(recipientId as any) ||
            currentUser?.friends.includes(recipientId as any)) {
            return res.status(400).json({
                success: false,
                message: "Request already sent or already friends"
            });
        }

        currentUser?.sentRequests.push(recipientId as any);
        recipient.receivedRequests.push(currentUser?._id as any);

        await currentUser?.save();
        await recipient.save();

        // Notify recipient via socket
        const connectedUsers = getConnectedUsers();
        const io = getIO() as Server;
        const recipientSocketId = connectedUsers.get(recipientId);
        if (recipientSocketId) {
            io.to(recipientSocketId).emit('newFriendRequest', {
                _id: currentUser?._id,
                name: currentUser?.name,
                image: currentUser?.image
            });
        }

        res.status(200).json({
            success: true,
            message: "Friend request sent"
        });
    } catch (error) {
        console.log('Error in sendFriendRequest', error);
        res.status(500).json({
            success: false,
            message: "Error sending request"
        });
    }
}

export const acceptFriendRequest = async (req: AuthRequest, res: Response) => {
    try {
        const { senderId } = req.params;
        const currentUser = await User.findById(req.user._id);
        const sender = await User.findById(senderId);

        if (!sender) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (!currentUser?.receivedRequests.includes(senderId as any)) {
            return res.status(400).json({
                success: false,
                message: "No request from this user"
            });
        }

        // Remove from requests
        currentUser.receivedRequests = currentUser.receivedRequests.filter(id => id.toString() !== senderId);
        sender.sentRequests = sender.sentRequests.filter(id => id.toString() !== req.user._id.toString());

        // Add to friends
        currentUser.friends.push(senderId as any);
        sender.friends.push(currentUser._id as any);

        // Also add to matches to enable messaging
        currentUser.matches.push(senderId as any);
        sender.matches.push(currentUser._id as any);

        await currentUser.save();
        await sender.save();

        // Notify sender via socket for friend request accepted
        const connectedUsers = getConnectedUsers();
        const io = getIO() as Server;
        const senderSocketId = connectedUsers.get(senderId);
        if (senderSocketId) {
            io.to(senderSocketId).emit('friendRequestAccepted', {
                _id: currentUser._id,
                name: currentUser.name,
                image: currentUser.image
            });
            // Also emit newMatch to show match found
            io.to(senderSocketId).emit('newMatch', {
                _id: currentUser._id,
                name: currentUser.name,
                image: currentUser.image
            });
        }

        // Notify current user (acceptor) of the new match
        const currentSocketId = connectedUsers.get((currentUser._id as any).toString());
        if (currentSocketId) {
            io.to(currentSocketId).emit('newMatch', {
                _id: sender._id,
                name: sender.name,
                image: sender.image
            });
        }

        res.status(200).json({
            success: true,
            message: "Friend request accepted"
        });
    } catch (error) {
        console.log('Error in acceptFriendRequest', error);
        res.status(500).json({
            success: false,
            message: "Error accepting request"
        });
    }
}

export const getFriendRequests = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.user._id).populate('receivedRequests', 'name image');
        res.status(200).json({
            success: true,
            requests: user?.receivedRequests
        });
    } catch (error) {
        console.log('Error in getFriendRequests', error);
        res.status(500).json({
            success: false,
            message: "Error fetching requests"
        });
    }
}

export const getFriends = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.user._id).populate('friends', 'name image');
        res.status(200).json({
            success: true,
            friends: user?.friends
        });
    } catch (error) {
        console.log('Error in getFriends', error);
        res.status(500).json({
            success: false,
            message: "Error fetching friends"
        });
    }
}
