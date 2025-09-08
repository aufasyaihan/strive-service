import type { Request, Response } from "express";
import prisma from "../config/db.config";
import { checkMembershipLimits, incrementUsageCount } from "../utils/membership";

export async function getAllArticles(req: Request, res: Response) {
    try {
        const articles = await prisma.article.findMany({
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
            data: [...articles],
        });
    } catch (error) {
        console.error("Error fetching articles:", error);
        res.status(500).json({
            meta: {
                message: "error",
                code: 500,
            },
        });
    }
}

export async function getArticleById(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            meta: {
                message: "Article ID is required",
                code: 400,
            },
        });
    }

    try {
        const article = await prisma.article.findUnique({
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
        
        if (!article) {
            return res.status(404).json({
                meta: {
                    message: "Article not found",
                    code: 404,
                },
            });
        }

        await incrementUsageCount(req.user!.userId, 'article');

        const updatedLimits = await checkMembershipLimits(req.user!.userId);

        res.json({
            meta: {
                message: "success",
                code: 200,
            },
            data: {
                ...article,
                membershipInfo: {
                    currentPlan: updatedLimits.currentPlan,
                    articlesRemaining: updatedLimits.articlesRemaining === null 
                        ? 'unlimited' 
                        : updatedLimits.articlesRemaining,
                },
            },
        });
    } catch (error) {
        console.error("Error fetching article:", error);
        res.status(500).json({
            meta: {
                message: "error",
                code: 500,
            },
        });
    }
}
