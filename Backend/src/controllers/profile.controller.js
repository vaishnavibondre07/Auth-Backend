import User from "../models/user.models.js";
import { getPagination } from "../utils/pagination.js";
import File from "../models/file.model.js";

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

export async function getUserFilesByAdmin(req, res){
    try {

        console.log("Admin fetching files for user ID:", req.params.id);
        const userId = req.params.id;
        console.log("Fetching files for user ID:", userId);

        const files = await File.find({
              uploadedBy: userId,
        }).sort({ createdAt: -1 });

        console.log(`Found ${files.length} files for user ID ${userId}`);

        return res.status(200).json({
            success: true,
            data: {
                success: true,
                count: files.length,
                files,
            }
        });

    } catch (error) {
        console.log("Get User Files By Admin Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}