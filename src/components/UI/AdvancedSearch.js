import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const AdvancedSearch = ({ 
  data = [], 
  searchFields = [], 
  onResults, 
  placeholder = "Rechercher...",
  filters = [],
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const filteredData = filterData();
    onResults(filteredData);
  }, [searchTerm, activeFilters, data]);

  const filterData = () => {
    let filtered = [...data];

    // Recherche textuelle
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        searchFields.some(field => {
          const value = getNestedValue(item, field);
          return value && value.toString().toLowerCase().includes(searchLower);
        })
      );
    }

    // Filtres avancés
    Object.entries(activeFilters).forEach(([filterKey, filterValue]) => {
      if (filterValue && filterValue !== '') {
        const filter = filters.find(f => f.key === filterKey);
        if (filter && filter.filterFn) {
          filtered = filtered.filter(item => filter.filterFn(item, filterValue));
        }
      }
    });

    return filtered;
  };

  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  const handleFilterChange = (filterKey, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  const clearFilters = () => {
    setActiveFilters({});
    setSearchTerm('');
  };

  const activeFilterCount = Object.values(activeFilters).filter(v => v && v !== '').length;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Barre de recherche principale */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="block w-full pl-10 pr-12 py-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500"
        />
        
        {/* Bouton filtres */}
        {filters.length > 0 && (
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-colors ${
              showFilters || activeFilterCount > 0 
                ? 'text-gold-400' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <FunnelIcon className="h-5 w-5" />
            {activeFilterCount > 0 && (
              <span className="ml-1 bg-gold-500 text-gray-900 text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                {activeFilterCount}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Panneau de filtres */}
      {showFilters && filters.length > 0 && (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-medium">Filtres avancés</h3>
            <div className="flex items-center space-x-2">
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-gray-400 hover:text-white text-sm"
                >
                  Effacer tout
                </button>
              )}
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-white"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filters.map((filter) => (
              <div key={filter.key} className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  {filter.label}
                </label>
                
                {filter.type === 'select' ? (
                  <select
                    value={activeFilters[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500"
                  >
                    <option value="">Tous</option>
                    {filter.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : filter.type === 'date' ? (
                  <input
                    type="date"
                    value={activeFilters[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500"
                  />
                ) : filter.type === 'range' ? (
                  <div className="space-y-2">
                    <input
                      type="number"
                      placeholder={`Min ${filter.label.toLowerCase()}`}
                      value={activeFilters[`${filter.key}_min`] || ''}
                      onChange={(e) => handleFilterChange(`${filter.key}_min`, e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500"
                    />
                    <input
                      type="number"
                      placeholder={`Max ${filter.label.toLowerCase()}`}
                      value={activeFilters[`${filter.key}_max`] || ''}
                      onChange={(e) => handleFilterChange(`${filter.key}_max`, e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500"
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    value={activeFilters[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    placeholder={filter.placeholder || `Filtrer par ${filter.label.toLowerCase()}`}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;
