-- Advanced Gamification Features

-- Character System
create table public.characters (
    id uuid primary key default gen_random_uuid(),
    name varchar(50) not null,
    type varchar(30) not null, -- 'mario', 'sonic', 'cat', 'robot', 'dragon', 'wizard'
    description text,
    unlock_condition varchar(100), -- 'streak_30', 'expenses_100', 'level_5', etc.
    unlock_points integer default 0,
    rarity varchar(20) default 'common', -- 'common', 'rare', 'epic', 'legendary'
    base_sprite varchar(100), -- URL or path to character sprite
    animations jsonb default '{}', -- JSON object with animation configurations
    is_active boolean default true,
    created_at timestamp with time zone default now()
);

-- Character Accessories/Customizations
create table public.character_accessories (
    id uuid primary key default gen_random_uuid(),
    name varchar(50) not null,
    type varchar(30) not null, -- 'hat', 'color', 'accessory', 'background'
    character_type varchar(30), -- null means applies to all characters
    sprite_path varchar(100),
    unlock_condition varchar(100),
    unlock_points integer default 0,
    rarity varchar(20) default 'common',
    is_active boolean default true,
    created_at timestamp with time zone default now()
);

-- User Character Progress
create table public.user_characters (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    character_id uuid references public.characters(id) on delete cascade not null,
    is_active boolean default false, -- Currently selected character
    unlocked_at timestamp with time zone default now(),
    unique(user_id, character_id)
);

-- User Accessory Progress
create table public.user_character_accessories (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    accessory_id uuid references public.character_accessories(id) on delete cascade not null,
    is_equipped boolean default false,
    unlocked_at timestamp with time zone default now(),
    unique(user_id, accessory_id)
);

-- Mood and Theme System
create table public.user_preferences (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null unique,
    current_mood varchar(20) default 'neutral', -- 'happy', 'neutral', 'worried', 'excited'
    theme_preference varchar(30) default 'auto', -- 'auto', 'always_light', 'always_dark', 'mood_based'
    animation_level varchar(20) default 'full', -- 'minimal', 'reduced', 'full'
    sound_enabled boolean default true,
    character_reactions boolean default true,
    background_effects boolean default true,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Seasonal Events
create table public.seasonal_events (
    id uuid primary key default gen_random_uuid(),
    name varchar(100) not null,
    description text,
    event_type varchar(30) not null, -- 'holiday', 'monthly_challenge', 'special'
    start_date timestamp with time zone not null,
    end_date timestamp with time zone not null,
    special_achievements jsonb default '[]', -- Array of special achievement IDs
    theme_overrides jsonb default '{}', -- Special UI theme during event
    bonus_multiplier decimal(3,2) default 1.0,
    is_active boolean default true,
    created_at timestamp with time zone default now()
);

-- User participation in seasonal events
create table public.user_seasonal_events (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    event_id uuid references public.seasonal_events(id) on delete cascade not null,
    progress jsonb default '{}', -- Event-specific progress tracking
    rewards_claimed jsonb default '[]', -- Array of claimed rewards
    joined_at timestamp with time zone default now(),
    unique(user_id, event_id)
);

-- Enhanced Achievement Categories
alter table public.achievements add column if not exists achievement_type varchar(30) default 'standard';
alter table public.achievements add column if not exists is_hidden boolean default false;
alter table public.achievements add column if not exists is_combo boolean default false;
alter table public.achievements add column if not exists combo_requirements jsonb default '[]';
alter table public.achievements add column if not exists seasonal_event_id uuid references public.seasonal_events(id);

-- Expense Animations and Interactions
create table public.expense_interactions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    expense_id uuid references public.expenses(id) on delete cascade not null,
    interaction_type varchar(30) not null, -- 'coin_flip', 'category_chomp', 'character_reaction'
    animation_data jsonb default '{}',
    created_at timestamp with time zone default now()
);

