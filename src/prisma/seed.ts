import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database to match current schema...')

  // 1) Roles (unique by name)
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: { name: 'ADMIN' },
  })
  const userRole = await prisma.role.upsert({
    where: { name: 'USER' },
    update: {},
    create: { name: 'USER' },
  })
  console.log('Upserted roles:', { adminRole: adminRole.name, userRole: userRole.name })

  // 2) Users (must belong to a Role)
  const alice = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      email: 'alice@example.com',
      name: 'Alice',
      role: { connect: { id: adminRole.id } },
    },
  })
  const bob = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      email: 'bob@example.com',
      name: 'Bob',
      role: { connect: { id: userRole.id } },
    },
  })
  console.log('Upserted users:', { alice: alice.email, bob: bob.email })

  // 3) Articles (thumbnail required, content optional, author optional)
  await prisma.article.upsert({
    where: { id: 'seed-article-1' },
    update: {
      title: 'Welcome to Strive',
      content: 'Kickstarting the platform with our first article.',
      thumbnail: 'https://picsum.photos/seed/article1/400/250',
      author: { connect: { id: alice.id } },
    },
    create: {
      id: 'seed-article-1',
      title: 'Welcome to Strive',
      content: 'Kickstarting the platform with our first article.',
      thumbnail: 'https://picsum.photos/seed/article1/400/250',
      author: { connect: { id: alice.id } },
    },
  })

  await prisma.article.upsert({
    where: { id: 'seed-article-2' },
    update: {
      title: 'Productivity Tips',
      content: null,
      thumbnail: 'https://picsum.photos/seed/article2/400/250',
      author: { connect: { id: bob.id } },
    },
    create: {
      id: 'seed-article-2',
      title: 'Productivity Tips',
      content: null,
      thumbnail: 'https://picsum.photos/seed/article2/400/250',
      author: { connect: { id: bob.id } },
    },
  })

  // 4) Videos
  await prisma.video.upsert({
    where: { id: 'seed-video-1' },
    update: {
      title: 'Intro Walkthrough',
      url: 'https://www.example.com/videos/intro',
    },
    create: {
      id: 'seed-video-1',
      title: 'Intro Walkthrough',
      url: 'https://www.example.com/videos/intro',
    },
  })

  await prisma.video.upsert({
    where: { id: 'seed-video-2' },
    update: {
      title: 'How To Use Strive',
      url: 'https://www.example.com/videos/how-to',
    },
    create: {
      id: 'seed-video-2',
      title: 'How To Use Strive',
      url: 'https://www.example.com/videos/how-to',
    },
  })

  console.log('Seeding complete.')
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })