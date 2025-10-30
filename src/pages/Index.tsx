import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { api } from '@/lib/api';
import AddMealDialog from '@/components/AddMealDialog';
import AddWorkoutDialog from '@/components/AddWorkoutDialog';
import AddPostDialog from '@/components/AddPostDialog';
import UpdateGoalsDialog from '@/components/UpdateGoalsDialog';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [dashboard, setDashboard] = useState<any>(null);
  const [weightData, setWeightData] = useState<any[]>([]);
  const [meals, setMeals] = useState<any[]>([]);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [exercises, setExercises] = useState<any[]>([]);

  const loadDashboard = async () => {
    try {
      const data = await api.getDashboard();
      setDashboard(data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  };

  const loadWeightHistory = async () => {
    try {
      const data = await api.getWeightHistory();
      setWeightData(data.slice(0, 5).reverse().map((item: any) => ({
        date: new Date(item.logged_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }),
        weight: parseFloat(item.weight)
      })));
    } catch (error) {
      console.error('Error loading weight:', error);
    }
  };

  const loadMeals = async () => {
    try {
      const data = await api.getMeals();
      setMeals(data);
    } catch (error) {
      console.error('Error loading meals:', error);
    }
  };

  const loadWorkouts = async () => {
    try {
      const data = await api.getWorkouts(7);
      setWorkouts(data);
    } catch (error) {
      console.error('Error loading workouts:', error);
    }
  };

  const loadPosts = async () => {
    try {
      const data = await api.getPosts();
      setPosts(data);
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  };

  const loadChallenges = async () => {
    try {
      const data = await api.getChallenges();
      setChallenges(data);
    } catch (error) {
      console.error('Error loading challenges:', error);
    }
  };

  const loadRecipes = async () => {
    try {
      const data = await api.getRecipes();
      setRecipes(data);
    } catch (error) {
      console.error('Error loading recipes:', error);
    }
  };

  const loadExercises = async () => {
    try {
      const data = await api.getExercises();
      setExercises(data);
    } catch (error) {
      console.error('Error loading exercises:', error);
    }
  };

  useEffect(() => {
    loadDashboard();
    loadWeightHistory();
    loadMeals();
    loadWorkouts();
    loadPosts();
    loadChallenges();
    loadRecipes();
    loadExercises();
  }, []);

  const handleLike = async (postId: number) => {
    try {
      await api.likePost(postId);
      loadPosts();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const macrosData = meals.reduce((acc, meal) => {
    acc.protein += parseFloat(meal.protein || 0);
    acc.fats += parseFloat(meal.fats || 0);
    acc.carbs += parseFloat(meal.carbs || 0);
    return acc;
  }, { protein: 0, fats: 0, carbs: 0 });

  const macrosChartData = [
    { name: 'Белки', value: Math.round(macrosData.protein), color: '#0EA5E9' },
    { name: 'Жиры', value: Math.round(macrosData.fats), color: '#8B5CF6' },
    { name: 'Углеводы', value: Math.round(macrosData.carbs), color: '#F97316' }
  ];

  const getMealTypeIcon = (type: string) => {
    switch(type) {
      case 'breakfast': return 'Sunrise';
      case 'lunch': return 'Sun';
      case 'dinner': return 'Moon';
      case 'snack': return 'Cookie';
      default: return 'Utensils';
    }
  };

  const getMealTypeName = (type: string) => {
    switch(type) {
      case 'breakfast': return 'Завтрак';
      case 'lunch': return 'Обед';
      case 'dinner': return 'Ужин';
      case 'snack': return 'Перекус';
      default: return type;
    }
  };

  const workoutChartData = (() => {
    const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    const today = new Date();
    const result = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayWorkouts = workouts.filter(w => w.workout_date === dateStr);
      const totalMinutes = dayWorkouts.reduce((sum, w) => sum + parseInt(w.duration_minutes || 0), 0);
      
      result.push({
        name: days[(date.getDay() + 6) % 7],
        duration: totalMinutes
      });
    }
    
    return result;
  })();

  if (!dashboard) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <header className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                FitLife AI
              </h1>
              <p className="text-muted-foreground mt-1">Твой путь к здоровой жизни</p>
            </div>
            <Avatar className="h-14 w-14 border-2 border-primary">
              <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                {dashboard.user.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {activeTab === 'home' && (
          <div className="space-y-6 animate-enter">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Icon name="Weight" size={18} className="text-primary" />
                    Текущий вес
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">{dashboard.user.current_weight} кг</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Цель: {dashboard.user.target_weight} кг
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Icon name="Flame" size={18} className="text-orange-500" />
                    Калории
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {dashboard.calories_consumed}
                    <span className="text-lg text-muted-foreground">/{dashboard.user.daily_calorie_target}</span>
                  </div>
                  <Progress 
                    value={(dashboard.calories_consumed / dashboard.user.daily_calorie_target) * 100} 
                    className="mt-2" 
                  />
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Icon name="Activity" size={18} className="text-secondary" />
                    Активность
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-secondary">
                    {dashboard.steps}
                    <span className="text-lg text-muted-foreground">/{dashboard.user.daily_steps_target}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{dashboard.workout_minutes} мин тренировки</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20 animate-scale-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Sparkles" size={20} className="text-primary" />
                  💡 Совет от ИИ-тренера
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground mb-4">
                  {dashboard.calories_consumed < dashboard.user.daily_calorie_target * 0.85
                    ? `Вы на ${Math.round((1 - dashboard.calories_consumed / dashboard.user.daily_calorie_target) * 100)}% ниже целевого калоража. Добавьте полезный перекус с белком!`
                    : dashboard.calories_consumed > dashboard.user.daily_calorie_target * 1.1
                    ? 'Вы превысили дневную норму калорий. Завтра постарайтесь контролировать порции.'
                    : 'Отличная работа! Вы в пределах своей дневной нормы калорий.'}
                </p>
                {recipes.length > 0 && (
                  <div className="flex items-center justify-between bg-white/60 rounded-lg p-3 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                      <Icon name="ChefHat" size={18} className="text-secondary" />
                      <span className="font-medium">Рекомендуем: {recipes[0]?.name}</span>
                    </div>
                    <Button size="sm" variant="outline">Посмотреть</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {weightData.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Динамика веса</CardTitle>
                    <CardDescription>За последний месяц</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={weightData}>
                        <defs>
                          <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                        <YAxis stroke="#9ca3af" fontSize={12} domain={['dataMin - 1', 'dataMax + 1']} />
                        <Tooltip />
                        <Area type="monotone" dataKey="weight" stroke="#0EA5E9" strokeWidth={2} fill="url(#weightGradient)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Активность за неделю</CardTitle>
                    <CardDescription>Минуты тренировок</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={workoutChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                        <YAxis stroke="#9ca3af" fontSize={12} />
                        <Tooltip />
                        <Bar dataKey="duration" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="flex gap-3 flex-wrap">
              <div className="flex-1 min-w-[150px]">
                <AddMealDialog onMealAdded={() => { loadMeals(); loadDashboard(); }} />
              </div>
              <div className="flex-1 min-w-[150px]">
                <AddWorkoutDialog onWorkoutAdded={() => { loadWorkouts(); loadDashboard(); }} />
              </div>
            </div>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="home" className="flex flex-col gap-1 py-3">
              <Icon name="Home" size={20} />
              <span className="text-xs">Главная</span>
            </TabsTrigger>
            <TabsTrigger value="nutrition" className="flex flex-col gap-1 py-3">
              <Icon name="Apple" size={20} />
              <span className="text-xs">Питание</span>
            </TabsTrigger>
            <TabsTrigger value="workout" className="flex flex-col gap-1 py-3">
              <Icon name="Dumbbell" size={20} />
              <span className="text-xs">Тренировки</span>
            </TabsTrigger>
            <TabsTrigger value="social" className="flex flex-col gap-1 py-3">
              <Icon name="Users" size={20} />
              <span className="text-xs">Соцсеть</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex flex-col gap-1 py-3">
              <Icon name="Settings" size={20} />
              <span className="text-xs">Настройки</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="nutrition" className="animate-enter space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>КБЖУ на сегодня</CardTitle>
                <CardDescription>Баланс макронутриентов</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex justify-center">
                    {macrosChartData.some(m => m.value > 0) ? (
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={macrosChartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {macrosChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                        Нет данных
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    {macrosChartData.map((macro) => (
                      <div key={macro.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: macro.color }} />
                          <span className="font-medium">{macro.name}</span>
                        </div>
                        <span className="text-lg font-bold">{macro.value}г</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Приёмы пищи</CardTitle>
                    <CardDescription>Сегодня</CardDescription>
                  </div>
                  <AddMealDialog onMealAdded={() => { loadMeals(); loadDashboard(); }} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {meals.length > 0 ? (
                  meals.map((meal) => (
                    <div key={meal.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Icon name={getMealTypeIcon(meal.meal_type)} size={20} className="text-primary" />
                        <div>
                          <p className="font-medium">{getMealTypeName(meal.meal_type)}</p>
                          <p className="text-sm text-muted-foreground">{meal.name}</p>
                        </div>
                      </div>
                      <Badge variant="secondary">{meal.calories} ккал</Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Приёмы пищи не добавлены</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {recipes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="BookOpen" size={20} />
                    Рекомендованные рецепты
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recipes.slice(0, 4).map((recipe) => (
                    <div key={recipe.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                      <h4 className="font-semibold mb-2">🥗 {recipe.name}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{recipe.description}</p>
                      <Badge>{recipe.calories} ккал</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="workout" className="animate-enter space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Активность за неделю</CardTitle>
                <CardDescription>Минуты тренировок</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={workoutChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="duration" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Тренировки</CardTitle>
                    <CardDescription>За последнюю неделю</CardDescription>
                  </div>
                  <AddWorkoutDialog onWorkoutAdded={() => { loadWorkouts(); loadDashboard(); }} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {workouts.length > 0 ? (
                  workouts.map((workout) => (
                    <div key={workout.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Icon name="Dumbbell" size={20} className="text-primary" />
                        <div>
                          <p className="font-medium">{workout.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(workout.workout_date).toLocaleDateString('ru-RU')}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">{workout.duration_minutes} мин</Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Тренировки не добавлены</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {exercises.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="TrendingUp" size={20} />
                    Личные рекорды
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {exercises.map((exercise, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{exercise.exercise_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(exercise.logged_at).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-primary">{exercise.weight_kg} кг</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="social" className="animate-enter space-y-6">
            {challenges.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Flame" size={20} className="text-orange-500" />
                    Активные челленджи
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {challenges.map((challenge) => (
                    <div key={challenge.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">{challenge.name}</h4>
                        <Badge variant="secondary">{challenge.participants || 0} участников</Badge>
                      </div>
                      <Progress value={((challenge.current_progress || 0) / challenge.target_value) * 100} className="mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {Math.round(((challenge.current_progress || 0) / challenge.target_value) * 100)}% выполнено
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Лента сообщества</CardTitle>
                  <AddPostDialog onPostAdded={loadPosts} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <div key={post.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3 mb-3">
                        <Avatar>
                          <AvatarFallback className="bg-secondary text-secondary-foreground">
                            {post.user_name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold">{post.user_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(post.created_at).toLocaleString('ru-RU')}
                            </p>
                          </div>
                          <p className="text-sm mt-2">{post.content}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 pt-3 border-t">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="gap-2"
                          onClick={() => handleLike(post.id)}
                        >
                          <Icon name="Heart" size={16} />
                          {post.likes_count}
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Icon name="MessageCircle" size={16} />
                          Комментировать
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Icon name="Share2" size={16} />
                          Поделиться
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Постов пока нет</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="animate-enter space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Профиль</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {dashboard.user.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{dashboard.user.name}</h3>
                    <p className="text-sm text-muted-foreground">{dashboard.user.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Цели и параметры</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Целевой вес</label>
                    <p className="text-2xl font-bold text-primary">{dashboard.user.target_weight} кг</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Дневная норма калорий</label>
                    <p className="text-2xl font-bold text-primary">{dashboard.user.daily_calorie_target} ккал</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Цель по шагам</label>
                    <p className="text-2xl font-bold text-primary">{dashboard.user.daily_steps_target.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Вода в день</label>
                    <p className="text-2xl font-bold text-primary">{dashboard.user.daily_water_target} стаканов</p>
                  </div>
                </div>
                <UpdateGoalsDialog 
                  currentGoals={dashboard.user} 
                  onGoalsUpdated={loadDashboard}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Интеграции</CardTitle>
                <CardDescription>Подключите внешние сервисы для автоматического отслеживания</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon name="Watch" size={20} className="text-primary" />
                    <div>
                      <p className="font-medium">Apple Health</p>
                      <p className="text-sm text-muted-foreground">Не подключено</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Подключить</Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon name="Activity" size={20} className="text-green-600" />
                    <div>
                      <p className="font-medium">Google Fit</p>
                      <p className="text-sm text-muted-foreground">Не подключено</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Подключить</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Crown" size={20} className="text-yellow-500" />
                  FitLife PRO
                </CardTitle>
                <CardDescription>Разблокируйте все возможности</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center gap-2">
                    <Icon name="Check" size={16} className="text-green-600" />
                    <span className="text-sm">Безлимитные ИИ-рекомендации</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="Check" size={16} className="text-green-600" />
                    <span className="text-sm">Персональные планы питания</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="Check" size={16} className="text-green-600" />
                    <span className="text-sm">Расширенная аналитика</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="Check" size={16} className="text-green-600" />
                    <span className="text-sm">Без рекламы</span>
                  </li>
                </ul>
                <Button className="w-full" size="lg">
                  Оформить PRO — 499₽/мес
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
