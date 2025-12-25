import { useEffect, useRef } from 'react';
import { useLayer } from '../../contexts/LayerContext';
import { useAnatomy } from '../../contexts/AnatomyContext';
import { useProgress } from '../../contexts/ProgressContext';
import { HOVER_HIGHLIGHT_COLOR, CONNECTION_HIGHLIGHT_COLOR } from '../../utils/constants';

interface InteractiveSVGProps {
  svgContent: string;
  layer: 'skeletal' | 'muscular' | 'nervous' | 'skin';
}

export function InteractiveSVG({ svgContent, layer }: InteractiveSVGProps) {
  const svgRef = useRef<HTMLDivElement>(null);
  const { layerVisibility } = useLayer();
  const { setHoveredPart, setSelectedPart, interactionState } = useAnatomy();
  const { recordPartViewed } = useProgress();

  const opacity = layerVisibility[layer];

  useEffect(() => {
    if (!svgRef.current) return;

    const svgElement = svgRef.current.querySelector('svg');
    if (!svgElement) return;

    const interactiveParts = svgElement.querySelectorAll('[data-part-id]');

    const handleMouseEnter = (e: Event) => {
      const target = e.currentTarget as SVGElement;
      const partId = target.getAttribute('data-part-id');
      if (partId) {
        setHoveredPart(partId);
        target.style.fill = HOVER_HIGHLIGHT_COLOR;
        target.style.cursor = 'pointer';
        target.style.filter = 'drop-shadow(0 0 8px rgba(76, 175, 80, 0.6))';
      }
    };

    const handleMouseLeave = (e: Event) => {
      const target = e.currentTarget as SVGElement;
      const partId = target.getAttribute('data-part-id');
      if (partId) {
        setHoveredPart(null);
        target.style.fill = '';
        target.style.filter = '';
      }
    };

    const handleClick = (e: Event) => {
      const target = e.currentTarget as SVGElement;
      const partId = target.getAttribute('data-part-id');
      if (partId) {
        setSelectedPart(partId);
        recordPartViewed(partId);
      }
    };

    interactiveParts.forEach((part) => {
      part.addEventListener('mouseenter', handleMouseEnter);
      part.addEventListener('mouseleave', handleMouseLeave);
      part.addEventListener('click', handleClick);
    });

    return () => {
      interactiveParts.forEach((part) => {
        part.removeEventListener('mouseenter', handleMouseEnter);
        part.removeEventListener('mouseleave', handleMouseLeave);
        part.removeEventListener('click', handleClick);
      });
    };
  }, [svgContent, setHoveredPart, setSelectedPart, recordPartViewed]);

  useEffect(() => {
    if (!svgRef.current || !interactionState.hoveredPartId) return;

    const svgElement = svgRef.current.querySelector('svg');
    if (!svgElement) return;

    const connections = interactionState.highlightedConnections;

    connections.forEach((connection) => {
      const connectedPart = svgElement.querySelector(`[data-part-id="${connection.to_id}"]`);
      if (connectedPart) {
        (connectedPart as SVGElement).style.fill = CONNECTION_HIGHLIGHT_COLOR;
        (connectedPart as SVGElement).style.fillOpacity = '0.6';
      }
    });

    return () => {
      connections.forEach((connection) => {
        const connectedPart = svgElement.querySelector(`[data-part-id="${connection.to_id}"]`);
        if (connectedPart) {
          (connectedPart as SVGElement).style.fill = '';
          (connectedPart as SVGElement).style.fillOpacity = '';
        }
      });
    };
  }, [interactionState.hoveredPartId, interactionState.highlightedConnections]);

  return (
    <div
      ref={svgRef}
      className="absolute inset-0 transition-opacity duration-300"
      style={{
        opacity,
        pointerEvents: opacity > 0.1 ? 'auto' : 'none',
      }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}
