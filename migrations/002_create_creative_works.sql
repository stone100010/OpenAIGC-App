-- OpenAIGC 创作天地数据库迁移
-- 创建时间: 2025-11-23

BEGIN;

-- 创作作品主表
CREATE TABLE IF NOT EXISTS creative_works (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- 基础信息
    creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    
    -- 作品类型分类 (核心字段)
    content_type VARCHAR(20) NOT NULL CHECK (content_type IN ('text', 'image', 'audio', 'video')),
    
    -- 内容数据
    content_data JSONB,           -- 存储具体内容（文本、参数等）
    media_url VARCHAR(500),       -- 媒体文件URL
    thumbnail_url VARCHAR(500),   -- 缩略图URL
    
    -- 权限控制
    is_public BOOLEAN DEFAULT true,      -- 是否公开显示
    is_featured BOOLEAN DEFAULT false,   -- 是否精选展示
    
    -- 统计数据
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    
    -- 时间信息
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- 元数据
    tags TEXT[],                  -- 标签数组
    parameters JSONB,             -- 创作参数（提示词、设置等）
    duration INTEGER,             -- 时长（音频/视频用，秒）
    file_size BIGINT,             -- 文件大小（字节）
    
    CONSTRAINT unique_creator_title UNIQUE(creator_id, title)
);

-- 创作作品统计表
CREATE TABLE IF NOT EXISTS creative_work_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    work_id UUID REFERENCES creative_works(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    action_type VARCHAR(20) NOT NULL CHECK (action_type IN ('view', 'like', 'share')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(work_id, user_id, action_type)
);

-- 创作作品分类表
CREATE TABLE IF NOT EXISTS creative_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    name_cn VARCHAR(50) NOT NULL,
    icon VARCHAR(50), -- FontAwesome图标名称
    color VARCHAR(20) DEFAULT 'gray',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 插入默认分类
INSERT INTO creative_categories (name, name_cn, icon, color, description) VALUES
('image', '图像创作', 'fa-image', 'blue', 'AI驱动的图像生成和设计'),
('video', '视频制作', 'fa-video', 'green', '专业级AI视频生成和编辑'),
('audio', '音频合成', 'fa-music', 'pink', '智能语音和音乐创作'),
('text', '文本创作', 'fa-edit', 'purple', 'AI辅助的文本内容创作'),
('tools', '工具展示', 'fa-cogs', 'orange', '创作工具和功能演示')
ON CONFLICT (name) DO NOTHING;

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_creative_works_creator_id ON creative_works(creator_id);
CREATE INDEX IF NOT EXISTS idx_creative_works_content_type ON creative_works(content_type);
CREATE INDEX IF NOT EXISTS idx_creative_works_is_public ON creative_works(is_public);
CREATE INDEX IF NOT EXISTS idx_creative_works_is_featured ON creative_works(is_featured);
CREATE INDEX IF NOT EXISTS idx_creative_works_created_at ON creative_works(created_at);

CREATE INDEX IF NOT EXISTS idx_creative_work_stats_work_id ON creative_work_stats(work_id);
CREATE INDEX IF NOT EXISTS idx_creative_work_stats_user_id ON creative_work_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_creative_work_stats_action_type ON creative_work_stats(action_type);

CREATE INDEX IF NOT EXISTS idx_creative_categories_name ON creative_categories(name);

-- 自动更新 updated_at 字段的函数
CREATE OR REPLACE FUNCTION update_creative_works_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为creative_works表添加触发器
CREATE TRIGGER IF NOT EXISTS update_creative_works_updated_at 
    BEFORE UPDATE ON creative_works 
    FOR EACH ROW EXECUTE FUNCTION update_creative_works_updated_at();

-- 自动更新浏览数统计的函数
CREATE OR REPLACE FUNCTION increment_work_views()
RETURNS TRIGGER AS $$
BEGIN
    -- 当有新查看记录时，更新作品浏览数
    IF NEW.action_type = 'view' THEN
        UPDATE creative_works 
        SET views_count = views_count + 1
        WHERE id = NEW.work_id;
    END IF;
    
    -- 当有点赞记录时，更新作品点赞数
    IF NEW.action_type = 'like' THEN
        -- 检查是否已存在该用户的点赞记录（防止重复点赞）
        IF NOT EXISTS (
            SELECT 1 FROM creative_work_stats 
            WHERE work_id = NEW.work_id 
            AND user_id = NEW.user_id 
            AND action_type = 'like'
            AND id != NEW.id
        ) THEN
            UPDATE creative_works 
            SET likes_count = likes_count + 1
            WHERE id = NEW.work_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为creative_work_stats表添加触发器
CREATE TRIGGER IF NOT EXISTS trigger_increment_work_views
    AFTER INSERT ON creative_work_stats
    FOR EACH ROW EXECUTE FUNCTION increment_work_views();

-- 视图：公开创作作品信息
CREATE OR REPLACE VIEW public_creative_works AS
SELECT 
    cw.id,
    cw.title,
    cw.description,
    cw.content_type,
    cw.content_data,
    cw.media_url,
    cw.thumbnail_url,
    cw.tags,
    cw.duration,
    cw.file_size,
    cw.views_count,
    cw.likes_count,
    cw.created_at,
    cw.updated_at,
    u.username as creator_username,
    u.email as creator_email,
    cc.name_cn as category_name,
    cc.icon as category_icon,
    cc.color as category_color
FROM creative_works cw
LEFT JOIN users u ON cw.creator_id = u.id
LEFT JOIN creative_categories cc ON cw.content_type = cc.name
WHERE cw.is_public = true
ORDER BY cw.created_at DESC;

COMMIT;

-- 输出完成信息
SELECT '创作天地数据库表创建完成！' AS message;