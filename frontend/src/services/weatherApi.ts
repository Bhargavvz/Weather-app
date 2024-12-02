import axios from 'axios';
import { WeatherData } from '../types/weather';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'http://api.weatherapi.com/v1';

export const weatherApi = {
  async getCurrentWeather(location: string): Promise<WeatherData> {
    try {
      const response = await axios.get(`${BASE_URL}/forecast.json`, {
        params: {
          key: API_KEY,
          q: location,
          days: 7,
          aqi: 'no',
          alerts: 'yes',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  },

  async searchLocations(query: string) {
    try {
      const response = await axios.get(`${BASE_URL}/search.json`, {
        params: {
          key: API_KEY,
          q: query,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching locations:', error);
      throw error;
    }
  },
};
