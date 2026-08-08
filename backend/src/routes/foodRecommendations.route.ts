import { Router, Request, Response } from "express";
import { z } from "zod";
import { chatCompletion } from "../services/openaiClient";
import { logger } from "../logger";

const router = Router();

const FoodSchema = z.object({
    destination: z.string().min(2),
    preferences: z.array(z.string()).optional(), // vegetarian, halal, street food
    budget: z.enum(["cheap", "moderate", "expensive"]).default("moderate")
});

router.post("/", async (req: Request, res: Response) => {
    try {
        const parsed = FoodSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.flatten() });
        }

        const { destination, preferences, budget } = parsed.data;

        const systemPrompt = `You are a culinary travel expert. Recommend local foods and experiences.
Return as JSON:
{
  "destination": string,
  "mustTryDishes": [
    { "name": string, "description": string, "dietaryNotes": string }
  ],
  "recommendedEateries": [
    { "name": string, "type": string, "specialty": string, "priceLevel": string, "whyItsGood": string }
  ],
  "foodTips": string[]
}`;

        const userPrompt = `Destination: ${destination}.
Dietary/Food Preferences: ${preferences?.join(", ") || "none"}.
Budget: ${budget}.
Recommend local delicacies and highly rated but authentic places to eat. Focus on flavor and local culture.`;

        logger.info(`Fetching food recommendations for ${destination}`);
        const result = await chatCompletion(systemPrompt, userPrompt, { temperature: 0.6 });
        const json = result.replace(/^```json\s*|```\s*$/g, "").trim();
        const recommendations = JSON.parse(json);

        return res.json({ success: true, data: recommendations });
    } catch (err: any) {
        logger.error("Food recommendation failed", { error: err.message });
        return res.status(500).json({ error: "Failed to fetch food recommendations", details: err.message });
    }
});

export default router;
