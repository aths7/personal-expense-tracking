import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import type { GameStats } from '@/types/gamification';
import { 
  Trophy, 
  Star, 
  TrendingUp,
  Flame,
  Target
} from 'lucide-react';

interface LevelProgressProps {
  gameStats: GameStats;
}

export function LevelProgress({ gameStats }: LevelProgressProps) {
  const { profile, levelInfo, nextLevelInfo, pointsToNextLevel } = gameStats;
  
  const progressPercentage = nextLevelInfo 
    ? ((profile.total_points - levelInfo.minPoints) / (nextLevelInfo.minPoints - levelInfo.minPoints)) * 100
    : 100;

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, React.ComponentType<{ className?: string }>> = {
      Trophy, Star, TrendingUp, Flame, Target,
    };
    return icons[iconName] || Star;
  };

  const LevelIcon = getIconComponent(levelInfo.icon);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <span>Your Level</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Level */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: levelInfo.color }}
            >
              <LevelIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold">{levelInfo.name}</h3>
              <p className="text-sm text-muted-foreground">Level {levelInfo.level}</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {profile.total_points.toLocaleString()} pts
          </Badge>
        </div>

        {/* Progress to Next Level */}
        {nextLevelInfo && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to {nextLevelInfo.name}</span>
              <span>{pointsToNextLevel.toLocaleString()} pts needed</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Flame className="h-4 w-4 text-orange-500" />
            </div>
            <div className="text-lg font-bold">{profile.current_streak}</div>
            <div className="text-xs text-muted-foreground">Current Streak</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Star className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-lg font-bold">{profile.longest_streak}</div>
            <div className="text-xs text-muted-foreground">Best Streak</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Target className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-lg font-bold">{profile.total_expenses_tracked}</div>
            <div className="text-xs text-muted-foreground">Expenses Tracked</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}