import { sql } from "../config/db.js";
import AppError from "../utils/appError.js";


export async function createUser(req, res, next) {
    try {
        //user_id,username,email,password

        const { user_id, user_name, email, password } = req.body;
        
        if (!user_id || !user_name || !email || !password) {
            throw new AppError("All fields are required (user_id, user_name, email, password)", 400);
        }

        const users = await sql`
            INSERT INTO users(user_id,user_name,email,password)
            VALUES(${user_id},${user_name},${email},${password})
            RETURNING *
        `;

        res.status(201).json({
            success: true,
            data: users[0]
        });
    } catch (error) {
        next(error);
    }
};


export async function getUserByEmail(req, res, next) {
    try {
        const { email } = req.params;
        
        if (!email) {
            throw new AppError("Email is required", 400);
        }

        const users = await sql`
            SELECT * FROM users WHERE email = ${email}
        `;

        if (users.length === 0) {
            throw new AppError("User not found", 404);
        }

        res.status(200).json({
            success: true,
            data: users[0]
        });
    } catch (error) {
        next(error);
    }
};


export async function deleteUserByID(req, res, next) {
    try {
        const { user_id } = req.params;
        
        if (!user_id) {
            throw new AppError("User ID is required", 400);
        }

        const users = await sql`
            DELETE FROM users WHERE user_id = ${user_id}
            RETURNING *
        `;

        if (users.length === 0) {
            throw new AppError("User not found", 404);
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: users[0]
        });
    } catch (error) {
        next(error);
    }
};

