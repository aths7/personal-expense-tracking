'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Crown,
  Gamepad2,
  Star,
  Trophy,
  Zap,
  Target,
  Users,
  Calendar,
  TrendingUp,
  Sparkles
} from 'lucide-react';

import { CharacterSelection } from '@/components/character/character-selection';
import { MiniGames, GameSelection } from '@/components/games/mini-games';
import { AnimatedCharacter, LevelUpAnimation, AchievementUnlock } from '@/components/animations/character-animations';
import { MoneyRain, CoinFlip } from '@/components/animations/money-rain';
import { InteractiveCategory, StreakPlant } from '@/components/animations/interactive-categories';
import { MoodButton, useMoodTheme } from '@/components/mood/mood-theme-provider';

import { useGamification } from '@/hooks/useGamification';
import { characterSystemService } from '@/services/character-system';
import type { Character } from '@/types/advanced-gamification';

export default function GamificationPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showMiniGames, setShowMiniGames] = useState(false);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [showAnimations, setShowAnimations] = useState<{
    moneyRain?: boolean;
    coinFlip?: { amount: number };
    levelUp?: { level: number; name: string };
    achievement?: { name: string; points: number; badge: string };
  }>({});
  const [activeCharacter, setActiveCharacter] = useState<Character | null>(null);

  const { userProfile, achievements, stats, error, loading } = useGamification();
  const { currentMood, updateMood, setBackgroundEffects, backgroundEffects } = useMoodTheme();

  useEffect(() => {
    // Update mood based on spending data (mock data for demo)
    updateMood({
      monthlyBudget: 50000,
      currentSpending: 37500,
      recentExpense: null
    });

    // Load active character
    loadActiveCharacter();
  }, []);

  const loadActiveCharacter = async () => {
    try {
      const { data: userChars } = await characterSystemService.getUserCharacters();
      const active = userChars?.find(uc => uc.is_active);
      if (active) {
        const { data: characters } = await characterSystemService.getAvailableCharacters();
        const character = characters?.find(c => c.id === active.character_id);
        if (character) setActiveCharacter(character);
      }
    } catch (error) {
      console.error('Error loading active character:', error);
    }
  };

  const handleGameComplete = (result: any) => {
    // Show coin flip animation
    setShowAnimations(prev => ({ ...prev, coinFlip: { amount: result.pointsEarned } }));
    
    // Check for level up
    if (result.pointsEarned > 20) {
      setTimeout(() => {
        setShowAnimations(prev => ({ 
          ...prev, 
          levelUp: { level: (stats?.level || 1) + 1, name: 'Game Master' }
        }));
      }, 2000);
    }
  };

  const triggerTestAnimations = () => {
    setShowAnimations({ moneyRain: true });
    setTimeout(() => {
      setShowAnimations(prev => ({ ...prev, coinFlip: { amount: 25 } }));
    }, 2000);
    setTimeout(() => {
      setShowAnimations(prev => ({ 
        ...prev, 
        achievement: { name: 'Animation Tester', points: 100, badge: '🎉' }
      }));
    }, 4000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gamification Hub</h1>
          <p className="text-muted-foreground">
            Level up your financial journey with fun challenges and rewards!
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <MoodButton onClick={() => setBackgroundEffects(!backgroundEffects)}>
            <Sparkles className="w-4 h-4 mr-2" />
            Effects: {backgroundEffects ? 'On' : 'Off'}
          </MoodButton>
          <MoodButton onClick={triggerTestAnimations} variant="accent">
            <Zap className="w-4 h-4 mr-2" />
            Test Animations
          </MoodButton>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Star className="w-8 h-8 text-yellow-500" />
              <div className="ml-3">
                <div className="text-2xl font-bold">{userProfile?.total_points || 0}</div>
                <div className="text-sm text-muted-foreground">Total Points</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Trophy className="w-8 h-8 text-blue-500" />
              <div className="ml-3">
                <div className="text-2xl font-bold">{userProfile?.level || 1}</div>
                <div className="text-sm text-muted-foreground">Level</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="w-8 h-8 text-green-500" />
              <div className="ml-3">
                <div className="text-2xl font-bold">{achievements?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Achievements</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-purple-500" />
              <div className="ml-3">
                <div className="text-2xl font-bold">{userProfile?.current_streak || 0}</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Mood & Character Display */}
      {activeCharacter && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5" />
              Your Character
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <AnimatedCharacter
                  character={activeCharacter}
                  mood={{
                    mood: currentMood,
                    expression: '😊',
                    animation: 'bounce',
                    trigger: 'display',
                    duration: 3000
                  }}
                  size="large"
                  showReaction={true}
                />
                <div>
                  <h3 className="text-xl font-semibold">{activeCharacter.name}</h3>
                  <p className="text-muted-foreground">{activeCharacter.description}</p>
                  <Badge className="mt-2">Current Mood: {currentMood}</Badge>
                </div>
              </div>
              <div className="text-right">
                <StreakPlant streakDays={userProfile?.current_streak || 0} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="characters">Characters</TabsTrigger>
          <TabsTrigger value="games">Mini Games</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements?.slice(0, 3).map((achievement) => (
                    <div key={achievement.id} className="flex items-center space-x-3">
                      <div className="text-2xl">{achievement.badge || '🏆'}</div>
                      <div>
                        <div className="font-medium">{achievement.name}</div>
                        <div className="text-sm text-muted-foreground">
                          +{achievement.points} points
                        </div>
                      </div>
                    </div>
                  )) || (
                    <p className="text-muted-foreground">No achievements yet. Start tracking expenses to earn your first achievement!</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <MoodButton 
                  className="w-full justify-start" 
                  onClick={() => setShowMiniGames(true)}
                >
                  <Gamepad2 className="w-4 h-4 mr-2" />
                  Play Mini Games
                </MoodButton>
                <MoodButton 
                  className="w-full justify-start" 
                  variant="secondary"
                  onClick={() => setActiveTab('characters')}
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Customize Character
                </MoodButton>
                <MoodButton 
                  className="w-full justify-start" 
                  variant="accent"
                  onClick={triggerTestAnimations}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Celebrate Progress
                </MoodButton>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="characters" className="space-y-6">
          <CharacterSelection 
            onCharacterSelect={(characterId) => {
              loadActiveCharacter();
              setShowAnimations(prev => ({ 
                ...prev, 
                achievement: { name: 'Character Selected', points: 10, badge: '👤' }
              }));
            }}
            showAccessories={true}
          />
        </TabsContent>

        <TabsContent value="games" className="space-y-6">
          {selectedGame ? (
            <MiniGames
              gameType={selectedGame as any}
              onGameComplete={handleGameComplete}
              onGameClose={() => setSelectedGame(null)}
            />
          ) : (
            <GameSelection
              onGameSelect={setSelectedGame}
              onClose={() => setShowMiniGames(false)}
            />
          )}
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements?.map((achievement) => (
                  <motion.div
                    key={achievement.id}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 border rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200"
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{achievement.badge || '🏆'}</div>
                      <div className="font-semibold">{achievement.name}</div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {achievement.description}
                      </div>
                      <Badge className="bg-yellow-500">+{achievement.points} points</Badge>
                    </div>
                  </motion.div>
                )) || (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    No achievements yet. Keep tracking your expenses to unlock rewards!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Social Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Social features coming soon!</p>
                <p className="text-sm">Connect with friends, share achievements, and compete in challenges.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Animation Overlays */}
      <MoneyRain
        isActive={showAnimations.moneyRain || false}
        intensity="heavy"
        onComplete={() => setShowAnimations(prev => ({ ...prev, moneyRain: false }))}
      />

      <AnimatePresence>
        {showAnimations.coinFlip && (
          <CoinFlip
            isActive={true}
            amount={showAnimations.coinFlip.amount}
            onComplete={() => setShowAnimations(prev => ({ ...prev, coinFlip: undefined }))}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAnimations.levelUp && (
          <LevelUpAnimation
            newLevel={showAnimations.levelUp.level}
            levelName={showAnimations.levelUp.name}
            onComplete={() => setShowAnimations(prev => ({ ...prev, levelUp: undefined }))}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAnimations.achievement && (
          <AchievementUnlock
            achievementName={showAnimations.achievement.name}
            points={showAnimations.achievement.points}
            badge={showAnimations.achievement.badge}
            onComplete={() => setShowAnimations(prev => ({ ...prev, achievement: undefined }))}
          />
        )}
      </AnimatePresence>

      {/* Game Selection Modal */}
      <AnimatePresence>
        {showMiniGames && !selectedGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowMiniGames(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <GameSelection
                onGameSelect={(gameType) => {
                  setSelectedGame(gameType);
                  setShowMiniGames(false);
                }}
                onClose={() => setShowMiniGames(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}