import { Router, Request, Response } from "express";
import { z } from "zod";
import { chatCompletion } from "../services/openaiClient";
import { logger } from "../logger";

const router = Router();

const CrowdSchema = z.object({
    destination: z.string().min(2),
    attractions: z.array(z.string()).min(1).max(10),
    travelDates: z.string().optional(),
});

/**
 * POST /api/ai/crowd-prediction
 * Predicts crowd levels and recommends optimal visit times
 */
router.post("/", async (req: Request, res: Response) => {
    try {
        const parsed = CrowdSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.flatten() });
        }

        const { destination, attractions, travelDates } = parsed.data;

        const systemPrompt = `You are an expert travel AI. Predict crowd levels and best visit times for attractions.
Respond in JSON:
{
  "destination": string,
  "predictions": [
    {
      "attraction": string,
      "crowdRating": "low" | "moderate" | "high" | "very high",
      "worstTime": string,
      "bestTime": string,
      "bestDay": string,
      "tip": string,
      "photoOpportunity": string
    }
  ],
  "generalAdvice": string
}`;

        const userPrompt = `Destination: ${destination}
Attractions: ${attractions.join(", ")}
${travelDates ? `Travel dates: ${travelDates}` : ""}
Predict crowd levels and give optimal visit times with reasoning.`;

        logger.info(`Crowd prediction for ${destination}`);
        const result = await chatCompletion(systemPrompt, userPrompt, { temperature: 0.5 });
        const json = result.replace(/^```json\s*|```\s*$/g, "").trim();
        const predictions = JSON.parse(json);

        return res.json({ success: true, data: predictions });
    } catch (err: any) {
        logger.error("Crowd prediction failed", { error: err.message });
        return res.status(500).json({ error: "Failed to predict crowd levels", details: err.message });
    }
});

export default router;
