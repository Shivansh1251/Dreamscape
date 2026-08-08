import { Router, Request, Response } from "express";
import { z } from "zod";
import { chatCompletion } from "../services/openaiClient";
import { fetchWeather } from "../services/weatherService";
import { logger } from "../logger";

const router = Router();

const WeatherTripSchema = z.object({
    destination: z.string().min(2).max(100),
    existingItinerary: z.string().optional(), // optional raw itinerary text
});

/**
 * POST /api/ai/weather-trip
 * Fetches real-time weather + AI suggestions to modify the trip plan
 */
router.post("/", async (req: Request, res: Response) => {
    try {
        const parsed = WeatherTripSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.flatten() });
        }

        const { destination, existingItinerary } = parsed.data;

        // 1. Get real weather data
        let weather;
        try {
            weather = await fetchWeather(destination);
        } catch {
            // If API key missing or network error, use a fallback message
            weather = null;
        }

        const weatherContext = weather
            ? `Current weather in ${weather.city}, ${weather.country}:
- Temperature: ${weather.tempCelsius}°C (feels like ${weather.feelsLike}°C)
- Condition: ${weather.condition} — ${weather.description}
- Humidity: ${weather.humidity}%
- Wind speed: ${weather.windSpeed} m/s
- Visibility: ${weather.visibility} km`
            : `Weather data unavailable. Use general seasonal knowledge for ${destination}.`;

        const itineraryContext = existingItinerary
            ? `Existing itinerary:\n${existingItinerary}`
            : "No specific itinerary provided.";

        const systemPrompt = `You are an AI travel assistant for Dreamscapes. 
Based on the current weather, suggest smart modifications to the trip plan.
Respond in JSON:
{
  "weatherSummary": string,
  "weatherScore": number (1-10, 10 = perfect weather),
  "alert": string | null,
  "modifications": [
    { "type": "reschedule" | "cancel" | "add" | "wear", "activity": string, "reason": string, "suggestion": string }
  ],
  "clothingRecommendations": string[],
  "packingAdditions": string[]
}`;

        const userPrompt = `${weatherContext}\n\n${itineraryContext}\n\nGive weather-aware travel modifications and alerts.`;

        logger.info(`Weather-aware trip modifications for ${destination}`);
        const result = await chatCompletion(systemPrompt, userPrompt, { temperature: 0.4 });
        const json = result.replace(/^```json\s*|```\s*$/g, "").trim();
        const modifications = JSON.parse(json);

        return res.json({
            success: true,
            data: { weather, modifications },
        });
    } catch (err: any) {
        logger.error("Weather trip modification failed", { error: err.message });
        return res.status(500).json({ error: "Failed to generate weather-aware suggestions", details: err.message });
    }
});

export default router;
