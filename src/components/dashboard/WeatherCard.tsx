import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wind, Droplets, ArrowRight, Heart } from 'lucide-react';
import type { WeatherData } from '../../features/weather/weatherSlice';
import { convertTemp } from '../../utils/unitConversion';

interface WeatherCardProps {
  data: WeatherData;
  unit: 'metric' | 'imperial';
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ data, unit, isFavorite, onToggleFavorite }) => {
  const navigate = useNavigate();
  const iconCode = data.weather[0].icon;
  const iconUrl = iconCode.startsWith('//') ? `https:${iconCode}` : `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

  return (
    <div 
        onClick={() => navigate(`/city/${data.name}`)}
        className="group relative bg-glass border border-glassBorder rounded-2xl p-6 cursor-pointer hover:bg-[rgba(255,255,255,0.3)] transition-all duration-300 backdrop-blur-md shadow-lg"
    >
      <button 
        onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(); }}
        className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition z-10"
      >
        <Heart fill={isFavorite ? "currentColor" : "none"} className={isFavorite ? "text-red-500" : ""} />
      </button>

      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-white">{data.name}</h2>
          <p className="text-slate-300 capitalize">{data.weather[0].description}</p>
        </div>
        <img src={iconUrl} alt={data.weather[0].main} className="w-16 h-16 -mt-2 -mr-2 drop-shadow-md" />
      </div>
      
      <div className="mt-4">
        <h3 className="text-5xl font-bold text-white tracking-tighter">
          {convertTemp(data.main.temp, unit)}°
        </h3>
        <p className="text-slate-300 mt-1">
          H: {convertTemp(data.main.temp_max, unit)}°  L: {convertTemp(data.main.temp_min, unit)}°
        </p>
      </div>
      
      <div className="mt-6 flex items-center justify-between text-sm text-slate-300">
        <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
                <Wind size={16} /> {Math.round(data.wind.speed)} m/s
            </span>
            <span className="flex items-center gap-1">
                <Droplets size={16} /> {data.main.humidity}%
            </span>
        </div>
        
        <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white flex items-center">
            Details <ArrowRight size={16} className="ml-1" />
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
