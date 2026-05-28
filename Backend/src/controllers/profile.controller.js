import User from "../models/user.models.js";
import { getPagination } from "../utils/pagination.js";

export async function getProfile(req, res){
    try {
        const user = await User.findById(req.user.id).select("-password");

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export async function getAllUsers(req, res){
    try {

        const {page, limit, skip} = getPagination(req.query);

        const totalUsers = await User.countDocuments();

        const totalPages = Math.ceil(totalUsers / limit);

        if(page > totalPages && totalUsers > 0 ){
            return res.status(400).json({
                success: false,
                message: "Page not found"
            });
        }


        const users = await User.find()
            .select("-password")
            .sort({createdAt : -1})
            .skip(skip)
            .limit(limit);

        return res.status(200).json({
            success: true,

            page,
            limit,
            totalUsers,
            totalPages,

            data: users
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
