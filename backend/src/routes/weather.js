import express from 'express';
import axios from 'axios';
import NodeCache from 'node-cache';
import { auth } from '../middleware/auth.js';
import WeatherCache from '../models/WeatherCache.js';

const router = express.Router();
const cache = new NodeCache({ stdTTL: 1800 }); // 30 minutes

// Get current weather and forecast
router.get('/forecast/:location', auth, async (req, res) => {
  try {
    const { location } = req.params;
    const cacheKey = `weather_${location}`;

    // Check memory cache first
    let weatherData = cache.get(cacheKey);

    if (!weatherData) {
      // Check MongoDB cache
      const cachedData = await WeatherCache.findOne({ location });
      if (cachedData) {
        weatherData = cachedData.data;
        cache.set(cacheKey, weatherData);
      } else {
        // Fetch from Weather API
        const response = await axios.get(`${process.env.WEATHER_API_BASE_URL}/forecast.json`, {
          params: {
            key: process.env.WEATHER_API_KEY,
            q: location,
            days: 7,
            aqi: 'yes'
          }
        });

        weatherData = response.data;

        // Save to cache
        cache.set(cacheKey, weatherData);
        await WeatherCache.create({
          location,
          data: weatherData
        });
      }
    }

    res.json(weatherData);
  } catch (error) {
    console.error('Weather API Error:', error);
    res.status(500).json({ message: 'Error fetching weather data' });
  }
});

// Get historical weather data
router.get('/history/:location', auth, async (req, res) => {
  try {
    const { location } = req.params;
    const { dt } = req.query; // Date in YYYY-MM-DD format

    const response = await axios.get(`${process.env.WEATHER_API_BASE_URL}/history.json`, {
      params: {
        key: process.env.WEATHER_API_KEY,
        q: location,
        dt
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Historical Weather API Error:', error);
    res.status(500).json({ message: 'Error fetching historical weather data' });
  }
});

// Search locations
router.get('/search', auth, async (req, res) => {
  try {
    const { q } = req.query;

    const response = await axios.get(`${process.env.WEATHER_API_BASE_URL}/search.json`, {
      params: {
        key: process.env.WEATHER_API_KEY,
        q
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Location Search Error:', error);
    res.status(500).json({ message: 'Error searching locations' });
  }
});

export default router;
