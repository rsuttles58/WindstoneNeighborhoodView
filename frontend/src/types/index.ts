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
  created_at: string;
  updated_at: string;
}

export interface CreateLocationData {
  address: string;
  holiday_type: HolidayType;
  properties: string[];
  notes?: string;
  submitted_by?: string;
}

export interface PropertyTags {
  halloween: string[];
  christmas: string[];
  easter: string[];
}
