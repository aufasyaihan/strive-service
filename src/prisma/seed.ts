import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const password = "12345678";
const prisma = new PrismaClient();

async function main() {
    console.log("Seeding database to match current schema...");
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const role = await prisma.role.createManyAndReturn({
        data: [{ name: "ADMIN" }, { name: "USER" }],
    });

    const membership = await prisma.membership.createManyAndReturn({
        data: [
            {
                package: "A",
            },
            {
                package: "B",
            },
            {
                package: "C",
            },
        ],
    });

    const user = await prisma.user.createManyAndReturn({
        data: [
            {
                email: "alice@example.com",
                password: hashedPassword,
                firstName: "Alice",
                lastName: "Wonderland",
                roleId: role[0]!.id,
                membershipId: membership[0]!.id,
            },
            {
                email: "bob@example.com",
                password: hashedPassword,
                firstName: "Bob",
                lastName: "Builder",
                roleId: role[1]!.id,
                membershipId: membership[1]!.id,
            },
        ],
    });

    await prisma.article.createMany({
        data: [
            {
                thumbnail: "https://picsum.photos/seed/article2/400/250",
                title: "Getting Started with Strive",
                content: "A comprehensive guide to get you started.",
                authorId: user[0]!.id,
            },
            {
                thumbnail: "https://picsum.photos/seed/article3/400/250",
                title: "Top 10 Tips for Success",
                content: "Boost your productivity with these tips.",
                authorId: user[1]!.id,
            },
            {
                thumbnail: "https://picsum.photos/seed/article4/400/250",
                title: "Understanding the Dashboard",
                content: "A deep dive into the features of your dashboard.",
                authorId: user[1]!.id,
            },
        ],
    });

    await prisma.video.createMany({
        data: [
            {
                title: "Intro Walkthrough",
                url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                description: "An introductory walkthrough of the Strive platform.",
                thumbnail: "https://picsum.photos/seed/video1/400/250",
                authorId: user[0]!.id,
            },
            {
                title: "How To Use Strive",
                url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                description: "A comprehensive guide on how to use the Strive platform.",
                thumbnail: "https://picsum.photos/seed/video2/400/250",
                authorId: user[1]!.id,
            },
        ],
    });

    console.log("Seeding complete.");
}

main()
    .catch((e) => {
        console.error("Seeding failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
