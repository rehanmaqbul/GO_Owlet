-- Drop existing tables if they exist (for clean re-runs)
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS task_submissions CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS content_items CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;
DROP TABLE IF EXISTS school_users CASCADE;
DROP TABLE IF EXISTS schools CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS online_forms CASCADE;

-- Enable the necessary Supabase extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'teacher', 'parent', 'child')),
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'inactive', 'pending')),
    password_hash VARCHAR(255), -- Stored securely
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,
    profile_image_url TEXT
);

-- Create schools table
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

-- Create teachers table
CREATE TABLE IF NOT EXISTS teachers (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
    subject_specialization TEXT[],
    years_of_experience INTEGER,
    education_level TEXT,
    certifications TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create association table between schools and users
CREATE TABLE IF NOT EXISTS school_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(school_id, user_id)
);

-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    grade_level VARCHAR(50),
    icon_url TEXT,
    color VARCHAR(50),
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create content_items table
CREATE TABLE IF NOT EXISTS content_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT,
    subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('lesson', 'resource', 'activity', 'quiz')),
    format VARCHAR(50) NOT NULL CHECK (format IN ('article', 'video', 'document', 'interactive', 'image')),
    status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('published', 'draft', 'archived')),
    grade_level VARCHAR(50),
    author_id UUID REFERENCES users(id),
    views INT DEFAULT 0,
    likes INT DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP WITH TIME ZONE
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructions TEXT,
    subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    points INT DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('published', 'draft', 'archived')),
    grade_level VARCHAR(50),
    creator_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP WITH TIME ZONE
);

-- Create task_submissions table
CREATE TABLE IF NOT EXISTS task_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id),
    submission TEXT,
    file_url TEXT,
    score INT,
    max_score INT,
    feedback TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'late', 'graded')),
    submitted_at TIMESTAMP WITH TIME ZONE,
    graded_at TIMESTAMP WITH TIME ZONE,
    graded_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create activity_logs table
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create system_logs table
CREATE TABLE IF NOT EXISTS system_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    level VARCHAR(50) NOT NULL CHECK (level IN ('info', 'warning', 'error', 'critical')),
    message TEXT NOT NULL,
    source VARCHAR(255),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    details JSONB
);

-- Create analytics table
CREATE TABLE IF NOT EXISTS analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL UNIQUE,
    active_users INT DEFAULT 0,
    page_views INT DEFAULT 0,
    new_users INT DEFAULT 0,
    session_count INT DEFAULT 0,
    avg_session_duration DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create content_ratings table
CREATE TABLE IF NOT EXISTS content_ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(content_id, user_id)
);

-- Create online_forms table
CREATE TABLE IF NOT EXISTS online_forms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    form_data JSONB,
    responses_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);
