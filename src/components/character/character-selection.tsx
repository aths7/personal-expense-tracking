'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Star, Crown, Zap } from 'lucide-react';
import { characterSystemService, CharacterUtils } from '@/services/character-system';
import { useGamification } from '@/hooks/useGamification';
import type { Character, UserCharacter, CharacterAccessory, UserCharacterAccessory } from '@/types/advanced-gamification';
import { AnimatedCharacter, AchievementUnlock } from '@/components/animations/character-animations';

interface CharacterSelectionProps {
  onCharacterSelect?: (characterId: string) => void;
  showAccessories?: boolean;
}

export function CharacterSelection({ onCharacterSelect, showAccessories = true }: CharacterSelectionProps) {
  const [availableCharacters, setAvailableCharacters] = useState<Character[]>([]);
  const [userCharacters, setUserCharacters] = useState<UserCharacter[]>([]);
  const [availableAccessories, setAvailableAccessories] = useState<CharacterAccessory[]>([]);
  const [userAccessories, setUserAccessories] = useState<UserCharacterAccessory[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [showUnlockAnimation, setShowUnlockAnimation] = useState<{ character?: Character; accessory?: CharacterAccessory } | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { userProfile, stats } = useGamification();

  useEffect(() => {
    loadCharacterData();
  }, []);

  const loadCharacterData = async () => {
    setLoading(true);
    try {
      const [charactersResult, userCharsResult, accessoriesResult, userAccsResult] = await Promise.all([
        characterSystemService.getAvailableCharacters(),
        characterSystemService.getUserCharacters(),
        characterSystemService.getAvailableAccessories(),
        characterSystemService.getUserAccessories()
      ]);

      if (charactersResult.data) setAvailableCharacters(charactersResult.data);
      if (userCharsResult.data) setUserCharacters(userCharsResult.data);
      if (accessoriesResult.data) setAvailableAccessories(accessoriesResult.data);
      if (userAccsResult.data) setUserAccessories(userAccsResult.data);

      // Set initially selected character to active one
      const activeCharacter = userCharsResult.data?.find(uc => uc.is_active);
      if (activeCharacter && charactersResult.data) {
        const character = charactersResult.data.find(c => c.id === activeCharacter.character_id);
        if (character) setSelectedCharacter(character);
      }
    } catch (error) {
      console.error('Error loading character data:', error);
    } finally {
      setLoading(false);
    }
  };

  const isCharacterUnlocked = (characterId: string) => {
    return userCharacters.some(uc => uc.character_id === characterId);
  };

  const isAccessoryUnlocked = (accessoryId: string) => {
    return userAccessories.some(ua => ua.accessory_id === accessoryId);
  };

  const canUnlockCharacter = (character: Character) => {
    if (!stats) return false;
    return CharacterUtils.checkUnlockConditions(character.unlock_condition, {
      totalExpenses: stats.totalExpenses,
      longestStreak: stats.currentStreak,
      level: stats.level,
      budgetGoalsCreated: 1, // This would come from actual budget data
      budgetGoalsAchieved: 0,
      categoriesUsed: stats.totalCategories || 0,
      maxSingleExpense: 0 // This would come from expense data
    });
  };

  const handleCharacterUnlock = async (character: Character) => {
    if (!canUnlockCharacter(character)) return;
    
    try {
      const result = await characterSystemService.unlockCharacter(character.id);
      if (result.success) {
        setShowUnlockAnimation({ character });
        await loadCharacterData();
      }
    } catch (error) {
      console.error('Error unlocking character:', error);
    }
  };

  const handleCharacterSelect = async (character: Character) => {
    if (!isCharacterUnlocked(character.id)) {
      if (canUnlockCharacter(character)) {
        await handleCharacterUnlock(character);
      }
      return;
    }

    try {
      const result = await characterSystemService.setActiveCharacter(character.id);
      if (result.success) {
        setSelectedCharacter(character);
        onCharacterSelect?.(character.id);
        await loadCharacterData();
      }
    } catch (error) {
      console.error('Error selecting character:', error);
    }
  };

  const getCharacterEmoji = (type: string) => {
    const emojis = {
      pig: '🐷',
      mario: '🍄',
      sonic: '💨',
      cat: '🐱',
      robot: '🤖',
      dragon: '🐲',
      wizard: '🧙‍♂️',
      ninja: '🥷',
      pirate: '🏴‍☠️',
      knight: '⚔️'
    };
    return emojis[type as keyof typeof emojis] || '💰';
  };

  const getRarityBadge = (rarity: string) => {
    const rarityConfig = {
      common: { label: 'Common', className: 'bg-gray-500' },
      rare: { label: 'Rare', className: 'bg-blue-500' },
      epic: { label: 'Epic', className: 'bg-purple-500' },
      legendary: { label: 'Legendary', className: 'bg-yellow-500' }
    };
    
    const config = rarityConfig[rarity as keyof typeof rarityConfig] || rarityConfig.common;
    return <Badge className={`${config.className} text-white text-xs`}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5" />
            Character Selection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {availableCharacters.map((character) => {
              const isUnlocked = isCharacterUnlocked(character.id);
              const canUnlock = canUnlockCharacter(character);
              const isActive = selectedCharacter?.id === character.id;
              
              return (
                <motion.div
                  key={character.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    isActive 
                      ? 'border-blue-500 bg-blue-50 shadow-lg' 
                      : isUnlocked 
                        ? 'border-gray-200 hover:border-gray-300 bg-white' 
                        : canUnlock
                          ? 'border-green-200 bg-green-50 hover:border-green-300'
                          : 'border-gray-100 bg-gray-50 opacity-60'
                  }`}
                  onClick={() => handleCharacterSelect(character)}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className="relative">
                      <div className="text-4xl mb-2">{getCharacterEmoji(character.type)}</div>
                      
                      {!isUnlocked && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-black/50 rounded-full p-2">
                            <Lock className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                      
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1"
                        >
                          <Star className="w-3 h-3 text-white fill-current" />
                        </motion.div>
                      )}
                    </div>
                    
                    <div className="text-center">
                      <div className="font-medium text-sm">{character.name}</div>
                      <div className="text-xs text-gray-500 mb-1">{character.description}</div>
                      {getRarityBadge(character.rarity)}
                    </div>
                    
                    {!isUnlocked && (
                      <div className="text-xs text-center">
                        <div className="text-gray-600 mb-1">Unlock: {character.unlock_condition.replace('_', ' ')}</div>
                        {canUnlock ? (
                          <Button size="sm" variant="outline" className="h-6 text-xs">
                            <Zap className="w-3 h-3 mr-1" />
                            Unlock
                          </Button>
                        ) : (
                          <div className="text-red-500">Requirements not met</div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Accessories Section */}
      {showAccessories && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Character Accessories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {availableAccessories.map((accessory) => {
                const isUnlocked = isAccessoryUnlocked(accessory.id);
                const isEquipped = userAccessories.some(ua => ua.accessory_id === accessory.id && ua.is_equipped);
                
                return (
                  <motion.div
                    key={accessory.id}
                    whileHover={{ scale: 1.05 }}
                    className={`p-3 rounded-lg border text-center cursor-pointer ${
                      isEquipped 
                        ? 'border-blue-500 bg-blue-50' 
                        : isUnlocked 
                          ? 'border-gray-200 hover:border-gray-300' 
                          : 'border-gray-100 bg-gray-50 opacity-60'
                    }`}
                  >
                    <div className="text-2xl mb-1">{accessory.icon || '🎨'}</div>
                    <div className="text-xs font-medium">{accessory.name}</div>
                    {getRarityBadge(accessory.rarity)}
                    
                    {!isUnlocked && (
                      <div className="mt-1">
                        <Lock className="w-3 h-3 mx-auto text-gray-400" />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Character Preview */}
      {selectedCharacter && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Character Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center p-8">
              <AnimatedCharacter
                character={selectedCharacter}
                mood={{
                  mood: 'happy',
                  expression: '😊',
                  animation: 'bounce',
                  trigger: 'selection',
                  duration: 3000
                }}
                size="large"
                showReaction={true}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Unlock Animation */}
      <AnimatePresence>
        {showUnlockAnimation?.character && (
          <AchievementUnlock
            achievementName={`${showUnlockAnimation.character.name} Unlocked!`}
            points={showUnlockAnimation.character.unlock_points}
            badge="🎉"
            onComplete={() => setShowUnlockAnimation(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}