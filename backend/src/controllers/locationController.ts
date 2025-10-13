import { Request, Response } from 'express';
import axios from 'axios';
import { query } from '../config/database';
import {
  Location,
  CreateLocationDto,
  UpdateLocationDto,
  GeocodeResult,
  ApiResponse,
} from '../types';

// Geocode address using Google Maps API
async function geocodeAddress(address: string): Promise<GeocodeResult> {
  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/geocode/json',
      {
        params: {
          address: address,
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      }
    );

    if (response.data.status === 'OK' && response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      return {
        latitude: location.lat,
        longitude: location.lng,
        formatted_address: response.data.results[0].formatted_address,
      };
    } else {
      throw new Error(`Geocoding failed: ${response.data.status}`);
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('Geocoding error:', errorMessage);
    throw new Error('Failed to geocode address');
  }
}

// Get all locations, optionally filtered by holiday type
export const getLocations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { holiday } = req.query;

    let queryText = 'SELECT * FROM locations';
    const params: string[] = [];

    if (holiday && typeof holiday === 'string') {
      queryText += ' WHERE holiday_type = $1';
      params.push(holiday);
    }

    queryText += ' ORDER BY created_at DESC';

    const result = await query<Location>(queryText, params);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    } as ApiResponse<Location[]>);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res
      .status(500)
      .json({ success: false, error: 'Failed to fetch locations' });
  }
};

// Get a single location by ID
export const getLocationById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await query<Location>(
      'SELECT * FROM locations WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Location not found' });
      return;
    }

    res.json({
      success: true,
      data: result.rows[0],
    } as ApiResponse<Location>);
  } catch (error) {
    console.error('Error fetching location:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch location' });
  }
};

// Create a new location
export const createLocation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { address, holiday_type, properties, notes, submitted_by } =
      req.body as CreateLocationDto;

    // Geocode the address
    const geocoded = await geocodeAddress(address);

    const result = await query<Location>(
      `INSERT INTO locations (address, latitude, longitude, holiday_type, properties, notes, submitted_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        geocoded.formatted_address,
        geocoded.latitude,
        geocoded.longitude,
        holiday_type,
        JSON.stringify(properties),
        notes || null,
        submitted_by || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Location created successfully',
      data: result.rows[0],
    } as ApiResponse<Location>);
  } catch (error) {
    console.error('Error creating location:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to create location';
    if (errorMessage.includes('geocode')) {
      res.status(400).json({ success: false, error: errorMessage });
    } else {
      res
        .status(500)
        .json({ success: false, error: 'Failed to create location' });
    }
  }
};

// Update a location
export const updateLocation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { properties, notes, submitted_by } = req.body as UpdateLocationDto;

    // Check if location exists
    const checkResult = await query<Location>(
      'SELECT * FROM locations WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Location not found' });
      return;
    }

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (properties !== undefined) {
      updates.push(`properties = $${paramCount}`);
      values.push(JSON.stringify(properties));
      paramCount++;
    }

    if (notes !== undefined) {
      updates.push(`notes = $${paramCount}`);
      values.push(notes);
      paramCount++;
    }

    if (submitted_by !== undefined) {
      updates.push(`submitted_by = $${paramCount}`);
      values.push(submitted_by);
      paramCount++;
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const queryText = `
      UPDATE locations 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await query<Location>(queryText, values);

    res.json({
      success: true,
      message: 'Location updated successfully',
      data: result.rows[0],
    } as ApiResponse<Location>);
  } catch (error) {
    console.error('Error updating location:', error);
    res
      .status(500)
      .json({ success: false, error: 'Failed to update location' });
  }
};

// Delete a location
export const deleteLocation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await query<Location>(
      'DELETE FROM locations WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Location not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Location deleted successfully',
    } as ApiResponse<never>);
  } catch (error) {
    console.error('Error deleting location:', error);
    res
      .status(500)
      .json({ success: false, error: 'Failed to delete location' });
  }
};
