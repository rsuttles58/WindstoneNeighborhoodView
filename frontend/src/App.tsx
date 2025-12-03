import React, { useState, useEffect, useCallback } from 'react';
import Map from './components/Map';
import FilterPanel from './components/FilterPanel';
import LocationForm from './components/LocationForm';
import FeedbackModal from './components/FeedbackModal';
import { locationApi } from './services/api';
import { Location, HolidayType } from './types';
import { getActiveHolidays } from './config/holidays';
import { useTheme } from './hooks/useTheme';
import ChristmasBanner from './assets/christmas_banner.png';
import './App.css';

function App() {
  // Initialize theme system
  useTheme();
  
  // Switch to Christmas season
  const activeHolidays = ['christmas'] as HolidayType[];
  const initialHoliday = 'christmas' as HolidayType;
  
  const [locations, setLocations] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [selectedHoliday, setSelectedHoliday] = useState<HolidayType | 'all'>(initialHoliday);
  const [selectedDecorations, setSelectedDecorations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // Map center and bounds for your neighborhood
  const [mapCenter] = useState({ lat: 34.9861, lng: -85.1092 });
  
  // Define your neighborhood boundaries (north, south, east, west)
  // Extra tight zoom - 40% closer than previous (street-level detail)
  const [mapBounds] = useState({
    north: 34.9891,  // Northern edge
    south: 34.9831,  // Southern edge
    east: -85.1062,  // Eastern edge
    west: -85.1122   // Western edge
  });

  const fetchLocations = async (holiday?: HolidayType | 'all') => {
    setLoading(true);
    setError(null);
    try {
      const data = await locationApi.getLocations(
        holiday && holiday !== 'all' ? holiday : undefined
      );
      setLocations(data);
      setFilteredLocations(data);
    } catch (err: any) {
      setError('Failed to load locations. Please try again later.');
      console.error('Error fetching locations:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = useCallback((
    locs: Location[],
    holiday: HolidayType | 'all',
    decorations: string[]
  ) => {
    // Safety check: if locs is undefined or null, use empty array
    if (!locs) {
      setFilteredLocations([]);
      return;
    }

    let filtered = locs;

    // Filter by holiday
    if (holiday !== 'all') {
      filtered = filtered.filter(loc => loc.holiday_type === holiday);
    }

    // Filter by decorations (if any selected)
    if (decorations.length > 0) {
      filtered = filtered.filter(loc => {
        // Location must have at least one of the selected decorations
        return decorations.some(decoration => loc.properties.includes(decoration));
      });
    }

    setFilteredLocations(filtered);
  }, []);

  useEffect(() => {
    fetchLocations();
  }, []);

  // Re-apply filters when locations change
  useEffect(() => {
    applyFilters(locations, selectedHoliday, selectedDecorations);
  }, [locations, selectedHoliday, selectedDecorations, applyFilters]);

  const handleHolidayChange = (holiday: HolidayType | 'all') => {
    setSelectedHoliday(holiday);
    setSelectedDecorations([]); // Clear decoration filters when changing holiday
    applyFilters(locations, holiday, []);
  };

  const handleDecorationsChange = (decorations: string[]) => {
    setSelectedDecorations(decorations);
    applyFilters(locations, selectedHoliday, decorations);
  };

  const handleFormSuccess = () => {
    fetchLocations(selectedHoliday !== 'all' ? selectedHoliday : undefined);
    setShowForm(false);
  };

  return (
    <div className="App">
      <header className="app-header" style={{ backgroundImage: `url(${ChristmasBanner})` }}>
        <h1>Windstone Christmas Lights Tour</h1>
        <p>Discover the best Christmas lights in Windstone!</p>
      </header>

      <div className="app-container">
        <div className="controls-section">
          <FilterPanel
            selectedHoliday={selectedHoliday}
            onHolidayChange={handleHolidayChange}
            selectedDecorations={selectedDecorations}
            onDecorationsChange={handleDecorationsChange}
          />
          
          <button 
            className="toggle-form-button"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? '🗺️ View Map' : '➕ Add Location'}
          </button>

          {!showForm && filteredLocations && (
            <div className="stats">
              <p>
                Showing <strong>{filteredLocations.length}</strong> location
                {filteredLocations.length !== 1 ? 's' : ''}
                {selectedHoliday !== 'all' && ` for ${selectedHoliday}`}
                {selectedDecorations.length > 0 && (
                  <span> with {selectedDecorations.length} decoration filter{selectedDecorations.length !== 1 ? 's' : ''}</span>
                )}
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading">Loading locations...</div>
        ) : showForm ? (
          <LocationForm onSubmitSuccess={handleFormSuccess} />
        ) : (
          <div className="map-container">
            <Map
              locations={filteredLocations || []}
              center={mapCenter}
              bounds={mapBounds}
            />
          </div>
        )}
      </div>

      <footer className="app-footer">
        <p>Built with ❤️ for the neighborhood</p>
        <button className="feedback-button" onClick={() => setShowFeedback(true)}>
          💬 Send Feedback
        </button>
      </footer>

      <FeedbackModal
        isOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
      />
    </div>
  );
}

export default App;
