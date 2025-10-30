-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    avatar VARCHAR(500),
    current_weight DECIMAL(5,2),
    target_weight DECIMAL(5,2),
    height INTEGER,
    daily_calorie_target INTEGER DEFAULT 2000,
    daily_steps_target INTEGER DEFAULT 10000,
    daily_water_target INTEGER DEFAULT 8,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create weight_logs table
CREATE TABLE IF NOT EXISTS weight_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    weight DECIMAL(5,2) NOT NULL,
    logged_at DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create meals table
CREATE TABLE IF NOT EXISTS meals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    meal_type VARCHAR(50) NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    name VARCHAR(255) NOT NULL,
    calories INTEGER NOT NULL,
    protein DECIMAL(5,2) DEFAULT 0,
    fats DECIMAL(5,2) DEFAULT 0,
    carbs DECIMAL(5,2) DEFAULT 0,
    meal_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create workouts table
CREATE TABLE IF NOT EXISTS workouts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    duration_minutes INTEGER NOT NULL,
    calories_burned INTEGER,
    workout_type VARCHAR(100),
    workout_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create exercises table
CREATE TABLE IF NOT EXISTS exercises (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    exercise_name VARCHAR(255) NOT NULL,
    weight_kg DECIMAL(6,2),
    reps INTEGER,
    sets INTEGER,
    is_personal_record BOOLEAN DEFAULT FALSE,
    logged_at DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create activity_logs table (steps, water, etc.)
CREATE TABLE IF NOT EXISTS activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    steps INTEGER DEFAULT 0,
    water_glasses INTEGER DEFAULT 0,
    logged_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, logged_date)
);

-- Create social_posts table
CREATE TABLE IF NOT EXISTS social_posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    content TEXT NOT NULL,
    image_url VARCHAR(500),
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create post_likes table
CREATE TABLE IF NOT EXISTS post_likes (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES social_posts(id),
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, user_id)
);

-- Create post_comments table
CREATE TABLE IF NOT EXISTS post_comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES social_posts(id),
    user_id INTEGER REFERENCES users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create challenges table
CREATE TABLE IF NOT EXISTS challenges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    target_value INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create challenge_participants table
CREATE TABLE IF NOT EXISTS challenge_participants (
    id SERIAL PRIMARY KEY,
    challenge_id INTEGER REFERENCES challenges(id),
    user_id INTEGER REFERENCES users(id),
    current_progress INTEGER DEFAULT 0,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(challenge_id, user_id)
);

-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    calories INTEGER NOT NULL,
    protein DECIMAL(5,2) DEFAULT 0,
    fats DECIMAL(5,2) DEFAULT 0,
    carbs DECIMAL(5,2) DEFAULT 0,
    prep_time_minutes INTEGER,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert demo user
INSERT INTO users (name, email, current_weight, target_weight, height, daily_calorie_target, daily_steps_target)
VALUES ('Иван Васильев', 'ivan@example.com', 79.5, 75.0, 180, 2000, 10000)
ON CONFLICT (email) DO NOTHING;

-- Insert demo weight logs
INSERT INTO weight_logs (user_id, weight, logged_at)
SELECT 1, weight, logged_at FROM (VALUES
    (82.0, CURRENT_DATE - INTERVAL '30 days'),
    (81.5, CURRENT_DATE - INTERVAL '23 days'),
    (80.8, CURRENT_DATE - INTERVAL '16 days'),
    (80.2, CURRENT_DATE - INTERVAL '9 days'),
    (79.5, CURRENT_DATE)
) AS t(weight, logged_at)
ON CONFLICT DO NOTHING;

-- Insert demo meals for today
INSERT INTO meals (user_id, meal_type, name, calories, protein, fats, carbs, meal_date)
VALUES 
    (1, 'breakfast', 'Овсянка, банан, орехи', 420, 15, 12, 60, CURRENT_DATE),
    (1, 'lunch', 'Куриная грудка, рис, овощи', 650, 45, 10, 70, CURRENT_DATE),
    (1, 'snack', 'Греческий йогурт', 150, 15, 5, 10, CURRENT_DATE)
ON CONFLICT DO NOTHING;

-- Insert demo workouts
INSERT INTO workouts (user_id, name, duration_minutes, workout_date)
SELECT 1, name, duration, workout_date FROM (VALUES
    ('Силовая тренировка', 45, CURRENT_DATE - INTERVAL '6 days'),
    ('Кардио', 60, CURRENT_DATE - INTERVAL '4 days'),
    ('HIIT', 30, CURRENT_DATE - INTERVAL '3 days'),
    ('Йога', 55, CURRENT_DATE - INTERVAL '2 days'),
    ('Силовая тренировка', 40, CURRENT_DATE)
) AS t(name, duration, workout_date)
ON CONFLICT DO NOTHING;

-- Insert activity logs
INSERT INTO activity_logs (user_id, steps, water_glasses, logged_date)
VALUES (1, 8234, 6, CURRENT_DATE)
ON CONFLICT (user_id, logged_date) DO UPDATE SET steps = 8234, water_glasses = 6;

-- Insert demo social posts
INSERT INTO social_posts (user_id, content, likes_count, created_at)
VALUES 
    (1, 'Сегодня пробежала 5км! Новый личный рекорд 🏃‍♀️', 24, CURRENT_TIMESTAMP - INTERVAL '2 hours'),
    (1, 'Делюсь рецептом протеинового смузи — бомба!', 18, CURRENT_TIMESTAMP - INTERVAL '5 hours'),
    (1, 'Неделя 3/12 челленджа "Здоровое тело". Минус 2кг!', 42, CURRENT_TIMESTAMP - INTERVAL '8 hours')
ON CONFLICT DO NOTHING;

-- Insert demo challenges
INSERT INTO challenges (name, description, start_date, end_date, target_value)
VALUES 
    ('30 дней планки', 'Выполняйте планку каждый день', CURRENT_DATE - INTERVAL '20 days', CURRENT_DATE + INTERVAL '10 days', 30),
    ('Здоровое питание', 'Следите за калориями 30 дней', CURRENT_DATE - INTERVAL '14 days', CURRENT_DATE + INTERVAL '16 days', 30),
    ('10K шагов каждый день', 'Проходите 10000 шагов ежедневно', CURRENT_DATE - INTERVAL '27 days', CURRENT_DATE + INTERVAL '3 days', 30)
ON CONFLICT DO NOTHING;

-- Insert challenge participants
INSERT INTO challenge_participants (challenge_id, user_id, current_progress)
VALUES (1, 1, 20), (2, 1, 14), (3, 1, 27)
ON CONFLICT DO NOTHING;

-- Insert demo recipes
INSERT INTO recipes (name, description, calories, protein, fats, carbs, prep_time_minutes)
VALUES 
    ('Салат с киноа и авокадо', 'Белки: 15г | Жиры: 12г | Углеводы: 30г', 350, 15, 12, 30, 15),
    ('Куриное филе с овощами', 'Белки: 35г | Жиры: 8г | Углеводы: 20г', 320, 35, 8, 20, 25)
ON CONFLICT DO NOTHING;

-- Insert exercise records
INSERT INTO exercises (user_id, exercise_name, weight_kg, reps, sets, is_personal_record, logged_at)
VALUES 
    (1, 'Жим лёжа', 75, 8, 3, TRUE, CURRENT_DATE - INTERVAL '1 day'),
    (1, 'Приседания', 100, 10, 4, TRUE, CURRENT_DATE - INTERVAL '2 days')
ON CONFLICT DO NOTHING;