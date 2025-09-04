import type { Request, Response } from 'express';
import prisma from "../config/db.config";

export async function getAllVideos(req: Request, res: Response) {
    try {
        const videos = await prisma.video.findMany();
        res.json({
            meta: {
                message: "success",
                code: 200,
            },
            videos,
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