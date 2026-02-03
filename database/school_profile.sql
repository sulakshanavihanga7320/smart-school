-- Create school_profile table
CREATE TABLE IF NOT EXISTS school_profile (
    id INTEGER PRIMARY KEY DEFAULT 1,
    name TEXT NOT NULL,
    target_line TEXT,
    logo_url TEXT,
    phone TEXT,
    website TEXT,
    email TEXT,
    address TEXT,
    country TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT single_row CHECK (id = 1)
);

-- Insert default row
INSERT INTO school_profile (id, name, target_line, logo_url, phone, website, email, address, country)
VALUES (
    1,
    'Siddhartha National Collage',
    'Anuradhapura',
    'https://via.placeholder.com/150',
    '0742828178',
    'https://youtube.com/@siddhartha.nc-official?si=ri-XrekXlmDPRG',
    'sulakshanavihanga7320@gmail.com',
    'Pemaduwa',
    'Sri Lanka'
)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE school_profile ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON school_profile
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Create policy to allow read for everyone
CREATE POLICY "Allow read for everyone" ON school_profile
    FOR SELECT
    USING (true);
