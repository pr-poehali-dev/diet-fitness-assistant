import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');

  const weightData = [
    { date: '1 окт', weight: 82 },
    { date: '8 окт', weight: 81.5 },
    { date: '15 окт', weight: 80.8 },
    { date: '22 окт', weight: 80.2 },
    { date: '29 окт', weight: 79.5 }
  ];

  const caloriesData = [
    { day: 'Пн', calories: 1850, target: 2000 },
    { day: 'Вт', calories: 2100, target: 2000 },
    { day: 'Ср', calories: 1920, target: 2000 },
    { day: 'Чт', calories: 2050, target: 2000 },
    { day: 'Пт', calories: 1880, target: 2000 },
    { day: 'Сб', calories: 2200, target: 2000 },
    { day: 'Вс', calories: 1950, target: 2000 }
  ];

  const macrosData = [
    { name: 'Белки', value: 120, color: '#0EA5E9' },
    { name: 'Жиры', value: 60, color: '#8B5CF6' },
    { name: 'Углеводы', value: 200, color: '#F97316' }
  ];

  const workoutData = [
    { name: 'Пн', duration: 45 },
    { name: 'Вт', duration: 0 },
    { name: 'Ср', duration: 60 },
    { name: 'Чт', duration: 30 },
    { name: 'Пт', duration: 55 },
    { name: 'Сб', duration: 0 },
    { name: 'Вс', duration: 40 }
  ];

  const todayStats = {
    weight: 79.5,
    caloriesConsumed: 1420,
    caloriesTarget: 2000,
    steps: 8234,
    stepsTarget: 10000,
    workoutMinutes: 45,
    water: 6,
    waterTarget: 8
  };

  const aiCoachTip = {
    title: '💡 Совет от ИИ-тренера',
    message: 'Отличная работа! Вы на 15% ниже целевого калоража. Добавьте полезный перекус с белком — например, греческий йогурт с орехами.',
    recipe: 'Овсянка с бананом и арахисовой пастой'
  };

  const socialPosts = [
    { id: 1, user: 'Мария К.', avatar: 'MK', text: 'Сегодня пробежала 5км! Новый личный рекорд 🏃‍♀️', likes: 24, time: '2ч назад' },
    { id: 2, user: 'Алексей П.', avatar: 'АП', text: 'Делюсь рецептом протеинового смузи — бомба!', likes: 18, time: '5ч назад' },
    { id: 3, user: 'Елена В.', avatar: 'ЕВ', text: 'Неделя 3/12 челленджа "Здоровое тело". Минус 2кг!', likes: 42, time: '8ч назад' }
  ];

  const challenges = [
    { name: '30 дней планки', progress: 67, participants: 234 },
    { name: 'Здоровое питание', progress: 45, participants: 512 },
    { name: '10K шагов каждый день', progress: 89, participants: 1203 }
  ];

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
                ИВ
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
                  <div className="text-3xl font-bold text-primary">{todayStats.weight} кг</div>
                  <p className="text-xs text-muted-foreground mt-1">-2.5 кг за месяц</p>
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
                    {todayStats.caloriesConsumed}
                    <span className="text-lg text-muted-foreground">/{todayStats.caloriesTarget}</span>
                  </div>
                  <Progress value={(todayStats.caloriesConsumed / todayStats.caloriesTarget) * 100} className="mt-2" />
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
                    {todayStats.steps}
                    <span className="text-lg text-muted-foreground">/{todayStats.stepsTarget}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{todayStats.workoutMinutes} мин тренировки</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20 animate-scale-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Sparkles" size={20} className="text-primary" />
                  {aiCoachTip.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground mb-4">{aiCoachTip.message}</p>
                <div className="flex items-center justify-between bg-white/60 rounded-lg p-3 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <Icon name="ChefHat" size={18} className="text-secondary" />
                    <span className="font-medium">Рекомендуем: {aiCoachTip.recipe}</span>
                  </div>
                  <Button size="sm" variant="outline">Посмотреть</Button>
                </div>
              </CardContent>
            </Card>

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
                  <CardTitle>Калории за неделю</CardTitle>
                  <CardDescription>План vs факт</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={caloriesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
                      <YAxis stroke="#9ca3af" fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="target" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="calories" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-3 flex-wrap">
              <Button className="flex-1 min-w-[150px]" size="lg">
                <Icon name="Plus" size={18} className="mr-2" />
                Добавить еду
              </Button>
              <Button className="flex-1 min-w-[150px]" size="lg" variant="secondary">
                <Icon name="Dumbbell" size={18} className="mr-2" />
                Добавить тренировку
              </Button>
              <Button className="flex-1 min-w-[150px]" size="lg" variant="outline">
                <Icon name="Target" size={18} className="mr-2" />
                Новая цель
              </Button>
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
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={macrosData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {macrosData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-4">
                    {macrosData.map((macro) => (
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
                    <CardDescription>Сегодня, 30 октября</CardDescription>
                  </div>
                  <Button>
                    <Icon name="Plus" size={18} className="mr-2" />
                    Добавить
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon name="Sunrise" size={20} className="text-orange-500" />
                    <div>
                      <p className="font-medium">Завтрак</p>
                      <p className="text-sm text-muted-foreground">Овсянка, банан, орехи</p>
                    </div>
                  </div>
                  <Badge variant="secondary">420 ккал</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon name="Sun" size={20} className="text-yellow-500" />
                    <div>
                      <p className="font-medium">Обед</p>
                      <p className="text-sm text-muted-foreground">Куриная грудка, рис, овощи</p>
                    </div>
                  </div>
                  <Badge variant="secondary">650 ккал</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon name="Cookie" size={20} className="text-primary" />
                    <div>
                      <p className="font-medium">Перекус</p>
                      <p className="text-sm text-muted-foreground">Греческий йогурт</p>
                    </div>
                  </div>
                  <Badge variant="secondary">150 ккал</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border-2 border-dashed border-muted rounded-lg opacity-50">
                  <div className="flex items-center gap-3">
                    <Icon name="Moon" size={20} className="text-purple-500" />
                    <div>
                      <p className="font-medium">Ужин</p>
                      <p className="text-sm text-muted-foreground">Не добавлено</p>
                    </div>
                  </div>
                  <Badge variant="outline">0 ккал</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="BookOpen" size={20} />
                  Рекомендованные рецепты
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                  <h4 className="font-semibold mb-2">🥗 Салат с киноа и авокадо</h4>
                  <p className="text-sm text-muted-foreground mb-3">Белки: 15г | Жиры: 12г | Углеводы: 30г</p>
                  <Badge>350 ккал</Badge>
                </div>
                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                  <h4 className="font-semibold mb-2">🍲 Куриное филе с овощами</h4>
                  <p className="text-sm text-muted-foreground mb-3">Белки: 35г | Жиры: 8г | Углеводы: 20г</p>
                  <Badge>320 ккал</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workout" className="animate-enter space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Активность за неделю</CardTitle>
                <CardDescription>Минуты тренировок</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={workoutData}>
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
                    <CardTitle>Планы тренировок</CardTitle>
                    <CardDescription>Персонализированные программы</CardDescription>
                  </div>
                  <Button>
                    <Icon name="Sparkles" size={18} className="mr-2" />
                    ИИ-подбор
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border-l-4 border-primary rounded-lg bg-primary/5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">Сила и выносливость</h4>
                      <p className="text-sm text-muted-foreground">12 недель · Средний уровень</p>
                    </div>
                    <Badge>Активно</Badge>
                  </div>
                  <Progress value={45} className="mb-2" />
                  <p className="text-sm">Неделя 6 из 12 · Следующая тренировка: Понедельник</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">Йога для начинающих</h4>
                      <p className="text-sm text-muted-foreground">4 недели · Лёгкий уровень</p>
                    </div>
                    <Badge variant="outline">Доступно</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">30 мин в день · Гибкость и баланс</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">HIIT кардио</h4>
                      <p className="text-sm text-muted-foreground">8 недель · Продвинутый</p>
                    </div>
                    <Badge variant="outline">Доступно</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">45 мин · Жиросжигание</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="TrendingUp" size={20} />
                  Прогресс упражнений
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Жим лёжа</p>
                    <p className="text-sm text-muted-foreground">Личный рекорд</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-primary">75 кг</p>
                    <p className="text-xs text-green-600">+5 кг за месяц</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Приседания</p>
                    <p className="text-sm text-muted-foreground">Личный рекорд</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-primary">100 кг</p>
                    <p className="text-xs text-green-600">+10 кг за месяц</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="animate-enter space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Flame" size={20} className="text-orange-500" />
                  Активные челленджи
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {challenges.map((challenge, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{challenge.name}</h4>
                      <Badge variant="secondary">{challenge.participants} участников</Badge>
                    </div>
                    <Progress value={challenge.progress} className="mb-2" />
                    <p className="text-sm text-muted-foreground">{challenge.progress}% выполнено</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Лента сообщества</CardTitle>
                  <Button size="sm">
                    <Icon name="Plus" size={16} className="mr-2" />
                    Создать пост
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {socialPosts.map((post) => (
                  <div key={post.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar>
                        <AvatarFallback className="bg-secondary text-secondary-foreground">
                          {post.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold">{post.user}</p>
                          <p className="text-xs text-muted-foreground">{post.time}</p>
                        </div>
                        <p className="text-sm mt-2">{post.text}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 pt-3 border-t">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Icon name="Heart" size={16} />
                        {post.likes}
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
                ))}
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
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">ИВ</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">Иван Васильев</h3>
                    <p className="text-sm text-muted-foreground">ivan@example.com</p>
                    <Button size="sm" variant="outline" className="mt-2">Изменить фото</Button>
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
                    <p className="text-2xl font-bold text-primary">75 кг</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Дневная норма калорий</label>
                    <p className="text-2xl font-bold text-primary">2000 ккал</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Цель по шагам</label>
                    <p className="text-2xl font-bold text-primary">10,000</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Вода в день</label>
                    <p className="text-2xl font-bold text-primary">8 стаканов</p>
                  </div>
                </div>
                <Button className="w-full">Изменить цели</Button>
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
