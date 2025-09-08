import type { Request, Response } from "express";
import prisma from "../config/db.config";
import { checkMembershipLimits, incrementUsageCount } from "../utils/membership";

export async function getAllVideos(req: Request, res: Response) {
    try {
        const videos = await prisma.video.findMany({
            select: {
                id: true,
                title: true,
                thumbnail: true,
                createdAt: true,
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
        res.json({
            meta: {
                message: "success",
                code: 200,
            },
            data: [...videos],
        });
    } catch (error) {
        console.error("Error fetching videos:", error);
        res.status(500).json({
            meta: {
                message: "error",
                code: 500,
            },
        });
    }
}

export async function getVideoById(req: Request, res: Response) {
    const { id } = req.params;
    
    if (!id) {
        return res.status(400).json({
            meta: {
                message: "Video ID is required",
                code: 400,
            },
        });
    }
    
    try {
        const video = await prisma.video.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
        
        if (!video) {
            return res.status(404).json({
                meta: {
                    message: "Video not found",
                    code: 404,
                },
            });
        }

        await incrementUsageCount(req.user!.userId, 'video');

        const updatedLimits = await checkMembershipLimits(req.user!.userId);

        res.json({
            meta: {
                message: "success",
                code: 200,
            },
            data: {
                ...video,
                membershipInfo: {
                    currentPlan: updatedLimits.currentPlan,
                    videosRemaining: updatedLimits.videosRemaining === null 
                        ? 'unlimited' 
                        : updatedLimits.videosRemaining,
                },
            },
        });
    } catch (error) {
        console.error("Error fetching video:", error);
        res.status(500).json({
            meta: {
                message: "error",
                code: 500,
            },
        });
    }
}
