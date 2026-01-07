-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_fa TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_fa TEXT NOT NULL,
  description_fa TEXT,
  price DECIMAL(12, 0) NOT NULL,
  original_price DECIMAL(12, 0),
  image_url TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  brand TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sliders table (for hero carousel)
CREATE TABLE IF NOT EXISTS sliders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_fa TEXT NOT NULL,
  subtitle_fa TEXT,
  image_url TEXT,
  link_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Banners table (for side banners/ads)
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_fa TEXT NOT NULL,
  image_url TEXT,
  link_url TEXT,
  position TEXT DEFAULT 'hero_side',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  logo_url TEXT,
  site_name TEXT DEFAULT 'سُر استور',
  hero_title TEXT,
  hero_subtitle TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  address_fa TEXT,
  instagram_url TEXT,
  telegram_url TEXT,
  whatsapp_url TEXT,
  about_us_fa TEXT DEFAULT 'فروشگاه سُر استور با هدف ارائه بهترین محصولات با کیفیت و قیمت مناسب فعالیت می‌کند.',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default site settings (only if empty)
INSERT INTO site_settings (site_name, contact_email)
SELECT 'سُر استور', 'info@sorstore.com'
WHERE NOT EXISTS (SELECT 1 FROM site_settings);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE sliders ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Allow public read
DROP POLICY IF EXISTS "Anyone can view products" ON products;
CREATE POLICY "Anyone can view products" ON products FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Anyone can view categories" ON categories;
CREATE POLICY "Anyone can view categories" ON categories FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Anyone can view sliders" ON sliders;
CREATE POLICY "Anyone can view sliders" ON sliders FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Anyone can view banners" ON banners;
CREATE POLICY "Anyone can view banners" ON banners FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Anyone can view site settings" ON site_settings;
CREATE POLICY "Anyone can view site settings" ON site_settings FOR SELECT USING (TRUE);

-- RLS Policies - Allow all operations (admin auth handled in API)
DROP POLICY IF EXISTS "Allow all product operations" ON products;
CREATE POLICY "Allow all product operations" ON products FOR ALL USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Allow all category operations" ON categories;
CREATE POLICY "Allow all category operations" ON categories FOR ALL USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Allow all slider operations" ON sliders;
CREATE POLICY "Allow all slider operations" ON sliders FOR ALL USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Allow all banner operations" ON banners;
CREATE POLICY "Allow all banner operations" ON banners FOR ALL USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Allow all site settings operations" ON site_settings;
CREATE POLICY "Allow all site settings operations" ON site_settings FOR ALL USING (TRUE) WITH CHECK (TRUE);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_sliders_active ON sliders(is_active);
CREATE INDEX IF NOT EXISTS idx_banners_active ON banners(is_active);
