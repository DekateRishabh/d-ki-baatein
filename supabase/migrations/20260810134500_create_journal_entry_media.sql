create table if not exists public.journal_entry_media (
  journal_entry_id uuid not null references public.journal_entries(id) on delete cascade,
  media_id uuid not null references public.media_assets(id) on delete cascade,
  sort_order integer not null default 0,
  caption text,
  primary key (journal_entry_id, media_id)
);

create index if not exists journal_entry_media_order_idx
  on public.journal_entry_media (journal_entry_id, sort_order);

alter table public.journal_entry_media enable row level security;

create policy "authenticated users can manage journal entry media"
  on public.journal_entry_media
  for all
  to authenticated
  using (true)
  with check (true);
