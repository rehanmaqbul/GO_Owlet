-- Create schools table only
CREATE TABLE IF NOT EXISTS schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'United States',
    phone VARCHAR(50),
    email VARCHAR(255),
    type VARCHAR(50) NOT NULL CHECK (type IN ('public', 'private', 'charter')),
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'inactive', 'pending')),
    subscription VARCHAR(50) NOT NULL DEFAULT 'trial' CHECK (subscription IN ('premium', 'standard', 'trial')),
    students_count INT DEFAULT 0,
    teachers_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indices for performance
CREATE INDEX IF NOT EXISTS idx_schools_status ON schools(status);
CREATE INDEX IF NOT EXISTS idx_schools_type ON schools(type);
CREATE INDEX IF NOT EXISTS idx_schools_subscription ON schools(subscription);

-- Insert a default school
INSERT INTO schools (
    name, 
    address, 
    city, 
    state, 
    postal_code, 
    type, 
    status
) VALUES (
    'Demo School',
    '123 Main Street',
    'Anytown',
    'CA',
    '90210',
    'public',
    'active'
);

-- Insert another school
INSERT INTO schools (
    name, 
    address, 
    city, 
    state, 
    postal_code, 
    type, 
    status
) VALUES (
    'Example Academy',
    '456 Oak Avenue',
    'Springfield',
    'IL',
    '62701',
    'private',
    'active'
); 