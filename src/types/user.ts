import { SystemName } from './anatomy';

export interface UserProgress {
  id: string;
  user_id: string;
  unlocked_systems: SystemName[];
  quiz_scores: Record<string, number>;
  parts_viewed: string[];
  last_active_layer: string;
  created_at: string;
  updated_at: string;
}

export interface UnlockEvent {
  system_name: SystemName;
  unlocked_at: Date;
  unlock_method: 'quiz_completion' | 'default';
}

export interface ExplorationStats {
  total_parts_viewed: number;
  skeletal_parts_viewed: number;
  muscular_parts_viewed: number;
  nervous_parts_viewed: number;
  total_time_spent_minutes: number;
}
