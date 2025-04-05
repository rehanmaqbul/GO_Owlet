
-- Function to get a user profile by ID
CREATE OR REPLACE FUNCTION get_profile_by_id(user_id UUID)
RETURNS SETOF profiles
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT * FROM profiles WHERE id = user_id LIMIT 1;
$$;

-- Function to get all questions
CREATE OR REPLACE FUNCTION get_all_questions()
RETURNS SETOF questions
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT * FROM questions ORDER BY created_at DESC;
$$;

-- Function to get a task by ID
CREATE OR REPLACE FUNCTION get_task_by_id(p_task_id UUID)
RETURNS SETOF tasks
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT * FROM tasks WHERE id = p_task_id LIMIT 1;
$$;

-- Function to get questions by their IDs
CREATE OR REPLACE FUNCTION get_questions_by_ids(p_question_ids UUID[])
RETURNS SETOF questions
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT * FROM questions WHERE id = ANY(p_question_ids);
$$;

-- Create trigger function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (new.id, new.raw_user_meta_data->>'name', new.email, new.raw_user_meta_data->>'role');
  RETURN new;
END;
$$;

-- Create trigger to automatically create profile for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
