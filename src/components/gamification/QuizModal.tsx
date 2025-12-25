import { useState, useEffect } from 'react';
import { X, Trophy, CheckCircle, XCircle } from 'lucide-react';
import { QuizQuestion, QuizAnswer } from '../../types/quiz';
import { SystemName } from '../../types/anatomy';
import { useProgress } from '../../contexts/ProgressContext';
import { QUIZ_PASSING_SCORE } from '../../utils/constants';

interface QuizModalProps {
  isOpen: boolean;
  systemName: SystemName;
  questions: QuizQuestion[];
  onClose: () => void;
  onComplete: (passed: boolean, score: number) => void;
}

export function QuizModal({ isOpen, systemName, questions, onClose, onComplete }: QuizModalProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const { updateQuizScore } = useProgress();

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  useEffect(() => {
    if (quizComplete) {
      const score = answers.filter((a) => a.is_correct).length / answers.length;
      const passed = score >= QUIZ_PASSING_SCORE;
      updateQuizScore(systemName, score);
      onComplete(passed, score);
    }
  }, [quizComplete, answers, systemName, updateQuizScore, onComplete]);

  if (!isOpen) return null;

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswer(answerId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    const isCorrect = selectedAnswer === currentQuestion.correct_answer_id;
    const answer: QuizAnswer = {
      question_id: currentQuestion.id,
      selected_answer_id: selectedAnswer,
      is_correct: isCorrect,
      time_taken_seconds: 0,
    };

    setAnswers([...answers, answer]);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizComplete(true);
    }
  };

  const calculateScore = () => {
    return answers.filter((a) => a.is_correct).length / answers.length;
  };

  if (quizComplete) {
    const score = calculateScore();
    const passed = score >= QUIZ_PASSING_SCORE;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
          <div
            className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
              passed ? 'bg-green-100' : 'bg-red-100'
            }`}
          >
            {passed ? (
              <Trophy className="w-10 h-10 text-green-600" />
            ) : (
              <XCircle className="w-10 h-10 text-red-600" />
            )}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {passed ? 'Congratulations!' : 'Keep Learning!'}
          </h2>
          <p className="text-gray-600 mb-6">
            You scored {Math.round(score * 100)}% on the {systemName} quiz.
          </p>

          {passed ? (
            <p className="text-green-700 mb-6">
              You've unlocked the next layer! Continue exploring the human machine.
            </p>
          ) : (
            <p className="text-red-700 mb-6">
              You need {Math.round(QUIZ_PASSING_SCORE * 100)}% to pass. Review the material and try
              again!
            </p>
          )}

          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {passed ? 'Continue Exploring' : 'Review Material'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {systemName} Quiz
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            {currentQuestion.question_text}
          </h3>

          <div className="space-y-3">
            {currentQuestion.options?.map((option) => (
              <button
                key={option.id}
                onClick={() => handleAnswerSelect(option.id)}
                disabled={showExplanation}
                className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                  selectedAnswer === option.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${showExplanation ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span className="text-gray-900">{option.text}</span>
              </button>
            ))}
          </div>
        </div>

        {showExplanation && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              selectedAnswer === currentQuestion.correct_answer_id
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            <div className="flex items-start space-x-3">
              {selectedAnswer === currentQuestion.correct_answer_id ? (
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              )}
              <div>
                <h4
                  className={`font-semibold mb-1 ${
                    selectedAnswer === currentQuestion.correct_answer_id
                      ? 'text-green-900'
                      : 'text-red-900'
                  }`}
                >
                  {selectedAnswer === currentQuestion.correct_answer_id ? 'Correct!' : 'Incorrect'}
                </h4>
                <p
                  className={`text-sm ${
                    selectedAnswer === currentQuestion.correct_answer_id
                      ? 'text-green-800'
                      : 'text-red-800'
                  }`}
                >
                  {currentQuestion.explanation}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          {!showExplanation ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
