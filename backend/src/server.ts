import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import session from "express-session";
import cookieParser from "cookie-parser";

import { config } from "./config";
import { logger } from "./logger";
import routes from "./routes";
import { connectDB } from "./config/db";
import passport from "./config/passport";
import authRoutes from "./routes/auth.route";
import mediaRoute from "./routes/media.route";
import placesRoute from "./routes/places.route";
import communityRoute from "./routes/community.route";

// Connect to MongoDB
connectDB();

const app = express();

// Security middlewares
app.use(helmet({ contentSecurityPolicy: false }));

// In development, allow any origin (covers file://, localhost, Live Server, etc.)
const corsOriginFn = (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (config.nodeEnv !== "production") {
        return callback(null, true); // allow all in dev
    }
    if (!origin || config.cors.origins.includes(origin)) {
        return callback(null, true);
    }
    callback(new Error(`CORS: origin ${origin} not allowed`));
};

app.use(
    cors({
        origin: corsOriginFn,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);
app.use(express.json());

// Rate limiting
app.use(
    rateLimit({
        windowMs: config.rateLimit.windowMs,
        max: config.rateLimit.max,
        message: "Too many requests, please try again later.",
    })
);

// Sessions and Cookies
app.use(cookieParser());
app.use(
    session({
        secret: config.session.secret,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: config.nodeEnv === "production",
            sameSite: config.nodeEnv === "production" ? "none" : "lax",
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        }
    })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Health check
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/ai", routes);
app.use("/api/media", mediaRoute);
app.use("/api/places", placesRoute);
app.use("/api/community", communityRoute);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ error: "Not Found" });
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error("Unhandled Error", { error: err.message, stack: err.stack });
    res.status(500).json({ error: "Internal Server Error" });
});

if (require.main === module) {
    app.listen(config.port, () => {
        logger.info(`Dreamscapes Backend running in ${config.nodeEnv} mode on port ${config.port}`);
    });
}

export default app;
