import type { Request, Response } from "express";
import prisma from "../config/db.config";
import bcrypt from "bcrypt";
import {
    extractTokenFromHeader,
    generateToken,
    verifyToken,
} from "../utils/jwt";
import { checkMembershipLimits } from "../utils/membership";

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
                membership: { connect: { package: "A" } },
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
                meta: {
                    message: "Invalid email or password",
                    code: 400,
                },
            });
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({
                meta: {
                    message: "Invalid email or password",
                    code: 400,
                },
            });
        }

        // Generate JWT token
        const access_token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role.name,
        });

        res.status(200).json({
            meta: {
                message: "Login successful",
                code: 200,
            },
            data: {
                access_token,
            },
        });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({
            meta: {
                message: "Internal server error",
                code: 500,
            },
        });
    }
}

export async function me(req: Request, res: Response) {
    try {
        const token = extractTokenFromHeader(req.headers.authorization);
        if (!token) {
            return res.status(401).json({
                meta: {
                    message: "Unauthorized",
                    code: 401,
                },
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
                articlesCount: true,
                videosCount: true,
                role: {
                    select: {
                        name: true,
                    },
                },
                membership: {
                    select: {
                        package: true,
                    },
                },
            },
        });

        if (!user) {
            return res.status(404).json({
                meta: {
                    message: "User not found",
                    code: 404,
                },
            });
        }

        res.status(200).json({
            meta: {
                message: "Profile retrieved successfully",
                code: 200,
            },
            data: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role.name,
                membership: user.membership.package,
                articlesCount: user.articlesCount,
                videosCount: user.videosCount,
            },
        });
    } catch (error) {
        console.error("Error getting user profile:", error);
        res.status(500).json({
            meta: {
                message: "Internal server error",
                code: 500,
            },
        });
    }
}

export async function getMembershipInfo(req: Request, res: Response) {
    if (!req.user) {
        return res.status(401).json({
            meta: {
                message: "Authentication required",
                code: 401,
            },
        });
    }

    try {
        const membershipLimits = await checkMembershipLimits(req.user.userId);
        
        res.status(200).json({
            meta: {
                message: "Membership info retrieved successfully",
                code: 200,
            },
            data: membershipLimits,
        });
    } catch (error) {
        console.error("Error getting membership info:", error);
        res.status(500).json({
            meta: {
                message: "Internal server error",
                code: 500,
            },
        });
    }
}

export async function updateMembership(req: Request, res: Response) {
    if (!req.user) {
        return res.status(401).json({
            meta: {
                message: "Authentication required",
                code: 401,
            },
        });
    }

    const { membershipPackage } = req.body;

    if (!membershipPackage) {
        return res.status(400).json({
            meta: {
                message: "Membership package is required",
                code: 400,
            },
        });
    }

    const validPackages = ["A", "B", "C"];
    if (!validPackages.includes(membershipPackage)) {
        return res.status(400).json({
            meta: {
                message: "Invalid membership package. Valid packages are: A, B, C",
                code: 400,
            },
        });
    }

    try {
        const membership = await prisma.membership.findUnique({
            where: { package: membershipPackage },
        });

        if (!membership) {
            return res.status(404).json({
                meta: {
                    message: "Membership package not found",
                    code: 404,
                },
            });
        }

        const updatedUser = await prisma.user.update({
            where: { id: req.user.userId },
            data: {
                membershipId: membership.id,
                articlesCount: 0,
                videosCount: 0,
            },
            include: {
                membership: true,
                role: true,
            },
        });

        res.status(200).json({
            meta: {
                message: "Membership updated successfully",
                code: 200,
            },
            data: {
                id: updatedUser.id,
                email: updatedUser.email,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                role: updatedUser.role.name,
                membership: updatedUser.membership.package,
                articlesCount: updatedUser.articlesCount,
                videosCount: updatedUser.videosCount,
            },
        });
    } catch (error) {
        console.error("Error updating membership:", error);
        res.status(500).json({
            meta: {
                message: "Internal server error",
                code: 500,
            },
        });
    }
}

