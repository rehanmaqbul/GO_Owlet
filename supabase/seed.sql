-- Clear existing data (if any)
TRUNCATE users, schools, school_users, subjects, content_items, tasks, task_submissions, activity_logs, system_logs, analytics, content_ratings RESTART IDENTITY CASCADE;

-- Insert sample users
INSERT INTO users (id, name, email, role, status, last_login) VALUES
    ('00000000-0000-0000-0000-000000000001', 'John Smith', 'john.smith@example.com', 'teacher', 'active', NOW() - INTERVAL '2 hours'),
    ('00000000-0000-0000-0000-000000000002', 'Sarah Johnson', 'sarah.j@example.com', 'parent', 'active', NOW() - INTERVAL '1 day'),
    ('00000000-0000-0000-0000-000000000003', 'Michael Brown', 'michael.b@example.com', 'admin', 'active', NOW() - INTERVAL '3 days'),
    ('00000000-0000-0000-0000-000000000004', 'Emma Wilson', 'emma.w@example.com', 'teacher', 'inactive', NOW() - INTERVAL '2 weeks'),
    ('00000000-0000-0000-0000-000000000005', 'James Davis', 'james.d@example.com', 'parent', 'active', NOW() - INTERVAL '5 hours'),
    ('00000000-0000-0000-0000-000000000006', 'Olivia Martin', 'olivia.m@example.com', 'teacher', 'pending', NULL),
    ('00000000-0000-0000-0000-000000000007', 'William Garcia', 'william.g@example.com', 'child', 'active', NOW() - INTERVAL '1 week'),
    ('00000000-0000-0000-0000-000000000008', 'Sophie Miller', 'sophie.m@example.com', 'parent', 'active', NOW() - INTERVAL '1 day');

-- Insert sample schools
INSERT INTO schools (id, name, address, city, state, postal_code, phone, email, type, status, subscription, students_count, teachers_count) VALUES
    ('00000000-0000-0000-0000-000000000001', 'Lincoln Elementary School', '123 Education St', 'Springfield', 'IL', '62701', '(217) 555-1234', 'admin@lincolnelementary.edu', 'public', 'active', 'premium', 428, 32),
    ('00000000-0000-0000-0000-000000000002', 'Washington High School', '456 Learning Ave', 'Springfield', 'IL', '62702', '(217) 555-5678', 'office@washingtonhs.edu', 'public', 'active', 'premium', 876, 64),
    ('00000000-0000-0000-0000-000000000003', 'Jefferson Middle School', '789 Knowledge Blvd', 'Springfield', 'IL', '62703', '(217) 555-9012', 'info@jeffersonms.edu', 'public', 'active', 'standard', 542, 38),
    ('00000000-0000-0000-0000-000000000004', 'Roosevelt Elementary', '321 Wisdom Rd', 'Springfield', 'IL', '62704', '(217) 555-3456', 'contact@rooseveltelementary.edu', 'public', 'active', 'standard', 356, 28),
    ('00000000-0000-0000-0000-000000000005', 'St. Mary''s Academy', '555 Faith St', 'Springfield', 'IL', '62705', '(217) 555-7890', 'admin@stmarysacademy.edu', 'private', 'active', 'premium', 312, 26),
    ('00000000-0000-0000-0000-000000000006', 'Springfield Montessori School', '777 Discovery Lane', 'Springfield', 'IL', '62706', '(217) 555-2109', 'info@springfieldmontessori.edu', 'private', 'active', 'standard', 185, 18),
    ('00000000-0000-0000-0000-000000000007', 'Oak Ridge Charter School', '888 Innovation Way', 'Springfield', 'IL', '62707', '(217) 555-6543', 'admin@oakridgecharter.edu', 'charter', 'pending', 'trial', 264, 22),
    ('00000000-0000-0000-0000-000000000008', 'Central Technical High School', '999 Industry Pkwy', 'Springfield', 'IL', '62708', '(217) 555-8765', 'office@centraltechnical.edu', 'public', 'inactive', 'none', 420, 36);

-- Create some school_user associations
INSERT INTO school_users (school_id, user_id) VALUES
    ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001'),
    ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000007'),
    ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004'),
    ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000006'),
    ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002'),
    ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000005'),
    ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000008');

-- Insert sample subjects
INSERT INTO subjects (id, name, description, icon, color) VALUES
    ('00000000-0000-0000-0000-000000000001', 'Mathematics', 'Number operations, algebra, geometry, and more', 'Calculator', 'blue'),
    ('00000000-0000-0000-0000-000000000002', 'Science', 'Biology, chemistry, physics, and earth sciences', 'Flask', 'green'),
    ('00000000-0000-0000-0000-000000000003', 'English', 'Reading, writing, grammar, and literature', 'BookOpen', 'purple'),
    ('00000000-0000-0000-0000-000000000004', 'History', 'World history, civilizations, and historical events', 'Clock', 'amber'),
    ('00000000-0000-0000-0000-000000000005', 'Geography', 'World geography, maps, and cultures', 'Globe', 'teal'),
    ('00000000-0000-0000-0000-000000000006', 'Art', 'Visual arts, techniques, and art history', 'Paintbrush', 'pink'),
    ('00000000-0000-0000-0000-000000000007', 'Music', 'Music theory, instruments, and appreciation', 'Music', 'indigo');

