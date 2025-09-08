import prisma from '../config/db.config';

export interface MembershipLimits {
    canAccessArticle: boolean;
    canAccessVideo: boolean;
    articlesRemaining: number | null; // null means unlimited
    videosRemaining: number | null; // null means unlimited
    currentPlan: string;
}

export async function checkMembershipLimits(userId: string): Promise<MembershipLimits> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            membership: true,
        },
    });

    if (!user) {
        throw new Error('User not found');
    }

    const { membership, articlesCount, videosCount } = user;
    
    console.log('User membership data:', {
        userId,
        membership: membership.package,
        articleLimit: membership.articleLimit,
        videoLimit: membership.videoLimit,
        articlesCount,
        videosCount
    });
    
    // Check article access
    const canAccessArticle = membership.articleLimit === null || articlesCount < membership.articleLimit;
    const articlesRemaining = membership.articleLimit === null 
        ? null 
        : Math.max(0, membership.articleLimit - articlesCount);

    // Check video access
    const canAccessVideo = membership.videoLimit === null || videosCount < membership.videoLimit;
    const videosRemaining = membership.videoLimit === null 
        ? null 
        : Math.max(0, membership.videoLimit - videosCount);

    return {
        canAccessArticle,
        canAccessVideo,
        articlesRemaining,
        videosRemaining,
        currentPlan: membership.package,
    };
}

export async function incrementUsageCount(userId: string, type: 'article' | 'video'): Promise<void> {
    if (type === 'article') {
        await prisma.user.update({
            where: { id: userId },
            data: {
                articlesCount: {
                    increment: 1,
                },
            },
        });
    } else if (type === 'video') {
        await prisma.user.update({
            where: { id: userId },
            data: {
                videosCount: {
                    increment: 1,
                },
            },
        });
    }
}

