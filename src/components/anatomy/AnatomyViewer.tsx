import { InteractiveSVG } from './InteractiveSVG';
import { LayerSlider } from './LayerSlider';
import { DetailPanel } from '../panels/DetailPanel';
import { MedicalDisclaimer } from '../panels/MedicalDisclaimer';

const PLACEHOLDER_SVG_SKELETAL = `
<svg viewBox="0 0 800 1200" xmlns="http://www.w3.org/2000/svg">
  <g data-part-id="bone_skull">
    <ellipse cx="400" cy="100" rx="80" ry="100" fill="#E8E8E8" stroke="#999" stroke-width="2"/>
  </g>
  <g data-part-id="bone_humerus_left">
    <rect x="250" y="200" width="30" height="150" rx="15" fill="#E8E8E8" stroke="#999" stroke-width="2"/>
  </g>
  <g data-part-id="bone_humerus_right">
    <rect x="520" y="200" width="30" height="150" rx="15" fill="#E8E8E8" stroke="#999" stroke-width="2"/>
  </g>
  <g data-part-id="bone_spine">
    <rect x="385" y="180" width="30" height="400" rx="5" fill="#E8E8E8" stroke="#999" stroke-width="2"/>
  </g>
  <g data-part-id="bone_femur_left">
    <rect x="330" y="600" width="35" height="250" rx="15" fill="#E8E8E8" stroke="#999" stroke-width="2"/>
  </g>
  <g data-part-id="bone_femur_right">
    <rect x="435" y="600" width="35" height="250" rx="15" fill="#E8E8E8" stroke="#999" stroke-width="2"/>
  </g>
</svg>
`;

const PLACEHOLDER_SVG_MUSCULAR = `
<svg viewBox="0 0 800 1200" xmlns="http://www.w3.org/2000/svg">
  <g data-part-id="muscle_biceps_left">
    <ellipse cx="265" cy="260" rx="25" ry="60" fill="#D32F2F" stroke="#B71C1C" stroke-width="2" opacity="0.9"/>
  </g>
  <g data-part-id="muscle_biceps_right">
    <ellipse cx="535" cy="260" rx="25" ry="60" fill="#D32F2F" stroke="#B71C1C" stroke-width="2" opacity="0.9"/>
  </g>
  <g data-part-id="muscle_pectoralis">
    <ellipse cx="400" cy="240" rx="90" ry="50" fill="#D32F2F" stroke="#B71C1C" stroke-width="2" opacity="0.9"/>
  </g>
  <g data-part-id="muscle_quadriceps_left">
    <ellipse cx="347" cy="700" rx="30" ry="100" fill="#D32F2F" stroke="#B71C1C" stroke-width="2" opacity="0.9"/>
  </g>
  <g data-part-id="muscle_quadriceps_right">
    <ellipse cx="453" cy="700" rx="30" ry="100" fill="#D32F2F" stroke="#B71C1C" stroke-width="2" opacity="0.9"/>
  </g>
</svg>
`;

const PLACEHOLDER_SVG_NERVOUS = `
<svg viewBox="0 0 800 1200" xmlns="http://www.w3.org/2000/svg">
  <g data-part-id="nerve_spinal_cord">
    <line x1="400" y1="100" x2="400" y2="600" stroke="#FFB300" stroke-width="8" opacity="0.8"/>
  </g>
  <g data-part-id="nerve_brachial_plexus_left">
    <path d="M 400 250 Q 350 270 280 300" stroke="#FFB300" stroke-width="4" fill="none" opacity="0.8"/>
  </g>
  <g data-part-id="nerve_brachial_plexus_right">
    <path d="M 400 250 Q 450 270 520 300" stroke="#FFB300" stroke-width="4" fill="none" opacity="0.8"/>
  </g>
  <g data-part-id="nerve_femoral_left">
    <line x1="380" y1="600" x2="347" y2="800" stroke="#FFB300" stroke-width="4" opacity="0.8"/>
  </g>
  <g data-part-id="nerve_femoral_right">
    <line x1="420" y1="600" x2="453" y2="800" stroke="#FFB300" stroke-width="4" opacity="0.8"/>
  </g>
</svg>
`;

const PLACEHOLDER_SVG_SKIN = `
<svg viewBox="0 0 800 1200" xmlns="http://www.w3.org/2000/svg">
  <path d="M 320 50 Q 400 30 480 50 L 550 200 Q 580 400 550 600 L 470 850 L 450 1150 L 350 1150 L 330 850 L 250 600 Q 220 400 250 200 Z"
        fill="#FFDBAC" stroke="#E0A96D" stroke-width="2" opacity="0.95"/>
</svg>
`;

export function AnatomyViewer() {
  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
          <InteractiveSVG svgContent={PLACEHOLDER_SVG_SKELETAL} layer="skeletal" />
          <InteractiveSVG svgContent={PLACEHOLDER_SVG_NERVOUS} layer="nervous" />
          <InteractiveSVG svgContent={PLACEHOLDER_SVG_MUSCULAR} layer="muscular" />
          <InteractiveSVG svgContent={PLACEHOLDER_SVG_SKIN} layer="skin" />
        </div>
      </div>

      <LayerSlider />
      <DetailPanel />
      <MedicalDisclaimer />
    </div>
  );
}