-- Mini-games and Predictions
create table public.mini_games (
    id uuid primary key default gen_random_uuid(),
    name varchar(50) not null,
    game_type varchar(30) not null, -- 'prediction', 'sorting', 'budgeting'
    description text,
    reward_points integer default 50,
    difficulty_level integer default 1,
    is_active boolean default true,
    created_at timestamp with time zone default now()
);

create table public.user_mini_game_scores (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    mini_game_id uuid references public.mini_games(id) on delete cascade not null,
    score integer not null,
    completion_time interval,
    points_earned integer default 0,
    played_at timestamp with time zone default now()
);

-- Social Features (Optional)
create table public.friend_connections (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    friend_id uuid references auth.users(id) on delete cascade not null,
    status varchar(20) default 'pending', -- 'pending', 'accepted', 'blocked'
    created_at timestamp with time zone default now(),
    unique(user_id, friend_id),
    check (user_id != friend_id)
);

create table public.challenge_invitations (
    id uuid primary key default gen_random_uuid(),
    challenger_id uuid references auth.users(id) on delete cascade not null,
    challenged_id uuid references auth.users(id) on delete cascade not null,
    challenge_type varchar(30) not null, -- 'savings_goal', 'streak_battle', 'category_limit'
    challenge_data jsonb not null,
    status varchar(20) default 'pending',
    expires_at timestamp with time zone not null,
    created_at timestamp with time zone default now()
);

-- RLS Policies
alter table public.characters enable row level security;
alter table public.character_accessories enable row level security;
alter table public.user_characters enable row level security;
alter table public.user_character_accessories enable row level security;
alter table public.user_preferences enable row level security;
alter table public.user_seasonal_events enable row level security;
alter table public.expense_interactions enable row level security;
alter table public.user_mini_game_scores enable row level security;
alter table public.friend_connections enable row level security;
alter table public.challenge_invitations enable row level security;

-- Public read policies for game content
create policy "Everyone can view characters" on public.characters
    for select using (true);

create policy "Everyone can view character accessories" on public.character_accessories
    for select using (true);

create policy "Everyone can view seasonal events" on public.seasonal_events
    for select using (true);

create policy "Everyone can view mini games" on public.mini_games
    for select using (true);

-- User-specific policies
create policy "Users can manage their character unlocks" on public.user_characters
    for all using (auth.uid() = user_id);

create policy "Users can manage their accessory unlocks" on public.user_character_accessories
    for all using (auth.uid() = user_id);

create policy "Users can manage their preferences" on public.user_preferences
    for all using (auth.uid() = user_id);

create policy "Users can view their seasonal event progress" on public.user_seasonal_events
    for all using (auth.uid() = user_id);

create policy "Users can manage their expense interactions" on public.expense_interactions
    for all using (auth.uid() = user_id);

create policy "Users can manage their mini game scores" on public.user_mini_game_scores
    for all using (auth.uid() = user_id);

-- Friend and challenge policies
create policy "Users can manage their friendships" on public.friend_connections
    for all using (auth.uid() = user_id or auth.uid() = friend_id);

create policy "Users can view relevant challenge invitations" on public.challenge_invitations
    for select using (auth.uid() = challenger_id or auth.uid() = challenged_id);

-- Insert default characters
insert into public.characters (name, type, description, unlock_condition, unlock_points, rarity, base_sprite) values
    ('Penny the Pig', 'pig', 'A cute piggy bank character who loves saving money', 'default', 0, 'common', '/characters/penny-pig.png'),
    ('Mario the Plumber', 'mario', 'Classic Italian plumber who collects coins', 'expenses_50', 150, 'rare', '/characters/mario.png'),
    ('Sonic the Hedgehog', 'sonic', 'Super fast hedgehog who runs through expenses', 'streak_14', 200, 'rare', '/characters/sonic.png'),
    ('Whiskers the Cat', 'cat', 'A lazy cat who judges your spending habits', 'level_3', 300, 'epic', '/characters/whiskers.png'),
    ('R2-Money2', 'robot', 'Futuristic robot that calculates optimal spending', 'budget_achiever', 250, 'epic', '/characters/robot.png'),
    ('Drake the Dragon', 'dragon', 'Ancient dragon who hoards treasure wisely', 'expenses_500', 1000, 'legendary', '/characters/dragon.png'),
    ('Merlin the Wizard', 'wizard', 'Magical wizard who makes money multiply', 'level_8', 2000, 'legendary', '/characters/wizard.png');

