import { Request, Response, Router } from "express";
import { config } from "../config";
import fetch from "node-fetch";

const router = Router();

router.get("/", async (req: Request, res: Response): Promise<any> => {
    try {
        const { location } = req.query;
        if (!location) {
            return res.status(400).json({ error: "Location is required" });
        }

        // 1. Fetch Video from Pexels
        let videoUrl = "https://videos.pexels.com/video-files/4525107/4525107-uhd_2560_1440_24fps.mp4"; // fallback
        if (config.pexels.apiKey) {
            const pexelsRes = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(location as string)}+travel&per_page=1&orientation=landscape&size=medium`, {
                headers: {
                    Authorization: config.pexels.apiKey
                }
            });
            const pexelsData: any = await pexelsRes.json();
            if (pexelsData.videos && pexelsData.videos.length > 0) {
                // Get highest quality hd/sd file
                const videoFiles = pexelsData.videos[0].video_files;
                const hdFile = videoFiles.find((f: any) => f.quality === 'hd') || videoFiles[0];
                if (hdFile) videoUrl = hdFile.link;
            }
        }

        // 2. Fetch Images from Unsplash
        let images = [
            "https://images.pexels.com/photos/2108845/pexels-photo-2108845.jpeg",
            "https://images.pexels.com/photos/14934581/pexels-photo-14934581.jpeg",
            "https://images.pexels.com/photos/40547/fair-fairground-ferris-wheel-carousel-40547.jpeg"
        ]; // fallbacks
        if (config.unsplash.accessKey) {
            const unsplashRes = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(location as string)}&per_page=6&orientation=landscape`, {
                headers: {
                    Authorization: `Client-ID ${config.unsplash.accessKey}`
                }
            });
            const unsplashData: any = await unsplashRes.json();
            if (unsplashData.results && unsplashData.results.length > 0) {
                images = unsplashData.results.map((r: any) => r.urls.regular);
            }
        }

        return res.json({ video: videoUrl, images });
    } catch (error) {
        console.error("Error fetching media:", error);
        return res.status(500).json({ error: "Failed to fetch media" });
    }
});

export default router;
