import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function deleteAllPosts() {
  const handler = process.argv[2];

  if (!handler) {
    console.error("Please provide a handler. Usage: node script.js @username");
    process.exit(1);
  }

  try {
    const result = await prisma.post.deleteMany({
      where: {
        author: {
          handler: handler,
        },
      },
    });

    console.log(`Deleted ${result.count} posts from ${handler}`);
    await prisma.$disconnect();
  } catch (error) {
    console.error("Error:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

deleteAllPosts();
