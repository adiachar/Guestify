import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authorizeUser = (req, res, next) => {

    try {
        if(req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            const user = jwt.verify(token, process.env.SECRET);
            req.user = user;
            req.token = token;
            next();

        } else {
            console.log(req.headers);
            return res.status(404).json({message: "No Auth Header!"});
        }

    } catch(err) {
        return res.status(404).json({message: "Not Authorized!"});
    }
}