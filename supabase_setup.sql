-- ============================================================================
-- Quiz Master Dale - Supabase Database Setup
-- ============================================================================
-- Run this SQL script in your Supabase SQL Editor to set up the entire backend
-- ============================================================================

-- 1. Create profiles table (extends Supabase auth users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create teams table
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create team_members junction table (many-to-many)
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(team_id, user_id)
);

-- 4. Create quizzes table (quiz templates/events)
CREATE TABLE IF NOT EXISTS quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  quiz_master_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  quiz_date DATE NOT NULL,
  rounds_config JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create quiz_attempts table (records of teams taking quizzes)
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  total_score INTEGER DEFAULT 0,
  max_score INTEGER DEFAULT 0,
  percentage INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Create quiz_scores table (detailed round-by-round breakdown)
CREATE TABLE IF NOT EXISTS quiz_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_attempt_id UUID NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL,
  round_format TEXT NOT NULL,
  questions_data JSONB NOT NULL DEFAULT '[]'::jsonb,
  round_score INTEGER DEFAULT 0,
  max_round_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Create quiz_images table (for picture rounds)
CREATE TABLE IF NOT EXISTS quiz_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL,
  question_number INTEGER NOT NULL,
  storage_path TEXT NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_images ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PROFILES RLS POLICIES
-- ============================================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can view profiles of team members
CREATE POLICY "Users can view team members profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.user_id = auth.uid()
      AND team_members.team_id IN (
        SELECT team_id FROM team_members
        WHERE user_id = profiles.id
      )
    )
  );

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can insert their own profile (during signup)
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- TEAMS RLS POLICIES
-- ============================================================================

-- Team members can view team
CREATE POLICY "Team members can view team"
  ON teams FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = teams.id
      AND team_members.user_id = auth.uid()
    )
  );

-- Creator can view their own team
CREATE POLICY "Creator can view own team"
  ON teams FOR SELECT
  USING (creator_id = auth.uid());

-- Public teams visible to all
CREATE POLICY "Public teams visible to all"
  ON teams FOR SELECT
  USING (is_public = TRUE);

-- Only creator can update team
CREATE POLICY "Only creator can update team"
  ON teams FOR UPDATE
  USING (creator_id = auth.uid())
  WITH CHECK (creator_id = auth.uid());

-- Only creator can delete team
CREATE POLICY "Only creator can delete team"
  ON teams FOR DELETE
  USING (creator_id = auth.uid());

-- Users can insert new team (they become creator)
CREATE POLICY "Users can create teams"
  ON teams FOR INSERT
  WITH CHECK (creator_id = auth.uid());

-- ============================================================================
-- TEAM_MEMBERS RLS POLICIES
-- ============================================================================

-- Team members can view team membership
CREATE POLICY "Team members can view membership"
  ON team_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_members tm2
      WHERE tm2.team_id = team_members.team_id
      AND tm2.user_id = auth.uid()
    )
  );

-- Team creator can add/remove members
CREATE POLICY "Team creator can manage members"
  ON team_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM teams
      WHERE teams.id = team_members.team_id
      AND teams.creator_id = auth.uid()
    )
  );

-- ============================================================================
-- QUIZZES RLS POLICIES
-- ============================================================================

-- Quiz master can view own quizzes
CREATE POLICY "Quiz master can view own quizzes"
  ON quizzes FOR SELECT
  USING (quiz_master_id = auth.uid());

-- Public quizzes visible to all
CREATE POLICY "Public quizzes visible to all"
  ON quizzes FOR SELECT
  USING (is_public = TRUE);

-- Quiz master can insert quizzes
CREATE POLICY "Users can create quizzes"
  ON quizzes FOR INSERT
  WITH CHECK (quiz_master_id = auth.uid());

-- Only quiz master can update
CREATE POLICY "Quiz master can update quizzes"
  ON quizzes FOR UPDATE
  USING (quiz_master_id = auth.uid())
  WITH CHECK (quiz_master_id = auth.uid());

