import mongoose from "mongoose";
import bcrypt from "bcryptjs";

interface IUser extends mongoose.Document {
    name: string;
    email: string;
    password: string;
    age: number;
    gender: 'male' | 'Female';
    genderPreference: 'male' | 'female';
    bio: string;
    image: string;
    likes: mongoose.Types.ObjectId[];
    dislikes: mongoose.Types.ObjectId[];
    matches: mongoose.Types.ObjectId[];
    isPasswordCorrect(password: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: true,
    },
    email:{
        type:String,
        required: true,
        unique: true,
    },
    password: {
        type:String,
        required: true,
    },
    age: {
        type:Number,
        required: true,
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female']
    },
    genderPreference: {
        type:String,
        required: true,
        enum: ['male','female','both']
    },
    bio : {
        type: String,
        default: ""
    },
    image: {
        type:String,
        default: ""
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    dislikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    matches: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]   
},{timestamps: true})


userSchema.pre('save',async function(next){
 
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password,10)
    next();
})

userSchema.methods.isPasswordCorrect = async function(password: string){
    return await bcrypt.compare(password,this.password)
}

const User = mongoose.model("User",userSchema);

export default User;