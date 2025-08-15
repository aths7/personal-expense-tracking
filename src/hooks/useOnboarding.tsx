'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface OnboardingContextType {
  showTutorial: boolean;
  isFirstTime: boolean;
  completedSteps: Set<string>;
  currentFeature: string | null;
  startTutorial: () => void;
  completeTutorial: () => void;
  skipTutorial: () => void;
  markStepCompleted: (step: string) => void;
  showFeatureHighlight: (feature: string) => void;
  dismissFeatureHighlight: () => void;
  hasCompletedStep: (step: string) => boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
}

interface OnboardingProviderProps {
  children: React.ReactNode;
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const [showTutorial, setShowTutorial] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [currentFeature, setCurrentFeature] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const supabase = createClient();

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      // For now, mock the user profile data since user_profiles table might not exist
      // const { data: profile } = await supabase
      //   .from('user_profiles')
      //   .select('onboarding_completed, onboarding_steps')
      //   .eq('user_id', user.id)
      //   .single();
      
      // Mock profile data for now
      const profile = {
        onboarding_completed: false,
        onboarding_steps: []
      };

      if (!profile) {
        // First time user - disable tutorial for now
        setIsFirstTime(true);
        setShowTutorial(false); // Disabled
      } else {
        setIsFirstTime(!profile.onboarding_completed);
        setShowTutorial(false); // Disabled
        
        if (profile.onboarding_steps) {
          setCompletedSteps(new Set(profile.onboarding_steps));
        }
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      // Assume first time user on error - tutorial disabled for now
      setIsFirstTime(true);
      setShowTutorial(false); // Disabled
    } finally {
      setLoading(false);
    }
  };

  const startTutorial = () => {
    setShowTutorial(true);
  };

  const completeTutorial = async () => {
    setShowTutorial(false);
    setIsFirstTime(false);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // For now, we'll skip updating the user_profiles table since it doesn't exist
      // await supabase
      //   .from('user_profiles')
      //   .upsert({
      //     user_id: user.id,
      //     onboarding_completed: true,
      //     onboarding_completed_at: new Date().toISOString(),
      //     onboarding_steps: Array.from(completedSteps)
      //   });
      
      console.log('Onboarding completed for user:', user.id);

      // For now, we'll skip awarding achievements since user_achievements table might not exist
      // await supabase
      //   .from('user_achievements')
      //   .upsert({
      //     user_id: user.id,
      //     achievement_id: 'onboarding-complete',
      //     unlocked_at: new Date().toISOString()
      //   });
      
      console.log('Would award onboarding completion achievement to user:', user.id);

      // For now, we'll skip the RPC call since it might not exist
      // await supabase.rpc('add_user_points', {
      //   user_id: user.id,
      //   points_to_add: 50
      // });
      
      console.log('Would add 50 starter points to user:', user.id);

    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const skipTutorial = async () => {
    setShowTutorial(false);
    setIsFirstTime(false);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // For now, we'll skip the database update since user_profiles doesn't exist
      // await supabase
      //   .from('user_profiles')
      //   .upsert({
      //     user_id: user.id,
      //     onboarding_completed: true,
      //     onboarding_skipped: true,
      //     onboarding_completed_at: new Date().toISOString()
      //   });
      
      console.log('User skipped onboarding:', user.id);
    } catch (error) {
      console.error('Error skipping onboarding:', error);
    }
  };

  const markStepCompleted = async (step: string) => {
    const newCompleted = new Set(completedSteps);
    newCompleted.add(step);
    setCompletedSteps(newCompleted);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // For now, we'll skip the database update since user_profiles doesn't exist
      // await supabase
      //   .from('user_profiles')
      //   .upsert({
      //     user_id: user.id,
      //     onboarding_steps: Array.from(newCompleted)
      //   });
      
      console.log('Updated onboarding steps for user:', user.id, Array.from(newCompleted));
    } catch (error) {
      console.error('Error updating onboarding steps:', error);
    }
  };

  const showFeatureHighlight = (feature: string) => {
    setCurrentFeature(feature);
    
    // Auto-dismiss after 10 seconds
    setTimeout(() => {
      setCurrentFeature(null);
    }, 10000);
  };

  const dismissFeatureHighlight = () => {
    setCurrentFeature(null);
  };

  const hasCompletedStep = (step: string): boolean => {
    return completedSteps.has(step);
  };

  if (loading) {
    return null; // or loading spinner
  }

  return (
    <OnboardingContext.Provider
      value={{
        showTutorial,
        isFirstTime,
        completedSteps,
        currentFeature,
        startTutorial,
        completeTutorial,
        skipTutorial,
        markStepCompleted,
        showFeatureHighlight,
        dismissFeatureHighlight,
        hasCompletedStep
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

// Pre-defined onboarding steps for tracking
export const ONBOARDING_STEPS = {
  TUTORIAL_COMPLETED: 'tutorial_completed',
  FIRST_EXPENSE_ADDED: 'first_expense_added',
  CATEGORY_EXPLORED: 'category_explored',
  DASHBOARD_VISITED: 'dashboard_visited',
  ACHIEVEMENT_EARNED: 'achievement_earned',
  CHARACTER_SELECTED: 'character_selected',
  MINI_GAME_PLAYED: 'mini_game_played',
  BUDGET_SET: 'budget_set',
  WEEK_COMPLETED: 'week_completed'
};

// Feature highlights for guiding users to new features
export const FEATURE_HIGHLIGHTS = {
  ADD_EXPENSE_BUTTON: 'add_expense_button',
  GAMIFICATION_HUB: 'gamification_hub',
  ACHIEVEMENTS_PANEL: 'achievements_panel',
  CHARACTER_SELECTOR: 'character_selector',
  MINI_GAMES: 'mini_games',
  INSIGHTS_PANEL: 'insights_panel',
  MOOD_INDICATOR: 'mood_indicator',
  FLOATING_ACTION: 'floating_action'
};