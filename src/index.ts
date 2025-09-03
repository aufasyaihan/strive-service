import { PrismaClient } from '@prisma/client'
import express from 'express'

const prisma = new PrismaClient()
const app = express();
app.use(express.json());
const port = 3000;


app.get("/", (req, res) => res.send("Hello World!"));

app.get('/feed', async (req, res) => {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: true },
  })
  res.json(posts)
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
