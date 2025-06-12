
import { useState } from "react";
import { Search, Thermometer, RefreshCw, Sun, Moon, Monitor, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GeocodingResult } from "@/lib/types";
import { WeatherService } from "@/lib/weather-service";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "@/components/theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WeatherHeaderProps {
  onCitySelect: (city: string) => void;
  onRefresh: () => void;
  temperatureUnit: 'C' | 'F';
  onTemperatureUnitChange: () => void;
  isRefreshing?: boolean;
}

export default function WeatherHeader({ 
  onCitySelect, 
  onRefresh, 
  temperatureUnit, 
  onTemperatureUnitChange,
  isRefreshing = false
}: WeatherHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { theme, setTheme } = useTheme();

  const { data: searchResults = [], isLoading: isSearching } = useQuery({
    queryKey: ['/api/search', searchQuery],
    queryFn: () => WeatherService.searchCities(searchQuery),
    enabled: searchQuery.length > 2,
    staleTime: 5 * 60 * 1000,
  });

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      onCitySelect(searchQuery.trim());
      setSearchQuery("");
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (result: GeocodingResult) => {
    onCitySelect(result.name);
    setSearchQuery("");
    setShowSuggestions(false);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-5 w-5" />;
      case 'dark':
        return <Moon className="h-5 w-5" />;
      default:
        return <Monitor className="h-5 w-5" />;
    }
  };

  return (
    <header className="glass-modern sticky top-0 z-50 border-b-0 animate-slide-up">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="text-4xl animate-bounce-gentle">🌤️</div>
            <div>
              <h1 className="text-2xl font-display text-gradient">
                WeatherWizard
              </h1>
              <p className="text-xs text-muted-foreground font-medium">
                Real-time weather insights
              </p>
            </div>
          </div>
          
          {/* Search */}
          <div className="flex-1 max-w-lg mx-8 relative">
            <div className="relative group">
              <Input
                type="text"
                placeholder="Search cities worldwide..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(e.target.value.length > 2);
                }}
                onKeyPress={handleSearch}
                onFocus={() => setShowSuggestions(searchQuery.length > 2)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="glass-modern pl-12 pr-4 py-4 w-full border-0 text-base font-medium placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-[hsl(var(--accent-blue))]/20"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[hsl(var(--accent-blue))] group-focus-within:scale-110 transition-transform" />
            </div>
            
            {/* Search Suggestions */}
            {showSuggestions && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 glass-modern mt-2 rounded-2xl overflow-hidden z-10 max-h-80 overflow-y-auto animate-scale-in">
                {searchResults.map((result, index) => (
                  <div
                    key={`${result.name}-${result.country}-${index}`}
                    onClick={() => handleSuggestionClick(result)}
                    className="px-6 py-4 hover:bg-[hsl(var(--accent-blue))]/5 cursor-pointer transition-colors group border-b border-border/30 last:border-b-0"
                  >
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-4 w-4 text-[hsl(var(--accent-blue))] group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="font-semibold text-foreground group-hover:text-[hsl(var(--accent-blue))] transition-colors">
                          {result.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {result.state && `${result.state}, `}{result.country}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {isSearching && (
              <div className="absolute top-full left-0 right-0 glass-modern mt-2 rounded-2xl p-6 text-center animate-scale-in">
                <div className="flex items-center justify-center space-x-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-[hsl(var(--accent-blue))]/20 border-t-[hsl(var(--accent-blue))]"></div>
                  <span className="text-[hsl(var(--accent-blue))] font-medium">Searching...</span>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-3">
            {/* Temperature Unit */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onTemperatureUnitChange}
              className="glass-modern h-12 px-4 rounded-xl font-semibold text-[hsl(var(--accent-blue))] hover:bg-[hsl(var(--accent-blue))]/10 border-0"
            >
              <Thermometer className="h-5 w-5 mr-2" />
              °{temperatureUnit}
            </Button>

            {/* Theme Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="glass-modern h-12 px-4 rounded-xl text-[hsl(var(--accent-blue))] hover:bg-[hsl(var(--accent-blue))]/10 border-0"
                >
                  {getThemeIcon()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-modern border-0 shadow-2xl">
                <DropdownMenuItem 
                  onClick={() => setTheme('light')}
                  className="rounded-lg hover:bg-[hsl(var(--accent-blue))]/10"
                >
                  <Sun className="mr-3 h-4 w-4" />
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setTheme('dark')}
                  className="rounded-lg hover:bg-[hsl(var(--accent-blue))]/10"
                >
                  <Moon className="mr-3 h-4 w-4" />
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setTheme('system')}
                  className="rounded-lg hover:bg-[hsl(var(--accent-blue))]/10"
                >
                  <Monitor className="mr-3 h-4 w-4" />
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Refresh */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="glass-modern h-12 px-4 rounded-xl text-[hsl(var(--accent-blue))] hover:bg-[hsl(var(--accent-blue))]/10 border-0 disabled:opacity-50"
            >
              <RefreshCw className={`h-5 w-5 transition-transform duration-700 ${isRefreshing ? 'animate-spin' : 'hover:rotate-180'}`} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
