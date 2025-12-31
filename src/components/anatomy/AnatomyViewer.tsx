import { useEffect, useState } from 'react';
import { InteractiveSVG } from './InteractiveSVG';
import { LayerSlider } from './LayerSlider';
import { DetailPanel } from '../panels/DetailPanel';
import { MedicalDisclaimer } from '../panels/MedicalDisclaimer';
import { useAnatomy } from '../../contexts/AnatomyContext';

const SVG_SKELETAL = `
<svg viewBox="0 0 800 1200" xmlns="http://www.w3.org/2000/svg">
  <g data-part-id="bone_humerus_left">
    <rect x="250" y="200" width="30" height="150" rx="15" fill="#E8E8E8" stroke="#999" stroke-width="2"/>
    <text x="185" y="275" font-size="12" fill="#666">Humerus</text>
  </g>
  <g data-part-id="bone_femur_left">
    <rect x="330" y="600" width="35" height="250" rx="15" fill="#E8E8E8" stroke="#999" stroke-width="2"/>
    <text x="260" y="750" font-size="12" fill="#666">Femur</text>
  </g>
  <rect x="385" y="180" width="30" height="400" rx="5" fill="#E8E8E8" stroke="#999" stroke-width="2"/>
  <text x="420" y="380" font-size="10" fill="#666">Spine</text>
</svg>
`;

const SVG_MUSCULAR = `
<svg viewBox="0 0 800 1200" xmlns="http://www.w3.org/2000/svg">
  <g data-part-id="muscle_biceps_left">
    <ellipse cx="265" cy="260" rx="25" ry="60" fill="#D32F2F" stroke="#B71C1C" stroke-width="2" opacity="0.9"/>
    <text x="210" y="265" font-size="12" fill="#8B0000">Biceps</text>
  </g>
  <g data-part-id="muscle_quadriceps_left">
    <ellipse cx="347" cy="700" rx="30" ry="100" fill="#D32F2F" stroke="#B71C1C" stroke-width="2" opacity="0.9"/>
    <text x="290" y="705" font-size="12" fill="#8B0000">Quads</text>
  </g>
</svg>
`;

const SVG_NERVOUS = `
<svg viewBox="0 0 800 1200" xmlns="http://www.w3.org/2000/svg">
  <g data-part-id="nerve_musculocutaneous">
    <path d="M 400 250 Q 350 270 280 300" stroke="#FFB300" stroke-width="4" fill="none" opacity="0.8"/>
    <text x="305" y="250" font-size="10" fill="#FFA500">Musculocutaneous</text>
  </g>
  <g data-part-id="nerve_femoral_left">
    <line x1="380" y1="600" x2="347" y2="800" stroke="#FFB300" stroke-width="4" opacity="0.8"/>
    <text x="345" y="690" font-size="10" fill="#FFA500">Femoral</text>
  </g>
  <line x1="400" y1="100" x2="400" y2="600" stroke="#FFB300" stroke-width="8" opacity="0.6"/>
</svg>
`;

const SVG_SKIN = `
<svg viewBox="0 0 800 1200" xmlns="http://www.w3.org/2000/svg">
  <path d="M 320 50 Q 400 30 480 50 L 550 200 Q 580 400 550 600 L 470 850 L 450 1150 L 350 1150 L 330 850 L 250 600 Q 220 400 250 200 Z"
        fill="#FFDBAC" stroke="#E0A96D" stroke-width="2" opacity="0.95"/>
</svg>
`;

export function AnatomyViewer() {
  const { loading } = useAnatomy();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || loading) {
    return (
      <div className="relative w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading anatomy data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
          <InteractiveSVG svgContent={SVG_SKELETAL} layer="skeletal" />
          <InteractiveSVG svgContent={SVG_NERVOUS} layer="nervous" />
          <InteractiveSVG svgContent={SVG_MUSCULAR} layer="muscular" />
          <InteractiveSVG svgContent={SVG_SKIN} layer="skin" />
        </div>
      </div>

      <LayerSlider />
      <DetailPanel />
      <MedicalDisclaimer />
    </div>
  );
}
