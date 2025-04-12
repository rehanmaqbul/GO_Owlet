# Supabase Database Setup

This folder contains the schema and seed files needed to set up the Supabase database for the GO_Owlet application.

## Database Schema

The database schema is defined in `schema.sql` and includes the following tables:

- `users` - User accounts with roles (admin, teacher, parent, child)
- `schools` - Educational institutions
- `school_users` - Join table linking users to schools
- `subjects` - Academic subjects
- `content_items` - Educational content (lessons, resources, quizzes)
- `tasks` - Assignments, exercises, and quizzes
- `task_submissions` - Student submissions for tasks
- `activity_logs` - User activity tracking
- `system_logs` - System logs for technical monitoring
- `analytics` - Usage statistics
- `content_ratings` - User ratings for content

## Initial Data

Sample data is provided in `seed.sql` to populate the database with:

- User accounts for different roles
- Sample schools with different subscriptions
- Subjects with icons and colors
- Educational content items of different types
- Tasks with deadlines
- Task submissions with various statuses
- System and activity logs
- Analytics data for a 30-day period
- Content ratings

## How to Initialize the Database

1. Start the Supabase local development server:
   ```
   npx supabase start
   ```

2. Apply the schema:
   ```
   npx supabase db reset
   ```
   This will execute both the schema and seed SQL files in order.

3. Or apply each file separately:
   ```
   npx supabase db run --file=schema.sql
   npx supabase db run --file=seed.sql
   ```

4. Generate TypeScript types for the database:
   ```
   npx supabase gen types typescript --local > src/lib/supabase/database.types.ts
   ```

## Database Structure

The database is designed with several key relationships:

- Users can be associated with multiple schools (many-to-many via school_users)
- Content items belong to subjects
- Tasks can be linked to content and subjects
- Task submissions are linked to tasks and students (users)
- Activity logs track user actions
- System logs track technical events
- Content ratings link users' feedback to content items

## Row Level Security (RLS)

The database uses Row Level Security (RLS) to control access to data:

- Admins have access to all data
- Users can see their own data
- Teachers can see data related to their schools
- Parents can see data related to their children

## Database Triggers

Several triggers are defined to:

1. Automatically update `updated_at` timestamps
2. Update school student and teacher counts when users are added or removed
3. Calculate average ratings for content items 