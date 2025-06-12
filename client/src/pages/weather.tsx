import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WeatherService } from "@/lib/weather-service";
import { CityWeather } from "@/lib/types";
import WeatherHeader from "@/components/weather-header";
import CurrentWeather from "@/components/current-weather";
import WeatherCard from "@/components/weather-card";
import LoadingOverlay from "@/components/loading-overlay";
import ErrorAlert from "@/components/error-alert";
import { useToast } from "@/hooks/use-toast";

export default function WeatherPage() {
  const [currentCity, setCurrentCity] = useState("New York");
  const [temperatureUnit, setTemperatureUnit] = useState<'C' | 'F'>('C');
  const [error, setError] = useState<string | null>(null);
  const [visibleCities, setVisibleCities] = useState(8);
  const { toast } = useToast();

  const majorCities = [
    'New York', 'London', 'Tokyo', 'Sydney', 'Cairo', 
    'São Paulo', 'Mumbai', 'Vancouver', 'Dubai', 'Paris',
    'Beijing', 'Moscow', 'Lagos', 'Mexico City', 'Bangkok',
    'Istanbul', 'Jakarta', 'Manila', 'Seoul', 'Singapore'
  ];

  // Current weather query
  const { 
    data: currentWeather, 
    isLoading: isCurrentLoading, 
    error: currentError,
    refetch: refetchCurrent 
  } = useQuery({
    queryKey: ['/api/weather/current', currentCity],
    queryFn: async () => {
      const data = await WeatherService.getCurrentWeather(currentCity);
      return WeatherService.transformWeatherData(data);
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });

  // Major cities weather query
  const { 
    data: citiesWeather = [], 
    isLoading: isCitiesLoading, 
    error: citiesError,
    refetch: refetchCities 
  } = useQuery({
    queryKey: ['/api/weather/cities', majorCities],
    queryFn: () => WeatherService.getMultipleCitiesWeather(majorCities),
    staleTime: 15 * 60 * 1000, // 15 minutes
    retry: 1,
  });

  // Handle errors
  useEffect(() => {
    if (currentError) {
      const errorMessage = currentError instanceof Error ? currentError.message : 'Failed to load current weather';
      setError(errorMessage);
    } else if (citiesError) {
      const errorMessage = citiesError instanceof Error ? citiesError.message : 'Failed to load cities weather';
      setError(errorMessage);
    }
  }, [currentError, citiesError]);

  // Try to get user's location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const data = await WeatherService.getWeatherByCoords(latitude, longitude);
            setCurrentCity(data.name);
          } catch (error) {
            console.log('Could not get weather for current location, using default');
          }
        },
        () => {
          console.log('Geolocation not available, using default location');
        }
      );
    }
  }, []);

  const handleCitySelect = (city: string) => {
    setCurrentCity(city);
    setError(null);
  };

  const handleRefresh = async () => {
    setError(null);
    try {
      await Promise.all([refetchCurrent(), refetchCities()]);
      toast({
        title: "Weather Updated",
        description: "All weather data has been refreshed",
      });
    } catch (error) {
      setError("Failed to refresh weather data");
    }
  };

  const handleTemperatureUnitChange = () => {
    setTemperatureUnit(prev => prev === 'C' ? 'F' : 'C');
  };

  const handleLoadMore = () => {
    setVisibleCities(prev => Math.min(prev + 8, majorCities.length));
  };

  const handleCityCardClick = (weather: CityWeather) => {
    setCurrentCity(weather.name);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const dismissError = () => setError(null);
  
  const retryOperation = () => {
    setError(null);
    refetchCurrent();
    refetchCities();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--gradient-start))] to-[hsl(var(--gradient-end))] transition-all duration-500">
      <WeatherHeader
        onCitySelect={handleCitySelect}
        onRefresh={handleRefresh}
        temperatureUnit={temperatureUnit}
        onTemperatureUnitChange={handleTemperatureUnitChange}
        isRefreshing={isCurrentLoading || isCitiesLoading}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Current Weather Section */}
        {currentWeather && (
          <div className="animate-fade-in">
            <CurrentWeather 
              weather={currentWeather} 
              temperatureUnit={temperatureUnit}
            />
          </div>
        )}

        {/* Global Weather Grid Section */}
        <section className="animate-slide-up">
          <div className="flex items-center justify-between mb-8 glass-effect rounded-2xl p-6 shadow-lg">
            <div className="space-y-2">
              <h3 className="text-4xl font-bold gradient-text tracking-tight">
                Major Cities Worldwide
              </h3>
              <p className="text-muted-foreground font-medium text-lg">
                Discover weather conditions across the globe
              </p>
            </div>
            <div className="flex space-x-3">
              <Button 
                className="px-6 py-3 bg-gradient-to-r from-[hsl(var(--professional-blue))] to-[hsl(var(--professional-teal))] text-white hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold rounded-xl border-2 border-transparent hover:border-white/20"
                onClick={() => setVisibleCities(majorCities.length)}
              >
                All Cities
              </Button>
              <Button 
                variant="outline"
                className="px-6 py-3 glass-effect border-2 border-[hsl(var(--professional-blue))]/30 text-[hsl(var(--professional-blue))] hover:bg-[hsl(var(--professional-blue))]/10 hover:border-[hsl(var(--professional-blue))] transition-all duration-300 font-semibold rounded-xl"
                onClick={() => setVisibleCities(8)}
              >
                Reset View
              </Button>
            </div>
          </div>

          {/* Weather Cards Grid */}
          {citiesWeather.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
              {citiesWeather.slice(0, visibleCities).map((weather, index) => (
                <div 
                  key={weather.id} 
                  className="animate-bounce-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <WeatherCard
                    weather={weather}
                    temperatureUnit={temperatureUnit}
                    onClick={() => handleCityCardClick(weather)}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {visibleCities < majorCities.length && citiesWeather.length > 0 && (
            <div className="text-center mt-12 animate-fade-in">
              <Button
                onClick={handleLoadMore}
                className="px-10 py-4 bg-gradient-to-r from-[hsl(var(--professional-blue))] to-[hsl(var(--professional-teal))] text-white hover:shadow-2xl transform hover:scale-110 transition-all duration-300 font-bold text-lg rounded-2xl border-2 border-transparent hover:border-white/20 glass-effect"
              >
                <Plus className="h-5 w-5 mr-3" />
                Load More Cities
              </Button>
            </div>
          )}

          {/* Empty State */}
          {!isCitiesLoading && citiesWeather.length === 0 && (
            <div className="text-center py-20 glass-effect rounded-3xl animate-bounce-in">
              <div className="text-9xl mb-8 animate-bounce">🌤️</div>
              <h3 className="text-3xl font-bold gradient-text mb-4 tracking-tight">
                Weather Data Unavailable
              </h3>
              <p className="text-muted-foreground mb-8 text-xl max-w-md mx-auto">
                Unable to load weather information for cities. Please check your connection and try again.
              </p>
              <Button 
                onClick={retryOperation} 
                className="bg-gradient-to-r from-[hsl(var(--professional-blue))] to-[hsl(var(--professional-teal))] text-white hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-bold px-8 py-4 rounded-xl text-lg"
              >
                Retry Loading
              </Button>
            </div>
          )}
        </section>
      </main>

      {/* Loading Overlay */}
      <LoadingOverlay 
        isVisible={isCurrentLoading && !currentWeather} 
        message="Loading weather data..."
      />

      {/* Error Alert */}
      <ErrorAlert
        isVisible={!!error}
        message={error || ""}
        onDismiss={dismissError}
        onRetry={retryOperation}
      />
    </div>
  );
}
