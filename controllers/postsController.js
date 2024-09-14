import { PrismaClient } from "@prisma/client";
import fileSizeLimit from "../middleware/fileSizeLimit.js";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const storage = multer.memoryStorage();

const upload = multer({ storage });

const prisma = new PrismaClient();

export const getPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc", // Newest first
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        media: true,
        _count: {
          select: {
            likes: true,
            replies: true,
          },
        },
      },
    });

    res.json(posts);
  } catch (err) {
    console.error("Error getting posts", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createPost = [
  upload.single("image"),
  fileSizeLimit,

  async (req, res) => {
    const { content } = req.body;
    const authorId = req.user.id;

    if (!content && !req.file) {
      return res.status(400).json({ message: "Content or image required" });
    }

    let media, mediaPublicId;
    if (req.file) {
      try {
        const fileStr = `data:${
          req.file.mimetype
        };base64,${req.file.buffer.toString("base64")}`;

        const result = await cloudinary.uploader.upload(fileStr, {
          folder: "social_media",
        });

        media = result.secure_url;
        mediaPublicId = result.public_id;
      } catch (uploadError) {
        console.error("Error uploading image to Cloudinary:", uploadError);
        return res.status(500).json({ message: "Failed to upload image" });
      }
    }

    try {
      const post = await prisma.post.create({
        data: {
          content,
          media: media
            ? {
                create: {
                  url: media,
                  type: "IMAGE",
                  urlPublicId: mediaPublicId,
                },
              }
            : undefined,
          author: { connect: { id: authorId } },
        },
        include: {
          author: true,
          media: true,
        },
      });

      res.status(201).json(post);
    } catch (err) {
      console.error("Error creating post", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
];
