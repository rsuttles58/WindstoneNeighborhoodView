import React, { useState, useEffect } from 'react';
import { HolidayType, CreateLocationData, PropertyTags } from '../types';
import { locationApi } from '../services/api';
import { getActiveHolidays } from '../config/holidays';
import './LocationForm.css';

interface LocationFormProps {
  onSubmitSuccess: () => void;
}

const LocationForm: React.FC<LocationFormProps> = ({ onSubmitSuccess }) => {
  const activeHolidays = getActiveHolidays();
  const [formData, setFormData] = useState<CreateLocationData>({
    address: '',
    holiday_type: activeHolidays[0] || 'halloween', // Default to first active holiday
    properties: [],
    notes: '',
    submitted_by: '',
  });

  const [propertyTags, setPropertyTags] = useState<PropertyTags | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Fetch available property tags
    locationApi.getPropertyTags()
      .then(tags => setPropertyTags(tags))
      .catch(err => console.error('Failed to load property tags:', err));
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePropertyToggle = (property: string) => {
    setFormData(prev => ({
      ...prev,
      properties: prev.properties.includes(property)
        ? prev.properties.filter(p => p !== property)
        : [...prev.properties, property],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validation
    if (!formData.address.trim()) {
      setError('Address is required');
      return;
    }

    if (formData.properties.length === 0) {
      setError('Please select at least one decoration feature');
      return;
    }

    setIsSubmitting(true);

    try {
      await locationApi.createLocation(formData);
      setSuccess(true);
      // Reset form
      setFormData({
        address: '',
        holiday_type: activeHolidays[0] || 'halloween',
        properties: [],
        notes: '',
        submitted_by: '',
      });
      onSubmitSuccess();
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit location. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableProperties = propertyTags ? propertyTags[formData.holiday_type] : [];

  return (
    <div className="location-form">
      <h2>Submit a Decoration Location</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="holiday_type">Holiday Type *</label>
          <select
            id="holiday_type"
            name="holiday_type"
            value={formData.holiday_type}
            onChange={handleInputChange}
            required
          >
            {activeHolidays.includes('halloween') && (
              <option value="halloween">🎃 Halloween</option>
            )}
            {activeHolidays.includes('christmas') && (
              <option value="christmas">🎄 Christmas</option>
            )}
            {activeHolidays.includes('easter') && (
              <option value="easter">🐰 Easter</option>
            )}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="address">Address *</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="123 Main Street, City, State"
            required
          />
        </div>

        <div className="form-group">
          <label>Decorations * (select at least one)</label>
          <div className="checkbox-grid">
            {availableProperties.map(property => (
              <label key={property} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.properties.includes(property)}
                  onChange={() => handlePropertyToggle(property)}
                />
                {property.replace(/_/g, ' ')}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="notes">Additional Notes (optional)</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Any special details about the decorations..."
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="submitted_by">Your Name (optional)</label>
          <input
            type="text"
            id="submitted_by"
            name="submitted_by"
            value={formData.submitted_by}
            onChange={handleInputChange}
            placeholder="Your name"
          />
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Location submitted successfully!</div>}

        <button type="submit" disabled={isSubmitting} className="submit-button">
          {isSubmitting ? 'Submitting...' : 'Submit Location'}
        </button>
      </form>
    </div>
  );
};

export default LocationForm;

