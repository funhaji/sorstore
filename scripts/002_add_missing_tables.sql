-- IMPORTANT: Run this script to create the missing tables
-- This adds: categories, sliders, banners tables
-- And updates products + site_settings with missing columns

-- 1. Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_fa TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid errors on re-run)
DROP POLICY IF EXISTS "Anyone can view categories" ON categories;
DROP POLICY IF EXISTS "Allow all category operations" ON categories;

-- RLS policies for categories
CREATE POLICY "Anyone can view categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow all category operations" ON categories FOR ALL USING (true);

-- 2. Create sliders table
CREATE TABLE IF NOT EXISTS sliders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_fa TEXT NOT NULL,
  subtitle_fa TEXT,
  image_url TEXT,
  link_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on sliders
ALTER TABLE sliders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view sliders" ON sliders;
DROP POLICY IF EXISTS "Allow all slider operations" ON sliders;

-- RLS policies for sliders
CREATE POLICY "Anyone can view sliders" ON sliders FOR SELECT USING (true);
CREATE POLICY "Allow all slider operations" ON sliders FOR ALL USING (true);

-- 3. Create banners table
CREATE TABLE IF NOT EXISTS banners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_fa TEXT NOT NULL,
  image_url TEXT,
  link_url TEXT,
  position TEXT DEFAULT 'hero_side',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on banners
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view banners" ON banners;
DROP POLICY IF EXISTS "Allow all banner operations" ON banners;

-- RLS policies for banners
CREATE POLICY "Anyone can view banners" ON banners FOR SELECT USING (true);
CREATE POLICY "Allow all banner operations" ON banners FOR ALL USING (true);

-- 4. Add category_id to products if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'category_id'
  ) THEN
    ALTER TABLE products ADD COLUMN category_id UUID REFERENCES categories(id) ON DELETE SET NULL;
  END IF;
END $$;

-- 5. Add missing columns to site_settings
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'site_settings' AND column_name = 'hero_title'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN hero_title TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'site_settings' AND column_name = 'hero_subtitle'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN hero_subtitle TEXT;
  END IF;
END $$;

-- 6. Ensure site_settings has at least one row
INSERT INTO site_settings (id, site_name, hero_title, hero_subtitle)
SELECT gen_random_uuid(), 'سُر استور', 'به سُر استور خوش آمدید', 'بهترین محصولات با بهترین قیمت'
WHERE NOT EXISTS (SELECT 1 FROM site_settings);

-- 7. Delete any existing products (start fresh as requested)
DELETE FROM products;
