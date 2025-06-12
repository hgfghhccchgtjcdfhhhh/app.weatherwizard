import { WeatherData, CityWeather, GeocodingResult } from "./types";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || "70ed5ee796a49f1cbf52107c10eee947";
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_URL = "https://api.openweathermap.org/geo/1.0";

export class WeatherService {
  static async getCurrentWeather(city: string): Promise<WeatherData> {
    const response = await fetch(
      `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`City "${city}" not found`);
      }
      if (response.status === 401) {
        throw new Error("Invalid API key");
      }
      throw new Error(`Failed to fetch weather data: ${response.statusText}`);
    }
    
    return response.json();
  }

  static async getWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch weather data: ${response.statusText}`);
    }
    
    return response.json();
  }

  static async searchCities(query: string): Promise<GeocodingResult[]> {
    if (!query.trim()) return [];
    
    const response = await fetch(
      `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to search cities: ${response.statusText}`);
    }
    
    return response.json();
  }

  static async getMultipleCitiesWeather(cities: string[]): Promise<CityWeather[]> {
    const promises = cities.map(async (city) => {
      try {
        const data = await this.getCurrentWeather(city);
        return this.transformWeatherData(data);
      } catch (error) {
        console.error(`Failed to fetch weather for ${city}:`, error);
        return null;
      }
    });
    
    const results = await Promise.allSettled(promises);
    return results
      .filter((result): result is PromiseFulfilledResult<CityWeather | null> => 
        result.status === 'fulfilled' && result.value !== null
      )
      .map(result => result.value!);
  }

  static transformWeatherData(data: WeatherData): CityWeather {
    return {
      id: data.id,
      name: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      description: data.weather[0].description
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      weatherIcon: data.weather[0].icon,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      pressure: data.main.pressure,
      visibility: Math.round(data.visibility / 1000), // Convert to km
    };
  }

  static getWeatherIconClass(iconCode: string): string {
    const iconMap: Record<string, string> = {
      '01d': 'Sun',
      '01n': 'Moon',
      '02d': 'CloudSun',
      '02n': 'CloudMoon',
      '03d': 'Cloud',
      '03n': 'Cloud',
      '04d': 'Clouds',
      '04n': 'Clouds',
      '09d': 'CloudRain',
      '09n': 'CloudRain',
      '10d': 'CloudRain',
      '10n': 'CloudRain',
      '11d': 'Zap',
      '11n': 'Zap',
      '13d': 'Snowflake',
      '13n': 'Snowflake',
      '50d': 'Haze',
      '50n': 'Haze'
    };
    return iconMap[iconCode] || 'Cloud';
  }
}
