import { Router, Request, Response } from "express";
import { z } from "zod";
import { chatCompletion } from "../services/openaiClient";
import { logger } from "../logger";

const router = Router();

const PhotoSpotsSchema = z.object({
    destination: z.string().min(2),
    vibe: z.string().optional() // e.g. "nature", "architecture", "street"
});

router.post("/", async (req: Request, res: Response) => {
    try {
        const parsed = PhotoSpotsSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.flatten() });
        }

        const { destination, vibe } = parsed.data;

        const systemPrompt = `You are a travel photography AI assistant. Recommend the best photo spots in a destination.
Provide a JSON response:
{
  "destination": string,
  "topSpots": [
    {
      "locationName": string,
      "bestTimeToShoot": string,
      "compositionTip": string,
      "crowdLevel": string
    }
  ],
  "gearSuggestions": string[]
}`;

        const userPrompt = `Destination: ${destination}.
Preferred vibe: ${vibe || "mixed"}.
Recommend highly aesthetic spots for photography, including both famous landmarks and hidden alleys. Give advice on lighting and angles.`;

        logger.info(`Fetching photo spots for ${destination}`);
        const result = await chatCompletion(systemPrompt, userPrompt, { temperature: 0.6 });
        const json = result.replace(/^```json\s*|```\s*$/g, "").trim();
        const spots = JSON.parse(json);

        return res.json({ success: true, data: spots });
    } catch (err: any) {
        logger.error("Photo spots generation failed", { error: err.message });
        return res.status(500).json({ error: "Failed to fetch photo spots", details: err.message });
    }
});

export default router;
