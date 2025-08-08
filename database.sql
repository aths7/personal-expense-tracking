-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Categories table
create table public.categories (
    id uuid primary key default gen_random_uuid(),
    name varchar(100) not null,
    color varchar(7),
    icon varchar(50),
    user_id uuid references auth.users(id) on delete cascade,
    is_default boolean default false,
    created_at timestamp with time zone default now()
);

-- Expenses table
create table public.expenses (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    category_id uuid references public.categories(id) on delete set null,
    amount decimal(10,2) not null check (amount > 0),
    description text,
    date date not null,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Row Level Security (RLS) Policies
alter table public.categories enable row level security;
alter table public.expenses enable row level security;

-- Categories policies
create policy "Users can view their own categories" on public.categories
    for select using (auth.uid() = user_id or is_default = true);

create policy "Users can create their own categories" on public.categories
    for insert with check (auth.uid() = user_id);

create policy "Users can update their own categories" on public.categories
    for update using (auth.uid() = user_id);

create policy "Users can delete their own categories" on public.categories
    for delete using (auth.uid() = user_id);

-- Expenses policies
create policy "Users can view their own expenses" on public.expenses
    for select using (auth.uid() = user_id);

create policy "Users can create their own expenses" on public.expenses
    for insert with check (auth.uid() = user_id);

create policy "Users can update their own expenses" on public.expenses
    for update using (auth.uid() = user_id);

create policy "Users can delete their own expenses" on public.expenses
    for delete using (auth.uid() = user_id);

-- Create function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language 'plpgsql';

-- Create trigger for expenses table
create trigger update_expenses_updated_at
    before update on public.expenses
    for each row
    execute procedure update_updated_at_column();

-- Insert default categories
insert into public.categories (name, color, icon, is_default, user_id) values
    ('Food & Dining', '#FF6B6B', 'UtensilsCrossed', true, null),
    ('Transportation', '#4ECDC4', 'Car', true, null),
    ('Entertainment', '#45B7D1', 'Gamepad2', true, null),
    ('Bills & Utilities', '#FFA07A', 'Receipt', true, null),
    ('Shopping', '#98D8C8', 'ShoppingBag', true, null),
    ('Healthcare', '#F7DC6F', 'Heart', true, null),
    ('Education', '#BB8FCE', 'GraduationCap', true, null),
    ('Travel', '#85C1E9', 'Plane', true, null),
    ('Groceries', '#82E0AA', 'Apple', true, null),
    ('Other', '#D5DBDB', 'MoreHorizontal', true, null);

-- Create indexes for better performance
create index idx_expenses_user_id on public.expenses(user_id);
create index idx_expenses_date on public.expenses(date);
create index idx_expenses_category_id on public.expenses(category_id);
create index idx_categories_user_id on public.categories(user_id);