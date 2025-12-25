import { LayerType, SystemName } from '../types/anatomy';

export const LAYER_ORDER: LayerType[] = ['skeletal', 'nervous', 'muscular', 'skin'];

export const SYSTEM_COLORS: Record<SystemName, string> = {
  'Skeletal System': '#E8E8E8',
  'Muscular System': '#D32F2F',
  'Nervous System': '#FFB300',
  'Integumentary System': '#FFDBAC',
};

export const SYSTEM_UNLOCK_REQUIREMENTS: Record<SystemName, string | null> = {
  'Skeletal System': null,
  'Muscular System': 'skeletal_quiz_passed',
  'Nervous System': 'muscular_quiz_passed',
  'Integumentary System': 'nervous_quiz_passed',
};

export const QUIZ_PASSING_SCORE = 0.7;

export const LAYER_Z_INDEX: Record<LayerType, number> = {
  skeletal: 1,
  nervous: 2,
  muscular: 3,
  skin: 4,
};

export const MEDICAL_DISCLAIMER = `
This interactive anatomy tool is designed for educational purposes only and should not be used
as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice
of your physician or other qualified health provider with any questions you may have regarding
a medical condition. Never disregard professional medical advice or delay in seeking it because
of information you have learned from this website.
`;

export const HOVER_HIGHLIGHT_COLOR = '#4CAF50';
export const CONNECTION_HIGHLIGHT_COLOR = '#2196F3';
export const SELECTED_HIGHLIGHT_COLOR = '#FF5722';

export const TRANSITION_DURATION = 300;