-- Insert sample content items
INSERT INTO content_items (id, title, type, format, subject_id, grade, status, views_count, rating, created_at, created_by) VALUES
    ('00000000-0000-0000-0000-000000000001', 'Introduction to Algebra', 'lesson', 'article', '00000000-0000-0000-0000-000000000001', 'Grade 5', 'published', 4280, 4.8, '2023-10-15', '00000000-0000-0000-0000-000000000001'),
    ('00000000-0000-0000-0000-000000000002', 'Photosynthesis Explained', 'lesson', 'video', '00000000-0000-0000-0000-000000000002', 'Grade 4', 'published', 3150, 4.5, '2023-09-22', '00000000-0000-0000-0000-000000000004'),
    ('00000000-0000-0000-0000-000000000003', 'Ancient Egypt Civilization', 'resource', 'article', '00000000-0000-0000-0000-000000000004', 'Grade 6', 'published', 2840, 4.7, '2023-11-05', '00000000-0000-0000-0000-000000000006'),
    ('00000000-0000-0000-0000-000000000004', 'Parts of Speech Interactive Quiz', 'quiz', 'interactive', '00000000-0000-0000-0000-000000000003', 'Grade 3', 'draft', 0, 0, '2023-11-20', '00000000-0000-0000-0000-000000000001'),
    ('00000000-0000-0000-0000-000000000005', 'Introduction to Fractions', 'lesson', 'video', '00000000-0000-0000-0000-000000000001', 'Grade 3', 'published', 5670, 4.6, '2023-10-08', '00000000-0000-0000-0000-000000000004'),
    ('00000000-0000-0000-0000-000000000006', 'World Geography Atlas', 'resource', 'interactive', '00000000-0000-0000-0000-000000000005', 'All Grades', 'published', 7320, 4.2, '2023-09-15', '00000000-0000-0000-0000-000000000006'),
    ('00000000-0000-0000-0000-000000000007', 'Creative Writing Prompts', 'resource', 'document', '00000000-0000-0000-0000-000000000003', 'Grade 5', 'published', 3980, 4.0, '2023-08-30', '00000000-0000-0000-0000-000000000004'),
    ('00000000-0000-0000-0000-000000000008', 'Chemical Reactions Lab', 'lesson', 'document', '00000000-0000-0000-0000-000000000002', 'Grade 6', 'draft', 0, 0, '2023-11-25', '00000000-0000-0000-0000-000000000001');

