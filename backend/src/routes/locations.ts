import express from 'express';
import * as locationController from '../controllers/locationController';
import {
  validateLocation,
  validateLocationUpdate,
} from '../middleware/validation';

const router = express.Router();

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

export default router;
