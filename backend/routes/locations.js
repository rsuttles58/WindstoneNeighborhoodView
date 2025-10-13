const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const { validateLocation, validateLocationUpdate } = require('../middleware/validation');

// Get all locations (with optional holiday filter)
router.get('/', locationController.getLocations);

// Get specific location by ID
router.get('/:id', locationController.getLocationById);

// Create new location
router.post('/', validateLocation, locationController.createLocation);

// Update location
router.put('/:id', validateLocationUpdate, locationController.updateLocation);

// Delete location
router.delete('/:id', locationController.deleteLocation);

module.exports = router;

