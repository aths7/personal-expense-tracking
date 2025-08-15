'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { WelcomeTutorial } from './welcome-tutorial';
import { QuickStartGuide } from './quick-start-guide';
import { FeatureHighlights } from './feature-highlight';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useAuth } from '@/hooks/useAuth';

export function OnboardingManager() {
  const { user, loading: authLoading } = useAuth();
  const { 
    showTutorial, 
    isFirstTime, 
    completeTutorial, 
    skipTutorial, 
    currentFeature 
  } = useOnboarding();
  
  const [showQuickStart, setShowQuickStart] = useState(false);

  // Disable quick start guide for now
  // useEffect(() => {
  //   if (!showTutorial && !isFirstTime && user) {
  //     const hasSeenQuickStart = localStorage.getItem('hasSeenQuickStart');
  //     if (!hasSeenQuickStart) {
  //       setShowQuickStart(true);
  //     }
  //   }
  // }, [showTutorial, isFirstTime, user]);

  const handleTutorialComplete = () => {
    completeTutorial();
    // setShowQuickStart(true);
    localStorage.setItem('hasSeenQuickStart', 'true');
  };

  const handleTutorialSkip = () => {
    skipTutorial();
    // setShowQuickStart(true);
    localStorage.setItem('hasSeenQuickStart', 'true');
  };

  const handleQuickStartClose = () => {
    setShowQuickStart(false);
    localStorage.setItem('hasSeenQuickStart', 'true');
  };

  // Don't render anything if auth is loading or no user
  if (authLoading || !user) {
    return null;
  }

  return (
    <>
      {/* Welcome Tutorial temporarily disabled */}
      {/* <AnimatePresence>
        {showTutorial && (
          <WelcomeTutorial 
            onComplete={handleTutorialComplete}
            onSkip={handleTutorialSkip}
          />
        )}
      </AnimatePresence> */}

      {/* Quick Start Guide temporarily disabled */}
      {/* <AnimatePresence>
        {showQuickStart && !showTutorial && (
          <QuickStartGuide 
            onClose={handleQuickStartClose}
          />
        )}
      </AnimatePresence> */}

      {/* Feature highlights (always available) */}
      <FeatureHighlights />
    </>
  );
}