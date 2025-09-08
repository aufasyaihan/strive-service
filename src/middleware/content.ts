import type { Request, Response, NextFunction } from 'express';
import { checkMembershipLimits } from '../utils/membership';

export async function checkArticleAccess(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        if (!req.user) {
            res.status(401).json({
                meta: {
                    message: "Authentication required",
                    code: 401,
                },
            });
            return;
        }

        const membershipLimits = await checkMembershipLimits(req.user.userId);
        
        if (!membershipLimits.canAccessArticle) {
            res.status(403).json({
                meta: {
                    message: `Article limit reached for plan ${membershipLimits.currentPlan}. Upgrade your membership to access more content.`,
                    code: 403,
                },
                data: {
                    currentPlan: membershipLimits.currentPlan,
                    articlesRemaining: membershipLimits.articlesRemaining,
                },
            });
            return;
        }

        req.membershipLimits = membershipLimits;
        next();
    } catch (error) {
        console.error('Error checking article access:', error);
        res.status(500).json({
            meta: {
                message: "Internal server error",
                code: 500,
            },
        });
    }
}

export async function checkVideoAccess(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        if (!req.user) {
            res.status(401).json({
                meta: {
                    message: "Authentication required",
                    code: 401,
                },
            });
            return;
        }

        const membershipLimits = await checkMembershipLimits(req.user.userId);
        
        if (!membershipLimits.canAccessVideo) {
            res.status(403).json({
                meta: {
                    message: `Video limit reached for plan ${membershipLimits.currentPlan}. Upgrade your membership to access more content.`,
                    code: 403,
                },
                data: {
                    currentPlan: membershipLimits.currentPlan,
                    videosRemaining: membershipLimits.videosRemaining,
                },
            });
            return;
        }

        req.membershipLimits = membershipLimits;
        next();
    } catch (error) {
        console.error('Error checking video access:', error);
        res.status(500).json({
            meta: {
                message: "Internal server error",
                code: 500,
            },
        });
    }
}