-- Only quiz master can delete
CREATE POLICY "Quiz master can delete quizzes"
  ON quizzes FOR DELETE
  USING (quiz_master_id = auth.uid());

-- ============================================================================
-- QUIZ_ATTEMPTS RLS POLICIES
-- ============================================================================

-- Team members can view team's quiz attempts
CREATE POLICY "Team members can view team attempts"
  ON quiz_attempts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = quiz_attempts.team_id
      AND team_members.user_id = auth.uid()
    )
  );

-- Team members can create quiz attempts for their team
CREATE POLICY "Team members can create attempts"
  ON quiz_attempts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = quiz_attempts.team_id
      AND team_members.user_id = auth.uid()
    )
  );

-- Team members can update their own attempts
CREATE POLICY "Team members can update attempts"
  ON quiz_attempts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = quiz_attempts.team_id
      AND team_members.user_id = auth.uid()
    )
  );

-- ============================================================================
-- QUIZ_SCORES RLS POLICIES
-- ============================================================================

-- Users can view scores for quiz attempts they have access to
CREATE POLICY "Users can view quiz scores"
  ON quiz_scores FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM quiz_attempts
      WHERE quiz_attempts.id = quiz_scores.quiz_attempt_id
      AND EXISTS (
        SELECT 1 FROM team_members
        WHERE team_members.team_id = quiz_attempts.team_id
        AND team_members.user_id = auth.uid()
      )
    )
  );

-- Users can insert scores for their quiz attempts
CREATE POLICY "Users can create quiz scores"
  ON quiz_scores FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM quiz_attempts
      WHERE quiz_attempts.id = quiz_scores.quiz_attempt_id
      AND EXISTS (
        SELECT 1 FROM team_members
        WHERE team_members.team_id = quiz_attempts.team_id
        AND team_members.user_id = auth.uid()
      )
    )
  );

-- Users can update their own scores
CREATE POLICY "Users can update quiz scores"
  ON quiz_scores FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM quiz_attempts
      WHERE quiz_attempts.id = quiz_scores.quiz_attempt_id
      AND EXISTS (
        SELECT 1 FROM team_members
        WHERE team_members.team_id = quiz_attempts.team_id
        AND team_members.user_id = auth.uid()
      )
    )
  );

-- ============================================================================
-- QUIZ_IMAGES RLS POLICIES
-- ============================================================================

-- Users can view images for quizzes they have access to
CREATE POLICY "Users can view quiz images"
  ON quiz_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM quizzes
      WHERE quizzes.id = quiz_images.quiz_id
      AND (
        quizzes.quiz_master_id = auth.uid()
        OR quizzes.is_public = TRUE
      )
    )
  );

-- Quiz master can upload images
CREATE POLICY "Quiz master can upload images"
  ON quiz_images FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM quizzes
      WHERE quizzes.id = quiz_images.quiz_id
      AND quizzes.quiz_master_id = auth.uid()
    )
  );

-- Quiz master can delete images
CREATE POLICY "Quiz master can delete images"
  ON quiz_images FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM quizzes
      WHERE quizzes.id = quiz_images.quiz_id
      AND quizzes.quiz_master_id = auth.uid()
    )
  );

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_teams_creator_id ON teams(creator_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_quiz_master_id ON quizzes(quiz_master_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_team_id ON quiz_attempts(team_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_scores_quiz_attempt_id ON quiz_scores(quiz_attempt_id);
CREATE INDEX IF NOT EXISTS idx_quiz_images_quiz_id ON quiz_images(quiz_id);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to handle updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quizzes_updated_at BEFORE UPDATE ON quizzes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quiz_attempts_updated_at BEFORE UPDATE ON quiz_attempts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quiz_scores_updated_at BEFORE UPDATE ON quiz_scores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- END OF SETUP
-- ============================================================================
-- Your database is now ready!
-- Next: Configure authentication and create auth hooks in React
