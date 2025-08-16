-- Cleanup script to remove all gamification-related tables and data
-- Run this script to completely remove the gamification system from your database

-- IMPORTANT: This will permanently delete all gamification data including:
-- - User profiles and points
-- - Achievements and user achievements  
-- - Budget goals and challenges
-- - Characters and accessories
-- - Seasonal events and mini-games
-- - All related user progress

-- Backup recommendation: 
-- Before running this script, consider backing up your data if you might want to restore it later:
-- pg_dump -U your_username -h your_host -d your_database --data-only --table=public.user_profiles > gamification_backup.sql

BEGIN;

-- ============================================================================
-- Step 1: Drop triggers and functions first
-- ============================================================================

-- Drop trigger that updates user profiles on expense insert
DROP TRIGGER IF EXISTS update_profile_on_expense ON public.expenses;

-- Drop functions
DROP FUNCTION IF EXISTS update_user_profile();
DROP FUNCTION IF EXISTS update_user_streaks();
DROP FUNCTION IF EXISTS increment_user_points(uuid, integer);

-- ============================================================================
-- Step 2: Drop advanced gamification tables (from advanced-gamification.sql)
-- ============================================================================

-- Drop social features tables
DROP TABLE IF EXISTS public.challenge_invitations CASCADE;
DROP TABLE IF EXISTS public.friend_connections CASCADE;

-- Drop mini-game tables
DROP TABLE IF EXISTS public.user_mini_game_scores CASCADE;
DROP TABLE IF EXISTS public.mini_games CASCADE;

-- Drop interaction tables
DROP TABLE IF EXISTS public.expense_interactions CASCADE;

-- Drop seasonal event tables
DROP TABLE IF EXISTS public.user_seasonal_events CASCADE;
DROP TABLE IF EXISTS public.seasonal_events CASCADE;

-- Drop character system tables
DROP TABLE IF EXISTS public.user_character_accessories CASCADE;
DROP TABLE IF EXISTS public.user_characters CASCADE;
DROP TABLE IF EXISTS public.character_accessories CASCADE;
DROP TABLE IF EXISTS public.characters CASCADE;

-- Drop user preferences
DROP TABLE IF EXISTS public.user_preferences CASCADE;

-- ============================================================================
-- Step 3: Drop core gamification tables (from gamification.sql)
-- ============================================================================

-- Drop user-specific gamification data
DROP TABLE IF EXISTS public.user_challenges CASCADE;
DROP TABLE IF EXISTS public.user_achievements CASCADE;
DROP TABLE IF EXISTS public.budget_goals CASCADE;

-- Drop master gamification tables
DROP TABLE IF EXISTS public.challenges CASCADE;
DROP TABLE IF EXISTS public.achievements CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- ============================================================================
-- Step 4: Clean up any remaining gamification columns in existing tables
-- ============================================================================

-- Remove any gamification-related columns that might have been added to expenses table
-- (Uncomment these if such columns exist in your schema)
-- ALTER TABLE public.expenses DROP COLUMN IF EXISTS points_earned;
-- ALTER TABLE public.expenses DROP COLUMN IF EXISTS achievement_trigger;

-- ============================================================================
-- Step 5: Clean up any gamification-related indexes that might remain
-- ============================================================================

-- Drop any remaining indexes (these should be automatically dropped with tables, but just in case)
DROP INDEX IF EXISTS idx_user_profiles_user_id;
DROP INDEX IF EXISTS idx_user_achievements_user_id;
DROP INDEX IF EXISTS idx_budget_goals_user_id;
DROP INDEX IF EXISTS idx_user_challenges_user_id;
DROP INDEX IF EXISTS idx_user_characters_user_id;
DROP INDEX IF EXISTS idx_user_preferences_user_id;
DROP INDEX IF EXISTS idx_seasonal_events_dates;
DROP INDEX IF EXISTS idx_expense_interactions_user_id;
DROP INDEX IF EXISTS idx_mini_game_scores_user_game;

-- ============================================================================
-- Step 6: Clean up any gamification-related RLS policies that might remain
-- ============================================================================

-- These should be automatically dropped with tables, but including for completeness
-- (No action needed - policies are dropped automatically with tables)

COMMIT;

-- ============================================================================
-- Verification queries - Run these after the cleanup to verify removal
-- ============================================================================

-- Check that gamification tables are removed
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- AND table_name LIKE '%achievement%' 
-- OR table_name LIKE '%gamification%' 
-- OR table_name LIKE '%character%' 
-- OR table_name LIKE '%challenge%' 
-- OR table_name LIKE '%budget_goal%' 
-- OR table_name LIKE '%user_profile%' 
-- OR table_name LIKE '%seasonal%' 
-- OR table_name LIKE '%mini_game%';

-- Check that triggers are removed
-- SELECT trigger_name FROM information_schema.triggers 
-- WHERE trigger_schema = 'public' 
-- AND (trigger_name LIKE '%gamification%' OR trigger_name LIKE '%profile%');

-- Check that functions are removed  
-- SELECT routine_name FROM information_schema.routines 
-- WHERE routine_schema = 'public' 
-- AND (routine_name LIKE '%gamification%' OR routine_name LIKE '%profile%' OR routine_name LIKE '%achievement%');

-- ============================================================================
-- Notes:
-- ============================================================================

-- 1. This script uses CASCADE to automatically drop dependent objects
-- 2. All user progress, points, achievements, and gamification data will be permanently lost
-- 3. The core expense tracking functionality (expenses, categories, users) will remain intact
-- 4. After running this script, your app should work normally without gamification features
-- 5. If you want to re-enable gamification later, you'll need to run the original 
--    gamification.sql and advanced-gamification.sql scripts again (but all user progress will be lost)

-- Success message will be displayed if script completes without errors
SELECT 'Gamification cleanup completed successfully!' as status;