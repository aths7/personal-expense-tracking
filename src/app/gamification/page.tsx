'use client';

import { useState, useEffect } from 'react';
import { AuthGuard } from '@/components/auth/auth-guard';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LevelProgress } from '@/components/gamification/level-progress';
import { AchievementsGrid } from '@/components/gamification/achievements-grid';
import { BudgetGoals } from '@/components/gamification/budget-goals';
import { useGamification } from '@/hooks/useGamification';
import { gamificationService } from '@/services/gamification';
import type { Achievement } from '@/types/gamification';
import { 
  Trophy, 
  Target, 
  Award, 
  Flame,
  TrendingUp
} from 'lucide-react';

export default function GamificationPage() {
  const { 
    gameStats, 
    loading, 
    createBudgetGoal, 
    updateBudgetGoal, 
    deleteBudgetGoal,
    joinChallenge
  } = useGamification();

  const [availableAchievements, setAvailableAchievements] = useState<Achievement[]>([]);
  const [achievementsLoading, setAchievementsLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      setAchievementsLoading(true);
      try {
        const { data } = await gamificationService.getAvailableAchievements();
        if (data) {
          setAvailableAchievements(data);
        }
      } finally {
        setAchievementsLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  if (loading || achievementsLoading || !gameStats) {
    return (
      <AuthGuard>
        <DashboardLayout>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
        </DashboardLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center space-x-2">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <span>Gamification</span>
          </h1>
          <p className="text-muted-foreground">
            Track your progress, earn achievements, and stay motivated!
          </p>
        </div>

        {/* Level Progress */}
        <LevelProgress gameStats={gameStats} />

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Points</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{gameStats.profile.total_points.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Achievements</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {gameStats.achievements.length}/{availableAchievements.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <Flame className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{gameStats.profile.current_streak}</div>
              <p className="text-xs text-muted-foreground">days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Budget Goals</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{gameStats.budgetGoals.length}</div>
              <p className="text-xs text-muted-foreground">active goals</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="achievements" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="achievements" className="flex items-center space-x-2">
              <Award className="h-4 w-4" />
              <span>Achievements</span>
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Budget Goals</span>
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center space-x-2">
              <Flame className="h-4 w-4" />
              <span>Challenges</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="achievements" className="space-y-6">
            <AchievementsGrid 
              gameStats={gameStats} 
              availableAchievements={availableAchievements}
            />
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <BudgetGoals
              gameStats={gameStats}
              onCreateGoal={createBudgetGoal}
              onUpdateGoal={updateBudgetGoal}
              onDeleteGoal={deleteBudgetGoal}
            />
          </TabsContent>

          <TabsContent value="challenges" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Challenges</CardTitle>
                <CardDescription>
                  Join community challenges to earn extra points and stay motivated!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Flame className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Challenges Coming Soon!</h3>
                  <p className="text-muted-foreground">
                    We&apos;re working on exciting community challenges. Stay tuned!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      </DashboardLayout>
    </AuthGuard>
  );
}