-- Gamification tables for expense tracker

-- User achievements and progress
create table public.user_profiles (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null unique,
    total_points integer default 0,
    current_streak integer default 0,
    longest_streak integer default 0,
    last_entry_date date,
    level integer default 1,
    total_expenses_tracked integer default 0,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Achievements system
create table public.achievements (
    id uuid primary key default gen_random_uuid(),
    key varchar(50) unique not null,
    name varchar(100) not null,
    description text,
    icon varchar(50),
    points integer default 0,
    badge_color varchar(7) default '#3B82F6',
    category varchar(50) default 'general',
    is_active boolean default true,
    created_at timestamp with time zone default now()
);

-- User achievements
create table public.user_achievements (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    achievement_id uuid references public.achievements(id) on delete cascade not null,
    earned_at timestamp with time zone default now(),
    points_earned integer default 0,
    unique(user_id, achievement_id)
);

-- Budget goals
create table public.budget_goals (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    category_id uuid references public.categories(id) on delete cascade,
    name varchar(100) not null,
    target_amount decimal(10,2) not null,
    period varchar(20) not null check (period in ('daily', 'weekly', 'monthly', 'yearly')),
    start_date date not null,
    end_date date not null,
    is_active boolean default true,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Challenges
create table public.challenges (
    id uuid primary key default gen_random_uuid(),
    name varchar(100) not null,
    description text,
    challenge_type varchar(50) not null,
    target_value decimal(10,2),
    reward_points integer default 0,
    start_date date not null,
    end_date date not null,
    is_active boolean default true,
    created_at timestamp with time zone default now()
);

-- User challenges
create table public.user_challenges (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    challenge_id uuid references public.challenges(id) on delete cascade not null,
    progress decimal(10,2) default 0,
    completed boolean default false,
    completed_at timestamp with time zone,
    points_earned integer default 0,
    joined_at timestamp with time zone default now(),
    unique(user_id, challenge_id)
);

-- Enable RLS
alter table public.user_profiles enable row level security;
alter table public.user_achievements enable row level security;
alter table public.budget_goals enable row level security;
alter table public.user_challenges enable row level security;

-- User profiles policies
create policy "Users can view their own profile" on public.user_profiles
    for select using (auth.uid() = user_id);

create policy "Users can create their own profile" on public.user_profiles
    for insert with check (auth.uid() = user_id);

create policy "Users can update their own profile" on public.user_profiles
    for update using (auth.uid() = user_id);

-- User achievements policies
create policy "Users can view their own achievements" on public.user_achievements
    for select using (auth.uid() = user_id);

create policy "Users can create their own achievements" on public.user_achievements
    for insert with check (auth.uid() = user_id);

-- Budget goals policies
create policy "Users can view their own budget goals" on public.budget_goals
    for select using (auth.uid() = user_id);

create policy "Users can create their own budget goals" on public.budget_goals
    for insert with check (auth.uid() = user_id);

create policy "Users can update their own budget goals" on public.budget_goals
    for update using (auth.uid() = user_id);

create policy "Users can delete their own budget goals" on public.budget_goals
    for delete using (auth.uid() = user_id);

-- User challenges policies
create policy "Users can view their own challenges" on public.user_challenges
    for select using (auth.uid() = user_id);

create policy "Users can create their own challenges" on public.user_challenges
    for insert with check (auth.uid() = user_id);

create policy "Users can update their own challenges" on public.user_challenges
    for update using (auth.uid() = user_id);

-- Public read access for achievements and challenges
create policy "Everyone can view achievements" on public.achievements
    for select using (true);

create policy "Everyone can view challenges" on public.challenges
    for select using (true);

-- Insert default achievements
insert into public.achievements (key, name, description, icon, points, badge_color, category) values
    ('first_expense', 'First Steps', 'Track your first expense', 'Target', 50, '#10B981', 'getting_started'),
    ('expense_streak_7', 'Week Warrior', 'Track expenses for 7 days in a row', 'Flame', 100, '#F59E0B', 'streaks'),
    ('expense_streak_30', 'Monthly Master', 'Track expenses for 30 days in a row', 'Award', 300, '#8B5CF6', 'streaks'),
    ('expense_streak_100', 'Century Champion', 'Track expenses for 100 days in a row', 'Crown', 1000, '#EF4444', 'streaks'),
    ('expenses_10', 'Getting Started', 'Track 10 expenses', 'TrendingUp', 75, '#3B82F6', 'milestones'),
    ('expenses_50', 'Halfway Hero', 'Track 50 expenses', 'BarChart3', 150, '#06B6D4', 'milestones'),
    ('expenses_100', 'Century Club', 'Track 100 expenses', 'Activity', 250, '#8B5CF6', 'milestones'),
    ('expenses_500', 'Tracking Titan', 'Track 500 expenses', 'Zap', 500, '#F59E0B', 'milestones'),
    ('category_explorer', 'Category Explorer', 'Use 5 different categories', 'Compass', 100, '#10B981', 'variety'),
    ('budget_setter', 'Budget Planner', 'Set your first budget goal', 'Target', 75, '#3B82F6', 'budgets'),
    ('budget_achiever', 'Goal Crusher', 'Successfully meet a budget goal', 'CheckCircle', 200, '#10B981', 'budgets'),
    ('frugal_week', 'Frugal Week', 'Spend under budget for 7 consecutive days', 'PiggyBank', 150, '#059669', 'savings'),
    ('big_spender', 'High Roller', 'Track an expense over $500', 'DollarSign', 100, '#DC2626', 'spending'),
    ('penny_pincher', 'Penny Pincher', 'Track 10 expenses under $5', 'Coins', 100, '#059669', 'savings');

-- Create function to update user profile
create or replace function update_user_profile()
returns trigger as $$
begin
    -- Update or insert user profile
    insert into public.user_profiles (user_id, total_expenses_tracked, last_entry_date)
    values (new.user_id, 1, new.date::date)
    on conflict (user_id) do update set
        total_expenses_tracked = user_profiles.total_expenses_tracked + 1,
        last_entry_date = new.date::date,
        updated_at = now();
    
    return new;
end;
$$ language 'plpgsql';

-- Create trigger for expense tracking
create trigger update_profile_on_expense
    after insert on public.expenses
    for each row
    execute procedure update_user_profile();

-- Function to calculate and update streaks
create or replace function update_user_streaks()
returns void as $$
declare
    user_record record;
    streak_days integer;
begin
    for user_record in select user_id, last_entry_date from public.user_profiles loop
        -- Calculate current streak
        if user_record.last_entry_date = current_date then
            streak_days := 1;
        elsif user_record.last_entry_date = current_date - interval '1 day' then
            -- Check consecutive days
            select count(*) into streak_days
            from (
                select date, lag(date) over (order by date) as prev_date
                from (
                    select distinct date::date as date
                    from public.expenses
                    where user_id = user_record.user_id
                    and date >= current_date - interval '100 days'
                    order by date desc
                ) t
            ) t2
            where prev_date is null or date = prev_date + interval '1 day';
        else
            streak_days := 0;
        end if;
        
        -- Update streak
        update public.user_profiles
        set 
            current_streak = streak_days,
            longest_streak = greatest(longest_streak, streak_days),
            updated_at = now()
        where user_id = user_record.user_id;
    end loop;
end;
$$ language 'plpgsql';

-- Function to increment user points
create or replace function increment_user_points(user_id_param uuid, points_to_add integer)
returns void as $$
begin
    update public.user_profiles
    set 
        total_points = total_points + points_to_add,
        updated_at = now()
    where user_id = user_id_param;
    
    -- If no profile exists, create one
    if not found then
        insert into public.user_profiles (user_id, total_points)
        values (user_id_param, points_to_add);
    end if;
end;
$$ language 'plpgsql';

-- Create indexes for better performance
create index idx_user_profiles_user_id on public.user_profiles(user_id);
create index idx_user_achievements_user_id on public.user_achievements(user_id);
create index idx_budget_goals_user_id on public.budget_goals(user_id);
create index idx_user_challenges_user_id on public.user_challenges(user_id);