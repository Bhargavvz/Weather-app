export interface WeatherData {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
    };
    wind_kph: number;
    wind_mph: number;
    humidity: number;
    uv: number;
    vis_km: number;
  };
  forecast: {
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_c: number;
        maxtemp_f: number;
        mintemp_c: number;
        mintemp_f: number;
        condition: {
          text: string;
          icon: string;
        };
      };
      hour: Array<{
        time: string;
        temp_c: number;
        temp_f: number;
        condition: {
          text: string;
          icon: string;
        };
      }>;
    }>;
  };
  alerts?: {
    headline: string;
    severity: string;
    urgency: string;
    areas: string;
    description: string;
  }[];
}

export interface UserPreferences {
  temperatureUnit: 'C' | 'F';
  speedUnit: 'kph' | 'mph';
  theme: 'light' | 'dark';
}

export type TemperatureUnit = 'C' | 'F';
export type SpeedUnit = 'kph' | 'mph';
