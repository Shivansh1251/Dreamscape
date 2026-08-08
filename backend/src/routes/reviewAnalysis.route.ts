import { Router, Request, Response } from "express";
import { z } from "zod";
import { chatCompletion } from "../services/openaiClient";
import { logger } from "../logger";

const router = Router();

const ReviewSchema = z.object({
    hotelName: z.string(),
    reviews: z.array(z.string()).min(1).max(20)
});

router.post("/", async (req: Request, res: Response) => {
    try {
        const parsed = ReviewSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.flatten() });
        }

        const { hotelName, reviews } = parsed.data;

        const systemPrompt = `You are an AI tasked with analyzing hotel reviews. Your job is to detect potential fake reviews and provide a sentiment summary.
Format as JSON:
{
  "hotelName": string,
  "overallSentiment": "positive" | "neutral" | "negative",
  "fakeReviewProbability": "low" | "medium" | "high",
  "suspicionReasons": string[],
  "summary": string,
  "keyPositives": string[],
  "keyNegatives": string[]
}`;

        const userPrompt = `Analyze these reviews for ${hotelName}:
${reviews.map((r, i) => `Review ${i + 1}: ${r}`).join("\n\n")}`;

        logger.info(`Analyzing reviews for ${hotelName}`);
        const result = await chatCompletion(systemPrompt, userPrompt, { temperature: 0.3 });
        const json = result.replace(/^```json\s*|```\s*$/g, "").trim();
        const analysis = JSON.parse(json);

        return res.json({ success: true, data: analysis });
    } catch (err: any) {
        logger.error("Review analysis failed", { error: err.message });
        return res.status(500).json({ error: "Failed to analyze reviews", details: err.message });
    }
});

export default router;
