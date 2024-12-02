import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import WeatherCharts from './WeatherCharts';

interface Location {
  name: string;
  lat: number;
  lon: number;
  isDefault: boolean;
}

interface WeatherData {
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
    };
    wind_kph: number;
    humidity: number;
    feelslike_c: number;
  };
  forecast: {
    forecastday: Array<{
      date: string;
      day: {
        avgtemp_c: number;
        condition: {
          text: string;
          icon: string;
        };
      };
    }>;
  };
}

const WeatherDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.preferences?.locations) {
      setLocations(user.preferences.locations);
      const defaultLocation = user.preferences.locations.find((loc: Location) => loc.isDefault);
      if (defaultLocation) {
        setSelectedLocation(defaultLocation.name);
        fetchWeatherData(defaultLocation.name);
      }
    }
  }, [isAuthenticated, user]);

  const fetchWeatherData = async (location: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/weather/forecast/${location}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWeatherData(response.data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/weather/search`, {
        params: { q: searchQuery },
        headers: { Authorization: `Bearer ${token}` },
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching locations:', error);
    }
  };

  const addLocation = async (location: any) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/user/locations',
        {
          name: location.name,
          lat: location.lat,
          lon: location.lon,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Refresh user data to get updated locations
      const response = await axios.get('http://localhost:5000/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLocations(response.data.preferences.locations);
      setSearchResults([]);
      setSearchQuery('');
    } catch (error) {
      console.error('Error adding location:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Weather Dashboard</h1>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search locations..."
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleSearch}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
              >
                Search
              </button>
            </div>
          </div>

          {searchResults.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Search Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((location) => (
                  <div
                    key={`${location.lat}-${location.lon}`}
                    className="bg-gray-50 p-4 rounded-lg"
                  >
                    <h3 className="font-semibold">{location.name}</h3>
                    <p className="text-sm text-gray-600">
                      {location.country}
                    </p>
                    <button
                      onClick={() => addLocation(location)}
                      className="mt-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition duration-200"
                    >
                      Add Location
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {locations.length > 0 && (
            <div className="flex space-x-4 mb-6 overflow-x-auto">
              {locations.map((location) => (
                <button
                  key={location.name}
                  onClick={() => {
                    setSelectedLocation(location.name);
                    fetchWeatherData(location.name);
                  }}
                  className={`px-4 py-2 rounded-lg ${
                    selectedLocation === location.name
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  } transition duration-200`}
                >
                  {location.name}
                  {location.isDefault && (
                    <span className="ml-2 text-xs">(Default)</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : weatherData ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">{selectedLocation}</h2>
                      <p className="text-4xl font-bold mt-2">
                        {weatherData.current.temp_c}°C
                      </p>
                      <p className="mt-1">{weatherData.current.condition.text}</p>
                    </div>
                    <img
                      src={`https:${weatherData.current.condition.icon}`}
                      alt={weatherData.current.condition.text}
                      className="w-16 h-16"
                    />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-4">Details</h3>
                  <div className="space-y-2">
                    <p>Feels like: {weatherData.current.feelslike_c}°C</p>
                    <p>Wind: {weatherData.current.wind_kph} km/h</p>
                    <p>Humidity: {weatherData.current.humidity}%</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-4">Forecast</h3>
                  <div className="space-y-4">
                    {weatherData.forecast.forecastday.slice(1, 4).map((day) => (
                      <div key={day.date} className="flex items-center justify-between">
                        <span>{new Date(day.date).toLocaleDateString()}</span>
                        <div className="flex items-center">
                          <img
                            src={`https:${day.day.condition.icon}`}
                            alt={day.day.condition.text}
                            className="w-8 h-8 mr-2"
                          />
                          <span>{day.day.avgtemp_c}°C</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Weather Trends</h3>
                <WeatherCharts location={selectedLocation} />
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-600">
              {isAuthenticated ? (
                locations.length === 0 ? (
                  <p>Search and add locations to get started</p>
                ) : (
                  <p>Select a location to view weather data</p>
                )
              ) : (
                <p>Please log in to view your weather dashboard</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;
