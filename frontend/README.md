# Weather App

A modern weather application built with React, TypeScript, and Vite. Features include current weather conditions, 7-day forecast, hourly temperature charts, and weather alerts.

## Features

- Current weather display with temperature, humidity, wind speed, and conditions
- 7-day weather forecast
- Hourly temperature charts
- Location search with autocomplete
- Weather alerts
- Dark/Light theme support
- Unit conversion (Celsius/Fahrenheit, km/h/mph)
- Responsive design

## Technologies Used

- React
- TypeScript
- Vite
- Tailwind CSS
- Chart.js
- React Query
- WeatherAPI

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your WeatherAPI key:
   ```
   VITE_WEATHER_API_KEY=your_api_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

- `VITE_WEATHER_API_KEY`: Your WeatherAPI API key (Get one at [WeatherAPI](https://www.weatherapi.com))

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build locally

## License

MIT
