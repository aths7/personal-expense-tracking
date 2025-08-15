-- Quick Expense Templates table
create table public.quick_expense_templates (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    icon varchar(50) not null default 'Coffee',
    label varchar(100) not null,
    amount decimal(10,2) not null check (amount > 0),
    category_name varchar(100) not null,
    color varchar(7) default '#5c5c99',
    sort_order integer default 0,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Row Level Security (RLS) Policies
alter table public.quick_expense_templates enable row level security;

-- Quick expense templates policies
create policy "Users can view their own quick expense templates" on public.quick_expense_templates
    for select using (auth.uid() = user_id);

create policy "Users can create their own quick expense templates" on public.quick_expense_templates
    for insert with check (auth.uid() = user_id);

create policy "Users can update their own quick expense templates" on public.quick_expense_templates
    for update using (auth.uid() = user_id);

create policy "Users can delete their own quick expense templates" on public.quick_expense_templates
    for delete using (auth.uid() = user_id);

-- Create trigger for quick_expense_templates table
create trigger update_quick_expense_templates_updated_at
    before update on public.quick_expense_templates
    for each row
    execute procedure update_updated_at_column();

-- Create index for better performance
create index idx_quick_expense_templates_user_id on public.quick_expense_templates(user_id);
create index idx_quick_expense_templates_sort_order on public.quick_expense_templates(user_id, sort_order);