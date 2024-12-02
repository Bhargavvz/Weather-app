import { WeatherData, UserPreferences } from '../types/weather';

interface WeatherForecastProps {
  data: WeatherData;
  preferences: UserPreferences;
}

export function WeatherForecast({ data, preferences }: WeatherForecastProps) {
  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { weekday: 'short' });
  };

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">7-Day Forecast</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {data.forecast.forecastday.map((day) => (
          <div
            key={day.date}
            className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <span className="font-semibold mb-2">{getDayName(day.date)}</span>
            <img
              src={day.day.condition.icon}
              alt={day.day.condition.text}
              className="w-12 h-12 mb-2"
            />
            <div className="text-sm space-y-1">
              <p className="font-medium">
                {Math.round(preferences.temperatureUnit === 'C' ? day.day.maxtemp_c : day.day.maxtemp_f)}°
                <span className="text-gray-500 dark:text-gray-400">
                  {' '}
                  {Math.round(preferences.temperatureUnit === 'C' ? day.day.mintemp_c : day.day.mintemp_f)}°
                </span>
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                {day.day.condition.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
