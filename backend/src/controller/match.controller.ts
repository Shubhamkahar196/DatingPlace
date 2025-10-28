import type { Request, Response } from "express";
import User from "../model/user.model.js";
import { getConnectedUsers, getIO } from "../socket/socket.server.js";
import { Server } from "socket.io";



export const swipeLeft = async (req: Request, res: Response) => {
    try {
        const {disLikeUserId} = req.params;

        const currentUser = await User.findById(req?.user.id);

        
        if(!currentUser?.dislikes.includes(Object(disLikeUserId))){
            currentUser?.dislikes.push(Object(disLikeUserId));
            await currentUser?.save();
        }

        res.status(200).json({
            success: true,
            user: currentUser
        });
        return;
    } catch (error) {
        console.log('Error in swipe left', error);
        res.status(400).json({
            success: false,
            message: 'Internal server error'
        })
        
    }
}

export const swipeRight = async (req: Request, res: Response) => {
    try {
        const {likeUserId} = req.params;
        const currentUser = await User.findById(req?.user.id);

        const likedUser = await User.findById(Object(likeUserId));

        if(!likedUser){
            res.status(400).json({
                success: true,
                message: 'User not found'
            });
            return;
        }

        if(!currentUser?.likes.includes(Object(likeUserId))){
            currentUser?.likes.push(Object(likeUserId));
            await currentUser?.save();

            if(likedUser?.likes.includes(currentUser?.id)){
                currentUser?.matches.push(likedUser.id);
                likedUser.matches.push(currentUser?.id)

                Promise.all([
                    await currentUser?.save(),
                    await likedUser?.save()
                ]);

                const connectedUsers = getConnectedUsers();

                const io = getIO() as Server;
                const likedUserSocketId = connectedUsers.get(likeUserId)
                if(likedUserSocketId) {
                    io.to(likedUserSocketId).emit('newMatch', {
                        _id: currentUser?._id,
                        name: currentUser?.name,
                        Image: currentUser?.image
                    })
                }
                //    @ts-ignore
                const currentSocketId = connectedUsers.get(currentUser?._id.toString());
                if(currentSocketId){
                    io.to(currentSocketId).emit('newMatch', {
                        _id: likedUser._id,
                        name: likedUser.name,
                        image: likedUser.image
                    })
                }
            }
        }

        res.status(200).json({
            success: true,
            user: currentUser
        });
        return;

    } catch (error) {
        console.log('Error in  swipeRight', error);
        res.status(400).json({
            success: false,
            message: "Internal server Error"
        })
        
    }
}

export const getMatches = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.user._id).populate('matches', 'name image')

        res.status(200).json({
            success: true,
            matches: user?.matches
        });
        return;
    } catch (error) {
        console.log('Error in matchController', error);
        
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

export const getUserProfiles = async (req: Request, res: Response) => {
    try {
        const currentUser = await User.findById(req.user._id);
        // Not Show -> currentUser, leftSwipt, rightSwipte, alreadyMatches, preference diffe

        const users = await User.find({
            $and: [
                {_id: {$ne: currentUser?.id}},
                {_id: {$nin: currentUser?.likes}},
                {_id: {$nin: currentUser?.dislikes}},
                {_id: {$nin: currentUser?.matches}},
                {
                    //TODO:check types later
                    //@ts-ignore
                    gender: currentUser?.genderPreference === 'both' ? { $in: ['male', 'female']} : currentUser?.genderPreference
                },
                {genderPreference: { $in: [currentUser?.gender, 'both']}}
            ]
        });

        res.status(200).json({
            success: true,
            users
        })
    } catch (error) {
        console.log('Error while getting the matches result', error);
        res.status(400).json({
            success: false,
            message: 'Internal server Error'
        })
        
    }
}