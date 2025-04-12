-- Enable Row Level Security
ALTER DATABASE postgres SET "app.settings.jwt_secret" = 'your-jwt-secret';

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'teacher', 'student', 'parent');
CREATE TYPE task_type AS ENUM ('mcq', 'true_false', 'reading', 'recording', 'upload');
CREATE TYPE submission_status AS ENUM ('pending', 'submitted', 'late', 'resubmitted', 'graded');

-- Create tables
CREATE TABLE grades (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT,
    academic_year VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE subjects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR NOT NULL,
    grade_id UUID REFERENCES grades(id),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE tasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR NOT NULL,
    subject_id UUID REFERENCES subjects(id),
    grade_id UUID REFERENCES grades(id),
    type task_type NOT NULL,
    chapter VARCHAR,
    lesson VARCHAR,
    description TEXT,
    assigned_date TIMESTAMP WITH TIME ZONE,
    deadline TIMESTAMP WITH TIME ZONE,
    total_marks INTEGER,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE task_submissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    task_id UUID REFERENCES tasks(id),
    student_id UUID,
    status submission_status DEFAULT 'pending',
    submission_date TIMESTAMP WITH TIME ZONE,
    content TEXT,
    file_url VARCHAR,
    marks_obtained DECIMAL,
    feedback TEXT,
    graded_by UUID,
    graded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE activity_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID,
    action_type VARCHAR NOT NULL,
    entity_type VARCHAR NOT NULL,
    entity_id UUID,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE dashboard_stats (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    grade_id UUID REFERENCES grades(id),
    stats_type VARCHAR NOT NULL,
    stats_value JSONB NOT NULL,
    period_start DATE,
    period_end DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_tasks_grade_id ON tasks(grade_id);
CREATE INDEX idx_tasks_subject_id ON tasks(subject_id);
CREATE INDEX idx_task_submissions_task_id ON task_submissions(task_id);
CREATE INDEX idx_task_submissions_student_id ON task_submissions(student_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);
CREATE INDEX idx_dashboard_stats_grade_id ON dashboard_stats(grade_id);

-- Enable Row Level Security (RLS)
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_stats ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON grades
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON subjects
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON tasks
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON task_submissions
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON activity_logs
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON dashboard_stats
    FOR SELECT USING (true);

-- Create policies for admin operations
CREATE POLICY "Enable all access for admins" ON grades
    FOR ALL USING (auth.role() = 'authenticated' AND auth.email() IN (SELECT email FROM auth.users WHERE role = 'admin'));

CREATE POLICY "Enable all access for admins" ON subjects
    FOR ALL USING (auth.role() = 'authenticated' AND auth.email() IN (SELECT email FROM auth.users WHERE role = 'admin'));

CREATE POLICY "Enable all access for admins" ON tasks
    FOR ALL USING (auth.role() = 'authenticated' AND auth.email() IN (SELECT email FROM auth.users WHERE role = 'admin'));

CREATE POLICY "Enable all access for admins" ON task_submissions
    FOR ALL USING (auth.role() = 'authenticated' AND auth.email() IN (SELECT email FROM auth.users WHERE role = 'admin'));

CREATE POLICY "Enable all access for admins" ON activity_logs
    FOR ALL USING (auth.role() = 'authenticated' AND auth.email() IN (SELECT email FROM auth.users WHERE role = 'admin'));

CREATE POLICY "Enable all access for admins" ON dashboard_stats
    FOR ALL USING (auth.role() = 'authenticated' AND auth.email() IN (SELECT email FROM auth.users WHERE role = 'admin')); 