'''
Business: API для фитнес-приложения - управление питанием, тренировками, соцсетью
Args: event с httpMethod, body, queryStringParameters
Returns: HTTP response с данными из БД
'''

import json
import os
from datetime import date, datetime, timedelta
from typing import Dict, Any, Optional
from decimal import Decimal
import psycopg2
from psycopg2.extras import RealDictCursor

def decimal_default(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn, cursor_factory=RealDictCursor)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    path: str = event.get('queryStringParameters', {}).get('action', '')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        user_id = 1
        
        if method == 'GET':
            if path == 'dashboard':
                today = date.today()
                
                cursor.execute('''
                    SELECT current_weight, target_weight, daily_calorie_target, 
                           daily_steps_target, daily_water_target, name, email
                    FROM users WHERE id = %s
                ''', (user_id,))
                user = cursor.fetchone()
                
                cursor.execute('''
                    SELECT COALESCE(SUM(calories), 0) as total_calories
                    FROM meals WHERE user_id = %s AND meal_date = %s
                ''', (user_id, today))
                calories = cursor.fetchone()
                
                cursor.execute('''
                    SELECT steps, water_glasses
                    FROM activity_logs WHERE user_id = %s AND logged_date = %s
                ''', (user_id, today))
                activity = cursor.fetchone() or {'steps': 0, 'water_glasses': 0}
                
                cursor.execute('''
                    SELECT COALESCE(SUM(duration_minutes), 0) as total_minutes
                    FROM workouts WHERE user_id = %s AND workout_date = %s
                ''', (user_id, today))
                workout = cursor.fetchone()
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({
                        'user': dict(user) if user else {},
                        'calories_consumed': int(calories['total_calories']),
                        'steps': activity['steps'],
                        'water_glasses': activity['water_glasses'],
                        'workout_minutes': int(workout['total_minutes'])
                    }, default=decimal_default),
                    'isBase64Encoded': False
                }
            
            elif path == 'weight_history':
                cursor.execute('''
                    SELECT weight, logged_at
                    FROM weight_logs
                    WHERE user_id = %s
                    ORDER BY logged_at DESC
                    LIMIT 30
                ''', (user_id,))
                weights = cursor.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps([dict(w) for w in weights], default=str),
                    'isBase64Encoded': False
                }
            
            elif path == 'meals':
                meal_date = event.get('queryStringParameters', {}).get('date', str(date.today()))
                
                cursor.execute('''
                    SELECT id, meal_type, name, calories, protein, fats, carbs, meal_date
                    FROM meals
                    WHERE user_id = %s AND meal_date = %s
                    ORDER BY created_at
                ''', (user_id, meal_date))
                meals = cursor.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps([dict(m) for m in meals], default=str),
                    'isBase64Encoded': False
                }
            
            elif path == 'workouts':
                days = int(event.get('queryStringParameters', {}).get('days', 7))
                start_date = date.today() - timedelta(days=days)
                
                cursor.execute('''
                    SELECT id, name, duration_minutes, workout_date, workout_type
                    FROM workouts
                    WHERE user_id = %s AND workout_date >= %s
                    ORDER BY workout_date DESC
                ''', (user_id, start_date))
                workouts = cursor.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps([dict(w) for w in workouts], default=str),
                    'isBase64Encoded': False
                }
            
            elif path == 'posts':
                cursor.execute('''
                    SELECT p.id, p.content, p.likes_count, p.created_at,
                           u.name as user_name, u.email
                    FROM social_posts p
                    JOIN users u ON p.user_id = u.id
                    ORDER BY p.created_at DESC
                    LIMIT 20
                ''')
                posts = cursor.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps([dict(p) for p in posts], default=str),
                    'isBase64Encoded': False
                }
            
            elif path == 'challenges':
                cursor.execute('''
                    SELECT c.id, c.name, c.description, c.target_value,
                           cp.current_progress,
                           (SELECT COUNT(*) FROM challenge_participants WHERE challenge_id = c.id) as participants
                    FROM challenges c
                    LEFT JOIN challenge_participants cp ON c.id = cp.challenge_id AND cp.user_id = %s
                    WHERE c.end_date >= CURRENT_DATE
                    ORDER BY c.start_date DESC
                ''', (user_id,))
                challenges = cursor.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps([dict(ch) for ch in challenges], default=str),
                    'isBase64Encoded': False
                }
            
            elif path == 'recipes':
                cursor.execute('''
                    SELECT id, name, description, calories, protein, fats, carbs
                    FROM recipes
                    LIMIT 20
                ''')
                recipes = cursor.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps([dict(r) for r in recipes], default=str),
                    'isBase64Encoded': False
                }
            
            elif path == 'exercises':
                cursor.execute('''
                    SELECT exercise_name, weight_kg, logged_at
                    FROM exercises
                    WHERE user_id = %s AND is_personal_record = TRUE
                    ORDER BY logged_at DESC
                    LIMIT 10
                ''', (user_id,))
                exercises = cursor.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps([dict(e) for e in exercises], default=str),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            if path == 'meal':
                cursor.execute('''
                    INSERT INTO meals (user_id, meal_type, name, calories, protein, fats, carbs, meal_date)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING id
                ''', (
                    user_id,
                    body_data['meal_type'],
                    body_data['name'],
                    body_data['calories'],
                    body_data.get('protein', 0),
                    body_data.get('fats', 0),
                    body_data.get('carbs', 0),
                    body_data.get('meal_date', date.today())
                ))
                new_id = cursor.fetchone()['id']
                conn.commit()
                
                return {
                    'statusCode': 201,
                    'headers': headers,
                    'body': json.dumps({'id': new_id, 'message': 'Meal added'}),
                    'isBase64Encoded': False
                }
            
            elif path == 'workout':
                cursor.execute('''
                    INSERT INTO workouts (user_id, name, duration_minutes, workout_type, workout_date)
                    VALUES (%s, %s, %s, %s, %s)
                    RETURNING id
                ''', (
                    user_id,
                    body_data['name'],
                    body_data['duration_minutes'],
                    body_data.get('workout_type', ''),
                    body_data.get('workout_date', date.today())
                ))
                new_id = cursor.fetchone()['id']
                conn.commit()
                
                return {
                    'statusCode': 201,
                    'headers': headers,
                    'body': json.dumps({'id': new_id, 'message': 'Workout added'}),
                    'isBase64Encoded': False
                }
            
            elif path == 'weight':
                cursor.execute('''
                    INSERT INTO weight_logs (user_id, weight, logged_at)
                    VALUES (%s, %s, %s)
                    RETURNING id
                ''', (user_id, body_data['weight'], body_data.get('date', date.today())))
                new_id = cursor.fetchone()['id']
                
                cursor.execute('''
                    UPDATE users SET current_weight = %s WHERE id = %s
                ''', (body_data['weight'], user_id))
                conn.commit()
                
                return {
                    'statusCode': 201,
                    'headers': headers,
                    'body': json.dumps({'id': new_id, 'message': 'Weight logged'}),
                    'isBase64Encoded': False
                }
            
            elif path == 'post':
                cursor.execute('''
                    INSERT INTO social_posts (user_id, content)
                    VALUES (%s, %s)
                    RETURNING id
                ''', (user_id, body_data['content']))
                new_id = cursor.fetchone()['id']
                conn.commit()
                
                return {
                    'statusCode': 201,
                    'headers': headers,
                    'body': json.dumps({'id': new_id, 'message': 'Post created'}),
                    'isBase64Encoded': False
                }
            
            elif path == 'like':
                post_id = body_data['post_id']
                
                cursor.execute('''
                    INSERT INTO post_likes (post_id, user_id)
                    VALUES (%s, %s)
                    ON CONFLICT (post_id, user_id) DO NOTHING
                ''', (post_id, user_id))
                
                cursor.execute('''
                    UPDATE social_posts 
                    SET likes_count = (SELECT COUNT(*) FROM post_likes WHERE post_id = %s)
                    WHERE id = %s
                ''', (post_id, post_id))
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({'message': 'Post liked'}),
                    'isBase64Encoded': False
                }
            
            elif path == 'activity':
                cursor.execute('''
                    INSERT INTO activity_logs (user_id, steps, water_glasses, logged_date)
                    VALUES (%s, %s, %s, %s)
                    ON CONFLICT (user_id, logged_date) 
                    DO UPDATE SET steps = EXCLUDED.steps, water_glasses = EXCLUDED.water_glasses
                ''', (
                    user_id,
                    body_data.get('steps', 0),
                    body_data.get('water_glasses', 0),
                    body_data.get('date', date.today())
                ))
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({'message': 'Activity logged'}),
                    'isBase64Encoded': False
                }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            
            if path == 'goals':
                cursor.execute('''
                    UPDATE users 
                    SET target_weight = %s, daily_calorie_target = %s, 
                        daily_steps_target = %s, daily_water_target = %s
                    WHERE id = %s
                ''', (
                    body_data.get('target_weight'),
                    body_data.get('daily_calorie_target'),
                    body_data.get('daily_steps_target'),
                    body_data.get('daily_water_target'),
                    user_id
                ))
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({'message': 'Goals updated'}),
                    'isBase64Encoded': False
                }
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 404,
            'headers': headers,
            'body': json.dumps({'error': 'Not found'}),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }