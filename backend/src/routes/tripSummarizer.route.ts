import { Router, Request, Response } from "express";
import { z } from "zod";
import { chatCompletion } from "../services/openaiClient";
import { logger } from "../logger";

const router = Router();

const SummarizeSchema = z.object({
    destination: z.string().min(2),
    highlights: z.array(z.string()).min(1),
    mood: z.enum(["adventurous", "relaxing", "romantic", "fun"]).default("fun"),
    format: z.enum(["blog", "social_media", "journal"]).default("social_media")
});

router.post("/", async (req: Request, res: Response) => {
    try {
        const parsed = SummarizeSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.flatten() });
        }

        const { destination, highlights, mood, format } = parsed.data;

        const systemPrompt = `You are an expert travel writer and content creator. Summarize a user's vacation based on their highlights.
Output format should be JSON containing the text and suggested hashtags.
{
  "title": string,
  "summaryText": string,
  "hashtags": string[]
}`;

        const userPrompt = `I just returned from ${destination}. 
My trip highlights were: ${highlights.join(", ")}.
The mood of the trip was: ${mood}.
Please write a well-crafted vacation summary in a ${format} format.`;

        logger.info(`Summarizing trip to ${destination}`);
        const result = await chatCompletion(systemPrompt, userPrompt, { temperature: 0.7 });
        const json = result.replace(/^```json\s*|```\s*$/g, "").trim();
        const summary = JSON.parse(json);

        return res.json({ success: true, data: summary });
    } catch (err: any) {
        logger.error("Trip summarization failed", { error: err.message });
        return res.status(500).json({ error: "Failed to summarize trip", details: err.message });
    }
});

export default router;
