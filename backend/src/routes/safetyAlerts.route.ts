import { Router, Request, Response } from "express";
import { z } from "zod";
import { chatCompletion } from "../services/openaiClient";
import { logger } from "../logger";

const router = Router();

const SafetySchema = z.object({
    destination: z.string().min(2),
    travelerProfile: z.string().optional() // e.g., "solo female", "family with kids"
});

router.post("/", async (req: Request, res: Response) => {
    try {
        const parsed = SafetySchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.flatten() });
        }

        const { destination, travelerProfile } = parsed.data;

        const systemPrompt = `You are a travel safety and risk assessment AI. Provide accurate, sensible safety advice for a destination.
Include areas to avoid, common scams, and general tips.
Do NOT fearmonger, just be realistic and helpful.
Format as JSON:
{
  "destination": string,
  "overallSafetyScore": number, 
  "keyRisks": [
    { "riskType": string, "description": string, "mitigation": string }
  ],
  "areasToAvoid": string[],
  "emergencyNumbers": { "police": string, "medical": string, "fire": string },
  "profileSpecificAdvice": string
}`;

        const userPrompt = `Destination: ${destination}.
Traveler Profile: ${travelerProfile || "general traveler"}.
Provide a safety assessment.`;

        logger.info(`Generating safety alerts for ${destination}`);
        const result = await chatCompletion(systemPrompt, userPrompt, { temperature: 0.4 });
        const json = result.replace(/^```json\s*|```\s*$/g, "").trim();
        const alerts = JSON.parse(json);

        return res.json({ success: true, data: alerts });
    } catch (err: any) {
        logger.error("Safety alerts failed", { error: err.message });
        return res.status(500).json({ error: "Failed to generate safety alerts", details: err.message });
    }
});

export default router;
