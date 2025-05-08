/*
  # Initial Schema for MoodRing

  1. Tables
    - users
      - Core user information and profile data
    - moods
      - User mood history and tracking
    - posts
      - User status updates and posts
    - comments
      - Comments on profiles and posts
    - friends
      - Friend relationships and top friends
    - themes
      - Custom CSS themes users can apply

  2. Security
    - RLS policies for all tables
    - Secure friend management
    - Protected user data
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  encrypted_password text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  avatar_url text,
  profile_song text,
  custom_css text,
  custom_html text,
  current_mood text,
  status text,
  bio text,
  interests text,
  view_count integer DEFAULT 0,
  last_login timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Moods table for tracking mood history
CREATE TABLE moods (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  mood text NOT NULL,
  emoji text,
  note text,
  created_at timestamp with time zone DEFAULT now()
);

-- Posts table for status updates
CREATE TABLE posts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  mood text,
  visibility text DEFAULT 'friends' CHECK (visibility IN ('public', 'friends', 'private')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Comments table
CREATE TABLE comments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Friends table for managing relationships
CREATE TABLE friends (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  friend_id uuid REFERENCES users(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted')),
  is_top_friend boolean DEFAULT false,
  top_friend_order integer,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, friend_id)
);

-- Themes table for reusable custom themes
CREATE TABLE themes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  css text NOT NULL,
  preview_image_url text,
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  is_public boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE moods ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE friends ENABLE ROW LEVEL SECURITY;
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view public profiles"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Moods policies
CREATE POLICY "Users can view friends' moods"
  ON moods FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM friends
      WHERE (user_id = auth.uid() AND friend_id = moods.user_id
        OR friend_id = auth.uid() AND user_id = moods.user_id)
      AND status = 'accepted'
    )
    OR user_id = auth.uid()
  );

CREATE POLICY "Users can manage own moods"
  ON moods FOR ALL
  USING (user_id = auth.uid());

-- Posts policies
CREATE POLICY "Users can view public and friends' posts"
  ON posts FOR SELECT
  USING (
    visibility = 'public'
    OR user_id = auth.uid()
    OR (
      visibility = 'friends'
      AND EXISTS (
        SELECT 1 FROM friends
        WHERE (user_id = auth.uid() AND friend_id = posts.user_id
          OR friend_id = auth.uid() AND user_id = posts.user_id)
        AND status = 'accepted'
      )
    )
  );

CREATE POLICY "Users can manage own posts"
  ON posts FOR ALL
  USING (user_id = auth.uid());

-- Comments policies
CREATE POLICY "Users can view comments on visible posts"
  ON comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM posts
      WHERE posts.id = comments.post_id
      AND (
        posts.visibility = 'public'
        OR posts.user_id = auth.uid()
        OR (
          posts.visibility = 'friends'
          AND EXISTS (
            SELECT 1 FROM friends
            WHERE (user_id = auth.uid() AND friend_id = posts.user_id
              OR friend_id = auth.uid() AND user_id = posts.user_id)
            AND status = 'accepted'
          )
        )
      )
    )
  );

CREATE POLICY "Users can manage own comments"
  ON comments FOR ALL
  USING (user_id = auth.uid());

-- Friends policies
CREATE POLICY "Users can view friend relationships"
  ON friends FOR SELECT
  USING (user_id = auth.uid() OR friend_id = auth.uid());

CREATE POLICY "Users can manage own friend relationships"
  ON friends FOR ALL
  USING (user_id = auth.uid());

-- Themes policies
CREATE POLICY "Users can view public themes"
  ON themes FOR SELECT
  USING (is_public = true OR created_by = auth.uid());

CREATE POLICY "Users can manage own themes"
  ON themes FOR ALL
  USING (created_by = auth.uid());

-- Create indexes for better performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_moods_user_id ON moods(user_id);
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_friends_user_id ON friends(user_id);
CREATE INDEX idx_friends_friend_id ON friends(friend_id);
CREATE INDEX idx_themes_created_by ON themes(created_by);

-- Add updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_friends_updated_at
    BEFORE UPDATE ON friends
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_themes_updated_at
    BEFORE UPDATE ON themes
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();