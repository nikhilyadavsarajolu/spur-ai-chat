import Groq from "groq-sdk";
import type {
  ChatCompletionMessageParam,
} from "groq-sdk/resources/chat/completions";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

// Store FAQ / system prompt
const STORE_CONTEXT = `
You are a helpful customer support agent for a small e-commerce store.

Store Policies:
- Shipping: We ship worldwide. USA delivery takes 7–10 business days.
- Returns: 30-day return policy for unused items.
- Refunds: Refunds are processed within 5 business days.
- Support Hours: Mon–Fri, 9 AM – 6 PM IST.

Rules:
- Be polite and concise.
- If unsure, say you will escalate to human support.
`;

export async function generateReply(
  history: { sender: string; text: string }[],
  userMessage: string
): Promise<string> {
  try {
    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: STORE_CONTEXT,
      },
      ...history.map(
        (m): ChatCompletionMessageParam => ({
          role: m.sender === "user" ? "user" : "assistant",
          content: m.text,
        })
      ),
      {
        role: "user",
        content: userMessage,
      },
    ];

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      temperature: 0.3,
      max_tokens: 200,
    });

    return (
      response.choices[0]?.message?.content ??
      "Sorry, I couldn't generate a response."
    );
  } catch (error) {
    console.error("Groq LLM error:", error);
    return "Sorry, I'm having trouble responding right now. Please try again later.";
  }
}
