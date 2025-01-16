import { PrismaClient, MediaType } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function generatePostContent() {
  const contentTypes = [
    // Tech Achievements & Projects
    () =>
      `${faker.helpers.arrayElement([
        "Just launched",
        "Excited to share",
        "Finally completed",
        "New milestone:",
      ])} ${faker.helpers.arrayElement([
        "my latest full-stack project using React and Node.js",
        "a complete UI/UX overhaul using Tailwind CSS",
        "a real-time data processing pipeline",
        "a mobile-first responsive dashboard",
      ])} ${faker.helpers.arrayElement(["🚀", "💻", "⚡"])}`,

    // Professional Learning
    () =>
      `${faker.helpers.arrayElement([
        "Deep diving into",
        "Learning about",
        "Exploring",
      ])} ${faker.helpers.arrayElement([
        "system design patterns for scalable applications",
        "advanced TypeScript features and best practices",
        "cloud-native architecture principles",
        "React performance optimization strategies",
      ])} 📚`,

    // Tech Insights
    () =>
      `${faker.helpers.arrayElement([
        "Pro tip:",
        "Key learning:",
        "Tech insight:",
      ])} ${faker.helpers.arrayElement([
        "Always write tests for your critical business logic",
        "Use TypeScript for better code maintainability",
        "Cache expensive operations whenever possible",
        "Document your code as you write it",
      ])} 💡`,
  ];

  return faker.helpers.arrayElement(contentTypes)();
}

async function main() {
  const users = [];
  const numUsers = 12; // Reduced number of users

  const companies = [
    "Google",
    "Microsoft",
    "Amazon",
    "Meta",
    "Netflix",
    "Uber",
    "Airbnb",
    "Twitter",
    "LinkedIn",
    "Stripe",
  ];

  // Create users
  for (let i = 0; i < numUsers; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const username = `${firstName} ${lastName}`;
    const handler = faker.internet
      .username({ firstName, lastName })
      .toLowerCase();
    const company = faker.helpers.arrayElement(companies);

    const titles = [
      "Senior Software Engineer",
      "Full Stack Developer",
      "Software Architect",
      "Frontend Engineer",
      "Backend Engineer",
    ];
    const title = faker.helpers.arrayElement(titles);

    const skills = ["React", "Node.js", "TypeScript", "AWS", "Docker"];
    const randomSkills = faker.helpers.arrayElements(skills, 3).join(" • ");

    const user = await prisma.user.create({
      data: {
        email: faker.internet.email({ firstName, lastName }),
        username,
        handler,
        password: await bcrypt.hash("password123", 10),
        about: `${title} @${company} | ${randomSkills} | Building scalable solutions`,
        avatar: `https://picsum.photos/seed/${handler}/300/300`,
        banner: `https://picsum.photos/seed/${handler}-banner/1500/500`,
        createdAt: faker.date.past(),
      },
    });
    users.push(user);
  }

  // Create follows
  for (const user of users) {
    const numFollows = faker.number.int({ min: 3, max: 8 });
    const followingUsers = faker.helpers.arrayElements(
      users.filter((u) => u.id !== user.id),
      numFollows,
    );

    for (const followingUser of followingUsers) {
      await prisma.follows.create({
        data: {
          followerId: user.id,
          followingId: followingUser.id,
        },
      });
    }
  }

  // Create posts
  for (const user of users) {
    const numPosts = faker.number.int({ min: 3, max: 6 }); // Reduced posts per user

    for (let i = 0; i < numPosts; i++) {
      const hasMedia = faker.datatype.boolean(0.3); // 30% chance of having media

      const post = await prisma.post.create({
        data: {
          content: generatePostContent(),
          authorId: user.id,
          createdAt: faker.date.recent({ days: 14 }), // Posts from last 14 days only
        },
      });

      if (hasMedia) {
        // Only create 1 media per post maximum
        await prisma.media.create({
          data: {
            url: `https://picsum.photos/seed/${post.id}/800/600`,
            type: MediaType.IMAGE,
            postId: post.id,
            urlPublicId: faker.string.uuid(),
          },
        });
      }

      // Add some likes
      const numLikes = faker.number.int({ min: 0, max: 5 });
      const likingUsers = faker.helpers.arrayElements(
        users.filter((u) => u.id !== user.id),
        numLikes,
      );

      for (const likingUser of likingUsers) {
        await prisma.like.create({
          data: {
            userId: likingUser.id,
            postId: post.id,
          },
        });
      }

      // Add max 1 reply per post
      if (faker.datatype.boolean(0.3)) {
        // 30% chance of reply
        const replyingUser = faker.helpers.arrayElement(users);
        await prisma.post.create({
          data: {
            content: faker.helpers.arrayElement([
              "Great insight! Would love to collaborate 🤝",
              "This is exactly what we need in the industry 💡",
              "Clean implementation! Looking forward to more 👏",
            ]),
            authorId: replyingUser.id,
            parentId: post.id,
            createdAt: faker.date.recent({ days: 14 }),
          },
        });
      }
    }
  }

  // Create some reposts (fewer)
  for (const user of users) {
    const posts = await prisma.post.findMany({
      where: {
        authorId: { not: user.id },
      },
      take: 2,
    });

    for (const post of posts) {
      if (faker.datatype.boolean(0.2)) {
        // 20% chance to repost
        await prisma.repost.create({
          data: {
            userId: user.id,
            postId: post.id,
          },
        });
      }
    }
  }

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
