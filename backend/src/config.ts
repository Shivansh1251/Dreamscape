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

    unsplash: {
        accessKey: process.env.UNSPLASH_ACCESS_KEY || "",
        baseUrl: "https://api.unsplash.com",
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

    session: {
        secret: process.env.SESSION_SECRET || "super-secret-key-for-dev",
    }
};
