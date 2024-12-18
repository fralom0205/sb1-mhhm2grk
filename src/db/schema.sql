-- Content table (unified table for all content types)
CREATE TABLE IF NOT EXISTS content (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('promotion', 'job', 'event')),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  views INTEGER DEFAULT 0,
  engagement REAL DEFAULT 0,
  step INTEGER DEFAULT 1,
  publish_date TIMESTAMP,
  expiry_date TIMESTAMP,
  target_audience TEXT[],
  
  -- Common fields for promotions/coupons
  promotion_type TEXT CHECK (promotion_type IN ('discount', 'offer', 'event')),
  location TEXT CHECK (location IN ('store', 'online', 'both')),
  usage_limit TEXT,
  validity_start TIMESTAMP,
  validity_end TIMESTAMP,
  cover_image TEXT,
  sharing_image TEXT,
  
  -- Job specific fields
  salary TEXT,
  job_type TEXT,
  requirements TEXT[],
  job_location TEXT,
  department TEXT,
  experience TEXT,
  benefits TEXT[],
  application_deadline TIMESTAMP,
  
  -- Event specific fields
  event_date TIMESTAMP,
  end_date TIMESTAMP,
  venue TEXT,
  capacity INTEGER,
  event_type TEXT,
  event_location TEXT,
  speakers TEXT[],
  agenda TEXT[],
  registration_deadline TIMESTAMP,
  registration_url TEXT,
  
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_content_user_type ON content(user_id, type);
CREATE INDEX IF NOT EXISTS idx_content_status ON content(status);
CREATE INDEX IF NOT EXISTS idx_content_step ON content(user_id, type, step);
CREATE INDEX IF NOT EXISTS idx_content_target ON content(user_id, target_audience);