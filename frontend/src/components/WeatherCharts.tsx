import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface WeatherTrend {
  date: string;
  avgTemp_c: number;
  totalPrecip_mm: number;
}

interface Props {
  location: string;
}

const WeatherCharts: React.FC<Props> = ({ location }) => {
  const [historicalData, setHistoricalData] = useState<WeatherTrend[]>([]);
  const [monthlyAverages, setMonthlyAverages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | 'monthly'>('7days');

  useEffect(() => {
    if (location) {
      fetchHistoricalData();
    }
  }, [location, timeRange]);

  const fetchHistoricalData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      let endpoint = '';
      
      if (timeRange === 'monthly') {
        endpoint = `http://localhost:5000/api/weather/analytics/monthly/${location}`;
      } else {
        const days = timeRange === '7days' ? 7 : 30;
        endpoint = `http://localhost:5000/api/weather/analytics/trends/${location}?days=${days}`;
      }

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (timeRange === 'monthly') {
        setMonthlyAverages(response.data);
      } else {
        setHistoricalData(response.data.dailyData);
      }
    } catch (error) {
      console.error('Error fetching historical data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const formatMonth = (month: number) => {
    return new Date(2024, month - 1).toLocaleDateString('en-US', {
      month: 'short',
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Weather Trends</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeRange('7days')}
            className={`px-3 py-1 rounded ${
              timeRange === '7days'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setTimeRange('30days')}
            className={`px-3 py-1 rounded ${
              timeRange === '30days'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setTimeRange('monthly')}
            className={`px-3 py-1 rounded ${
              timeRange === 'monthly'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={timeRange === 'monthly' ? monthlyAverages : historicalData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey={timeRange === 'monthly' ? 'month' : 'date'}
                  tickFormatter={timeRange === 'monthly' ? formatMonth : formatDate}
                />
                <YAxis yAxisId="temp" name="Temperature (°C)" />
                <YAxis yAxisId="precip" orientation="right" name="Precipitation (mm)" />
                <Tooltip
                  labelFormatter={
                    timeRange === 'monthly'
                      ? (value) => formatMonth(value)
                      : (value) => formatDate(value)
                  }
                />
                <Legend />
                <Line
                  yAxisId="temp"
                  type="monotone"
                  dataKey="avgTemp_c"
                  name="Temperature"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line
                  yAxisId="precip"
                  type="monotone"
                  dataKey="totalPrecip_mm"
                  name="Precipitation"
                  stroke="#82ca9d"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {timeRange !== 'monthly' && historicalData.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Temperature Analysis</h4>
                <p>
                  Average:{' '}
                  {(
                    historicalData.reduce((sum, day) => sum + day.avgTemp_c, 0) /
                    historicalData.length
                  ).toFixed(1)}
                  °C
                </p>
                <p>
                  Max:{' '}
                  {Math.max(...historicalData.map((day) => day.avgTemp_c)).toFixed(
                    1
                  )}
                  °C
                </p>
                <p>
                  Min:{' '}
                  {Math.min(...historicalData.map((day) => day.avgTemp_c)).toFixed(
                    1
                  )}
                  °C
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Precipitation Analysis</h4>
                <p>
                  Total:{' '}
                  {historicalData
                    .reduce((sum, day) => sum + day.totalPrecip_mm, 0)
                    .toFixed(1)}
                  mm
                </p>
                <p>
                  Average:{' '}
                  {(
                    historicalData.reduce(
                      (sum, day) => sum + day.totalPrecip_mm,
                      0
                    ) / historicalData.length
                  ).toFixed(1)}
                  mm/day
                </p>
                <p>
                  Rainy Days:{' '}
                  {
                    historicalData.filter((day) => day.totalPrecip_mm > 0).length
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WeatherCharts;
