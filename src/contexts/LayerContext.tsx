import { createContext, useContext, useState, ReactNode } from 'react';
import { LayerVisibility, LayerType } from '../types/anatomy';
import { LAYER_ORDER } from '../utils/constants';

interface LayerContextType {
  currentLayer: LayerType;
  setCurrentLayer: (layer: LayerType) => void;
  layerVisibility: LayerVisibility;
  sliderValue: number;
  setSliderValue: (value: number) => void;
  isLayerVisible: (layer: LayerType) => boolean;
}

const LayerContext = createContext<LayerContextType | undefined>(undefined);

interface LayerProviderProps {
  children: ReactNode;
}

export function LayerProvider({ children }: LayerProviderProps) {
  const [currentLayer, setCurrentLayer] = useState<LayerType>('skeletal');
  const [sliderValue, setSliderValue] = useState<number>(0);

  const calculateLayerVisibility = (sliderVal: number): LayerVisibility => {
    const visibility: LayerVisibility = {
      skeletal: 1,
      nervous: 0,
      muscular: 0,
      skin: 0,
    };

    if (sliderVal <= 33) {
      visibility.skeletal = 1;
      visibility.nervous = sliderVal / 33;
    } else if (sliderVal <= 66) {
      const progress = (sliderVal - 33) / 33;
      visibility.skeletal = 1 - progress * 0.3;
      visibility.nervous = 1;
      visibility.muscular = progress;
    } else {
      const progress = (sliderVal - 66) / 34;
      visibility.skeletal = 0.7 - progress * 0.7;
      visibility.nervous = 1 - progress * 0.5;
      visibility.muscular = 1;
      visibility.skin = progress;
    }

    return visibility;
  };

  const layerVisibility = calculateLayerVisibility(sliderValue);

  const isLayerVisible = (layer: LayerType): boolean => {
    return layerVisibility[layer] > 0.1;
  };

  const handleSetCurrentLayer = (layer: LayerType) => {
    setCurrentLayer(layer);
    const layerIndex = LAYER_ORDER.indexOf(layer);
    const newSliderValue = (layerIndex / (LAYER_ORDER.length - 1)) * 100;
    setSliderValue(newSliderValue);
  };

  return (
    <LayerContext.Provider
      value={{
        currentLayer,
        setCurrentLayer: handleSetCurrentLayer,
        layerVisibility,
        sliderValue,
        setSliderValue,
        isLayerVisible,
      }}
    >
      {children}
    </LayerContext.Provider>
  );
}

export function useLayer() {
  const context = useContext(LayerContext);
  if (context === undefined) {
    throw new Error('useLayer must be used within a LayerProvider');
  }
  return context;
}
