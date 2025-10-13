import React, { useState, useEffect } from 'react';
import { HolidayType, PropertyTags } from '../types';
import { locationApi } from '../services/api';
import './FilterPanel.css';

interface FilterPanelProps {
  selectedHoliday: HolidayType | 'all';
  onHolidayChange: (holiday: HolidayType | 'all') => void;
  selectedDecorations: string[];
  onDecorationsChange: (decorations: string[]) => void;
}

// Emoji mapping for decorations
const getDecorationEmoji = (decoration: string): string => {
  const emojiMap: Record<string, string> = {
    // Halloween
    'halloween_lights': '💡',
    'pumpkins': '🎃',
    'scary_props': '😱',
    'inflatables': '🎈',
    'fog_machine': '🌫️',
    'skeleton_display': '💀',
    'witch_decor': '🧙‍♀️',
    'graveyard': '🪦',
    // Christmas
    'christmas_lights': '✨',
    'santa_display': '🎅',
    'nativity_scene': '⭐',
    'animated_display': '⚡',
    'music': '🎵',
    'reindeer': '🦌',
    'snowman': '⛄',
    'inflatable_santa': '🎅',
    // Easter
    'easter_eggs': '🥚',
    'bunny_display': '🐰',
    'pastel_lights': '✨',
    'egg_hunt': '🔍',
    'easter_baskets': '🧺',
    'spring_flowers': '🌸',
  };
  return emojiMap[decoration] || '🎉';
};

const FilterPanel: React.FC<FilterPanelProps> = ({ 
  selectedHoliday, 
  onHolidayChange,
  selectedDecorations,
  onDecorationsChange 
}) => {
  const [propertyTags, setPropertyTags] = useState<PropertyTags | null>(null);
  const [showDecorationFilter, setShowDecorationFilter] = useState(false);

  useEffect(() => {
    // Fetch available property tags
    locationApi.getPropertyTags()
      .then(tags => setPropertyTags(tags))
      .catch(err => console.error('Failed to load property tags:', err));
  }, []);

  const handleDecorationToggle = (decoration: string) => {
    if (selectedDecorations.includes(decoration)) {
      onDecorationsChange(selectedDecorations.filter(d => d !== decoration));
    } else {
      onDecorationsChange([...selectedDecorations, decoration]);
    }
  };

  const clearDecorationFilters = () => {
    onDecorationsChange([]);
  };

  // Get available decorations based on selected holiday
  const getAvailableDecorations = (): string[] => {
    if (!propertyTags) return [];
    
    if (selectedHoliday === 'all') {
      // Combine all decoration types
      return [...propertyTags.halloween, ...propertyTags.christmas, ...propertyTags.easter];
    }
    
    return propertyTags[selectedHoliday] || [];
  };

  const availableDecorations = getAvailableDecorations();

  return (
    <div className="filter-panel">
      <h3>Filter by Holiday</h3>
      <div className="filter-buttons">
        {/* Always show "All" button for filtering all holidays */}
        <button
          className={selectedHoliday === 'all' ? 'active' : ''}
          onClick={() => onHolidayChange('all')}
        >
          All
        </button>
        
        {/* Always show all holiday options for filtering, regardless of active season */}
        <button
          className={selectedHoliday === 'halloween' ? 'active halloween' : 'halloween'}
          onClick={() => onHolidayChange('halloween')}
        >
          🎃 Halloween
        </button>
        
        <button
          className={selectedHoliday === 'christmas' ? 'active christmas' : 'christmas'}
          onClick={() => onHolidayChange('christmas')}
        >
          🎄 Christmas
        </button>
        
        <button
          className={selectedHoliday === 'easter' ? 'active easter' : 'easter'}
          onClick={() => onHolidayChange('easter')}
        >
          🐰 Easter
        </button>
      </div>

      {/* Decoration Filter Section */}
      <div className="decoration-filter-section">
        <div className="decoration-filter-header">
          <h3>Filter by Decorations</h3>
          <button 
            className="toggle-decorations-button"
            onClick={() => setShowDecorationFilter(!showDecorationFilter)}
          >
            {showDecorationFilter ? '▲ Hide' : '▼ Show'}
          </button>
        </div>
        
        {showDecorationFilter && (
          <div className="decoration-filter-content">
            {selectedDecorations.length > 0 && (
              <div className="filter-actions">
                <button 
                  className="clear-filters-button"
                  onClick={clearDecorationFilters}
                >
                  ✕ Clear All ({selectedDecorations.length})
                </button>
              </div>
            )}
            
            <div className="decoration-buttons">
              {availableDecorations.map(decoration => (
                <button
                  key={decoration}
                  className={`decoration-button ${selectedDecorations.includes(decoration) ? 'selected' : ''}`}
                  onClick={() => handleDecorationToggle(decoration)}
                >
                  {getDecorationEmoji(decoration)} {decoration.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
            
            {availableDecorations.length === 0 && (
              <p className="no-decorations">No decorations available for selected holiday</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterPanel;

