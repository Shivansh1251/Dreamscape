import { Request, Response, Router } from "express";
import { config } from "../config";

const router = Router();
const FALLBACK_VIDEO = "https://videos.pexels.com/video-files/4525107/4525107-uhd_2560_1440_24fps.mp4";
const FALLBACK_IMAGES = [
    "https://images.pexels.com/photos/2108845/pexels-photo-2108845.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/14934581/pexels-photo-14934581.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/40547/fair-fairground-ferris-wheel-carousel-40547.jpeg?auto=compress&cs=tinysrgb&w=1200",
];

type MediaImage = { url: string; alt: string; photographer?: string; photographerUrl?: string };
type MediaResponse = { video: string; images: MediaImage[] };

const cache = new Map<string, { expiresAt: number; data: MediaResponse }>();
const CACHE_TTL_MS = 30 * 60 * 1000;

function bestVideoFile(files: Array<{ link: string; quality: string; width?: number }> = []) {
    return [...files]
        .filter((file) => file.link)
        .sort((a, b) => {
            const score = (file: { quality: string }) => file.quality === "hd" ? 2 : file.quality === "sd" ? 1 : 0;
            return score(b) - score(a) || (b.width || 0) - (a.width || 0);
        })[0]?.link;
}

router.get("/", async (req: Request, res: Response): Promise<any> => {
    try {
        const location = typeof req.query.location === "string" ? req.query.location.trim() : "";
        if (!location) return res.status(400).json({ error: "Location is required" });
        if (location.length > 100) return res.status(400).json({ error: "Location must be 100 characters or fewer" });

        const cacheKey = location.toLocaleLowerCase();
        const cached = cache.get(cacheKey);
        if (cached && cached.expiresAt > Date.now()) return res.json(cached.data);

        // This Pexels video appears in PageLayout's hero, directly behind the navbar.
        let video = FALLBACK_VIDEO;
        if (config.pexels.apiKey) {
            const pexelsResponse = await fetch(
                `https://api.pexels.com/videos/search?query=${encodeURIComponent(`${location} travel`)}&per_page=5&orientation=landscape&size=medium`,
                { headers: { Authorization: config.pexels.apiKey } },
            );
            if (pexelsResponse.ok) {
                const result = await pexelsResponse.json() as { videos?: Array<{ video_files?: Array<{ link: string; quality: string; width?: number }> }> };
                video = bestVideoFile(result.videos?.[0]?.video_files) || video;
            }
        }

        let images: MediaImage[] = FALLBACK_IMAGES.map((url, index) => ({ url, alt: `${location} travel view ${index + 1}` }));
        if (config.unsplash.accessKey) {
            const unsplashResponse = await fetch(
                `https://api.unsplash.com/search/photos?query=${encodeURIComponent(location)}&per_page=6&orientation=landscape`,
                { headers: { Authorization: `Client-ID ${config.unsplash.accessKey}` } },
            );
            if (unsplashResponse.ok) {
                const result = await unsplashResponse.json() as {
                    results?: Array<{ alt_description?: string | null; urls: { regular: string }; user: { name: string; links: { html: string } } }>;
                };
                if (result.results?.length) {
                    images = result.results.map((photo, index) => ({
                        url: photo.urls.regular,
                        alt: photo.alt_description || `${location} travel view ${index + 1}`,
                        photographer: photo.user.name,
                        photographerUrl: `${photo.user.links.html}?utm_source=dreamscapes&utm_medium=referral`,
                    }));
                }
            }
        }

        const data = { video, images };
        cache.set(cacheKey, { data, expiresAt: Date.now() + CACHE_TTL_MS });
        return res.json(data);
    } catch (error) {
        console.error("Error fetching media:", error);
        return res.status(500).json({ error: "Failed to fetch media" });
    }
});

export default router;
