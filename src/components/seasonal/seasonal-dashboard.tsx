'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, 
  Calendar, 
  Trophy, 
  Gift,
  Star,
  TrendingUp,
  Zap,
  X
} from 'lucide-react';
import { FestivalBanner } from './festival-banner';
import { SeasonalChallenges } from './seasonal-challenges';
import { SeasonalRewards } from './seasonal-rewards';
import { useSeasonalEvents } from '@/hooks/useSeasonalEvents';
// formatCurrency removed - not used in current implementation

interface SeasonalDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onExpenseAdded?: (expense: Record<string, unknown>) => void;
}

export function SeasonalDashboard({ isOpen, onClose, onExpenseAdded }: SeasonalDashboardProps) {
  const {
    currentEvent,
    loading,
    userPoints,
    claimedRewards,
    acceptChallenge,
    completeChallenge,
    claimReward,
    getEventTheme,
    getSeasonalOffers,
    getTimeUntilEventEnd
  } = useSeasonalEvents();

  const [activeTab, setActiveTab] = useState('overview');
  const [showOffers, setShowOffers] = useState(true);

  const eventTheme = getEventTheme();
  const offers = getSeasonalOffers();

  if (loading) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <div className="bg-white p-8 rounded-lg">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  if (!currentEvent) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg p-8 max-w-md w-full mx-4"
            >
              <div className="text-center">
                <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Events</h3>
                <p className="text-gray-600 mb-6">
                  Check back later for seasonal events and special challenges!
                </p>
                <Button onClick={onClose} className="w-full">
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center space-x-3">
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${eventTheme?.primary}20` }}
                >
                  <Sparkles 
                    className="w-6 h-6" 
                    style={{ color: eventTheme?.primary }} 
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Seasonal Events</h2>
                  <p className="text-gray-600">
                    {currentEvent.name} • {getTimeUntilEventEnd(currentEvent)} remaining
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="flex items-center">
                  <Star className="w-4 h-4 mr-1" />
                  {userPoints} Points
                </Badge>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="px-6 pt-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview" className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="challenges" className="flex items-center">
                      <Trophy className="w-4 h-4 mr-2" />
                      Challenges ({currentEvent.challenges.length})
                    </TabsTrigger>
                    <TabsTrigger value="rewards" className="flex items-center">
                      <Gift className="w-4 h-4 mr-2" />
                      Rewards
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="p-6">
                  <TabsContent value="overview" className="mt-0">
                    <div className="space-y-6">
                      {/* Festival Banner */}
                      <FestivalBanner
                        event={currentEvent}
                        onChallengeClick={() => setActiveTab('challenges')}
                        onViewRewards={() => setActiveTab('rewards')}
                      />

                      {/* Special Offers */}
                      {offers.length > 0 && showOffers && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <Card className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <h3 className="font-semibold text-yellow-800 flex items-center">
                                  <Zap className="w-4 h-4 mr-2" />
                                  Limited Time Offers
                                </h3>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => setShowOffers(false)}
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                              <div className="space-y-2">
                                {offers.map((offer, index) => (
                                  <div key={index} className="flex items-start space-x-2">
                                    <div className="text-yellow-600">•</div>
                                    <div>
                                      <div className="font-medium text-yellow-800">
                                        {offer.title}
                                      </div>
                                      <div className="text-sm text-yellow-700">
                                        {offer.description}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )}

                      {/* Quick Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {currentEvent.challenges.filter(c => c.is_completed).length}
                            </div>
                            <div className="text-sm text-gray-600">
                              Challenges Complete
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {claimedRewards.length}
                            </div>
                            <div className="text-sm text-gray-600">
                              Rewards Claimed
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-purple-600">
                              {userPoints}
                            </div>
                            <div className="text-sm text-gray-600">
                              Points Earned
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-orange-600">
                              {Math.floor(Math.random() * 50) + 10}
                            </div>
                            <div className="text-sm text-gray-600">
                              Community Rank
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Recent Activity */}
                      <Card>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-4 flex items-center">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Recent Activity
                          </h3>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm">Completed &ldquo;Smart Diwali Spending&rdquo; challenge</span>
                              </div>
                              <Badge variant="outline" className="text-xs">+200 pts</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span className="text-sm">Claimed &ldquo;Diwali Light Keeper&rdquo; badge</span>
                              </div>
                              <Badge variant="outline" className="text-xs">-100 pts</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                <span className="text-sm">Started &ldquo;Festival Essentials Only&rdquo; challenge</span>
                              </div>
                              <Badge variant="outline" className="text-xs">New</Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="challenges" className="mt-0">
                    <SeasonalChallenges
                      event={currentEvent}
                      challenges={currentEvent.challenges}
                      onChallengeAccept={acceptChallenge}
                      onChallengeComplete={completeChallenge}
                    />
                  </TabsContent>

                  <TabsContent value="rewards" className="mt-0">
                    <SeasonalRewards
                      event={currentEvent}
                      userPoints={userPoints}
                      claimedRewards={claimedRewards}
                      onClaimReward={claimReward}
                    />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}