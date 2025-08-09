import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { GameStats, Achievement } from '@/types/gamification';
import { ACHIEVEMENT_CATEGORIES } from '@/constants/gamification';
import {
  Trophy,
  Lock,
  Star,
  Award,
  Target,
  Flame,
  Play,
  Shuffle,
  DollarSign,
  PiggyBank,
  CreditCard,
  LucideIcon
} from 'lucide-react';

interface AchievementsGridProps {
  gameStats: GameStats;
  availableAchievements: Achievement[];
}

export function AchievementsGrid({ gameStats, availableAchievements }: AchievementsGridProps) {
  const earnedAchievementIds = new Set(gameStats.achievements.map(a => a.achievement_id));

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, LucideIcon> = {
      Trophy, Star, Award, Target, Flame, Play, Shuffle, DollarSign, PiggyBank, CreditCard,
    };
    return icons[iconName] || Trophy;
  };

  const getCategoryIcon = (categoryKey: string) => {
    const category = ACHIEVEMENT_CATEGORIES[categoryKey as keyof typeof ACHIEVEMENT_CATEGORIES];
    if (!category) return Play;

    const icons: Record<string, LucideIcon> = {
      Play, Flame, Target, Shuffle, DollarSign, PiggyBank, CreditCard,
    };
    return icons[category.icon] || Play;
  };

  // Group achievements by category
  const achievementsByCategory = availableAchievements.reduce((acc, achievement) => {
    if (!acc[achievement.category]) {
      acc[achievement.category] = [];
    }
    acc[achievement.category].push(achievement);
    return acc;
  }, {} as Record<string, Achievement[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Trophy className="h-5 w-5 text-yellow-500" />
        <h3 className="text-lg font-semibold">Achievements</h3>
        <Badge variant="secondary">
          {gameStats.achievements.length}/{availableAchievements.length}
        </Badge>
      </div>

      {Object.entries(achievementsByCategory).map(([categoryKey, achievements]) => {
        const category = ACHIEVEMENT_CATEGORIES[categoryKey as keyof typeof ACHIEVEMENT_CATEGORIES];
        const CategoryIcon = getCategoryIcon(categoryKey);

        return (
          <div key={categoryKey} className="space-y-3">
            <div className="flex items-center space-x-2">
              <CategoryIcon className="h-4 w-4" style={{ color: category?.color || '#6B7280' }} />
              <h4 className="font-medium" style={{ color: category?.color || '#6B7280' }}>
                {category?.name || categoryKey}
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {achievements.map((achievement) => {
                const isEarned = earnedAchievementIds.has(achievement.id);
                const userAchievement = gameStats.achievements.find(
                  a => a.achievement_id === achievement.id
                );
                const AchievementIcon = getIconComponent(achievement.icon || 'Trophy');

                return (
                  <Card
                    key={achievement.id}
                    className={`transition-all duration-200 ${isEarned
                      ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 border-yellow-200 dark:border-yellow-800'
                      : 'opacity-75 hover:opacity-100'
                      }`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${isEarned ? 'shadow-lg' : ''
                            }`}
                          style={{ backgroundColor: isEarned ? achievement.badge_color : '#6B7280' }}
                        >
                          {isEarned ? (
                            <AchievementIcon className="h-5 w-5" />
                          ) : (
                            <Lock className="h-5 w-5" />
                          )}
                        </div>
                        <Badge variant={isEarned ? 'default' : 'secondary'} className="text-xs">
                          {achievement.points} pts
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <h4 className={`font-semibold text-sm mb-1 ${isEarned ? 'text-yellow-800 dark:text-yellow-200' : ''
                        }`}>
                        {achievement.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {achievement.description}
                      </p>
                      {isEarned && userAchievement && (
                        <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                          Earned {new Date(userAchievement.earned_at).toLocaleDateString()}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}