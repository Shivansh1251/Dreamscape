import { Router, Request, Response } from "express";
import { z } from "zod";
import { chatCompletion } from "../services/openaiClient";
import { logger } from "../logger";

const router = Router();

const PackingSchema = z.object({
    destination: z.string().min(2),
    days: z.number().int().min(1),
    season: z.string().optional(),
    activities: z.array(z.string()).optional(),
    travelStyle: z.string().optional(), // backpacker, luxury, etc.
});

router.post("/", async (req: Request, res: Response) => {
    try {
        const parsed = PackingSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.flatten() });
        }

        const { destination, days, season, activities, travelStyle } = parsed.data;

        const systemPrompt = `You are a smart travel AI. Create a highly personalized packing checklist in JSON format.
Format:
{
  "destination": string,
  "categories": [
    {
      "categoryName": string,
      "items": [
        { "name": string, "quantity": number, "reason": string }
      ]
    }
  ],
  "luggageAdvice": string
}`;

        const userPrompt = `Destination: ${destination}, Days: ${days}.
Season/Weather: ${season || "unknown"}.
Activities planned: ${activities?.join(", ") || "general sightseeing"}.
Travel style: ${travelStyle || "standard"}.
Give a comprehensive packing list with reasons for specific items.`;

        logger.info(`Generating packing checklist for ${destination}`);
        const result = await chatCompletion(systemPrompt, userPrompt, { temperature: 0.6 });
        const json = result.replace(/^```json\s*|```\s*$/g, "").trim();
        const checklist = JSON.parse(json);

        return res.json({ success: true, data: checklist });
    } catch (err: any) {
        logger.error("Packing list generation failed", { error: err.message });
        return res.status(500).json({ error: "Failed to generate packing list", details: err.message });
    }
});

export default router;
