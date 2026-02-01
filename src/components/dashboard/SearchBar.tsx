import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { weatherApi } from '../../services/weatherApi';

interface CityResult {
    name: string;
    lat: number;
    lon: number;
    country: string;
    state?: string;
}

interface SearchBarProps {
    onSelectCity: (city: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSelectCity }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<CityResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length > 2) {
                try {
                    const data = await weatherApi.searchCity(query);
                    setResults(data);
                    setIsOpen(true);
                } catch (err) {
                    console.error("Search failed", err);
                }
            } else {
                setResults([]);
                setIsOpen(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [query]);

    // Click outside handler
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const handleSelect = (city: CityResult) => {
        onSelectCity(city.name); // You might want to pass lat/lon later
        setQuery('');
        setIsOpen(false);
    };

    return (
        <div ref={wrapperRef} className="relative w-full max-w-md">
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search city..."
                    className="w-full bg-slate-800 text-white pl-10 pr-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500"
                />
                <Search className="absolute left-3 top-2.5 text-slate-400" size={20} />
            </div>
            
            {isOpen && results.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                    {results.map((city, index) => (
                        <div 
                            key={`${city.lat}-${city.lon}-${index}`}
                            onClick={() => handleSelect(city)}
                            className="px-4 py-3 hover:bg-slate-700 cursor-pointer transition-colors border-b border-slate-700 last:border-0"
                        >
                            <p className="font-medium text-white">{city.name}</p>
                            <p className="text-sm text-slate-400">{city.state ? `${city.state}, ` : ''}{city.country}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
