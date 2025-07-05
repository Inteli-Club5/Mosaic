import { useState, useMemo } from 'react';

const useFilters = (initialFilters = {}) => {
  const [filters, setFilters] = useState(initialFilters);

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const applyFilters = (items, filterConfig) => {
    return items.filter(item => {
      return Object.entries(filterConfig).every(([key, config]) => {
        const filterValue = filters[key];
        
        if (!filterValue || filterValue === '') return true;
        
        const itemValue = item[key];
        
        switch (config.type) {
          case 'exact':
            return itemValue === filterValue;
          case 'range':
            return itemValue >= filterValue.min && itemValue <= filterValue.max;
          case 'min':
            return itemValue >= filterValue;
          case 'max':
            return itemValue <= filterValue;
          case 'includes':
            return itemValue.includes(filterValue);
          default:
            return true;
        }
      });
    });
  };

  const sortItems = (items, sortConfig) => {
    const { key, direction = 'asc' } = sortConfig;
    
    return [...items].sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];
      
      if (direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  return {
    filters,
    updateFilter,
    updateFilters,
    resetFilters,
    applyFilters,
    sortItems
  };
};

export default useFilters; 