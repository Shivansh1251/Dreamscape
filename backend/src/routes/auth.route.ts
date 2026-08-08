import { Router } from "express";
import passport from "../config/passport";
import { config } from "../config";

const router = Router();

// Kick off the Google Authentication Flow
router.get("/google",
    (req, res, next) => {
        // Only run passport authenticate if client id is set, else mock
        if (config.google.clientId) {
            passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
        } else {
            // Mock authentication for demonstration
            req.login({ id: "mock_user", firstName: "Test", lastName: "User" } as Express.User, (err) => {
                if (err) return next(err);
                return res.redirect("/Dashboard.html");
            });
        }
    }
);

// Google Callback Route
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/Log_in.html?error=auth_failed" }),
    (req, res) => {
        // Successful authentication
        res.redirect("/Dashboard.html");
    }
);

// Provide user info to frontend
router.get("/me", (req, res) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        res.json({ success: true, user: req.user });
    } else {
        res.status(401).json({ success: false, message: "Not authenticated" });
    }
});

// Logout
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.json({ success: true, message: "Logged out successfully" });
    });
});

export default router;