-- Insert default accessories
insert into public.character_accessories (name, type, character_type, sprite_path, unlock_condition, unlock_points, rarity) values
    ('Red Cap', 'hat', 'mario', '/accessories/red-cap.png', 'first_expense', 25, 'common'),
    ('Cool Sunglasses', 'accessory', null, '/accessories/sunglasses.png', 'streak_7', 100, 'rare'),
    ('Golden Crown', 'hat', null, '/accessories/crown.png', 'level_5', 500, 'epic'),
    ('Rainbow Colors', 'color', null, '/accessories/rainbow.png', 'category_explorer', 150, 'rare'),
    ('Wizard Hat', 'hat', 'wizard', '/accessories/wizard-hat.png', 'expenses_100', 200, 'epic'),
    ('Speed Shoes', 'accessory', 'sonic', '/accessories/speed-shoes.png', 'big_spender', 300, 'epic'),
    ('Treasure Background', 'background', null, '/accessories/treasure-bg.png', 'budget_setter', 400, 'legendary');

-- Insert seasonal events
insert into public.seasonal_events (name, description, event_type, start_date, end_date, bonus_multiplier) values
    ('New Year Financial Resolutions', 'Start the year with great financial habits', 'holiday', '2024-01-01', '2024-01-31', 1.5),
    ('Summer Savings Challenge', 'Save money during the summer months', 'monthly_challenge', '2024-06-01', '2024-08-31', 1.25),
    ('Holiday Spending Awareness', 'Stay mindful during the holiday season', 'holiday', '2024-12-01', '2024-12-31', 2.0);

-- Insert mini-games
insert into public.mini_games (name, game_type, description, reward_points, difficulty_level) values
    ('Expense Predictor', 'prediction', 'Predict your next month spending and earn points for accuracy', 100, 2),
    ('Category Speed Sort', 'sorting', 'Quickly sort expenses into the correct categories', 50, 1),
    ('Budget Allocator', 'budgeting', 'Drag and drop to create the perfect budget distribution', 75, 2),
    ('Expense Memory Game', 'memory', 'Remember and match expense patterns', 60, 1),
    ('Financial Quiz Master', 'quiz', 'Test your financial knowledge', 80, 3);

-- Enhanced achievements with new types
insert into public.achievements (key, name, description, icon, points, badge_color, category, achievement_type, is_hidden) values
    ('combo_saver', 'Combo Saver', 'Stay under budget for 7 consecutive days', 'Zap', 300, '#10B981', 'combos', 'combo', false),
    ('midnight_tracker', 'Night Owl', 'Track an expense after midnight', 'Moon', 50, '#6366F1', 'hidden', 'standard', true),
    ('weekend_warrior', 'Weekend Warrior', 'Track expenses on 10 different weekends', 'Calendar', 200, '#8B5CF6', 'consistency', 'standard', false),
    ('expense_artist', 'Expense Artist', 'Use all available categories in a single month', 'Palette', 250, '#F59E0B', 'variety', 'standard', false),
    ('achievement_hunter', 'Achievement Hunter', 'Unlock 10 different achievements', 'Trophy', 500, '#DC2626', 'meta', 'combo', false);

-- Create indexes
create index idx_user_characters_user_id on public.user_characters(user_id);
create index idx_user_preferences_user_id on public.user_preferences(user_id);
create index idx_seasonal_events_dates on public.seasonal_events(start_date, end_date);
create index idx_expense_interactions_user_id on public.expense_interactions(user_id);
create index idx_mini_game_scores_user_game on public.user_mini_game_scores(user_id, mini_game_id);