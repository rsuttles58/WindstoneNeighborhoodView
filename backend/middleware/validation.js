const { HOLIDAY_TYPES, PROPERTY_TAGS } = require('../config/constants');

const validateLocation = (req, res, next) => {
  const { address, holiday_type, properties, notes, submitted_by } = req.body;

  // Validate required fields
  if (!address || typeof address !== 'string' || address.trim().length === 0) {
    return res.status(400).json({ error: 'Valid address is required' });
  }

  if (!holiday_type || !Object.values(HOLIDAY_TYPES).includes(holiday_type)) {
    return res.status(400).json({ 
      error: 'Valid holiday_type is required',
      valid_types: Object.values(HOLIDAY_TYPES)
    });
  }

  // Validate properties array
  if (!Array.isArray(properties) || properties.length === 0) {
    return res.status(400).json({ error: 'At least one property is required' });
  }

  // Validate properties against allowed tags for the holiday type
  const allowedTags = PROPERTY_TAGS[holiday_type];
  const invalidProperties = properties.filter(prop => !allowedTags.includes(prop));
  
  if (invalidProperties.length > 0) {
    return res.status(400).json({ 
      error: 'Invalid properties for this holiday type',
      invalid_properties: invalidProperties,
      allowed_properties: allowedTags
    });
  }

  // Validate optional fields
  if (notes && typeof notes !== 'string') {
    return res.status(400).json({ error: 'Notes must be a string' });
  }

  if (submitted_by && typeof submitted_by !== 'string') {
    return res.status(400).json({ error: 'submitted_by must be a string' });
  }

  next();
};

const validateLocationUpdate = (req, res, next) => {
  const { properties, notes, submitted_by } = req.body;

  // For updates, all fields are optional, but if provided must be valid
  if (properties !== undefined) {
    if (!Array.isArray(properties) || properties.length === 0) {
      return res.status(400).json({ error: 'Properties must be a non-empty array' });
    }
  }

  if (notes !== undefined && typeof notes !== 'string') {
    return res.status(400).json({ error: 'Notes must be a string' });
  }

  if (submitted_by !== undefined && typeof submitted_by !== 'string') {
    return res.status(400).json({ error: 'submitted_by must be a string' });
  }

  next();
};

module.exports = {
  validateLocation,
  validateLocationUpdate
};

