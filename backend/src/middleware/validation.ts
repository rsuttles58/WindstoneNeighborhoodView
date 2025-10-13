import { Request, Response, NextFunction } from 'express';
import { HOLIDAY_TYPES, PROPERTY_TAGS } from '../config/constants';
import { CreateLocationDto, UpdateLocationDto, HolidayType } from '../types';

export const validateLocation = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { address, holiday_type, properties, notes, submitted_by } =
    req.body as CreateLocationDto;

  // Validate required fields
  if (!address || typeof address !== 'string' || address.trim().length === 0) {
    res.status(400).json({ error: 'Valid address is required' });
    return;
  }

  if (!holiday_type || !Object.values(HOLIDAY_TYPES).includes(holiday_type)) {
    res.status(400).json({
      error: 'Valid holiday_type is required',
      valid_types: Object.values(HOLIDAY_TYPES),
    });
    return;
  }

  // Validate properties array
  if (!Array.isArray(properties) || properties.length === 0) {
    res.status(400).json({ error: 'At least one property is required' });
    return;
  }

  // Validate properties against allowed tags for the holiday type
  const allowedTags = PROPERTY_TAGS[holiday_type as HolidayType];
  const invalidProperties = properties.filter(
    (prop) => !allowedTags.includes(prop)
  );

  if (invalidProperties.length > 0) {
    res.status(400).json({
      error: 'Invalid properties for this holiday type',
      invalid_properties: invalidProperties,
      allowed_properties: allowedTags,
    });
    return;
  }

  // Validate optional fields
  if (notes !== undefined && typeof notes !== 'string') {
    res.status(400).json({ error: 'Notes must be a string' });
    return;
  }

  if (submitted_by !== undefined && typeof submitted_by !== 'string') {
    res.status(400).json({ error: 'submitted_by must be a string' });
    return;
  }

  next();
};

export const validateLocationUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { properties, notes, submitted_by } = req.body as UpdateLocationDto;

  // For updates, all fields are optional, but if provided must be valid
  if (properties !== undefined) {
    if (!Array.isArray(properties) || properties.length === 0) {
      res.status(400).json({ error: 'Properties must be a non-empty array' });
      return;
    }
  }

  if (notes !== undefined && typeof notes !== 'string') {
    res.status(400).json({ error: 'Notes must be a string' });
    return;
  }

  if (submitted_by !== undefined && typeof submitted_by !== 'string') {
    res.status(400).json({ error: 'submitted_by must be a string' });
    return;
  }

  next();
};
