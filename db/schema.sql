-- 25 West Gallery — Neon Postgres schema

CREATE TABLE IF NOT EXISTS artists (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  discipline TEXT,
  seed TEXT NOT NULL,
  image_url TEXT,
  bio TEXT,
  statement TEXT,
  links JSONB NOT NULL DEFAULT '[]',
  exhibitions JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS works (
  id TEXT PRIMARY KEY,
  artist TEXT NOT NULL REFERENCES artists(slug) ON DELETE CASCADE,
  title TEXT NOT NULL,
  medium TEXT,
  dimensions TEXT,
  price TEXT,
  seed TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exhibitions (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  artists JSONB NOT NULL DEFAULT '[]',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'archive',
  seed TEXT NOT NULL,
  image_url TEXT,
  statement TEXT,
  works JSONB NOT NULL DEFAULT '[]',
  install_seeds JSONB NOT NULL DEFAULT '[]',
  install_images JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT,
  date DATE NOT NULL,
  time TEXT,
  description TEXT,
  rsvp TEXT,
  related JSONB NOT NULL DEFAULT '{}',
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS opportunities (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  kind TEXT,
  deadline DATE,
  show_dates TEXT,
  compensation TEXT,
  process TEXT,
  materials JSONB NOT NULL DEFAULT '[]',
  apply_href TEXT,
  statement TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gallery_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  name TEXT,
  email TEXT,
  instagram TEXT,
  instagram_href TEXT,
  address TEXT,
  hours TEXT,
  mission TEXT,
  philosophy TEXT,
  team JSONB NOT NULL DEFAULT '[]',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_works_artist ON works(artist);
CREATE INDEX IF NOT EXISTS idx_exhibitions_status ON exhibitions(status);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
