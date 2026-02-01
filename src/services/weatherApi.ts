import axios from 'axios';

const API_KEY = 'cd3947336e91475380c50019260102';
const BASE_URL = 'https://api.weatherapi.com/v1';

// Helper to map WeatherAPI current response to OWM structure
const mapCurrentToOWM = (data: any) => ({
    id: data.location.lat + data.location.lon, // Fake ID
    name: data.location.name,
    coord: { lat: data.location.lat, lon: data.location.lon },
    main: {
        temp: data.current.temp_c,
        humidity: data.current.humidity,
        pressure: data.current.pressure_mb,
        temp_min: data.current.temp_c, // Not provided in current
        temp_max: data.current.temp_c, // Not provided in current (could fetch from forecast)
        feels_like: data.current.feelslike_c,
        sea_level: data.current.pressure_mb,
        grnd_level: data.current.pressure_mb
    },
    weather: [{
        main: data.current.condition.text,
        description: data.current.condition.text,
        icon: data.current.condition.icon // This is a full URL usually
    }],
    wind: { speed: data.current.wind_kph / 3.6, deg: data.current.wind_degree }, // kph to m/s
    visibility: data.current.vis_km * 1000,
    uv: data.current.uv,
    sys: { country: data.location.country },
    dt: data.location.localtime_epoch,
});

// Helper to map WeatherAPI forecast to OWM 5-day list structure
const mapForecastToOWM = (data: any) => ({
    city: {
        name: data.location.name,
        country: data.location.country,
        coord: { lat: data.location.lat, lon: data.location.lon },
    },
    list: data.forecast.forecastday.flatMap((day: any) => 
        day.hour.filter((_: any, index: number) => index % 3 === 0).map((hour: any) => ({
            dt: hour.time_epoch,
            main: {
                temp: hour.temp_c,
                temp_min: hour.temp_c,
                temp_max: hour.temp_c,
                pressure: hour.pressure_mb,
                humidity: hour.humidity,
                feels_like: hour.feelslike_c,
                sea_level: hour.pressure_mb,
                grnd_level: hour.pressure_mb
            },
            weather: [{
                main: hour.condition.text,
                description: hour.condition.text,
                icon: hour.condition.icon
            }],
            wind: { speed: hour.wind_kph / 3.6, deg: hour.wind_degree },
            pop: hour.chance_of_rain // Keep as percentage 0-100 for simpler Chart display
        }))
    )
});

export const weatherApi = {
    getCurrentWeather: async (city: string) => {
        try {
            const response = await axios.get(`${BASE_URL}/forecast.json`, { // Use forecast to get min/max if needed, or current
                params: {
                    key: API_KEY,
                    q: city,
                    days: 1, // Get today's max/min
                    aqi: 'no',
                    alerts: 'no'
                }
            });
            
            // Enrich current data with today's high/low from forecast
            const current = mapCurrentToOWM(response.data);
            const today = response.data.forecast.forecastday[0].day;
            current.main.temp_max = today.maxtemp_c;
            current.main.temp_min = today.mintemp_c;
            
            return current;
        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    },
    
    getForecast: async (city: string) => {
        try {
             // WeatherAPI allows days parameter. OWM returns 5 days.
             const response = await axios.get(`${BASE_URL}/forecast.json`, {
                params: {
                    key: API_KEY,
                    q: city,
                    days: 5,
                    aqi: 'no',
                    alerts: 'no'
                }
            });
            return mapForecastToOWM(response.data);
        } catch (error) {
           console.error("API Error:", error);
           throw error;   
        }
    },

    searchCity: async (query: string) => {
        try {
            const response = await axios.get(`${BASE_URL}/search.json`, {
                params: {
                    key: API_KEY,
                    q: query
                }
            });
            // Map to expected format: { name, lat, lon, country, state }
            return response.data.map((item: any) => ({
                name: item.name,
                lat: item.lat,
                lon: item.lon,
                country: item.country,
                state: item.region || ''
            }));
        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    }
}
