import axios from 'axios';
import {
  Location,
  CreateLocationData,
  PropertyTags,
  HolidayType,
} from '../types';

const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const locationApi = {
  // Get all locations, optionally filtered by holiday
  getLocations: async (holiday?: HolidayType): Promise<Location[]> => {
    const params = holiday ? { holiday } : {};
    const response = await api.get<{ success: boolean; data: Location[] }>(
      '/locations',
      { params }
    );
    return response.data.data;
  },

  // Get a specific location by ID
  getLocationById: async (id: number): Promise<Location> => {
    const response = await api.get<{ success: boolean; data: Location }>(
      `/locations/${id}`
    );
    return response.data.data;
  },

  // Create a new location
  createLocation: async (data: CreateLocationData): Promise<Location> => {
    const response = await api.post<{ success: boolean; data: Location }>(
      '/locations',
      data
    );
    return response.data.data;
  },

  // Get available property tags
  getPropertyTags: async (): Promise<PropertyTags> => {
    const response = await api.get<{ success: boolean; data: PropertyTags }>(
      '/properties'
    );
    return response.data.data;
  },

  // Get available holiday types
  getHolidayTypes: async (): Promise<HolidayType[]> => {
    const response = await api.get<{ success: boolean; data: HolidayType[] }>(
      '/holidays'
    );
    return response.data.data;
  },
};

export default api;
