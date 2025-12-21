-- 添加头像数据字段到用户资料表
-- 用于存储Base64编码的100x100头像图片

BEGIN;

-- 添加 avatar_data 字段到 user_profiles 表
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS avatar_data TEXT;

-- 添加注释说明字段用途
COMMENT ON COLUMN user_profiles.avatar_data IS 'Base64编码的头像数据，100x100px，用于移动端显示';

COMMIT;

-- 验证字段是否添加成功
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND column_name = 'avatar_data';
