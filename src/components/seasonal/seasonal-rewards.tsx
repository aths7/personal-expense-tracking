'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Gift, 
  Star, 
  Crown, 
  Sparkles, 
  Trophy, 
  Medal,
  Gem,
  Lock,
  CheckCircle2,
  Coins,
  Palette,
  Zap
} from 'lucide-react';
import { formatCurrency } from '@/lib/currency';
import type { SeasonalReward, SeasonalEvent } from '@/services/seasonal-events';

interface SeasonalRewardsProps {
  event: SeasonalEvent;
  userPoints: number;
  claimedRewards: string[];
  onClaimReward?: (rewardId: string) => void;
}

export function SeasonalRewards({ 
  event, 
  userPoints, 
  claimedRewards, 
  onClaimReward 
}: SeasonalRewardsProps) {
  const [selectedTab, setSelectedTab] = useState('available');
  const [selectedReward, setSelectedReward] = useState<SeasonalReward | null>(null);

  // Mock rewards data - in real app would come from event.rewards
  const mockRewards: SeasonalReward[] = [
    {
      id: 'diwali_badge_1',
      event_id: event.id,
      type: 'badge',
      name: 'Diwali Light Keeper',
      description: 'Successfully managed expenses during Diwali celebrations',
      value: 100,
      unlock_condition: 'complete_any_challenge',
      icon: '🪔',
      rarity: 'common'
    },
    {
      id: 'diwali_character_1',
      event_id: event.id,
      type: 'character',
      name: 'Festival Ganesha',
      description: 'A special Ganesha character that brings good fortune to your savings',
      value: 500,
      unlock_condition: 'complete_3_challenges',
      icon: '🐘',
      rarity: 'epic'
    },
    {
      id: 'diwali_accessory_1',
      event_id: event.id,
      type: 'accessory',
      name: 'Golden Sparkler',
      description: 'A sparkler accessory that adds festival magic to your character',
      value: 300,
      unlock_condition: 'spend_wisely',
      icon: '✨',
      rarity: 'rare'
    },
    {
      id: 'diwali_bonus_1',
      event_id: event.id,
      type: 'currency_bonus',
      name: 'Festival Bonus Points',
      description: 'Bonus points to boost your expense tracking journey',
      value: 1000,
      unlock_condition: 'complete_all_challenges',
      icon: '🎁',
      rarity: 'legendary'
    },
    {
      id: 'diwali_badge_2',
      event_id: event.id,
      type: 'badge',
      name: 'Smart Shopper',
      description: 'Stayed within budget during festival shopping',
      value: 200,
      unlock_condition: 'budget_achievement',
      icon: '🛍️',
      rarity: 'rare'
    }
  ];

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'text-gray-600 bg-gray-100 border-gray-200',
      rare: 'text-blue-600 bg-blue-100 border-blue-200',
      epic: 'text-purple-600 bg-purple-100 border-purple-200',
      legendary: 'text-yellow-600 bg-yellow-100 border-yellow-200'
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

  const getRarityIcon = (rarity: string) => {
    const icons = {
      common: Star,
      rare: Gem,
      epic: Crown,
      legendary: Sparkles
    };
    return icons[rarity as keyof typeof icons] || Star;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      badge: Trophy,
      character: Palette,
      accessory: Sparkles,
      currency_bonus: Coins,
      points: Medal
    };
    return icons[type as keyof typeof icons] || Gift;
  };

  const canClaimReward = (reward: SeasonalReward) => {
    return userPoints >= reward.value && !claimedRewards.includes(reward.id);
  };

  const isRewardClaimed = (reward: SeasonalReward) => {
    return claimedRewards.includes(reward.id);
  };

  const availableRewards = mockRewards.filter(reward => canClaimReward(reward));
  const claimedRewardsList = mockRewards.filter(reward => isRewardClaimed(reward));
  const lockedRewards = mockRewards.filter(reward => 
    !canClaimReward(reward) && !isRewardClaimed(reward)
  );

  const RewardCard = ({ reward, isLocked = false, isClaimed = false }: { 
    reward: SeasonalReward; 
    isLocked?: boolean;
    isClaimed?: boolean;
  }) => {
    const RarityIcon = getRarityIcon(reward.rarity);
    const TypeIcon = getTypeIcon(reward.type);

    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: isLocked ? 1 : 1.05 }}
        className={`cursor-pointer ${isLocked ? 'opacity-60' : ''}`}
        onClick={() => !isLocked && setSelectedReward(reward)}
      >
        <Card className={`relative transition-all hover:shadow-lg ${
          selectedReward?.id === reward.id ? 'ring-2' : ''
        } ${isClaimed ? 'bg-green-50 border-green-200' : ''}`}
        style={{
          ringColor: selectedReward?.id === reward.id ? event.theme_colors.primary : 'transparent'
        }}>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <div className="text-2xl">
                  {reward.icon}
                </div>
                <div>
                  <CardTitle className="text-lg flex items-center">
                    {reward.name}
                    {isClaimed && <CheckCircle2 className="w-4 h-4 ml-2 text-green-500" />}
                    {isLocked && <Lock className="w-4 h-4 ml-2 text-gray-400" />}
                  </CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={getRarityColor(reward.rarity)}>
                      <RarityIcon className="w-3 h-3 mr-1" />
                      {reward.rarity}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <TypeIcon className="w-3 h-3 mr-1" />
                      {reward.type.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              {reward.description}
            </p>
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Cost: {reward.value} points
              </div>
              <div className="text-sm text-gray-500">
                You have: {userPoints} points
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-4">
              {isClaimed ? (
                <Button disabled className="w-full bg-green-500 text-white">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Claimed
                </Button>
              ) : isLocked ? (
                <Button disabled variant="outline" className="w-full">
                  <Lock className="w-4 h-4 mr-2" />
                  Need {reward.value - userPoints} more points
                </Button>
              ) : (
                <Button 
                  className="w-full"
                  style={{ backgroundColor: event.theme_colors.primary }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onClaimReward?.(reward.id);
                  }}
                >
                  <Gift className="w-4 h-4 mr-2" />
                  Claim Reward
                </Button>
              )}
            </div>
          </CardContent>

          {/* Rarity Glow Effect */}
          {reward.rarity === 'legendary' && !isLocked && (
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 0 rgba(255, 215, 0, 0)',
                  '0 0 20px rgba(255, 215, 0, 0.5)',
                  '0 0 0 rgba(255, 215, 0, 0)',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 rounded-lg pointer-events-none"
            />
          )}
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center">
          <Gift className="w-6 h-6 mr-2" style={{ color: event.theme_colors.primary }} />
          Seasonal Rewards
        </h2>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="flex items-center">
            <Coins className="w-4 h-4 mr-1" />
            {userPoints} Points
          </Badge>
          <Badge variant="outline">
            {claimedRewardsList.length} Rewards Claimed
          </Badge>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="available" className="flex items-center">
            <Zap className="w-4 h-4 mr-2" />
            Available ({availableRewards.length})
          </TabsTrigger>
          <TabsTrigger value="claimed" className="flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Claimed ({claimedRewardsList.length})
          </TabsTrigger>
          <TabsTrigger value="locked" className="flex items-center">
            <Lock className="w-4 h-4 mr-2" />
            Locked ({lockedRewards.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="mt-6">
          {availableRewards.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {availableRewards.map((reward) => (
                <RewardCard key={reward.id} reward={reward} />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <CardContent>
                <div className="text-gray-400 mb-4">
                  <Gift className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  No Rewards Available
                </h3>
                <p className="text-gray-500">
                  Complete challenges to earn points and unlock rewards!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="claimed" className="mt-6">
          {claimedRewardsList.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {claimedRewardsList.map((reward) => (
                <RewardCard key={reward.id} reward={reward} isClaimed />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <CardContent>
                <div className="text-gray-400 mb-4">
                  <Trophy className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  No Rewards Claimed Yet
                </h3>
                <p className="text-gray-500">
                  Start completing challenges to claim your first reward!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="locked" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {lockedRewards.map((reward) => (
              <RewardCard key={reward.id} reward={reward} isLocked />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Reward Details Modal */}
      <AnimatePresence>
        {selectedReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedReward(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg p-6 max-w-md w-full"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">{selectedReward.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{selectedReward.name}</h3>
                <Badge className={getRarityColor(selectedReward.rarity)} size="lg">
                  {selectedReward.rarity}
                </Badge>
                <p className="text-gray-600 mt-4 mb-6">
                  {selectedReward.description}
                </p>
                
                <div className="space-y-2 text-sm text-gray-500 mb-6">
                  <div>Cost: {selectedReward.value} points</div>
                  <div>Type: {selectedReward.type.replace('_', ' ')}</div>
                  <div>Condition: {selectedReward.unlock_condition.replace('_', ' ')}</div>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedReward(null)}
                    className="flex-1"
                  >
                    Close
                  </Button>
                  {canClaimReward(selectedReward) && (
                    <Button 
                      className="flex-1"
                      style={{ backgroundColor: event.theme_colors.primary }}
                      onClick={() => {
                        onClaimReward?.(selectedReward.id);
                        setSelectedReward(null);
                      }}
                    >
                      Claim
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}