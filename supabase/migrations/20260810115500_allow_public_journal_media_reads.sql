create policy "public can read public journal media"
  on public.journal_entry_media
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.media_assets
      where media_assets.id = journal_entry_media.media_id
        and media_assets.is_public = true
    )
  );
