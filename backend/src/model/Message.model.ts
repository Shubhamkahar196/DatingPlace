import mongoose, { mongo } from 'mongoose'
import User from './user.model.js'

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    }
},{timestamps: true})

const Message = mongoose.model('Message', messageSchema);

export default Message;