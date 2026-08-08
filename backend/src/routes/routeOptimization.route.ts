import { Router, Request, Response } from "express";
import { z } from "zod";
import { chatCompletion } from "../services/openaiClient";
import { logger } from "../logger";

const router = Router();

const RouteOptimizationSchema = z.object({
    startLocation: z.string(),
    waypoints: z.array(z.string()).min(2),
    modeOfTransport: z.enum(["driving", "walking", "transit", "bicycling"]).default("driving")
});

router.post("/", async (req: Request, res: Response) => {
    try {
        const parsed = RouteOptimizationSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.flatten() });
        }

        const { startLocation, waypoints, modeOfTransport } = parsed.data;

        // Note: In a real production environment, you would call the Google Maps Directions API 
        // to do the actual TSP (Traveling Salesperson) optimization. Here we use an AI approximation 
        // as a smart wrapper. 

        const systemPrompt = `You are an AI mapping expert. The user wants to visit multiple places. 
Suggest a logical order to visit these locations that minimizes travel time and prevents backtracking.
Provide JSON output:
{
  "optimizedOrder": [
    { "location": string, "rationale": string }
  ],
  "estimatedTotalTime": string,
  "transportAdvice": string
}`;

        const userPrompt = `Starting point: ${startLocation}.
Locations to visit: ${waypoints.join(", ")}.
Mode of transport: ${modeOfTransport}.
Order them logically.`;

        logger.info(`Optimizing route for ${waypoints.length} stops from ${startLocation}`);
        const result = await chatCompletion(systemPrompt, userPrompt, { temperature: 0.3 });
        const json = result.replace(/^```json\s*|```\s*$/g, "").trim();
        const optimization = JSON.parse(json);

        return res.json({ success: true, data: optimization });
    } catch (err: any) {
        logger.error("Route optimization failed", { error: err.message });
        return res.status(500).json({ error: "Failed to optimize route", details: err.message });
    }
});

export default router;
