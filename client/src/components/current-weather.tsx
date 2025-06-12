
import { Droplets, Wind, MapPin, Gauge, Eye, Sunrise, Sunset } from "lucide-react";
import { CityWeather } from "@/lib/types";
import * as LucideIcons from "lucide-react";
import { WeatherService } from "@/lib/weather-service";

interface CurrentWeatherProps {
  weather: CityWeather;
  temperatureUnit: 'C' | 'F';
}

export default function CurrentWeather({ weather, temperatureUnit }: CurrentWeatherProps) {
  const convertTemperature = (temp: number) => {
    if (temperatureUnit === 'F') {
      return Math.round((temp * 9/5) + 32);
    }
    return temp;
  };

  const getWeatherIcon = (iconCode: string) => {
    const iconName = WeatherService.getWeatherIconClass(iconCode);
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Cloud;
    return <IconComponent className="h-24 w-24 text-[hsl(var(--accent-blue))] weather-icon" />;
  };

  return (
    <section className="mb-12 animate-fade-in">
      <div className="card-modern relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--accent-blue))]/5 via-transparent to-[hsl(var(--accent-cyan))]/5"></div>
        
        <div className="relative z-10">
          {/* Main Weather Info */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-8">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-6">
                <MapPin className="h-6 w-6 text-[hsl(var(--accent-blue))]" />
                <div>
                  <h2 className="text-4xl font-display text-foreground">
                    {weather.name}
                  </h2>
                  <p className="text-lg text-muted-foreground font-medium">
                    {weather.country}
                  </p>
                </div>
              </div>
              
              <div className="flex items-baseline space-x-6">
                <span className="text-7xl font-display text-gradient">
                  {convertTemperature(weather.temperature)}°
                </span>
                <div>
                  <p className="text-3xl font-semibold text-foreground capitalize mb-2">
                    {weather.description}
                  </p>
                  <p className="text-xl text-muted-foreground">
                    Feels like {convertTemperature(weather.feelsLike)}°{temperatureUnit}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="mb-6">
                {getWeatherIcon(weather.weatherIcon)}
              </div>
            </div>
          </div>

          {/* Weather Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-modern rounded-2xl p-6 group hover:scale-105 transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-[hsl(var(--accent-blue))]/10 rounded-xl group-hover:bg-[hsl(var(--accent-blue))]/20 transition-colors">
                  <Droplets className="h-6 w-6 text-[hsl(var(--accent-blue))]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Humidity</p>
                  <p className="text-2xl font-bold text-foreground">{weather.humidity}%</p>
                </div>
              </div>
            </div>

            <div className="glass-modern rounded-2xl p-6 group hover:scale-105 transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-[hsl(var(--accent-cyan))]/10 rounded-xl group-hover:bg-[hsl(var(--accent-cyan))]/20 transition-colors">
                  <Wind className="h-6 w-6 text-[hsl(var(--accent-cyan))]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Wind</p>
                  <p className="text-2xl font-bold text-foreground">{weather.windSpeed} m/s</p>
                </div>
              </div>
            </div>

            <div className="glass-modern rounded-2xl p-6 group hover:scale-105 transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-500/10 rounded-xl group-hover:bg-purple-500/20 transition-colors">
                  <Gauge className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Pressure</p>
                  <p className="text-2xl font-bold text-foreground">{weather.pressure} hPa</p>
                </div>
              </div>
            </div>

            <div className="glass-modern rounded-2xl p-6 group hover:scale-105 transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-500/10 rounded-xl group-hover:bg-orange-500/20 transition-colors">
                  <Eye className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Visibility</p>
                  <p className="text-2xl font-bold text-foreground">10 km</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