-- Insert sample tasks
INSERT INTO tasks (id, name, description, subject_id, content_id, type, status, assigned_date, deadline, created_by, grade) VALUES
    ('00000000-0000-0000-0000-000000000001', 'Algebra Basics Quiz', 'Complete the quiz on basic algebra concepts', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'quiz', 'active', NOW() - INTERVAL '5 days', NOW() + INTERVAL '2 days', '00000000-0000-0000-0000-000000000001', 'Grade 5'),
    ('00000000-0000-0000-0000-000000000002', 'Photosynthesis Report', 'Write a one-page report on photosynthesis', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'assignment', 'active', NOW() - INTERVAL '7 days', NOW() + INTERVAL '1 day', '00000000-0000-0000-0000-000000000004', 'Grade 4'),
    ('00000000-0000-0000-0000-000000000003', 'Egypt Presentation', 'Create a presentation about Ancient Egypt', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000003', 'project', 'active', NOW() - INTERVAL '10 days', NOW() + INTERVAL '5 days', '00000000-0000-0000-0000-000000000006', 'Grade 6'),
    ('00000000-0000-0000-0000-000000000004', 'Grammar Exercise', 'Complete the grammar worksheet', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000004', 'exercise', 'active', NOW() - INTERVAL '3 days', NOW() + INTERVAL '4 days', '00000000-0000-0000-0000-000000000001', 'Grade 3'),
    ('00000000-0000-0000-0000-000000000005', 'Fractions Quiz', 'Take the online fractions quiz', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000005', 'quiz', 'inactive', NOW() - INTERVAL '20 days', NOW() - INTERVAL '10 days', '00000000-0000-0000-0000-000000000004', 'Grade 3');

-- Insert sample task submissions
INSERT INTO task_submissions (task_id, student_id, status, submission_date, score, feedback, graded_by, graded_at) VALUES
    ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000007', 'graded', NOW() - INTERVAL '1 day', 85.5, 'Good work on the algebraic expressions!', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '12 hours'),
    ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000007', 'submitted', NOW() - INTERVAL '2 days', NULL, NULL, NULL, NULL),
    ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000007', 'pending', NULL, NULL, NULL, NULL, NULL),
    ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000007', 'late', NOW(), NULL, NULL, NULL, NULL),
    ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000007', 'graded', NOW() - INTERVAL '15 days', 92.0, 'Excellent understanding of fractions!', '00000000-0000-0000-0000-000000000004', NOW() - INTERVAL '14 days');

-- Insert sample activity logs
INSERT INTO activity_logs (user_id, action_type, description, entity_type, entity_id, created_at) VALUES
    ('00000000-0000-0000-0000-000000000003', 'login', 'User logged in', 'user', '00000000-0000-0000-0000-000000000003', NOW() - INTERVAL '2 hours'),
    ('00000000-0000-0000-0000-000000000001', 'create', 'Created new task: Algebra Basics Quiz', 'task', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '5 days'),
    ('00000000-0000-0000-0000-000000000004', 'update', 'Updated content: Photosynthesis Explained', 'content', '00000000-0000-0000-0000-000000000002', NOW() - INTERVAL '3 days'),
    ('00000000-0000-0000-0000-000000000003', 'delete', 'Deleted inactive user account', 'user', NULL, NOW() - INTERVAL '1 day'),
    ('00000000-0000-0000-0000-000000000001', 'grade', 'Graded submission for Algebra Basics Quiz', 'submission', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '12 hours');

-- Insert sample system logs
INSERT INTO system_logs (level, message, source, user_id, details, timestamp) VALUES
    ('error', 'Database connection failed', 'API Server', NULL, 'Connection timeout after 30s. Database server might be down.', '2023-07-15T09:23:45Z'),
    ('info', 'User logged in', 'Auth Service', '00000000-0000-0000-0000-000000000001', NULL, '2023-07-15T09:25:12Z'),
    ('warning', 'High CPU usage detected', 'System Monitor', NULL, 'CPU usage at 85% for the last 15 minutes', '2023-07-15T10:12:33Z'),
    ('success', 'Daily backup completed', 'Backup Service', NULL, 'All data successfully backed up to cloud storage', '2023-07-15T10:45:21Z'),
    ('debug', 'Cache refresh initiated', 'Content Service', '00000000-0000-0000-0000-000000000003', 'Manual cache refresh triggered by admin', '2023-07-15T11:03:45Z'),
    ('info', 'New content published', 'Content Management', '00000000-0000-0000-0000-000000000004', 'Published "Introduction to Fractions" lesson', '2023-07-15T11:15:22Z'),
    ('error', 'Payment processing failed', 'Payment Gateway', '00000000-0000-0000-0000-000000000002', 'Card declined by payment processor', '2023-07-15T11:30:05Z'),
    ('info', 'System update scheduled', 'System Admin', '00000000-0000-0000-0000-000000000003', 'Update scheduled for tonight at 3:00 AM', '2023-07-15T12:05:18Z'),
    ('warning', 'API rate limit approaching', 'API Gateway', NULL, 'External API service quota at 80% for today', '2023-07-15T12:45:33Z'),
    ('success', 'Database optimization completed', 'Database Service', NULL, 'Optimization reduced database size by 15%', '2023-07-15T13:10:27Z'),
    ('debug', 'Session cleanup run', 'Auth Service', NULL, 'Removed 245 expired sessions', '2023-07-15T14:05:42Z'),
    ('error', 'Email service unavailable', 'Notification Service', NULL, 'Unable to connect to SMTP server', '2023-07-15T14:30:19Z');

-- Insert sample analytics data for the past 30 days
INSERT INTO analytics (date, active_users, page_views, new_users, session_count, avg_session_duration)
SELECT
    CURRENT_DATE - (n || ' days')::INTERVAL,
    FLOOR(RANDOM() * 500) + 100,  -- active_users between 100-600
    FLOOR(RANDOM() * 5000) + 1000, -- page_views between 1000-6000
    FLOOR(RANDOM() * 50) + 5,     -- new_users between 5-55
    FLOOR(RANDOM() * 800) + 200,  -- session_count between 200-1000
    ROUND((RANDOM() * 10 + 2)::NUMERIC, 2) -- avg_session_duration between 2-12 minutes
FROM generate_series(0, 29) n;

-- Insert sample content ratings
INSERT INTO content_ratings (content_id, user_id, rating, comment) VALUES
    ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000007', 5, 'Very helpful for understanding algebra concepts!'),
    ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 4, 'Good content but could use more examples.'),
    ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000007', 5, 'The video made photosynthesis easy to understand!'),
    ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000005', 4, 'Great explanations but the audio could be clearer.'),
    ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000007', 5, 'Loved learning about ancient Egypt!'),
    ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000007', 5, 'This helped my child understand fractions!'),
    ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', 4, 'Good but could use more practice problems.'),
    ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000007', 4, 'Very interactive and engaging!'),
    ('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000005', 4, 'Great writing prompts for creativity.'); 