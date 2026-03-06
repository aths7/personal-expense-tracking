

create table public.loans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  loan_name text not null,
  loan_amount numeric(12,2) not null,
  lender_name text,
  rate_of_interest numeric(5,2) not null, -- % per annum
  start_date date not null,
  end_date date,
  emi_amount numeric(12,2),
  next_emi_date date,
  effective_interest numeric(12,2),
  status text not null
    check (status in ('pending','active','closed','written_off')) default 'active',
    currency_code char(3) not null default 'INR'
    check (currency_code ~ '^[A-Z]{3}$'),
    
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  -- Data quality
  constraint loans_user_loanname_uniq unique (user_id, loan_name),
  constraint loan_amount_pos check (loan_amount > 0),
  constraint roi_range check (rate_of_interest >= 0 and rate_of_interest <= 100),
  constraint emi_pos check (emi_amount is null or emi_amount > 0),
  constraint nonempty_loan_name check (length(trim(loan_name)) > 0),
  constraint dates_order check (end_date is null or end_date >= start_date),
  constraint next_emi_window check (
    next_emi_date is null
    or (next_emi_date >= start_date and (end_date is null or next_emi_date <= end_date))
  ),
  constraint eff_interest_pos check (effective_interest is null or effective_interest >= 0)
);

-- updated_at trigger
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at
before update on public.loans
for each row
execute function update_updated_at_column();

-- RLS
alter table public.loans enable row level security;

create policy "read own loans"
on public.loans for select to authenticated
using (user_id = auth.uid());

create policy "insert own loans"
on public.loans for insert to authenticated
with check (user_id = auth.uid());

create policy "update own loans"
on public.loans for update to authenticated
using (user_id = auth.uid());

create policy "delete own loans"
on public.loans for delete to authenticated
using (user_id = auth.uid());

-- Indexes
create index if not exists loans_user_id_idx on public.loans(user_id);
create index if not exists loans_user_next_emi_idx on public.loans(user_id, next_emi_date) where next_emi_date is not null;
create index if not exists loans_user_start_idx on public.loans(user_id, start_date);

