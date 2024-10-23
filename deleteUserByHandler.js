import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function deleteUserByHandler(handler) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        handler: handler
      },
      include: {
        posts: true,
        followers: true,
        following: true,
        likes: true,
        reposts: true,
        bookmarks: true,
        notifications: true,
        sentMessages: true,
        receivedMessages: true,
      }
    });

    if (!user) {
      console.error(`User with handler "${handler}" not found.`);
      return;
    }

    await prisma.post.deleteMany({
      where: {
        authorId: user.id,
      },
    });

    await prisma.follows.deleteMany({
      where: {
        OR: [
          { followerId: user.id },
          { followingId: user.id },
        ],
      },
    });

    await prisma.like.deleteMany({
      where: {
        userId: user.id,
      },
    });

    await prisma.repost.deleteMany({
      where: {
        userId: user.id,
      },
    });

    await prisma.bookmark.deleteMany({
      where: {
        userId: user.id,
      },
    });

    await prisma.notification.deleteMany({
      where: {
        userId: user.id,
      },
    });

    await prisma.message.deleteMany({
      where: {
        OR: [
          { senderId: user.id },
          { recipientId: user.id },
        ],
      },
    });

    await prisma.user.delete({
      where: {
        id: user.id,
      },
    });

    console.log(`User with handler "${handler}" and all related data have been deleted.`);

  } catch (error) {
    console.error("Error deleting user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Command-line argument to get the handler
const handler = process.argv[2];

if (!handler) {
  console.error("Please provide a user handler as an argument.");
  process.exit(1);
}

deleteUserByHandler(handler);
