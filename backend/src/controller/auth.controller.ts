import type { Request, Response } from "express";
import User from "../model/user.model.js";
import jwt from "jsonwebtoken";
import { SigninSchema, SignupSchema } from "../utils/auth.js";

export const signup = async (req: Request, res: Response) => {
  try {
    const parsedData = SignupSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({
        error: "Invalid input",
        details: parsedData.error,
      });
    }

    // get data from the validation object

    const {
      name,
      email,
      password,
      age,
      gender,
      genderPreference,
      bio,
      image,
      likes,
      dislikes,
    } = parsedData.data;

    // check if user already exists

    const existingUser = await User.findOne({
      $or: [{ email }, { name }],
    });

    if (existingUser) {
      return res.status(409).json({
        error: "Email or username already in use",
      });
    }

    // create the new user
    const newUser = new User({
      name,
      email,
      password,
      age,
      gender,
      genderPreference,
      bio: bio || "",
      image: image || "",
      likes: likes || [],
      dislikes: dislikes || [],
    });

    // save the user
    await newUser.save();

    // generate JWT token
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "7d" }
    );

    // set cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // respond with success
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        age: newUser.age,
        gender: newUser.gender,
        genderPreference: newUser.genderPreference,
        bio: newUser.bio,
        image: newUser.image,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};



export const signin = async (req: Request, res: Response) => {
  try {
    const parsedData = SigninSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({
        error: "Invalid input",
        details: parsedData.error,
      });
    }
    const {email,password} = parsedData.data;

    // find the user by email

    const user = await User.findOne({email});
    if(!user){
      return res.status(404).json({
        error: "Invalid credentials"
      })
    }

    // use the instance method to check the password

    const isMatch = await user.isPasswordCorrect(password);

    if(!isMatch){
      return res.status(401).json({
        error: "Invalid credentials"
      })
    }

    // generate JWT and response

    if(!process.env.JWT_SECRET){
      throw new Error("JWT_SECRET is not defined");
    }

    const token = jwt.sign({
      userId: user._id
    },process.env.JWT_SECRET, {expiresIn: "2d"})

    // set cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 2 * 24 * 60 * 60 * 1000 // 2 days
    });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      message: "Login successfully"
    })



  } catch (error) {
    console.log("Error in login ",error);
    res.status(500).json({
      error: "Internal server error"
    })
  }
};


export const logout = async(req:Request,res:Response) =>{
  res.clearCookie('jwt');
  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  })
  return;
}


export const getme = async (req: Request , res : Response) => {
    try {
        res.send({
            succes0s: true,
            user: req.user
        })
        return;
    } catch (error) {
        console.log('Error in server');
        res.send({
            success: false,
            message: "Error in server"
        })
        return;
    }
}