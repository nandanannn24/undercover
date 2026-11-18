-- ==============================================================================
-- UNDERCOVER GAME DATABASE SCHEMA FOR SUPABASE
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/hhbzujouvzwktxfkrpbx/sql
-- ==============================================================================

-- 1. Table: game_history (Match History & Statistics)
CREATE TABLE IF NOT EXISTS public.game_history (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    winner TEXT NOT NULL,
    player_count INTEGER NOT NULL,
    rounds INTEGER NOT NULL,
    secret_word_civilian TEXT NOT NULL,
    secret_word_undercover TEXT NOT NULL,
    players_summary JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for fast ordering by match date
CREATE INDEX IF NOT EXISTS idx_game_history_created_at ON public.game_history (created_at DESC);

-- Enable RLS
ALTER TABLE public.game_history ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access
CREATE POLICY "Allow public read on game_history"
ON public.game_history FOR SELECT
USING (true);

-- Allow anonymous insert access
CREATE POLICY "Allow public insert on game_history"
ON public.game_history FOR INSERT
WITH CHECK (true);


-- 2. Table: custom_words (User-added & community word pairs)
CREATE TABLE IF NOT EXISTS public.custom_words (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    civilian TEXT NOT NULL,
    undercover TEXT NOT NULL,
    difficulty TEXT NOT NULL DEFAULT 'medium',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for searching words
CREATE INDEX IF NOT EXISTS idx_custom_words_category ON public.custom_words (category);

-- Enable RLS
ALTER TABLE public.custom_words ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read and insert
CREATE POLICY "Allow public read on custom_words"
ON public.custom_words FOR SELECT
USING (true);

CREATE POLICY "Allow public insert on custom_words"
ON public.custom_words FOR INSERT
WITH CHECK (true);


-- 3. Table: game_rooms (Optional future online / multi-device rooms)
CREATE TABLE IF NOT EXISTS public.game_rooms (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'waiting',
    config JSONB NOT NULL DEFAULT '{}'::jsonb,
    current_round INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.game_rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on game_rooms"
ON public.game_rooms FOR SELECT
USING (true);

CREATE POLICY "Allow public insert and update on game_rooms"
ON public.game_rooms FOR ALL
USING (true);
