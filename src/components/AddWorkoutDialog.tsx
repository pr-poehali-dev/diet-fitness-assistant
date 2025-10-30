import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface AddWorkoutDialogProps {
  onWorkoutAdded: () => void;
}

const AddWorkoutDialog = ({ onWorkoutAdded }: AddWorkoutDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    duration_minutes: '',
    workout_type: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://functions.poehali.dev/b255f161-6db3-41bf-9d98-c46c9607a363?action=workout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          duration_minutes: parseInt(formData.duration_minutes),
          workout_type: formData.workout_type
        })
      });

      if (response.ok) {
        setFormData({
          name: '',
          duration_minutes: '',
          workout_type: ''
        });
        setOpen(false);
        onWorkoutAdded();
      }
    } catch (error) {
      console.error('Error adding workout:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Icon name="Dumbbell" size={18} className="mr-2" />
          Добавить тренировку
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Добавить тренировку</DialogTitle>
          <DialogDescription>
            Запишите свою тренировку
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="workout-name">Название тренировки</Label>
            <Input
              id="workout-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Силовая тренировка"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Длительность (минуты)</Label>
            <Input
              id="duration"
              type="number"
              value={formData.duration_minutes}
              onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
              placeholder="45"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Тип тренировки</Label>
            <Input
              id="type"
              value={formData.workout_type}
              onChange={(e) => setFormData({ ...formData, workout_type: e.target.value })}
              placeholder="Силовая / Кардио / Йога"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Отмена
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Добавление...' : 'Добавить'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddWorkoutDialog;
