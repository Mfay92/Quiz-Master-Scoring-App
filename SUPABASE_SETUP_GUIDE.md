# Supabase Setup Guide

This guide walks you through setting up the backend for Quiz Master Dale in Supabase.

## Step 1: Create the Database Schema

1. Go to your Supabase project dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `supabase_setup.sql` from your project root
5. Paste it into the SQL editor
6. Click **Run**

This will create:
- 7 database tables (profiles, teams, team_members, quizzes, quiz_attempts, quiz_scores, quiz_images)
- Row Level Security (RLS) policies for all tables
- Indexes for performance optimization
- Triggers for automatic timestamp updates

**Status**: If you see "Success" with no red errors, you're good to go! ✅

## Step 2: Configure Supabase Authentication

Supabase authentication is already enabled by default, but let's verify:

1. Go to **Authentication** > **Providers** in your Supabase dashboard
2. Confirm that **Email** provider is enabled (it should be by default)
3. Click on **Email** and ensure:
   - ✅ "Enable email sign ups" is ON
   - ✅ "Enable email confirmations" is OFF (for now, to ease testing)

Done! Your authentication is ready.

## Step 3: Create Storage Bucket (Optional, for Picture Rounds)

To enable picture round uploads:

1. Go to **Storage** in your Supabase dashboard
2. Click **Create new bucket**
3. Name it: `quiz-images`
4. Set it to **Public** for public access
5. Click **Create**
6. Click the **quiz-images** bucket
7. Go to **Policies** tab
8. Click **Create Policy**
9. Select **For Public access**
10. Name: "Public access for quiz images"
11. Click **Create**

This allows users to upload and view quiz images.

## Step 4: Enable Row Level Security (Already Done!)

The SQL script already created all RLS policies, but here's what was set up:

### Key Security Rules:

- **Users can only access their own profiles**
- **Team members can see team data** but only if they're members
- **Quiz masters can manage their own quizzes**
- **Public quizzes are visible to everyone**
- **Team leaders can manage team membership**

You can review these policies:
1. Go to **Authentication** > **Roles and Permissions**
2. Click each table to see policies

## Step 5: Verify Your Credentials Are Set

1. In VS Code, check that you have `.env.local` file
2. It should contain:
   ```
   VITE_SUPABASE_URL=https://wtgotgzdfhgwdjiqqeka.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. If not, create it with these values from your Supabase project settings

## Step 6: Test the Connection

1. Your dev server should still be running at `http://localhost:5173`
2. You should see the **Signup/Login** page
3. Try creating a new account:
   - Email: `test@example.com`
   - Password: `TestPassword123`
   - Display Name: `Test User`
4. If signup succeeds, you're connected! 🎉

## Troubleshooting

### "No rows returned" Error
- The profiles table wasn't created
- Solution: Re-run the `supabase_setup.sql` script

### "Permission denied" Error
- RLS policies need adjustment
- Check Supabase logs for details
- Verify the SQL script ran successfully

### "Invalid Supabase URL" Error
- Check `.env.local` has correct URL (no extra spaces)
- Verify your Supabase project is still active

### Connection Timeout
- Check your internet connection
- Verify Supabase project status at supabase.com/dashboard
- Try running: `npm run dev` again

## What's Been Created

### Profiles Table
Stores user information:
- `id` (UUID) - matches Supabase auth user ID
- `display_name` (TEXT) - user's display name
- `email` (TEXT) - user's email
- `avatar_url` (TEXT) - optional profile picture
- `created_at` / `updated_at` (TIMESTAMP)

### Teams Table
Manages quiz teams:
- `id` (UUID) - team ID
- `name` (TEXT) - team name
- `creator_id` (UUID) - who created the team
- `description` (TEXT) - team description
- `is_public` (BOOLEAN) - public/private team
- `created_at` / `updated_at` (TIMESTAMP)

### Team Members Table
Many-to-many relationship between users and teams:
- `id` (UUID)
- `team_id` (UUID) - which team
- `user_id` (UUID) - which user
- `joined_at` (TIMESTAMP)

### Quizzes Table
Quiz events/templates:
- `id` (UUID)
- `title` (TEXT) - quiz name
- `quiz_master_id` (UUID) - who created it
- `quiz_date` (DATE) - when the quiz is/was
- `rounds_config` (JSONB) - configuration for each round
- `is_public` (BOOLEAN) - public/private quiz

### Quiz Attempts Table
Records of teams taking quizzes:
- `id` (UUID)
- `quiz_id` (UUID) - which quiz
- `team_id` (UUID) - which team took it
- `user_id` (UUID) - who submitted it
- `total_score` (INTEGER)
- `max_score` (INTEGER)
- `percentage` (INTEGER)
- `started_at` / `completed_at` (TIMESTAMP)

### Quiz Scores Table
Detailed round-by-round scores:
- `id` (UUID)
- `quiz_attempt_id` (UUID) - which attempt
- `round_number` (INTEGER)
- `round_format` (TEXT) - e.g., "General Knowledge"
- `questions_data` (JSONB) - answers and correctness
- `round_score` / `max_round_score` (INTEGER)

### Quiz Images Table
Images for picture rounds:
- `id` (UUID)
- `quiz_id` (UUID) - which quiz
- `round_number` / `question_number` (INTEGER)
- `storage_path` (TEXT) - path in storage bucket
- `uploaded_by` (UUID) - who uploaded it

## What You Can Do Now

✅ **Sign up / Log in** - Users can create accounts and authenticate
✅ **Create teams** - Organize teams for group quizzes
✅ **Track scores** - Scores persist in the database
✅ **View history** - Quiz attempts are saved
✅ **Manage team members** - Add friends to teams

## Next Phase Ideas

- [ ] Quiz creation interface for quiz masters
- [ ] Automated leaderboards
- [ ] Statistics dashboard
- [ ] Email notifications for quiz results
- [ ] Export results to PDF
- [ ] Integration with NotebookLM for AI-generated questions

## Support

If you encounter issues:

1. **Check Supabase Status**: https://status.supabase.com
2. **Review Supabase Docs**: https://supabase.com/docs
3. **Check Browser Console**: F12 > Console tab for JavaScript errors
4. **View Supabase Logs**:
   - Go to **Logs** tab in Supabase dashboard
   - Look for error messages

---

**Your Supabase backend is now ready!** 🚀

Start the dev server with `npm run dev` and test the signup/login flow.
