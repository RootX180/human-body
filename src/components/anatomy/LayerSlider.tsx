import { useLayer } from '../../contexts/LayerContext';
import { Layers } from 'lucide-react';

export function LayerSlider() {
  const { sliderValue, setSliderValue } = useLayer();

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setSliderValue(value);
  };

  const getLayerLabel = (value: number): string => {
    if (value <= 25) return 'Skeletal System';
    if (value <= 50) return 'Nervous System';
    if (value <= 75) return 'Muscular System';
    return 'Skin Surface';
  };

  const currentLabel = getLayerLabel(sliderValue);

  return (
    <div className="fixed left-8 top-1/2 -translate-y-1/2 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-20 flex flex-col items-center space-y-6">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
          <Layers className="w-6 h-6 text-blue-600" />
        </div>

        <div className="relative h-80 flex items-center">
          <input
            type="range"
            min="0"
            max="100"
            value={sliderValue}
            onChange={handleSliderChange}
            className="slider-vertical w-2 h-80 appearance-none bg-gray-200 rounded-full outline-none"
            style={{
              writingMode: 'bt-lr' as any,
              WebkitAppearance: 'slider-vertical',
            }}
          />
        </div>

        <div className="text-center">
          <p className="text-xs font-semibold text-gray-700 mb-1">Layer</p>
          <p className="text-[10px] text-gray-500 leading-tight w-16 break-words">
            {currentLabel}
          </p>
        </div>

        <div className="flex flex-col space-y-2">
          <LayerMarker label="Skin" position={100} active={sliderValue >= 75} />
          <LayerMarker label="Muscle" position={66} active={sliderValue >= 50} />
          <LayerMarker label="Nerve" position={33} active={sliderValue >= 25} />
          <LayerMarker label="Bone" position={0} active={true} />
        </div>
      </div>
    </div>
  );
}

interface LayerMarkerProps {
  label: string;
  position: number;
  active: boolean;
}

function LayerMarker({ label, active }: LayerMarkerProps) {
  return (
    <div className="flex items-center space-x-1">
      <div
        className={`w-3 h-3 rounded-full transition-colors ${
          active ? 'bg-blue-500' : 'bg-gray-300'
        }`}
      />
      <span className={`text-[9px] ${active ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
        {label}
      </span>
    </div>
  );
}
