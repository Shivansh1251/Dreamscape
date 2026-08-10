import { Request, Response, Router } from "express";
import { config } from "../config";

const router = Router();
const CACHE_TTL_MS = 20 * 60 * 1000;
const cache = new Map<string, { expiresAt: number; data: unknown }>();

type GeoFeature = {
    properties: {
        name?: string;
        formatted?: string;
        address_line1?: string;
        address_line2?: string;
        lat?: number;
        lon?: number;
        website?: string;
        contact?: { website?: string; phone?: string };
        categories?: string[];
        accommodation?: { stars?: string };
        catering?: { cuisine?: string };
    };
};

type PlacePhoto = { url: string; photographer?: string; photographerUrl?: string };
type Place = { name: string; address: string; lat: number; lon: number; website?: string; mapUrl: string; category: string; stars?: string; cuisine?: string; rating?: number; popularity?: number; photo?: PlacePhoto };

const placeGroups: Record<string, string> = {
    hotels: "accommodation.hotel,accommodation.guest_house,accommodation.hostel",
    restaurants: "catering.restaurant",
    cafes: "catering.cafe",
    attractions: "tourism.attraction,entertainment,leisure.park",
    mustSee: "tourism.attraction,entertainment.museum,entertainment.culture",
};

const photoCache = new Map<string, PlacePhoto | undefined>();

type FoursquarePlace = { name?: string; latitude?: number; longitude?: number; website?: string; rating?: number; popularity?: number; location?: { formatted_address?: string; address?: string; locality?: string; region?: string }; categories?: Array<{ name?: string }> };

async function popularFoursquarePlaces(location: string, query: string, group: string): Promise<Place[]> {
    if (!config.foursquare.apiKey) return [];
    try {
        const url = new URL("/places/search", config.foursquare.baseUrl);
        url.search = new URLSearchParams({ near: location, query, sort: "POPULARITY", limit: "5" }).toString();
        const response = await fetch(url, { headers: { Authorization: `Bearer ${config.foursquare.apiKey}`, "X-Places-Api-Version": config.foursquare.apiVersion } });
        if (!response.ok) return [];
        const payload = await response.json() as { results?: FoursquarePlace[] };
        return (payload.results || []).filter((place) => place.name && place.latitude !== undefined && place.longitude !== undefined).map((place) => ({
            name: place.name as string,
            address: place.location?.formatted_address || [place.location?.address, place.location?.locality, place.location?.region].filter(Boolean).join(", ") || "Address unavailable",
            lat: place.latitude as number,
            lon: place.longitude as number,
            website: place.website,
            mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.latitude},${place.longitude}`)}`,
            category: group,
            rating: place.rating,
            popularity: place.popularity,
        }));
    } catch { return []; }
}

async function findPlacePhoto(place: Place, location: string): Promise<PlacePhoto | undefined> {
    if (!config.unsplash.accessKey) return undefined;
    const key = `${place.name}-${location}`.toLowerCase();
    if (photoCache.has(key)) return photoCache.get(key);
    try {
        const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(`${place.name} ${location} travel`)}&per_page=1&orientation=landscape`, {
            headers: { Authorization: `Client-ID ${config.unsplash.accessKey}` },
        });
        if (!response.ok) return undefined;
        const payload = await response.json() as { results?: Array<{ urls?: { small?: string }; user?: { name?: string; links?: { html?: string } } }> };
        const item = payload.results?.[0];
        const photo = item?.urls?.small ? { url: item.urls.small, photographer: item.user?.name, photographerUrl: item.user?.links?.html } : undefined;
        photoCache.set(key, photo);
        return photo;
    } catch { return undefined; }
}

function normalize(feature: GeoFeature, group: string): Place | null {
    const props = feature.properties;
    if (!props.name || props.lat === undefined || props.lon === undefined) return null;
    return {
        name: props.name,
        address: props.formatted || [props.address_line1, props.address_line2].filter(Boolean).join(", ") || "Address unavailable",
        lat: props.lat,
        lon: props.lon,
        website: props.contact?.website || props.website,
        mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${props.lat},${props.lon}`)}`,
        category: group,
        stars: props.accommodation?.stars,
        cuisine: props.catering?.cuisine,
    };
}

router.get("/", async (req: Request, res: Response): Promise<any> => {
    const location = typeof req.query.location === "string" ? req.query.location.trim() : "";
    if (!location || location.length > 100) return res.status(400).json({ error: "A valid location is required" });
    if (!config.geoapify.apiKey) return res.status(503).json({ error: "Geoapify API key is not configured" });

    const cacheKey = location.toLowerCase();
    const cached = cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) return res.json(cached.data);

    try {
        const geocodeUrl = new URL("/v1/geocode/search", config.geoapify.baseUrl);
        geocodeUrl.search = new URLSearchParams({ text: location, format: "json", limit: "1", apiKey: config.geoapify.apiKey }).toString();
        const geocodeResponse = await fetch(geocodeUrl);
        if (!geocodeResponse.ok) return res.status(502).json({ error: "Geoapify could not find this location" });
        const geocode = await geocodeResponse.json() as { results?: Array<{ lat: number; lon: number; formatted: string }> };
        const coordinates = geocode.results?.[0];
        if (!coordinates) return res.status(404).json({ error: "Location not found" });

        const resultEntries = await Promise.all(Object.entries(placeGroups).map(async ([group, categories]) => {
            const placesUrl = new URL("/v2/places", config.geoapify.baseUrl);
            placesUrl.search = new URLSearchParams({ categories, filter: `circle:${coordinates.lon},${coordinates.lat},5000`, bias: `proximity:${coordinates.lon},${coordinates.lat}`, limit: "6", apiKey: config.geoapify.apiKey }).toString();
            const response = await fetch(placesUrl);
            if (!response.ok) return [group, []] as const;
            const payload = await response.json() as { features?: GeoFeature[] };
            const places = (payload.features || []).map((feature) => normalize(feature, group)).filter((place): place is Place => Boolean(place));
            const withPhotos = await Promise.all(places.map(async (place) => ({ ...place, photo: await findPlacePhoto(place, coordinates.formatted) })));
            return [group, withPhotos] as const;
        }));

        const rankedEntries = await Promise.all([
            ["hotels", "hotel"], ["restaurants", "restaurant"], ["mustSee", "tourist attraction"],
        ].map(async ([group, query]) => {
            const places = await popularFoursquarePlaces(location, query, group);
            const withPhotos = await Promise.all(places.map(async (place) => ({ ...place, photo: await findPlacePhoto(place, coordinates.formatted) })));
            return [group, withPhotos] as const;
        }));
        const groups = Object.fromEntries(resultEntries) as Record<string, Place[]>;
        rankedEntries.forEach(([group, places]) => { if (places.length) groups[group] = places; });
        const data = { location: coordinates.formatted, center: { lat: coordinates.lat, lon: coordinates.lon }, groups };
        cache.set(cacheKey, { data, expiresAt: Date.now() + CACHE_TTL_MS });
        return res.json(data);
    } catch {
        return res.status(502).json({ error: "Unable to load nearby places right now" });
    }
});

export default router;