CREATE INDEX IF NOT EXISTS idx_schools_status ON public.schools(status);
CREATE INDEX IF NOT EXISTS idx_schools_type ON public.schools(type);
CREATE INDEX IF NOT EXISTS idx_schools_subscription ON public.schools(subscription);
CREATE INDEX IF NOT EXISTS idx_content_items_type ON public.content_items(type);
CREATE INDEX IF NOT EXISTS idx_content_items_status ON public.content_items(status);
CREATE INDEX IF NOT EXISTS idx_content_items_subject_id ON public.content_items(subject_id);
CREATE INDEX IF NOT EXISTS idx_tasks_subject_id ON public.tasks(subject_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_task_submissions_task_id ON public.task_submissions(task_id);
CREATE INDEX IF NOT EXISTS idx_task_submissions_student_id ON public.task_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_task_submissions_status ON public.task_submissions(status);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action_type ON public.activity_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_system_logs_level ON public.system_logs(level);
CREATE INDEX IF NOT EXISTS idx_system_logs_source ON public.system_logs(source);
CREATE INDEX IF NOT EXISTS idx_system_logs_timestamp ON public.system_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_online_forms_school_id ON public.online_forms(school_id);

-- Drop existing triggers
DROP TRIGGER IF EXISTS update_users_modtime ON users;
DROP TRIGGER IF EXISTS update_schools_modtime ON schools;
DROP TRIGGER IF EXISTS update_subjects_modtime ON subjects;
DROP TRIGGER IF EXISTS update_content_items_modtime ON content_items;
DROP TRIGGER IF EXISTS update_tasks_modtime ON tasks;
DROP TRIGGER IF EXISTS update_task_submissions_modtime ON task_submissions;
DROP TRIGGER IF EXISTS update_online_forms_modtime ON online_forms;
DROP TRIGGER IF EXISTS update_school_counts_trigger ON school_users;
DROP TRIGGER IF EXISTS update_content_rating_trigger ON content_ratings;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update the updated_at column
CREATE TRIGGER update_users_modtime
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_schools_modtime
BEFORE UPDATE ON schools
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_subjects_modtime
BEFORE UPDATE ON subjects
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_content_items_modtime
BEFORE UPDATE ON content_items
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_tasks_modtime
BEFORE UPDATE ON tasks
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_task_submissions_modtime
BEFORE UPDATE ON task_submissions
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_online_forms_modtime
BEFORE UPDATE ON online_forms
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Function to update school counts
CREATE OR REPLACE FUNCTION update_school_counts()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the school's student and teacher counts
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE schools
        SET
            students_count = (
                SELECT COUNT(*)
                FROM school_users su
                JOIN users u ON su.user_id = u.id
                WHERE su.school_id = NEW.school_id AND u.role = 'child'
            ),
            teachers_count = (
                SELECT COUNT(*)
                FROM school_users su
                JOIN users u ON su.user_id = u.id
                WHERE su.school_id = NEW.school_id AND u.role = 'teacher'
            )
        WHERE id = NEW.school_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE schools
        SET
            students_count = (
                SELECT COUNT(*)
                FROM school_users su
                JOIN users u ON su.user_id = u.id
                WHERE su.school_id = OLD.school_id AND u.role = 'child'
            ),
            teachers_count = (
                SELECT COUNT(*)
                FROM school_users su
                JOIN users u ON su.user_id = u.id
                WHERE su.school_id = OLD.school_id AND u.role = 'teacher'
            )
        WHERE id = OLD.school_id;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for school_users changes
CREATE TRIGGER update_school_counts_trigger
AFTER INSERT OR UPDATE OR DELETE ON school_users
FOR EACH ROW EXECUTE FUNCTION update_school_counts();

-- Function to update content ratings
CREATE OR REPLACE FUNCTION update_content_rating_average()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the content's average rating
    UPDATE content_items
    SET rating = (
        SELECT AVG(rating)
        FROM content_ratings
        WHERE content_id = NEW.content_id
    )
    WHERE id = NEW.content_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for content_ratings changes
CREATE TRIGGER update_content_rating_trigger
AFTER INSERT OR UPDATE ON content_ratings
FOR EACH ROW EXECUTE FUNCTION update_content_rating_average();

-- Disable RLS on the users table temporarily
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Or, if you prefer to keep RLS but allow inserts:
CREATE POLICY insert_users_policy ON users 
    FOR INSERT 
    TO authenticated 
    WITH CHECK (true);

-- Disable RLS on the schools table temporarily
ALTER TABLE schools DISABLE ROW LEVEL SECURITY;

-- Drop existing policies for schools table
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON schools;
DROP POLICY IF EXISTS "Enable all access for admins" ON schools;
DROP POLICY IF EXISTS "Enable insert for all authenticated users" ON schools;

-- Enable Row Level Security (RLS)
ALTER TABLE school_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE online_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;

-- Create policies (basic examples - would need to be refined for production)
CREATE POLICY admin_all_access ON users
    FOR ALL
    TO authenticated
    USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Allow users to see their own data
CREATE POLICY user_read_own ON users
    FOR SELECT
    TO authenticated
    USING (id = auth.uid());

-- Add a policy that allows insertion of new users
CREATE POLICY insert_users ON users 
    FOR INSERT 
    TO authenticated 
    WITH CHECK (true);

-- Create policies for schools table
CREATE POLICY "Enable read access for all authenticated users" ON schools
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for admins" ON schools
    FOR INSERT 
    TO authenticated 
    WITH CHECK (
        auth.jwt() ->> 'email' IN (
            SELECT email FROM users WHERE role = 'admin'
        )
    );

CREATE POLICY "Enable update for admins" ON schools
    FOR UPDATE 
    TO authenticated 
    USING (
        auth.jwt() ->> 'email' IN (
            SELECT email FROM users WHERE role = 'admin'
        )
    );

CREATE POLICY "Enable delete for admins" ON schools
    FOR DELETE 
    TO authenticated 
    USING (
        auth.jwt() ->> 'email' IN (
            SELECT email FROM users WHERE role = 'admin'
        )
    );

-- Create policies for online_forms
CREATE POLICY "Enable read access for authenticated users" ON online_forms
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for admins" ON online_forms
    FOR INSERT 
    TO authenticated 
    WITH CHECK (
        auth.jwt() ->> 'email' IN (
            SELECT email FROM users WHERE role = 'admin'
        )
    );

CREATE POLICY "Enable update for admins" ON online_forms
    FOR UPDATE 
    TO authenticated 
    USING (
        auth.jwt() ->> 'email' IN (
            SELECT email FROM users WHERE role = 'admin'
        )
    );

CREATE POLICY "Enable delete for admins" ON online_forms
    FOR DELETE 
    TO authenticated 
    USING (
        auth.jwt() ->> 'email' IN (
            SELECT email FROM users WHERE role = 'admin'
        )
    );

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_users ENABLE ROW LEVEL SECURITY;

-- Create policies for teachers table
CREATE POLICY "Enable read access for all users" ON teachers
    FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY "Enable insert for admins" ON teachers
    FOR INSERT 
    TO authenticated 
    WITH CHECK (
        auth.jwt() ->> 'email' IN (
            SELECT email FROM users WHERE role = 'admin'
        )
    );

CREATE POLICY "Enable update for admins and self" ON teachers
    FOR UPDATE 
    TO authenticated 
    USING (
        auth.jwt() ->> 'email' IN (
            SELECT email FROM users WHERE role = 'admin'
        ) OR 
        auth.uid() = id
    );

CREATE POLICY "Enable delete for admins" ON teachers
    FOR DELETE 
    TO authenticated 
    USING (
        auth.jwt() ->> 'email' IN (
            SELECT email FROM users WHERE role = 'admin'
        )
    );

-- Add indexes for teachers table
CREATE INDEX IF NOT EXISTS idx_teachers_school_id ON teachers(school_id);

-- Create trigger for teachers updated_at
CREATE TRIGGER update_teachers_modtime
    BEFORE UPDATE ON teachers
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- Grant permissions for teachers table
GRANT ALL ON teachers TO authenticated;
GRANT ALL ON teachers TO service_role;

-- Add comment for documentation
COMMENT ON TABLE teachers IS 'Stores additional information about teachers beyond their basic user data'; 