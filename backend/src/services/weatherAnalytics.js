import axios from 'axios';

export const weatherAnalytics = {
  async getHistoricalTrends(location, days = 30) {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const dailyData = [];
      let currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const response = await axios.get(`${process.env.WEATHER_API_BASE_URL}/history.json`, {
          params: {
            key: process.env.WEATHER_API_KEY,
            q: location,
            dt: dateStr
          }
        });

        dailyData.push({
          date: dateStr,
          avgTemp_c: response.data.forecast.forecastday[0].day.avgtemp_c,
          totalPrecip_mm: response.data.forecast.forecastday[0].day.totalprecip_mm
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }

      return {
        averageTemperature: calculateAverage(dailyData.map(d => d.avgTemp_c)),
        totalPrecipitation: dailyData.reduce((sum, d) => sum + d.totalPrecip_mm, 0),
        dailyData
      };
    } catch (error) {
      console.error('Error fetching historical trends:', error);
      throw error;
    }
  },

  async getMonthlyAverages(location, year) {
    const monthlyData = [];
    
    for (let month = 0; month < 12; month++) {
      const date = new Date(year, month, 1);
      const dateStr = date.toISOString().split('T')[0];
      
      try {
        const response = await axios.get(`${process.env.WEATHER_API_BASE_URL}/history.json`, {
          params: {
            key: process.env.WEATHER_API_KEY,
            q: location,
            dt: dateStr
          }
        });

        monthlyData.push({
          month: month + 1,
          avgTemp_c: response.data.forecast.forecastday[0].day.avgtemp_c,
          totalPrecip_mm: response.data.forecast.forecastday[0].day.totalprecip_mm
        });
      } catch (error) {
        console.error(`Error fetching data for ${dateStr}:`, error);
      }
    }

    return monthlyData;
  }
};

function calculateAverage(numbers) {
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
}
