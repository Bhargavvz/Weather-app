import { useState } from 'react';
import { useQuery } from 'react-query';
import { weatherApi } from '../services/weatherApi';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface SearchLocationProps {
  onLocationSelect: (location: string) => void;
}

export function SearchLocation({ onLocationSelect }: SearchLocationProps) {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const { data: locations, isLoading } = useQuery(
    ['locations', search],
    () => weatherApi.searchLocations(search),
    {
      enabled: search.length > 2,
      staleTime: 300000, // Cache results for 5 minutes
    }
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setIsOpen(true);
  };

  const handleSelect = (location: string) => {
    onLocationSelect(location);
    setSearch('');
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search for a city..."
          className="input pl-10"
        />
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>

      {isOpen && search.length > 2 && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          {isLoading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : locations?.length > 0 ? (
            <ul className="max-h-60 overflow-auto">
              {locations.map((location: any, index: number) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleSelect(location.url)}
                >
                  {location.name}, {location.country}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center">No locations found</div>
          )}
        </div>
      )}
    </div>
  );
}
