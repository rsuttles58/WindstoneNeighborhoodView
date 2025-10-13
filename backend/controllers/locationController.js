const axios = require('axios');
const db = require('../config/database');

// Geocode address using Google Maps API
async function geocodeAddress(address) {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: address,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });

    if (response.data.status === 'OK' && response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      return {
        latitude: location.lat,
        longitude: location.lng,
        formatted_address: response.data.results[0].formatted_address
      };
    } else {
      throw new Error(`Geocoding failed: ${response.data.status}`);
    }
  } catch (error) {
    console.error('Geocoding error:', error.message);
    throw new Error('Failed to geocode address');
  }
}

// Get all locations, optionally filtered by holiday type
const getLocations = async (req, res) => {
  try {
    const { holiday } = req.query;
    
    let query = 'SELECT * FROM locations';
    const params = [];
    
    if (holiday) {
      query += ' WHERE holiday_type = $1';
      params.push(holiday);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await db.query(query, params);
    
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
};

// Get a single location by ID
const getLocationById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(
      'SELECT * FROM locations WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching location:', error);
    res.status(500).json({ error: 'Failed to fetch location' });
  }
};

// Create a new location
const createLocation = async (req, res) => {
  try {
    const { address, holiday_type, properties, notes, submitted_by } = req.body;
    
    // Geocode the address
    const geocoded = await geocodeAddress(address);
    
    const result = await db.query(
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
        submitted_by || null
      ]
    );
    
    res.status(201).json({
      success: true,
      message: 'Location created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating location:', error);
    if (error.message.includes('geocode')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to create location' });
    }
  }
};

// Update a location
const updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { properties, notes, submitted_by } = req.body;
    
    // Check if location exists
    const checkResult = await db.query(
      'SELECT * FROM locations WHERE id = $1',
      [id]
    );
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }
    
    // Build update query dynamically
    const updates = [];
    const values = [];
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
    
    const query = `
      UPDATE locations 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
    
    const result = await db.query(query, values);
    
    res.json({
      success: true,
      message: 'Location updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({ error: 'Failed to update location' });
  }
};

// Delete a location
const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(
      'DELETE FROM locations WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }
    
    res.json({
      success: true,
      message: 'Location deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting location:', error);
    res.status(500).json({ error: 'Failed to delete location' });
  }
};

module.exports = {
  getLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation
};

