import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { convertTemp } from '../../utils/unitConversion';

interface ForecastChartProps {
  data: any[];
  type?: 'temp' | 'wind' | 'humidity' | 'rain';
  unit?: 'metric' | 'imperial';
}

const ForecastChart: React.FC<ForecastChartProps> = ({ data, type = 'temp', unit = 'metric' }) => {
  
  const chartConfig = {
      temp: { key: 'main.temp', color: '#f59e0b', label: 'Temperature', unitSym: '°' },
      wind: { key: 'wind.speed', color: '#3b82f6', label: 'Wind Speed', unitSym: ' m/s' },
      humidity: { key: 'main.humidity', color: '#10b981', label: 'Humidity', unitSym: '%' },
      rain: { key: 'pop', color: '#60a5fa', label: 'Chance of Rain', unitSym: '%' }
  };

  const config = chartConfig[type];

  // Helper to deep access keys like "main.temp"
  const getValue = (obj: any, path: string) => {
      return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  const processedData = data.map(item => ({
      ...item,
      displayValue: type === 'temp' 
          ? convertTemp(getValue(item, config.key), unit)
          : Math.round(getValue(item, config.key)),
      time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', hour12: true })
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={processedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`color${type}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={config.color} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={config.color} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
        <XAxis 
            dataKey="time" 
            stroke="#94a3b8" 
            tick={{fontSize: 12}} 
            tickLine={false}
            axisLine={false}
        />
        <YAxis 
            stroke="#94a3b8" 
            tick={{fontSize: 12}} 
            tickLine={false}
            axisLine={false}
            unit={config.unitSym}
        />
        <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', color: '#fff' }}
        />
        <Area 
            type="monotone" 
            dataKey="displayValue" 
            name={config.label}
            stroke={config.color} 
            fillOpacity={1} 
            fill={`url(#color${type})`} 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default ForecastChart;
