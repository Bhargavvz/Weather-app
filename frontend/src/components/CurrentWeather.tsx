import { WeatherData, UserPreferences } from '../types/weather';

interface CurrentWeatherProps {
  data: WeatherData;
  preferences: UserPreferences;
}

export function CurrentWeather({ data, preferences }: CurrentWeatherProps) {
  const temperature = preferences.temperatureUnit === 'C' 
    ? data.current.temp_c 
    : data.current.temp_f;
  
  const windSpeed = preferences.speedUnit === 'kph'
    ? data.current.wind_kph
    : data.current.wind_mph;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">{data.location.name}</h2>
          <p className="text-gray-600 dark:text-gray-400">{data.location.country}</p>
        </div>
        <img 
          src={data.current.condition.icon} 
          alt={data.current.condition.text}
          className="w-16 h-16"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-4xl font-bold">
            {Math.round(temperature)}°{preferences.temperatureUnit}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            {data.current.condition.text}
          </p>
        </div>

        <div className="space-y-2">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Wind Speed</p>
            <p className="font-semibold">
              {Math.round(windSpeed)} {preferences.speedUnit}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Humidity</p>
            <p className="font-semibold">{data.current.humidity}%</p>
          </div>

          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">UV Index</p>
            <p className="font-semibold">{data.current.uv}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Visibility</p>
            <p className="font-semibold">{data.current.vis_km} km</p>
          </div>
        </div>
      </div>
    </div>
  );
}
