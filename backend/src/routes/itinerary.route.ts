import { Router, Request, Response } from "express";
import { z } from "zod";
import { chatCompletion } from "../services/openaiClient";
import { logger } from "../logger";

const router = Router();

// ─── Input schema ────────────────────────────────────────────────────────────
const ItinerarySchema = z.object({
    destination: z.string().min(2).max(100),
    days: z.number().int().min(1).max(30),
    budget: z.string().min(2).max(50),            // e.g. "₹50,000" or "$2000"
    travelers: z.number().int().min(1).max(50).default(1),
    interests: z.array(z.string()).optional(),    // ["beaches", "history", "food"]
    travelStyle: z.enum(["budget", "mid-range", "luxury"]).default("mid-range"),
    startDate: z.string().optional(),             // ISO date
});

/**
 * POST /api/ai/itinerary
 * Generates a full day-by-day AI travel itinerary
 */
router.post("/", async (req: Request, res: Response) => {
    try {
        const parsed = ItinerarySchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.flatten() });
        }

        const { destination, days, budget, travelers, interests, travelStyle, startDate } =
            parsed.data;

        const interestStr = interests?.length ? interests.join(", ") : "general sightseeing";

        const systemPrompt = `You are an expert AI travel planner for Dreamscapes. 
You create detailed, realistic, and actionable travel itineraries.
Always respond in valid JSON matching this schema:
{
  "destination": string,
  "summary": string,
  "budgetBreakdown": { "accommodation": string, "food": string, "transport": string, "activities": string, "misc": string, "total": string },
  "days": [
    {
      "day": number,
      "date": string,
      "title": string,
      "morning": { "time": string, "activity": string, "location": string, "tip": string },
      "afternoon": { "time": string, "activity": string, "location": string, "tip": string },
      "evening": { "time": string, "activity": string, "location": string, "tip": string },
      "meals": { "breakfast": string, "lunch": string, "dinner": string },
      "estimatedDayCost": string
    }
  ],
  "generalTips": string[],
  "bestTimeToVisit": string
}`;

        const userPrompt = `Plan a ${days}-day trip to ${destination} for ${travelers} traveler(s) with a total budget of ${budget}.
Travel style: ${travelStyle}. Primary interests: ${interestStr}.
${startDate ? `Start date: ${startDate}.` : ""}
Include local hidden gems, not just tourist traps.`;

        logger.info(`Generating itinerary for ${destination} (${days} days)`);
        const result = await chatCompletion(systemPrompt, userPrompt, {
            temperature: 0.7,
            maxTokens: 3000,
        });

        // Strip markdown fences if present
        const json = result.replace(/^```json\s*|```\s*$/g, "").trim();
        const itinerary = JSON.parse(json);

        return res.json({ success: true, data: itinerary });
    } catch (err: any) {
        logger.error("Itinerary generation failed", { error: err.message });
        return res.status(500).json({ error: "Failed to generate itinerary", details: err.message });
    }
});

export default router;
