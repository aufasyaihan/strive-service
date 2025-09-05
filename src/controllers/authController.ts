import type { Request, Response } from "express";
import prisma from "../config/db.config";
import bcrypt from "bcrypt";
import {
    extractTokenFromHeader,
    generateToken,
    verifyToken,
} from "../utils/jwt";

export async function register(req: Request, res: Response) {
    const { email, password, first_name, last_name } = req.body;
    if (!email || !password || !first_name || !last_name) {
        return res.status(400).json({
            message: "Email and password are required",
            code: 400,
        });
    }
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists",
                code: 400,
            });
        }
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName: first_name,
                lastName: last_name,
                role: { connect: { name: "USER" } },
            },
        });
        res.status(201).json({
            message: "User registered successfully",
            code: 201,
        });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({
            message: "Internal server error",
            code: 500,
        });
    }
}

export async function login(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required",
            code: 400,
        });
    }
    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                role: true,
            },
        });
        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password",
                code: 400,
            });
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({
                message: "Invalid email or password",
                code: 400,
            });
        }

        // Generate JWT token
        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role.name,
        });

        res.status(200).json({
            message: "Login successful",
            code: 200,
            data: {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role.name,
                },
            },
        });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({
            message: "Internal server error",
            code: 500,
        });
    }
}

export async function me(req: Request, res: Response) {
    try {
        const token = extractTokenFromHeader(req.headers.authorization);
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized",
                code: 401,
            });
        }

        const decoded = verifyToken(token);
        const userId = decoded.userId;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                code: 404,
            });
        }

        res.status(200).json({
            meta: {
                message: "Profile retrieved successfully",
                code: 200,
            },
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role.name,
                },
            },
        });
    } catch (error) {
        console.error("Error getting user profile:", error);
        res.status(500).json({
            message: "Internal server error",
            code: 500,
        });
    }
}
