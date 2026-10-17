import OpenAI from "openai";
import { config } from "../config";
import { logger } from "../logger";

let _client: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
    if (!config.openai.apiKey || config.openai.apiKey === "your_openai_api_key_here") {
        logger.warn("OPENAI_API_KEY is not set. Using MOCK mode for demonstrations.");
        return {} as OpenAI; // Mock client
    }
    if (!_client) {
        _client = new OpenAI({
            apiKey: config.openai.apiKey,
            timeout: config.openai.timeout,
        });
        logger.debug("OpenAI client initialised");
    }
    return _client;
}

function getMockResponse(systemPrompt: string, userPrompt = ""): string {
    if (systemPrompt.includes("budgetBreakdown")) {
        const destination = userPrompt.match(/trip to (.+?) for \d+ traveler/i)?.[1]?.trim() || "Mock City";
        const requestedDays = Math.min(Math.max(Number(userPrompt.match(/Plan a (\d+)-day trip/i)?.[1] || 1), 1), 30);
        if (requestedDays > 1) {
            const days = Array.from({ length: requestedDays }, (_, index) => ({
                day: index + 1,
                date: new Date(Date.now() + index * 86400000).toISOString().slice(0, 10),
                title: index === 0 ? "Arrive and get oriented" : index === requestedDays - 1 ? "A gentle final day" : "Local highlights and hidden corners",
                morning: { time: "9:00 AM", activity: "Start with a relaxed local breakfast", location: `${destination} old quarter`, tip: "Ask a local for a favourite nearby spot." },
                afternoon: { time: "2:00 PM", activity: "Explore a signature neighbourhood and one hidden gem", location: `${destination} city centre`, tip: "Leave buffer time between stops." },
                evening: { time: "7:00 PM", activity: "Watch the sunset, then enjoy regional dinner", location: `${destination} main square`, tip: "Reserve popular restaurants ahead." },
                meals: { breakfast: "Local cafe", lunch: "Market or casual bistro", dinner: "Regional restaurant" },
                estimatedDayCost: "₹2,000",
            }));
            return JSON.stringify({
                destination,
                summary: `A balanced ${requestedDays}-day plan for ${destination}, with room for local food, memorable sights and unhurried exploration.`,
                budgetBreakdown: { accommodation: "₹10,000", food: "₹5,000", transport: "₹2,000", activities: "₹3,000", misc: "₹1,000", total: "₹21,000" },
                days,
                generalTips: ["Book key experiences in advance", "Carry a small amount of local cash", "Keep one flexible block each day"],
                bestTimeToVisit: "October to March",
            });
        }
        return JSON.stringify({
            destination,
            summary: "A beautiful mock journey.",
            budgetBreakdown: { accommodation: "₹10,000", food: "₹5,000", transport: "₹2,000", activities: "₹3,000", misc: "₹1,000", total: "₹21,000" },
            days: [{ day: 1, date: "2026-08-01", title: "Arrival", morning: { time: "10AM", activity: "Check in", location: "Hotel", tip: "Relax" }, afternoon: { time: "2PM", activity: "Walk", location: "Park", tip: "Take water" }, evening: { time: "7PM", activity: "Dinner", location: "Cafe", tip: "Try local food" }, meals: { breakfast: "-", lunch: "Cafe", dinner: "Restaurant" }, estimatedDayCost: "₹2000" }],
            generalTips: ["Book in advance", "Carry cash"],
            bestTimeToVisit: "October to March"
        });
    } else if (systemPrompt.includes("weatherSummary")) {
        return JSON.stringify({
            weatherSummary: "Sunny and clear.",
            weatherScore: 9,
            alert: null,
            modifications: [{ type: "wear", activity: "All day", reason: "Sun is strong", suggestion: "Wear sunscreen and sunglasses" }],
            clothingRecommendations: ["Light clothing", "Hat"],
            packingAdditions: ["Sunscreen", "Water bottle"]
        });
    } else if (systemPrompt.includes("predictions")) {
        return JSON.stringify({
            destination: "Mock Destination",
            predictions: [{ attraction: "Main Square", crowdRating: "high", worstTime: "2 PM", bestTime: "7 AM", bestDay: "Tuesday", tip: "Go early to beat crowds.", photoOpportunity: "Sunrise lighting is best." }],
            generalAdvice: "Avoid weekends for major tourist spots."
        });
    } else if (systemPrompt.includes("packing checklist")) {
        return JSON.stringify({
            destination: "Mock Destination",
            categories: [{ categoryName: "Clothing", items: [{ name: "T-Shirts", quantity: 3, reason: "For daily wear" }] }],
            luggageAdvice: "Travel light with a backpack."
        });
    } else if (systemPrompt.includes("visa assistant")) {
        return JSON.stringify({
            status: "visa-free",
            allowedStay: "90 days",
            estimatedCost: "Free",
            requirements: ["Valid passport for 6 months"],
            processSteps: ["Book flight", "Pack bags", "Arrive"],
            disclaimer: "This is a mocked AI response."
        });
    } else if (systemPrompt.includes("expense splitter")) {
        return JSON.stringify({
            totalSpent: 1000,
            perPersonAverage: 333.33,
            balances: { "Alice": 100, "Bob": -50, "Charlie": -50 },
            settlementTransactions: [{ from: "Bob", to: "Alice", amount: 50 }, { from: "Charlie", to: "Alice", amount: 50 }],
            summary: "Bob and Charlie each owe Alice 50."
        });
    } else if (systemPrompt.includes("culinary travel expert")) {
        return JSON.stringify({
            destination: "Mock Destination",
            mustTryDishes: [{ name: "Mock Pie", description: "Delicious local pie", dietaryNotes: "Contains gluten" }],
            recommendedEateries: [{ name: "Joe's Cafe", type: "Cafe", specialty: "Coffee", priceLevel: "$", whyItsGood: "Great atmosphere." }],
            foodTips: ["Eat where the locals eat."]
        });
    } else if (systemPrompt.includes("photography AI")) {
        return JSON.stringify({
            destination: "Mock Destination",
            topSpots: [{ locationName: "The Grand Outlook", bestTimeToShoot: "Golden Hour", compositionTip: "Use leading lines", crowdLevel: "Medium" }],
            gearSuggestions: ["Wide angle lens", "Tripod"]
        });
    } else if (systemPrompt.includes("summarize a user's vacation")) {
        return JSON.stringify({
            title: "My Amazing Trip!",
            summaryText: "We had a blast visiting all the cool spots.",
            hashtags: ["#travel", "#vacation", "#mocktrip"]
        });
    } else if (systemPrompt.includes("mapping expert")) {
        return JSON.stringify({
            optimizedOrder: [{ location: "Point A", rationale: "Start here" }, { location: "Point B", rationale: "Next logical stop" }],
            estimatedTotalTime: "4 hours",
            transportAdvice: "Walk between spots."
        });
    } else if (systemPrompt.includes("safety and risk")) {
        return JSON.stringify({
            destination: "Mock Destination",
            overallSafetyScore: 8,
            keyRisks: [{ riskType: "Pickpocketing", description: "In busy areas", mitigation: "Keep valuables hidden" }],
            areasToAvoid: ["Dark alleys at night"],
            emergencyNumbers: { police: "911", medical: "911", fire: "911" },
            profileSpecificAdvice: "Stay alert and have fun."
        });
    } else if (systemPrompt.includes("hospitality AI")) {
        return JSON.stringify({
            comparison: [{ hotel: "Hotel A", pros: ["Great location"], cons: ["Expensive"] }, { hotel: "Hotel B", pros: ["Cheap"], cons: ["Far away"] }],
            winner: "Hotel A",
            winnerJustification: "Better location outweighs the cost."
        });
    } else if (systemPrompt.includes("fake review")) {
        return JSON.stringify({
            hotelName: "Mock Hotel",
            overallSentiment: "positive",
            fakeReviewProbability: "low",
            suspicionReasons: ["None"],
            summary: "Most reviews seem genuine and positive.",
            keyPositives: ["Clean rooms"],
            keyNegatives: ["Slow WiFi"]
        });
    }
    return "{}";
}

/**
 * Convenience wrapper that calls chat.completions.create with a system + user prompt
 * and returns the text content of the first choice.
 */
export async function chatCompletion(
    systemPrompt: string,
    userPrompt: string,
    opts: { temperature?: number; maxTokens?: number } = {}
): Promise<string> {
    if (!config.openai.apiKey || config.openai.apiKey === "your_openai_api_key_here") {
        return getMockResponse(systemPrompt, userPrompt);
    }

    const client = getOpenAIClient();
    const response = await client.chat.completions.create({
        model: config.openai.model,
        temperature: opts.temperature ?? 0.7,
        max_tokens: opts.maxTokens ?? 2048,
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
        ],
    });

    const content = response.choices[0]?.message?.content ?? "";
    return content.trim();
}
