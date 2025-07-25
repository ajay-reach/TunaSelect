
CREATE TABLE fish (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  weight_kg REAL NOT NULL,
  catch_date DATE NOT NULL,
  location TEXT NOT NULL,
  grade TEXT NOT NULL,
  price_per_kg REAL NOT NULL,
  is_available BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE segments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fish_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  segment_type TEXT NOT NULL,
  weight_kg REAL NOT NULL,
  position_x REAL NOT NULL,
  position_y REAL NOT NULL,
  width REAL NOT NULL,
  height REAL NOT NULL,
  is_available BOOLEAN DEFAULT 1,
  reserved_until TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  fish_id INTEGER NOT NULL,
  segment_ids TEXT NOT NULL,
  total_weight_kg REAL NOT NULL,
  total_price REAL NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  delivery_address TEXT,
  delivery_date DATE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
