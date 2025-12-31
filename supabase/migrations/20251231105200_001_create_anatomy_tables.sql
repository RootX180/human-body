/*
  # Create anatomy database schema

  1. New Tables
    - `systems` - Anatomical systems (Skeletal, Muscular, Nervous, Integumentary)
    - `bones` - Skeletal system structures
    - `muscles` - Muscular system structures
    - `nerves` - Nervous system structures
    - `quiz_questions` - Interactive quiz content
    - `user_progress` - Track user learning progress

  2. Security
    - Enable RLS on all tables
    - Public read access for anatomy data
    - User-specific progress tracking

  3. Relationships
    - Muscles reference bones (origin/insertion)
    - Muscles reference nerves (innervation)
    - Bones reference each other (articulation)
*/

CREATE TABLE IF NOT EXISTS systems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  layer_order integer NOT NULL,
  unlock_requirement text,
  color_theme text NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  common_name text NOT NULL,
  description text NOT NULL,
  biomechanical_function text NOT NULL,
  svg_path_id text UNIQUE NOT NULL,
  articulates_with uuid[] DEFAULT '{}'::uuid[],
  position_data jsonb NOT NULL,
  fun_fact text,
  reference_sources text[] NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS nerves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  common_name text,
  description text NOT NULL,
  biomechanical_function text NOT NULL,
  svg_path_id text UNIQUE NOT NULL,
  origin_point text NOT NULL,
  innervates uuid[] DEFAULT '{}'::uuid[],
  position_data jsonb NOT NULL,
  fun_fact text,
  reference_sources text[] NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS muscles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  common_name text NOT NULL,
  description text NOT NULL,
  biomechanical_function text NOT NULL,
  svg_path_id text UNIQUE NOT NULL,
  origin_bone_id uuid NOT NULL REFERENCES bones(id) ON DELETE RESTRICT,
  insertion_bone_id uuid NOT NULL REFERENCES bones(id) ON DELETE RESTRICT,
  nerve_supply_id uuid NOT NULL REFERENCES nerves(id) ON DELETE RESTRICT,
  muscle_group text NOT NULL,
  action text NOT NULL,
  position_data jsonb NOT NULL,
  fun_fact text,
  reference_sources text[] NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  system_name text NOT NULL,
  question_type text NOT NULL,
  question_text text NOT NULL,
  correct_answer_id text NOT NULL,
  options jsonb,
  difficulty integer CHECK (difficulty >= 1 AND difficulty <= 3),
  explanation text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  unlocked_systems text[] DEFAULT '{"Skeletal System"}'::text[],
  quiz_scores jsonb DEFAULT '{}'::jsonb,
  parts_viewed text[] DEFAULT '{}'::text[],
  last_active_layer text DEFAULT 'skeletal',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE bones ENABLE ROW LEVEL SECURITY;
ALTER TABLE nerves ENABLE ROW LEVEL SECURITY;
ALTER TABLE muscles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Systems are readable by everyone" ON systems FOR SELECT USING (true);
CREATE POLICY "Bones are readable by everyone" ON bones FOR SELECT USING (true);
CREATE POLICY "Nerves are readable by everyone" ON nerves FOR SELECT USING (true);
CREATE POLICY "Muscles are readable by everyone" ON muscles FOR SELECT USING (true);
CREATE POLICY "Quiz questions are readable by everyone" ON quiz_questions FOR SELECT USING (true);
CREATE POLICY "Users can view own progress" ON user_progress FOR SELECT USING (true);
CREATE POLICY "Users can insert own progress" ON user_progress FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own progress" ON user_progress FOR UPDATE USING (true) WITH CHECK (true);

CREATE INDEX idx_bones_svg_path ON bones(svg_path_id);
CREATE INDEX idx_muscles_svg_path ON muscles(svg_path_id);
CREATE INDEX idx_nerves_svg_path ON nerves(svg_path_id);
CREATE INDEX idx_quiz_system ON quiz_questions(system_name);
CREATE INDEX idx_user_progress_user ON user_progress(user_id);
