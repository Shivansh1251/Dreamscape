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
    companions: z.string().max(80).optional(),
    accommodation: z.string().max(120).optional(),
    dietaryRestrictions: z.string().max(160).optional(),
    physicalAbility: z.string().max(160).optional(),
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

        const { destination, days, budget, travelers, interests, travelStyle, startDate, companions, accommodation, dietaryRestrictions, physicalAbility } =
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
${companions ? `Travelling with: ${companions}.` : ""}
${accommodation ? `Accommodation preference: ${accommodation}.` : ""}
${startDate ? `Start date: ${startDate}.` : ""}
${dietaryRestrictions ? `Dietary requirements: ${dietaryRestrictions}.` : ""}
${physicalAbility ? `Activity considerations: ${physicalAbility}.` : ""}
Keep each day geographically coherent, include realistic travel time and costs, and include local hidden gems rather than only tourist traps.`;

        logger.info(`Generating itinerary for ${destination} (${days} days)`);
        const result = await chatCompletion(systemPrompt, userPrompt, {
            temperature: 0.7,
            maxTokens: Math.min(8000, 1800 + days * 450),
        });

        // Models occasionally wrap JSON in markdown or add a short preamble.
        const fenced = result.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
        const json = (fenced?.[1] || result).trim();
        const start = json.indexOf("{");
        const end = json.lastIndexOf("}");
        if (start < 0 || end <= start) throw new Error("AI returned an invalid itinerary format");
        const itinerary = JSON.parse(json.slice(start, end + 1));

        return res.json({ success: true, data: itinerary });
    } catch (err: any) {
        logger.error("Itinerary generation failed", { error: err.message });
        return res.status(500).json({ error: "Failed to generate itinerary", details: err.message });
    }
});

export default router;
