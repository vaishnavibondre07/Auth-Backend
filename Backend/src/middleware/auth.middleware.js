import config  from "../config/config.js";
import jwt from "jsonwebtoken";
import Session from "../models/session.model.js";

export async function authMiddleware(req,res,next){
    try{

        console.log(req.cookies)

        const token = req.cookies.accessToken;
        console.log(token);
        

        if(!token){

            return res.status(401).json({
                success: false,
                message: "Access token missing"
            });

        }

        const decoded = jwt.verify(token, config.JWT_SECRET);

        const session = await Session.findById(decoded.sessionId);
        
        if(!session || session.revoked){

            res.clearCookie("accessToken")
            res.clearCookie("refreshToken")

            return res.status(401).json({
                success: false,
                message: "Invalid session"
            });
        }

        req.user = decoded;

        next();
    }  catch(error) {

        return res.status(401).json({
            success: false,
            message:"Invalid or expired token"
        });
    }
}