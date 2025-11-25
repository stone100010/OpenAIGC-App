-- OpenAIGC 用户系统数据库初始化脚本
-- 数据库: PostgreSQL (Neon托管)
-- 创建时间: 2025-11-23

BEGIN;

-- 启用必要的扩展
CREATE EXTENSION  "uuid-ossp";
CREATE EXTENSION  "pgcrypto";

-- 用户基础信息表
CREATE TABLE  users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    invite_code VARCHAR(50) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    is_pro BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,
    email_verified_at TIMESTAMP WITH TIME ZONE
);

-- 用户会话表
CREATE TABLE  user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    refresh_token VARCHAR(255) UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    is_active BOOLEAN DEFAULT true
);

-- 用户资料表
CREATE TABLE  user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    display_name VARCHAR(100),
    avatar_url VARCHAR(500),
    bio TEXT,
    join_date DATE DEFAULT CURRENT_DATE,
    timezone VARCHAR(50) DEFAULT 'UTC',
    language VARCHAR(10) DEFAULT 'zh-CN',
    theme VARCHAR(20) DEFAULT 'light',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 用户统计表
CREATE TABLE  user_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    artworks_count INTEGER DEFAULT 0,
    total_duration_minutes INTEGER DEFAULT 0,
    likes_received INTEGER DEFAULT 0,
    pro_expires_at TIMESTAMP WITH TIME ZONE,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 用户创作历史表
CREATE TABLE  user_artworks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    content_type VARCHAR(50) NOT NULL, -- 'image', 'audio', 'video', 'text'
    content_url VARCHAR(500),
    thumbnail_url VARCHAR(500),
    prompt TEXT,
    parameters JSONB,
    is_public BOOLEAN DEFAULT false,
    likes_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 用户收藏表
CREATE TABLE  user_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    artwork_id UUID REFERENCES user_artworks(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, artwork_id)
);

-- 用户偏好设置表
CREATE TABLE  user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    setting_key VARCHAR(100) NOT NULL,
    setting_value JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, setting_key)
);

-- 邀请码表
CREATE TABLE  invite_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    code_type VARCHAR(20) NOT NULL DEFAULT 'standard', -- 'standard', 'pro', 'admin'
    description TEXT,
    max_uses INTEGER DEFAULT 1,
    used_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    used_by UUID REFERENCES users(id) ON DELETE SET NULL,
    used_at TIMESTAMP WITH TIME ZONE
);

