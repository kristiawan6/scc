-- Admin users of the CMS.
create table users (
  id            uuid primary key default gen_random_uuid(),
  email         text not null unique,
  name          text not null,
  password_hash text not null,
  created_at    timestamptz not null default now()
);

-- One row per item of a CMS collection (highlights, ministries, next-steps, campuses).
-- `data` is validated against lib/cms.ts by the API before it is stored.
create table entries (
  id         uuid primary key default gen_random_uuid(),
  collection text not null,
  position   integer not null default 0,
  published  boolean not null default true,
  data       jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index entries_collection_position on entries (collection, position);

-- Singleton documents, e.g. key 'site' for church-wide settings.
create table settings (
  key        text primary key,
  data       jsonb not null,
  updated_at timestamptz not null default now()
);

-- Contact form submissions.
create table messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  phone      text not null default '',
  topic      text not null,
  message    text not null,
  read       boolean not null default false,
  created_at timestamptz not null default now()
);
create index messages_created_at on messages (created_at desc);
