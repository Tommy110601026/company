-- =========================================================
-- EnviroValor 型錄下載後台：資料表、檔案空間與權限
-- 使用方式：Supabase 後台 → SQL Editor → 貼上整份 → Run
-- 可以重複執行，不會重複建立或清掉資料
-- =========================================================


-- ---------------------------------------------------------
-- 1. 型錄資料表
-- ---------------------------------------------------------

create table if not exists public.downloads (
    id              uuid primary key default gen_random_uuid(),

    title_zh        text not null,
    title_en        text not null,
    description_zh  text not null default '',
    description_en  text not null default '',
    highlights_zh   text[] not null default '{}',
    highlights_en   text[] not null default '{}',

    -- Storage 裡的路徑，例如 1747800000000-ab12cd.pdf
    file_path       text not null,
    -- 下載時給使用者看到的原始檔名
    file_name       text not null,
    -- 位元組數，前台自動換算成 KB / MB
    file_size       bigint not null,
    -- 副檔名大寫，例如 PDF
    file_type       text not null,
    upload_date     date not null default current_date,

    sort_order      integer not null default 0,
    published       boolean not null default true,

    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists downloads_set_updated_at on public.downloads;

create trigger downloads_set_updated_at
before update on public.downloads
for each row execute function public.set_updated_at();


-- ---------------------------------------------------------
-- 2. 資料表權限
-- 訪客：只能讀「已上架」的型錄
-- 登入者（業主）：可以新增、修改、刪除
-- ---------------------------------------------------------

alter table public.downloads enable row level security;

grant select on public.downloads to anon;
grant select, insert, update, delete on public.downloads to authenticated;

drop policy if exists "訪客讀取已上架型錄" on public.downloads;
create policy "訪客讀取已上架型錄"
on public.downloads for select
to anon
using (published);

drop policy if exists "登入者完整管理" on public.downloads;
create policy "登入者完整管理"
on public.downloads for all
to authenticated
using (true)
with check (true);


-- ---------------------------------------------------------
-- 3. 檔案空間（公開讀取，單檔上限 50 MB）
-- ---------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
    'downloads',
    'downloads',
    true,
    52428800,
    array[
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/zip',
        'application/x-zip-compressed'
    ]
)
on conflict (id) do update
set public             = excluded.public,
    file_size_limit    = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- 公開 bucket 不需要讀取權限也能下載；以下只開放登入者上傳、取代、刪除
drop policy if exists "登入者讀取型錄檔案" on storage.objects;
create policy "登入者讀取型錄檔案"
on storage.objects for select
to authenticated
using (bucket_id = 'downloads');

drop policy if exists "登入者上傳型錄檔案" on storage.objects;
create policy "登入者上傳型錄檔案"
on storage.objects for insert
to authenticated
with check (bucket_id = 'downloads');

drop policy if exists "登入者更新型錄檔案" on storage.objects;
create policy "登入者更新型錄檔案"
on storage.objects for update
to authenticated
using (bucket_id = 'downloads');

drop policy if exists "登入者刪除型錄檔案" on storage.objects;
create policy "登入者刪除型錄檔案"
on storage.objects for delete
to authenticated
using (bucket_id = 'downloads');
