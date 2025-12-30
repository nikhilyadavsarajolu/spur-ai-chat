import { Router, Request, Response } from "express";
import { prisma } from "../db/prisma";
import cuid from "cuid";
import { generateReply } from "../services/llm.service";

const router = Router();

router.post("/message", async (req: Request, res: Response) => {
  try {
    const { message, sessionId } = req.body;

    // 1. Validate input
    if (!message || typeof message !== "string" || message.trim() === "") {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    const trimmedMessage = message.trim().slice(0, 1000);

    // 2. Get or create conversation
    let conversationId = sessionId;

    if (!conversationId) {
      const conversation = await prisma.conversation.create({
        data: {
          id: cuid(),
        },
      });
      conversationId = conversation.id;
    }

    // 3. Save user message
    await prisma.message.create({
      data: {
        conversationId,
        sender: "user",
        text: trimmedMessage,
      },
    });

    // 4. Fetch recent conservation history
    const history = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      take: 10,
    });

    // 5. Save AI message
    const aiReply = await generateReply(
      history.map((m) => ({
        sender: m.sender,
        text: m.text,
      })),
      trimmedMessage
    );

    // 6. Return response
    return res.json({
      reply: aiReply,
      sessionId: conversationId,
    });
  } catch (error) {
    console.error("Chat error:", error);
    return res.status(500).json({
      error: "Something went wrong. Please try again.",
    });
  }
});

export default router;
