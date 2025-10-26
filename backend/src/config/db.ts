import mongoose from "mongoose";

const connectDb = async ()=>{
    try {
         if(!process.env.MONGODB_URL){
        throw new Error("Mongodb url is not defined");
    }

    const connectionInstance = await mongoose.connect(process.env.MONGODB_URL);
    console.log(`Database connected successfully || DB host :${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("Mongodb connection error",error);
        process.exit(1);
    }
}

export default connectDb



