export type HolidayType = 'halloween' | 'christmas' | 'easter';

export interface Location {
  id: number;
  address: string;
  latitude: number;
  longitude: number;
  holiday_type: HolidayType;
  properties: string[];
  notes?: string;
  submitted_by?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateLocationDto {
  address: string;
  holiday_type: HolidayType;
  properties: string[];
  notes?: string;
  submitted_by?: string;
}

export interface UpdateLocationDto {
  properties?: string[];
  notes?: string;
  submitted_by?: string;
}

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  formatted_address: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  message?: string;
  error?: string;
}
