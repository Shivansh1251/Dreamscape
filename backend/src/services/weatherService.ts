import axios from "axios";
import { config } from "../config";
import { logger } from "../logger";

export interface WeatherData {
    city: string;
    country: string;
    tempCelsius: number;
    feelsLike: number;
    condition: string;
    description: string;
    humidity: number;
    windSpeed: number;
    visibility: number;
    sunrise: string;
    sunset: string;
    fetchedAt: string;
}

export async function fetchWeather(location: string): Promise<WeatherData> {
    if (!config.openWeather.apiKey) {
        throw new Error(
            "OPENWEATHER_API_KEY is not set. Please add it to your .env file."
        );
    }

    logger.debug(`Fetching weather for: ${location}`);

    const url = `${config.openWeather.baseUrl}/weather`;
    const { data } = await axios.get(url, {
        params: {
            q: location,
            appid: config.openWeather.apiKey,
            units: "metric",
        },
    });

    const toTime = (unix: number) =>
        new Date(unix * 1000).toLocaleTimeString("en-IN", { timeZone: "UTC" });

    return {
        city: data.name,
        country: data.sys.country,
        tempCelsius: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        condition: data.weather[0].main,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        visibility: data.visibility / 1000, // km
        sunrise: toTime(data.sys.sunrise),
        sunset: toTime(data.sys.sunset),
        fetchedAt: new Date().toISOString(),
    };
}
