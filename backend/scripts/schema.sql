-- Database schema for neighborhood decorations app

CREATE TABLE IF NOT EXISTS locations (
  id SERIAL PRIMARY KEY,
  address VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  holiday_type VARCHAR(50) NOT NULL,
  properties JSONB NOT NULL DEFAULT '[]'::jsonb,
  notes TEXT,
  submitted_by VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_holiday_type ON locations(holiday_type);
CREATE INDEX IF NOT EXISTS idx_properties ON locations USING GIN (properties);
CREATE INDEX IF NOT EXISTS idx_created_at ON locations(created_at DESC);

-- Add constraint to validate holiday types
ALTER TABLE locations ADD CONSTRAINT check_holiday_type 
  CHECK (holiday_type IN ('halloween', 'christmas', 'easter'));

