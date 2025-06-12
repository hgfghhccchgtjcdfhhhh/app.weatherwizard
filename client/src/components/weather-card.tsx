
import { Droplets, Wind } from "lucide-react";
import { CityWeather } from "@/lib/types";
import * as LucideIcons from "lucide-react";
import { WeatherService } from "@/lib/weather-service";

interface WeatherCardProps {
  weather: CityWeather;
  temperatureUnit: 'C' | 'F';
  onClick: () => void;
}

export default function WeatherCard({ weather, temperatureUnit, onClick }: WeatherCardProps) {
  const convertTemperature = (temp: number) => {
    if (temperatureUnit === 'F') {
      return Math.round((temp * 9/5) + 32);
    }
    return temp;
  };

  const getWeatherIcon = (iconCode: string) => {
    const iconName = WeatherService.getWeatherIconClass(iconCode);
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Cloud;
    
    // Enhanced color mapping
    let colorClass = "text-muted-foreground";
    if (iconCode.includes('01')) colorClass = "text-yellow-500"; // Clear sky
    if (iconCode.includes('02')) colorClass = "text-[hsl(var(--accent-blue))]"; // Few clouds
    if (iconCode.includes('03') || iconCode.includes('04')) colorClass = "text-gray-500"; // Clouds
    if (iconCode.includes('09') || iconCode.includes('10')) colorClass = "text-blue-500"; // Rain
    if (iconCode.includes('11')) colorClass = "text-purple-500"; // Thunderstorm
    if (iconCode.includes('13')) colorClass = "text-cyan-400"; // Snow
    if (iconCode.includes('50')) colorClass = "text-gray-400"; // Mist/Haze
    
    return <IconComponent className={`h-12 w-12 ${colorClass} weather-icon`} />;
  };

  return (
    <div 
      onClick={onClick}
      className="card-modern cursor-pointer group relative overflow-hidden"
    >
      {/* Hover gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--accent-blue))]/0 to-[hsl(var(--accent-cyan))]/0 group-hover:from-[hsl(var(--accent-blue))]/5 group-hover:to-[hsl(var(--accent-cyan))]/5 transition-all duration-500"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-xl text-foreground mb-1 truncate group-hover:text-[hsl(var(--accent-blue))] transition-colors">
              {weather.name}
            </h4>
            <p className="text-[hsl(var(--accent-blue))] text-sm font-medium opacity-80">
              {weather.country}
            </p>
          </div>
          <div className="ml-4 group-hover:scale-110 transition-transform duration-300">
            {getWeatherIcon(weather.weatherIcon)}
          </div>
        </div>

        {/* Temperature */}
        <div className="mb-6">
          <div className="text-5xl font-display text-gradient mb-2">
            {convertTemperature(weather.temperature)}°
          </div>
          <p className="text-foreground font-medium capitalize text-lg">
            {weather.description}
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 glass-modern rounded-lg px-3 py-2">
            <Droplets className="h-4 w-4 text-[hsl(var(--accent-blue))]" />
            <span className="text-sm font-semibold text-foreground">{weather.humidity}%</span>
          </div>
          <div className="flex items-center space-x-2 glass-modern rounded-lg px-3 py-2">
            <Wind className="h-4 w-4 text-[hsl(var(--accent-cyan))]" />
            <span className="text-sm font-semibold text-foreground">{weather.windSpeed} m/s</span>
          </div>
        </div>
      </div>
    </div>
  );
}
