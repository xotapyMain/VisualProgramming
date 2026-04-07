import React from 'react';
import { formatDate } from '../utils/formatDate';

interface WeatherCardProps {
  dt: number;
  temp: number;
  icon: string;
  description: string;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ dt, temp, icon, description }) => {
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  return (
    <div className="weather-card">
      <p className="card-date">{formatDate(dt)}</p>
      <img src={iconUrl} alt={description} title={description} />
      <p className="card-temp">{Math.round(temp)}°C</p>
    </div>
  );
};
