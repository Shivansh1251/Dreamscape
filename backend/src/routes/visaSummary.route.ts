import { Router, Request, Response } from "express";
import { z } from "zod";
import { chatCompletion } from "../services/openaiClient";
import { logger } from "../logger";

const router = Router();

const VisaSchema = z.object({
    nationality: z.string().min(2),
    destination: z.string().min(2),
    purposeOfVisit: z.string().default("tourism"),
});

router.post("/", async (req: Request, res: Response) => {
    try {
        const parsed = VisaSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.flatten() });
        }

        const { nationality, destination, purposeOfVisit } = parsed.data;

        const systemPrompt = `You are a travel visa assistant. Provide visa and entry requirement information based on the passport nationality and destination.
IMPORTANT: State that this is AI-generated guidance and users should verify with official embassies.
Format as JSON:
{
  "status": "visa-free" | "eVisa" | "visa-on-arrival" | "visa-required",
  "allowedStay": string,
  "estimatedCost": string,
  "requirements": string[],
  "processSteps": string[],
  "disclaimer": string
}`;

        const userPrompt = `I hold a ${nationality} passport and want to travel to ${destination} for ${purposeOfVisit}. What are the visa requirements?`;

        logger.info(`Generating visa summary: ${nationality} to ${destination}`);
        const result = await chatCompletion(systemPrompt, userPrompt, { temperature: 0.2 });
        const json = result.replace(/^```json\s*|```\s*$/g, "").trim();
        const summary = JSON.parse(json);

        return res.json({ success: true, data: summary });
    } catch (err: any) {
        logger.error("Visa summary failed", { error: err.message });
        return res.status(500).json({ error: "Failed to fetch visa requirements", details: err.message });
    }
});

export default router;
