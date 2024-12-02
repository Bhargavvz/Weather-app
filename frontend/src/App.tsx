import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import LandingPage from './components/LandingPage';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import WeatherDashboard from './components/WeatherDashboard';
import { Header } from './components/Header';
import { UserPreferences } from './types/weather';

const queryClient = new QueryClient();

function App() {
  const [preferences, setPreferences] = useState<UserPreferences>({
    temperatureUnit: 'C',
    speedUnit: 'kph',
    theme: 'light',
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', preferences.theme === 'dark');
  }, [preferences.theme]);

  return (
    <Router>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Header 
              preferences={preferences}
              onPreferencesChange={setPreferences}
            />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <WeatherDashboard preferences={preferences} />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
          </div>
        </QueryClientProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
