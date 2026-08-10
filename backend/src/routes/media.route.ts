import { Request, Response, Router } from "express";
import { config } from "../config";
import { fetchWeather, WeatherData } from "../services/weatherService";

const router = Router();
const FALLBACK_VIDEO = "https://videos.pexels.com/video-files/4525107/4525107-uhd_2560_1440_24fps.mp4";
const FALLBACK_IMAGES = [
    "https://images.pexels.com/photos/2108845/pexels-photo-2108845.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/14934581/pexels-photo-14934581.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/40547/fair-fairground-ferris-wheel-carousel-40547.jpeg?auto=compress&cs=tinysrgb&w=1200",
];

type MediaImage = { url: string; alt: string; photographer?: string; photographerUrl?: string };
type MediaResponse = { video: string; images: MediaImage[]; hotels: MediaImage[]; food: MediaImage[]; concerts: MediaImage[]; weather: WeatherData | null };
type UnsplashPhoto = { alt_description?: string | null; urls: { regular: string }; user: { name: string; links: { html: string } } };

const cache = new Map<string, { expiresAt: number; data: MediaResponse }>();
const CACHE_TTL_MS = 30 * 60 * 1000;

function bestVideoFile(files: Array<{ link: string; quality: string; width?: number }> = []) {
    return [...files].filter((file) => file.link).sort((a, b) => {
        const score = (file: { quality: string }) => file.quality === "hd" ? 2 : file.quality === "sd" ? 1 : 0;
        return score(b) - score(a) || (b.width || 0) - (a.width || 0);
    })[0]?.link;
}

function fallbackImages(location: string, category: string, count = 3): MediaImage[] {
    return FALLBACK_IMAGES.slice(0, count).map((url, index) => ({ url, alt: `${location} ${category} ${index + 1}` }));
}

async function unsplashSearch(query: string, location: string, category: string, count = 3): Promise<MediaImage[]> {
    if (!config.unsplash.accessKey) return fallbackImages(location, category, count);
    try {
        const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`, {
            headers: { Authorization: `Client-ID ${config.unsplash.accessKey}` },
        });
        if (!response.ok) return fallbackImages(location, category, count);
        const data = await response.json() as { results?: UnsplashPhoto[] };
        if (!data.results?.length) return fallbackImages(location, category, count);
        return data.results.map((photo, index) => ({
            url: photo.urls.regular,
            alt: photo.alt_description || `${location} ${category} ${index + 1}`,
            photographer: photo.user.name,
            photographerUrl: `${photo.user.links.html}?utm_source=dreamscapes&utm_medium=referral`,
        }));
    } catch {
        return fallbackImages(location, category, count);
    }
}

router.get("/", async (req: Request, res: Response): Promise<any> => {
    try {
        const location = typeof req.query.location === "string" ? req.query.location.trim() : "";
        if (!location) return res.status(400).json({ error: "Location is required" });
        if (location.length > 100) return res.status(400).json({ error: "Location must be 100 characters or fewer" });

        const cacheKey = location.toLocaleLowerCase();
        const cached = cache.get(cacheKey);
        if (cached && cached.expiresAt > Date.now()) return res.json(cached.data);

        const videoRequest = config.pexels.apiKey ? fetch(
            `https://api.pexels.com/videos/search?query=${encodeURIComponent(`${location} travel`)}&per_page=5&orientation=landscape&size=medium`,
            { headers: { Authorization: config.pexels.apiKey } },
        ).catch(() => null) : Promise.resolve(null);
        const [pexelsResponse, images, hotels, food, concerts, weather] = await Promise.all([
            videoRequest,
            unsplashSearch(location, location, "travel view", 6),
            unsplashSearch(`${location} hotel luxury`, location, "hotel", 3),
            unsplashSearch(`${location} local food restaurant`, location, "food", 3),
            unsplashSearch(`${location} concert live music`, location, "concert", 3),
            fetchWeather(location).catch(() => null),
        ]);

        let video = FALLBACK_VIDEO;
        if (pexelsResponse?.ok) {
            const result = await pexelsResponse.json() as { videos?: Array<{ video_files?: Array<{ link: string; quality: string; width?: number }> }> };
            video = bestVideoFile(result.videos?.[0]?.video_files) || video;
        }

        const data = { video, images, hotels, food, concerts, weather };
        cache.set(cacheKey, { data, expiresAt: Date.now() + CACHE_TTL_MS });
        return res.json(data);
    } catch (error) {
        console.error("Error fetching media:", error);
        return res.status(500).json({ error: "Failed to fetch media" });
    }
});

export default router;
