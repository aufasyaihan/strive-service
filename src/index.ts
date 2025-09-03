import "dotenv/config";
import express from "express";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(withAccelerate());
const app = express();
app.use(express.json());
const port = 3000;

app.get("/", (req, res) => res.send("Hello World!"));

app.get("/feed", async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            where: { published: true },
            include: { author: true },
        });
        res.json({
            meta: {
                message: "success",
                code: 200,
            },
            postingan: posts,
        });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({
            meta: {
                message: "error",
                code: 500,
            },
            postingan: [],
        });
    }
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
