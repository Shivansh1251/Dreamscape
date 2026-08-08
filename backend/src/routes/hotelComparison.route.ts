import { Router, Request, Response } from "express";
import { z } from "zod";
import { chatCompletion } from "../services/openaiClient";
import { logger } from "../logger";

const router = Router();

const HotelCompareSchema = z.object({
    destination: z.string(),
    hotels: z.array(z.object({
        name: z.string(),
        price: z.string(),
        amenities: z.array(z.string()).optional()
    })).min(2).max(4),
    priorities: z.array(z.string()).optional() // e.g., ["location", "pool", "budget"]
});

router.post("/", async (req: Request, res: Response) => {
    try {
        const parsed = HotelCompareSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.flatten() });
        }

        const { destination, hotels, priorities } = parsed.data;

        const systemPrompt = `You are a professional hospitality AI. Compare given hotels based on the user's priorities and the destination context.
Choose a clear winner and explain why.
Format as JSON:
{
  "comparison": [
    { "hotel": string, "pros": string[], "cons": string[] }
  ],
  "winner": string,
  "winnerJustification": string
}`;

        const userPrompt = `Destination: ${destination}.
Hotels: ${JSON.stringify(hotels, null, 2)}.
User priorities: ${priorities?.join(", ") || "overall value"}.
Compare these hotels.`;

        logger.info(`Comparing hotels in ${destination}`);
        const result = await chatCompletion(systemPrompt, userPrompt, { temperature: 0.5 });
        const json = result.replace(/^```json\s*|```\s*$/g, "").trim();
        const comparison = JSON.parse(json);

        return res.json({ success: true, data: comparison });
    } catch (err: any) {
        logger.error("Hotel comparison failed", { error: err.message });
        return res.status(500).json({ error: "Failed to compare hotels", details: err.message });
    }
});

export default router;
