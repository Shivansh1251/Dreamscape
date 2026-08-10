import { Request, Response, Router } from "express";
import { Subscriber } from "../models/Subscriber";

const router = Router();

router.post("/subscribe", async (req: Request, res: Response): Promise<any> => {
    const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
    if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: "Enter a valid email address" });
    try {
        await Subscriber.findOneAndUpdate({ email }, { $setOnInsert: { email, source: "community" } }, { upsert: true, new: true });
        return res.status(201).json({ success: true, message: "You are on the Dreamscape list." });
    } catch {
        return res.status(503).json({ error: "Subscription storage is unavailable right now" });
    }
});

export default router;
