import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { UserProgress } from '../types/user';
import { SystemName } from '../types/anatomy';
import { supabase } from '../lib/supabase';

interface ProgressContextType {
  progress: UserProgress | null;
  loading: boolean;
  isSystemUnlocked: (systemName: SystemName) => boolean;
  unlockSystem: (systemName: SystemName) => Promise<void>;
  recordPartViewed: (partId: string) => Promise<void>;
  updateQuizScore: (systemName: string, score: number) => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

interface ProgressProviderProps {
  children: ReactNode;
}

export function ProgressProvider({ children }: ProgressProviderProps) {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    initializeProgress();
  }, []);

  const initializeProgress = async () => {
    try {
      setLoading(true);

      const localProgress = localStorage.getItem('anatomy_progress');
      if (localProgress) {
        setProgress(JSON.parse(localProgress));
      } else {
        const newProgress: UserProgress = {
          id: sessionId,
          user_id: sessionId,
          unlocked_systems: ['Skeletal System'],
          quiz_scores: {},
          parts_viewed: [],
          last_active_layer: 'skeletal',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        setProgress(newProgress);
        localStorage.setItem('anatomy_progress', JSON.stringify(newProgress));

        try {
          await supabase.from('user_progress').insert([newProgress]);
        } catch (err) {
          console.warn('Could not sync progress to database:', err);
        }
      }
    } catch (err) {
      console.error('Error initializing progress:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveProgress = async (updatedProgress: UserProgress) => {
    setProgress(updatedProgress);
    localStorage.setItem('anatomy_progress', JSON.stringify(updatedProgress));

    try {
      await supabase
        .from('user_progress')
        .upsert([{ ...updatedProgress, updated_at: new Date().toISOString() }]);
    } catch (err) {
      console.warn('Could not sync progress to database:', err);
    }
  };

  const isSystemUnlocked = (systemName: SystemName): boolean => {
    if (!progress) return false;
    return progress.unlocked_systems.includes(systemName);
  };

  const unlockSystem = async (systemName: SystemName) => {
    if (!progress) return;

    if (!progress.unlocked_systems.includes(systemName)) {
      const updatedProgress = {
        ...progress,
        unlocked_systems: [...progress.unlocked_systems, systemName],
      };
      await saveProgress(updatedProgress);
    }
  };

  const recordPartViewed = async (partId: string) => {
    if (!progress) return;

    if (!progress.parts_viewed.includes(partId)) {
      const updatedProgress = {
        ...progress,
        parts_viewed: [...progress.parts_viewed, partId],
      };
      await saveProgress(updatedProgress);
    }
  };

  const updateQuizScore = async (systemName: string, score: number) => {
    if (!progress) return;

    const updatedProgress = {
      ...progress,
      quiz_scores: {
        ...progress.quiz_scores,
        [systemName]: score,
      },
    };
    await saveProgress(updatedProgress);
  };

  return (
    <ProgressContext.Provider
      value={{
        progress,
        loading,
        isSystemUnlocked,
        unlockSystem,
        recordPartViewed,
        updateQuizScore,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
