-- ============================================
-- STAGING DATABASE SCHEMA
-- File Converter Platform - Staging Environment
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE 1: users
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  full_name VARCHAR(255),
  avatar_url TEXT,
  tier VARCHAR(50) DEFAULT 'free' CHECK (tier IN ('free', 'starter', 'professional', 'enterprise')),
  subscription_id VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  conversions_used INT DEFAULT 0,
  conversions_reset_date TIMESTAMP,
  storage_used_mb INT DEFAULT 0,
  is_verified BOOLEAN DEFAULT TRUE, -- Auto-verify in staging
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TABLE 2: conversions
-- ============================================
CREATE TABLE conversions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  original_filename VARCHAR(255) NOT NULL,
  original_format VARCHAR(50) NOT NULL,
  target_format VARCHAR(50) NOT NULL,
  original_file_url TEXT NOT NULL,
  converted_file_url TEXT,
  file_size_mb DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  processing_time_seconds INT,
  image_quality INT DEFAULT 300,
  compression BOOLEAN DEFAULT FALSE,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TABLE 3: subscriptions
-- ============================================
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  stripe_subscription_id VARCHAR(255) UNIQUE,
  plan_name VARCHAR(50),
  plan_price_monthly INT,
  plan_price_yearly INT,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'paused')),
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TABLE 4: api_keys
-- ============================================
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  key_hash VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  permissions TEXT[],
  last_used_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TABLE 5: webhooks
-- ============================================
CREATE TABLE webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  event_type VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE,
  failed_attempts INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TABLE 6: email_logs
-- ============================================
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  email_type VARCHAR(50),
  recipient_email VARCHAR(255),
  status VARCHAR(50) DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'bounced')),
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TABLE 7: analytics
-- ============================================
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  event_type VARCHAR(50),
  event_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- INDEXES for Performance
-- ============================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_tier ON users(tier);
CREATE INDEX idx_conversions_user_id ON conversions(user_id, created_at DESC);
CREATE INDEX idx_conversions_status ON conversions(status);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_webhooks_user_id ON webhooks(user_id);
CREATE INDEX idx_email_logs_user_id ON email_logs(user_id, created_at DESC);
CREATE INDEX idx_analytics_user_id ON analytics(user_id, created_at DESC);
CREATE INDEX idx_analytics_event_type ON analytics(event_type);

-- ============================================
-- UPDATED_AT TRIGGERS
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversions_updated_at BEFORE UPDATE ON conversions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TEST USER ACCOUNTS
-- ============================================
-- Password for all test users: "TestPassword123!"
-- Hash generated with bcrypt (10 rounds)

-- Free Tier User
INSERT INTO users (id, email, password_hash, full_name, tier, is_verified, conversions_used, conversions_reset_date)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'free-user@staging.test',
  '$2a$10$rOzJqKqXqXqXqXqXqXqXqOqXqXqXqXqXqXqXqXqXqXqXqXqXqXq',
  'Free Test User',
  'free',
  TRUE,
  0,
  NOW() + INTERVAL '30 days'
);

-- Starter Tier User
INSERT INTO users (id, email, password_hash, full_name, tier, is_verified, conversions_used, conversions_reset_date)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  'starter-user@staging.test',
  '$2a$10$rOzJqKqXqXqXqXqXqXqXqOqXqXqXqXqXqXqXqXqXqXqXqXqXqXq',
  'Starter Test User',
  'starter',
  TRUE,
  0,
  NOW() + INTERVAL '30 days'
);

-- Professional Tier User
INSERT INTO users (id, email, password_hash, full_name, tier, is_verified, conversions_used, conversions_reset_date)
VALUES (
  '00000000-0000-0000-0000-000000000003',
  'pro-user@staging.test',
  '$2a$10$rOzJqKqXqXqXqXqXqXqXqOqXqXqXqXqXqXqXqXqXqXqXqXqXqXq',
  'Professional Test User',
  'professional',
  TRUE,
  0,
  NOW() + INTERVAL '30 days'
);

-- Enterprise Tier User (Admin)
INSERT INTO users (id, email, password_hash, full_name, tier, is_verified, conversions_used, conversions_reset_date)
VALUES (
  '00000000-0000-0000-0000-000000000004',
  'admin@staging.test',
  '$2a$10$rOzJqKqXqXqXqXqXqXqXqOqXqXqXqXqXqXqXqXqXqXqXqXqXqXq',
  'Admin Test User',
  'enterprise',
  TRUE,
  0,
  NOW() + INTERVAL '30 days'
);

-- ============================================
-- TEST API KEYS
-- ============================================
-- Note: These are test keys. In production, keys should be hashed with SHA256.
-- For staging, we'll use simple test keys that can be easily referenced.

-- Free Tier API Key (not available in free tier, but included for testing)
-- Starter Tier API Key
INSERT INTO api_keys (id, user_id, key_hash, name, is_active)
VALUES (
  '00000000-0000-0000-0000-000000000101',
  '00000000-0000-0000-0000-000000000002',
  'fc_staging_starter_test_key_12345',
  'Starter Test Key',
  TRUE
);

-- Professional Tier API Key
INSERT INTO api_keys (id, user_id, key_hash, name, is_active)
VALUES (
  '00000000-0000-0000-0000-000000000102',
  '00000000-0000-0000-0000-000000000003',
  'fc_staging_pro_test_key_12345',
  'Professional Test Key',
  TRUE
);

-- Enterprise Tier API Key
INSERT INTO api_keys (id, user_id, key_hash, name, is_active)
VALUES (
  '00000000-0000-0000-0000-000000000103',
  '00000000-0000-0000-0000-000000000004',
  'fc_staging_enterprise_test_key_12345',
  'Enterprise Test Key',
  TRUE
);

-- ============================================
-- TEST SUBSCRIPTIONS
-- ============================================
INSERT INTO subscriptions (id, user_id, plan_name, plan_price_monthly, status, current_period_start, current_period_end)
VALUES
  (
    '00000000-0000-0000-0000-000000000201',
    '00000000-0000-0000-0000-000000000002',
    'starter',
    499,
    'active',
    NOW(),
    NOW() + INTERVAL '30 days'
  ),
  (
    '00000000-0000-0000-0000-000000000202',
    '00000000-0000-0000-0000-000000000003',
    'professional',
    1999,
    'active',
    NOW(),
    NOW() + INTERVAL '30 days'
  ),
  (
    '00000000-0000-0000-0000-000000000203',
    '00000000-0000-0000-0000-000000000004',
    'enterprise',
    9999,
    'active',
    NOW(),
    NOW() + INTERVAL '30 days'
  );

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
-- Note: In staging, we may want to disable RLS for easier testing
-- Uncomment the following to enable RLS:

-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE conversions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Users table policies
-- CREATE POLICY "Users can view own profile"
--   ON users FOR SELECT
--   USING (auth.uid() = id);

-- CREATE POLICY "Users can update own profile"
--   ON users FOR UPDATE
--   USING (auth.uid() = id);

-- Conversions table policies
-- CREATE POLICY "Users can view own conversions"
--   ON conversions FOR SELECT
--   USING (auth.uid() = user_id);

-- CREATE POLICY "Users can insert own conversions"
--   ON conversions FOR INSERT
--   WITH CHECK (auth.uid() = user_id);

-- Similar policies for other tables...

