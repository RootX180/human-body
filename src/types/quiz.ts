export type QuestionType = 'click_to_identify' | 'multiple_choice' | 'connection_match';

export interface QuizQuestion {
  id: string;
  system_name: string;
  question_type: QuestionType;
  question_text: string;
  correct_answer_id: string;
  options?: {
    id: string;
    text: string;
    svg_path_id?: string;
  }[];
  difficulty: 1 | 2 | 3;
  explanation: string;
}

export interface QuizAnswer {
  question_id: string;
  selected_answer_id: string;
  is_correct: boolean;
  time_taken_seconds: number;
}

export interface QuizSession {
  system_name: string;
  questions: QuizQuestion[];
  answers: QuizAnswer[];
  start_time: Date;
  end_time?: Date;
  score: number;
  passing_score: number;
  status: 'in_progress' | 'passed' | 'failed';
}

export interface QuizResult {
  session_id: string;
  system_name: string;
  score: number;
  total_questions: number;
  passed: boolean;
  completed_at: Date;
}
