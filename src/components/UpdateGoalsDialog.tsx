import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface UpdateGoalsDialogProps {
  currentGoals: {
    target_weight?: number;
    daily_calorie_target?: number;
    daily_steps_target?: number;
    daily_water_target?: number;
  };
  onGoalsUpdated: () => void;
}

const UpdateGoalsDialog = ({ currentGoals, onGoalsUpdated }: UpdateGoalsDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    target_weight: '',
    daily_calorie_target: '',
    daily_steps_target: '',
    daily_water_target: ''
  });

  useEffect(() => {
    if (currentGoals) {
      setFormData({
        target_weight: currentGoals.target_weight?.toString() || '',
        daily_calorie_target: currentGoals.daily_calorie_target?.toString() || '',
        daily_steps_target: currentGoals.daily_steps_target?.toString() || '',
        daily_water_target: currentGoals.daily_water_target?.toString() || ''
      });
    }
  }, [currentGoals]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://functions.poehali.dev/b255f161-6db3-41bf-9d98-c46c9607a363?action=goals', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          target_weight: parseFloat(formData.target_weight),
          daily_calorie_target: parseInt(formData.daily_calorie_target),
          daily_steps_target: parseInt(formData.daily_steps_target),
          daily_water_target: parseInt(formData.daily_water_target)
        })
      });

      if (response.ok) {
        setOpen(false);
        onGoalsUpdated();
      }
    } catch (error) {
      console.error('Error updating goals:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Изменить цели</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Обновить цели</DialogTitle>
          <DialogDescription>
            Измените свои цели и дневные нормы
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="target_weight">Целевой вес (кг)</Label>
            <Input
              id="target_weight"
              type="number"
              step="0.1"
              value={formData.target_weight}
              onChange={(e) => setFormData({ ...formData, target_weight: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="calories">Дневная норма калорий</Label>
            <Input
              id="calories"
              type="number"
              value={formData.daily_calorie_target}
              onChange={(e) => setFormData({ ...formData, daily_calorie_target: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="steps">Цель по шагам</Label>
            <Input
              id="steps"
              type="number"
              value={formData.daily_steps_target}
              onChange={(e) => setFormData({ ...formData, daily_steps_target: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="water">Вода в день (стаканов)</Label>
            <Input
              id="water"
              type="number"
              value={formData.daily_water_target}
              onChange={(e) => setFormData({ ...formData, daily_water_target: e.target.value })}
              required
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Отмена
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateGoalsDialog;
