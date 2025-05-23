import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/user.js";
import dotenv from "dotenv";

dotenv.config();

export const signIn = async (req, res) => {
    const {email, password} = req.body;
    console.log("hello");
    try{ 
        let user = await User.findOne({email: email}).lean();
        
        if(!user) {
            return res.status(404).json({message: "User not found!"});
        } 
        
        let isPassword = await bcrypt.compare(password, user.password);

        if(!isPassword) {
            return res.status(404).json({message: "Incorrect Password!"});
        }

        delete user.password;

        let token = jwt.sign(user, process.env.SECRET, {expiresIn: '1h'});

        return res.status(200).json({user: user, token: token});
        
    } catch(err) {
        console.log(err);
        return res.status(500).json({message: "Internal Server Error!"});
    }
    
}

export const signUp = async (req, res) => {
    if(!req.body) {
        return res.status(404).json({message: "No request object!"});
    }

    try {
        req.body.password = await bcrypt.hash(req.body.password, 10);
        
        let newUser = new User(req.body);

        await newUser.save();

        let user = newUser.toObject();

        delete user.password;

        let token = jwt.sign(user, process.env.SECRET, {expiresIn: '1h'});

        return res.status(200).json({user: user, token: token});

    } catch(err) {
        return res.status(500).json({message: "Internal Server Error!"});
    }
}

export const authorize = async (req, res) => {
    try {
        let user = await User.findById(req.user._id).lean();

        if(!user) {
            return res.status(404).json({message: "User Not Found!"});
        }

        delete user.password;

        return res.status(200).json({user: user});

    } catch(err) {
        return res.status(500).json({message: "Internal Server Error!"});
    }
}