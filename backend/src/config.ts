import dotenv from "dotenv";
import path from "path";

// Load .env from the backend directory
dotenv.config({ path: path.resolve(__dirname, "../.env") });

export const config = {
    port: parseInt(process.env.PORT || "3000", 10),
    nodeEnv: process.env.NODE_ENV || "development",

    openai: {
        apiKey: process.env.OPENAI_API_KEY || "",
        model: "gpt-4o-mini",         // cost-efficient, fast
        timeout: 60_000,
    },

    openWeather: {
        apiKey: process.env.OPENWEATHER_API_KEY || "",
        baseUrl: "https://api.openweathermap.org/data/2.5",
    },

    googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY || "",
        baseUrl: "https://maps.googleapis.com/maps/api",
    },

    geoapify: {
        apiKey: process.env.GEOAPIFY_API_KEY || process.env.Geoapify_API_KEY || "",
        baseUrl: "https://api.geoapify.com",
    },

    amadeus: {
        clientId: process.env.AMADEUS_CLIENT_ID || process.env.AMADEUS_API_KEY || "",
        clientSecret: process.env.AMADEUS_CLIENT_SECRET || process.env.AMADEUS_API_SECRET || "",
        baseUrl: process.env.AMADEUS_ENV === "production" ? "https://api.amadeus.com" : "https://test.api.amadeus.com",
    },

    hotelbeds: {
        apiKey: process.env.HOTELBEDS_API_KEY || process.env.Hotelbeds_API_KEY || "",
        secret: process.env.HOTELBEDS_SECRET || process.env.Hotelbeds_SECRET || "",
        baseUrl: process.env.HOTELBEDS_ENV === "production" ? "https://api.hotelbeds.com" : "https://api.test.hotelbeds.com",
    },

    foursquare: {
        apiKey: process.env.FOURSQUARE_API_KEY || process.env.foursquare_api_key || "",
        baseUrl: "https://places-api.foursquare.com",
        apiVersion: "2025-06-17",
    },

    unsplash: {
        accessKey: process.env.UNSPLASH_ACCESS_KEY || "",
        baseUrl: "https://api.unsplash.com",
    },

    pexels: {
        // PEXELS_API_KEY is preferred; retain the original name for existing .env files.
        apiKey: process.env.PEXELS_API_KEY || process.env.PEXELS_ACCESS_KEY || process.env.pexels_api_key || process.env.pexels_access_key || "",
    },

    cors: {
        origins: (process.env.CORS_ORIGINS || "*").split(",").map((o) => o.trim()),
    },

    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100,                  // max requests per window per IP
    },

    google: {
        clientId: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        callbackUrl: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3000/api/auth/google/callback",
    },

    frontendUrl: (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, ""),

    session: {
        secret: process.env.SESSION_SECRET || "super-secret-key-for-dev",
    }
};
