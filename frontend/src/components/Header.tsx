import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { UserPreferences } from '../types/weather';

interface HeaderProps {
  preferences: UserPreferences;
  onPreferencesChange: (preferences: UserPreferences) => void;
}

export function Header({ preferences, onPreferencesChange }: HeaderProps) {
  const toggleTheme = () => {
    onPreferencesChange({
      ...preferences,
      theme: preferences.theme === 'light' ? 'dark' : 'light',
    });
  };

  const toggleTemperatureUnit = () => {
    onPreferencesChange({
      ...preferences,
      temperatureUnit: preferences.temperatureUnit === 'C' ? 'F' : 'C',
    });
  };

  const toggleSpeedUnit = () => {
    onPreferencesChange({
      ...preferences,
      speedUnit: preferences.speedUnit === 'kph' ? 'mph' : 'kph',
    });
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-accent">Weather App</h1>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTemperatureUnit}
            className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-700"
          >
            °{preferences.temperatureUnit}
          </button>
          
          <button
            onClick={toggleSpeedUnit}
            className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-700"
          >
            {preferences.speedUnit}
          </button>
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {preferences.theme === 'light' ? (
              <MoonIcon className="h-6 w-6" />
            ) : (
              <SunIcon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