-- 邀请码使用记录表
CREATE TABLE  invite_code_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invite_code_id UUID REFERENCES invite_codes(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- 创建索引
CREATE INDEX  idx_users_email ON users(email);
CREATE INDEX  idx_users_username ON users(username);
CREATE INDEX  idx_users_invite_code ON users(invite_code);
CREATE INDEX  idx_users_is_active ON users(is_active);
CREATE INDEX  idx_users_created_at ON users(created_at);

CREATE INDEX  idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX  idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX  idx_user_sessions_expires_at ON user_sessions(expires_at);

CREATE INDEX  idx_user_artworks_user_id ON user_artworks(user_id);
CREATE INDEX  idx_user_artworks_content_type ON user_artworks(content_type);
CREATE INDEX  idx_user_artworks_created_at ON user_artworks(created_at);
CREATE INDEX  idx_user_artworks_is_public ON user_artworks(is_public);

CREATE INDEX  idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX  idx_user_favorites_artwork_id ON user_favorites(artwork_id);

CREATE INDEX  idx_user_preferences_user_id ON user_preferences(user_id);

CREATE INDEX  idx_invite_codes_code ON invite_codes(code);
CREATE INDEX  idx_invite_codes_type ON invite_codes(code_type);
CREATE INDEX  idx_invite_codes_active ON invite_codes(is_active);
CREATE INDEX  idx_invite_codes_expires ON invite_codes(expires_at);

CREATE INDEX  idx_invite_code_usage_code_id ON invite_code_usage(invite_code_id);
CREATE INDEX  idx_invite_code_usage_user_id ON invite_code_usage(user_id);

-- 自动更新 updated_at 字段的函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为相关表添加触发器
CREATE TRIGGER  update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER  update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER  update_user_stats_updated_at 
    BEFORE UPDATE ON user_stats 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER  update_user_artworks_updated_at 
    BEFORE UPDATE ON user_artworks 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER  update_user_preferences_updated_at 
    BEFORE UPDATE ON user_preferences 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 自动更新用户统计的函数
CREATE OR REPLACE FUNCTION update_user_artworks_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE user_stats 
        SET artworks_count = artworks_count + 1,
            last_activity_at = NOW()
        WHERE user_id = NEW.user_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE user_stats 
        SET artworks_count = artworks_count - 1
        WHERE user_id = OLD.user_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER  trigger_update_user_artworks_count
    AFTER INSERT OR DELETE ON user_artworks
    FOR EACH ROW EXECUTE FUNCTION update_user_artworks_count();

-- 更新邀请码使用状态的函数
CREATE OR REPLACE FUNCTION update_invite_code_usage()
RETURNS TRIGGER AS $
BEGIN
    -- 当用户注册完成时，核销邀请码
    IF TG_OP = 'INSERT' THEN
        -- 查找对应的邀请码
        UPDATE invite_codes 
        SET 
            used_count = used_count + 1,
            used_by = NEW.id,
            used_at = NOW(),
            is_active = CASE 
                WHEN used_count + 1 >= max_uses THEN false 
                ELSE is_active 
            END
        WHERE code = NEW.invite_code 
        AND is_active = true 
        AND (expires_at IS NULL OR expires_at > NOW());
        
        -- 记录使用历史
        INSERT INTO invite_code_usage (invite_code_id, user_id, used_at)
        SELECT ic.id, NEW.id, NOW()
        FROM invite_codes ic 
        WHERE ic.code = NEW.invite_code 
        AND ic.is_active = true;
        
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$ language 'plpgsql';

-- 为用户注册添加邀请码核销触发器
CREATE TRIGGER  trigger_invite_code_consumption
    AFTER INSERT ON users
    FOR EACH ROW EXECUTE FUNCTION update_invite_code_usage();

-- 创建视图：用户完整信息
CREATE OR REPLACE VIEW user_complete_info AS
SELECT 
    u.id,
    u.username,
    u.email,
    u.is_pro,
    u.is_verified,
    u.created_at,
    u.last_login_at,
    up.display_name,
    up.avatar_url,
    up.bio,
    up.theme,
    us.artworks_count,
    us.total_duration_minutes,
    us.likes_received,
    us.last_activity_at
FROM users u
LEFT JOIN user_profiles up ON u.id = up.user_id
LEFT JOIN user_stats us ON u.id = us.user_id
WHERE u.is_active = true;

-- 预设邀请码数据
INSERT INTO invite_codes (code, code_type, description, max_uses, is_active, expires_at) VALUES
('ADMIN2024', 'admin', '管理员专用邀请码', 1, true, '2025-12-31 23:59:59'),
('VJwgvd', 'pro', 'Generated invite code 1', 5, true, '2025-12-31 23:59:59'),
('zxyQIv', 'pro', 'Generated invite code 2', 5, true, '2025-12-31 23:59:59'),
('mG1Z2v', 'pro', 'Generated invite code 3', 5, true, '2025-12-31 23:59:59'),
('67Cndi', 'pro', 'Generated invite code 4', 5, true, '2025-12-31 23:59:59'),
('6AwdEw', 'pro', 'Generated invite code 5', 5, true, '2025-12-31 23:59:59'),
('IcDZr2', 'pro', 'Generated invite code 6', 5, true, '2025-12-31 23:59:59'),
('UQcFVP', 'pro', 'Generated invite code 7', 5, true, '2025-12-31 23:59:59'),
('hqE1hF', 'pro', 'Generated invite code 8', 5, true, '2025-12-31 23:59:59'),
('02b24L', 'pro', 'Generated invite code 9', 5, true, '2025-12-31 23:59:59'),
('QmPAPd', 'pro', 'Generated invite code 10', 5, true, '2025-12-31 23:59:59'),
('sQeto9', 'standard', 'Generated invite code 11', 3, true, '2025-12-31 23:59:59'),
('7MDsGP', 'standard', 'Generated invite code 12', 3, true, '2025-12-31 23:59:59'),
('y1x3bq', 'standard', 'Generated invite code 13', 3, true, '2025-12-31 23:59:59'),
('FWp2sY', 'standard', 'Generated invite code 14', 3, true, '2025-12-31 23:59:59'),
('HB0X4N', 'standard', 'Generated invite code 15', 3, true, '2025-12-31 23:59:59'),
('mCioZo', 'standard', 'Generated invite code 16', 3, true, '2025-12-31 23:59:59'),
('A54JZv', 'standard', 'Generated invite code 17', 3, true, '2025-12-31 23:59:59'),
('G0jtNO', 'standard', 'Generated invite code 18', 3, true, '2025-12-31 23:59:59'),
('S7beKq', 'standard', 'Generated invite code 19', 3, true, '2025-12-31 23:59:59'),
('K4EiP8', 'standard', 'Generated invite code 20', 3, true, '2025-12-31 23:59:59'),
('m6fTV3', 'standard', 'Generated invite code 21', 3, true, '2025-12-31 23:59:59'),
('JPACEA', 'standard', 'Generated invite code 22', 3, true, '2025-12-31 23:59:59'),
('JKkeuY', 'standard', 'Generated invite code 23', 3, true, '2025-12-31 23:59:59'),
('tfghUF', 'standard', 'Generated invite code 24', 3, true, '2025-12-31 23:59:59'),
('PV7PRN', 'standard', 'Generated invite code 25', 3, true, '2025-12-31 23:59:59'),
('ATKqL5', 'standard', 'Generated invite code 26', 3, true, '2025-12-31 23:59:59'),
('OCHOpl', 'standard', 'Generated invite code 27', 3, true, '2025-12-31 23:59:59'),
('nlRZ5m', 'standard', 'Generated invite code 28', 3, true, '2025-12-31 23:59:59'),
('HyZrst', 'standard', 'Generated invite code 29', 3, true, '2025-12-31 23:59:59'),
('Bq0K6c', 'standard', 'Generated invite code 30', 3, true, '2025-12-31 23:59:59'),
('diAIuw', 'standard', 'Generated invite code 31', 1, true, '2025-12-31 23:59:59'),
('Xb5hBz', 'standard', 'Generated invite code 32', 1, true, '2025-12-31 23:59:59'),
('wceRKg', 'standard', 'Generated invite code 33', 1, true, '2025-12-31 23:59:59'),
('atreL4', 'standard', 'Generated invite code 34', 1, true, '2025-12-31 23:59:59'),
('bETJ2C', 'standard', 'Generated invite code 35', 1, true, '2025-12-31 23:59:59'),
('h2cooJ', 'standard', 'Generated invite code 36', 1, true, '2025-12-31 23:59:59'),
('EDLDql', 'standard', 'Generated invite code 37', 1, true, '2025-12-31 23:59:59'),
('NJfXYx', 'standard', 'Generated invite code 38', 1, true, '2025-12-31 23:59:59'),
('MNOkq7', 'standard', 'Generated invite code 39', 1, true, '2025-12-31 23:59:59'),
('z53IDT', 'standard', 'Generated invite code 40', 1, true, '2025-12-31 23:59:59'),
('NGTgcS', 'standard', 'Generated invite code 41', 1, true, '2025-12-31 23:59:59'),
('SxESse', 'standard', 'Generated invite code 42', 1, true, '2025-12-31 23:59:59'),
('wxAkDt', 'standard', 'Generated invite code 43', 1, true, '2025-12-31 23:59:59'),
('5MvkuS', 'standard', 'Generated invite code 44', 1, true, '2025-12-31 23:59:59'),
('e10ayt', 'standard', 'Generated invite code 45', 1, true, '2025-12-31 23:59:59'),
('r3xj6U', 'standard', 'Generated invite code 46', 1, true, '2025-12-31 23:59:59'),
('UVx2WI', 'standard', 'Generated invite code 47', 1, true, '2025-12-31 23:59:59'),
('JWJrV3', 'standard', 'Generated invite code 48', 1, true, '2025-12-31 23:59:59'),
('QhiK1V', 'standard', 'Generated invite code 49', 1, true, '2025-12-31 23:59:59'),
('9BhN2S', 'standard', 'Generated invite code 50', 1, true, '2025-12-31 23:59:59'),
('7ohElh', 'standard', 'Generated invite code 51', 1, true, '2025-12-31 23:59:59'),
('iSzoWJ', 'standard', 'Generated invite code 52', 1, true, '2025-12-31 23:59:59'),
('krEMsi', 'standard', 'Generated invite code 53', 1, true, '2025-12-31 23:59:59'),
('jUPH9y', 'standard', 'Generated invite code 54', 1, true, '2025-12-31 23:59:59'),
('o9gIa7', 'standard', 'Generated invite code 55', 1, true, '2025-12-31 23:59:59'),
('DFyLxJ', 'standard', 'Generated invite code 56', 1, true, '2025-12-31 23:59:59'),
('wLP33t', 'standard', 'Generated invite code 57', 1, true, '2025-12-31 23:59:59'),
('lWUZsg', 'standard', 'Generated invite code 58', 1, true, '2025-12-31 23:59:59'),
('674E33', 'standard', 'Generated invite code 59', 1, true, '2025-12-31 23:59:59'),
('QbnOVC', 'standard', 'Generated invite code 60', 1, true, '2025-12-31 23:59:59'),
('r2WXA2', 'standard', 'Generated invite code 61', 1, true, '2025-12-31 23:59:59'),
('4QyPrk', 'standard', 'Generated invite code 62', 1, true, '2025-12-31 23:59:59'),
('ARRF5e', 'standard', 'Generated invite code 63', 1, true, '2025-12-31 23:59:59'),
('n6LIsQ', 'standard', 'Generated invite code 64', 1, true, '2025-12-31 23:59:59'),
('RF5wgZ', 'standard', 'Generated invite code 65', 1, true, '2025-12-31 23:59:59'),
('Z9x1pA', 'standard', 'Generated invite code 66', 1, true, '2025-12-31 23:59:59'),
('WfI0TT', 'standard', 'Generated invite code 67', 1, true, '2025-12-31 23:59:59'),
('8uHDuN', 'standard', 'Generated invite code 68', 1, true, '2025-12-31 23:59:59'),
('9yZSqq', 'standard', 'Generated invite code 69', 1, true, '2025-12-31 23:59:59'),
('O2rnRk', 'standard', 'Generated invite code 70', 1, true, '2025-12-31 23:59:59'),
('BzpkiO', 'standard', 'Generated invite code 71', 1, true, '2025-12-31 23:59:59'),
('VR8Lpe', 'standard', 'Generated invite code 72', 1, true, '2025-12-31 23:59:59'),
('8q7VjH', 'standard', 'Generated invite code 73', 1, true, '2025-12-31 23:59:59'),
('HCjomW', 'standard', 'Generated invite code 74', 1, true, '2025-12-31 23:59:59'),
('X9TAsQ', 'standard', 'Generated invite code 75', 1, true, '2025-12-31 23:59:59'),
('bICmIC', 'standard', 'Generated invite code 76', 1, true, '2025-12-31 23:59:59'),
('eQZjkC', 'standard', 'Generated invite code 77', 1, true, '2025-12-31 23:59:59'),
('eUzOY7', 'standard', 'Generated invite code 78', 1, true, '2025-12-31 23:59:59'),
('CwmPhf', 'standard', 'Generated invite code 79', 1, true, '2025-12-31 23:59:59'),
('n4xHyS', 'standard', 'Generated invite code 80', 1, true, '2025-12-31 23:59:59'),
('CegOaq', 'standard', 'Generated invite code 81', 1, true, '2025-12-31 23:59:59'),
('5NYF4z', 'standard', 'Generated invite code 82', 1, true, '2025-12-31 23:59:59'),
('8XLKFr', 'standard', 'Generated invite code 83', 1, true, '2025-12-31 23:59:59'),
('CbGQO8', 'standard', 'Generated invite code 84', 1, true, '2025-12-31 23:59:59'),
('TIbmM4', 'standard', 'Generated invite code 85', 1, true, '2025-12-31 23:59:59'),
('Ltacpb', 'standard', 'Generated invite code 86', 1, true, '2025-12-31 23:59:59'),
('rJNE8f', 'standard', 'Generated invite code 87', 1, true, '2025-12-31 23:59:59'),
('GFecZV', 'standard', 'Generated invite code 88', 1, true, '2025-12-31 23:59:59'),
('ySCLpB', 'standard', 'Generated invite code 89', 1, true, '2025-12-31 23:59:59'),
('Uq56Lg', 'standard', 'Generated invite code 90', 1, true, '2025-12-31 23:59:59'),
('qMkr60', 'standard', 'Generated invite code 91', 1, true, '2025-12-31 23:59:59'),
('w0CWeH', 'standard', 'Generated invite code 92', 1, true, '2025-12-31 23:59:59'),
('JoQuMJ', 'standard', 'Generated invite code 93', 1, true, '2025-12-31 23:59:59'),
('FzbMnA', 'standard', 'Generated invite code 94', 1, true, '2025-12-31 23:59:59'),
('QX6BqJ', 'standard', 'Generated invite code 95', 1, true, '2025-12-31 23:59:59'),
('HqVwnD', 'standard', 'Generated invite code 96', 1, true, '2025-12-31 23:59:59'),
('rZuGvs', 'standard', 'Generated invite code 97', 1, true, '2025-12-31 23:59:59'),
('hQ9H9J', 'standard', 'Generated invite code 98', 1, true, '2025-12-31 23:59:59'),
('wuvY7E', 'standard', 'Generated invite code 99', 1, true, '2025-12-31 23:59:59'),
('HAsm2P', 'standard', 'Generated invite code 100', 1, true, '2025-12-31 23:59:59')
ON CONFLICT (code) DO NOTHING;

-- 预设管理员用户
-- 首先创建管理员用户（使用管理员邀请码）
INSERT INTO users (username, email, password_hash, invite_code, is_verified, is_pro) 
VALUES ('odyssey', 'odysseywarsaw@openaigc.fun', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeG.6D4L8X4Z3P7G2', 'ADMIN2024', true, true)
ON CONFLICT (username) DO NOTHING;

-- 为管理员用户创建资料和统计
INSERT INTO user_profiles (user_id, display_name, bio)
SELECT u.id, u.username, '系统管理员 - OpenAIGC创始人'
FROM users u 
WHERE u.username = 'odyssey'
ON CONFLICT DO NOTHING;

INSERT INTO user_stats (user_id, artworks_count, total_duration_minutes, likes_received)
SELECT u.id, 0, 0, 0
FROM users u 
WHERE u.username = 'odyssey'
ON CONFLICT DO NOTHING;

-- 为管理员设置权限相关的偏好设置
INSERT INTO user_preferences (user_id, setting_key, setting_value)
SELECT u.id, 'admin_permissions', '{"can_manage_users": true, "can_manage_invites": true, "can_access_logs": true}'::jsonb
FROM users u 
WHERE u.username = 'odyssey'
ON CONFLICT DO NOTHING;

-- 插入示例数据（仅用于测试）
-- 注意：生产环境中应删除这些示例数据

-- 示例用户（使用标准邀请码）
INSERT INTO users (username, email, password_hash, invite_code, is_verified, is_pro) 
VALUES 
('demo_user', 'demo@openai.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeG.6D4L8X4Z3P7G2', 'DEMO2024', true, false),
('pro_user', 'pro@openai.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeG.6D4L8X4Z3P7G2', 'IFLOW2024', true, true)
ON CONFLICT (username) DO NOTHING;

-- 为示例用户创建对应的资料和统计
INSERT INTO user_profiles (user_id, display_name, bio)
SELECT u.id, u.username, '示例用户 - ' || u.username
FROM users u 
WHERE u.username IN ('demo_user', 'pro_user')
ON CONFLICT DO NOTHING;

INSERT INTO user_stats (user_id, artworks_count, total_duration_minutes, likes_received)
SELECT u.id, FLOOR(RANDOM() * 50), FLOOR(RANDOM() * 1000), FLOOR(RANDOM() * 500)
FROM users u 
WHERE u.username IN ('demo_user', 'pro_user')
ON CONFLICT DO NOTHING;

COMMIT;

-- 输出完成信息
SELECT 'OpenAIGC 用户系统数据库初始化完成！' AS message;

-- 显示预设的管理员账户信息
SELECT 
    '预设管理员账户信息：' AS info,
    username,
    email,
    '密码: admin123' AS default_password,
    is_pro,
    '请及时修改默认密码！' AS security_warning
FROM users 
WHERE username = 'odyssey';

-- 显示可用邀请码信息
SELECT 
    '可用邀请码信息：' AS info,
    code,
    code_type,
    description,
    max_uses,
    used_count,
    is_active,
    expires_at
FROM invite_codes
ORDER BY code_type, code;