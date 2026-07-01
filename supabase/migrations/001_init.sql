-- Create building_type enum
DO $$ BEGIN
  CREATE TYPE building_type AS ENUM ('عمودي', 'افقي');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  serial SERIAL,
  project_name TEXT NOT NULL DEFAULT '',
  project_location TEXT DEFAULT '',
  building_type building_type,
  building_count INTEGER CHECK (building_count >= 0),
  apartment_count INTEGER CHECK (apartment_count >= 0),
  floor_count INTEGER CHECK (floor_count >= 0),
  approved_plans BOOLEAN,
  bidder TEXT DEFAULT '',
  bid_issue_date DATE,
  bid_validity_date DATE,
  new_bid_issue TEXT DEFAULT '',
  authorized_person TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  result TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  has_notes BOOLEAN DEFAULT FALSE,
  bid_link TEXT DEFAULT '',
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view own projects" ON projects;
DROP POLICY IF EXISTS "Users can insert own projects" ON projects;
DROP POLICY IF EXISTS "Users can update own projects" ON projects;

-- RLS Policies
CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Index on user_id
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_serial ON projects(serial);
