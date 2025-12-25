import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AnatomyData, AnatomyPart, InteractionState, Connection, Bone, Muscle, Nerve } from '../types/anatomy';
import { supabase } from '../lib/supabase';

interface AnatomyContextType {
  anatomyData: AnatomyData | null;
  loading: boolean;
  error: string | null;
  interactionState: InteractionState;
  setHoveredPart: (partId: string | null) => void;
  setSelectedPart: (partId: string | null) => void;
  getPartById: (partId: string) => AnatomyPart | null;
  getConnectionsForPart: (partId: string) => Connection[];
}

const AnatomyContext = createContext<AnatomyContextType | undefined>(undefined);

interface AnatomyProviderProps {
  children: ReactNode;
}

export function AnatomyProvider({ children }: AnatomyProviderProps) {
  const [anatomyData, setAnatomyData] = useState<AnatomyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [interactionState, setInteractionState] = useState<InteractionState>({
    hoveredPartId: null,
    selectedPartId: null,
    highlightedConnections: [],
    showDetailPanel: false,
  });

  useEffect(() => {
    fetchAnatomyData();
  }, []);

  const fetchAnatomyData = async () => {
    try {
      setLoading(true);

      const [bonesResult, musclesResult, nervesResult, systemsResult] = await Promise.all([
        supabase.from('bones').select('*'),
        supabase.from('muscles').select('*'),
        supabase.from('nerves').select('*'),
        supabase.from('systems').select('*'),
      ]);

      if (bonesResult.error) throw bonesResult.error;
      if (musclesResult.error) throw musclesResult.error;
      if (nervesResult.error) throw nervesResult.error;
      if (systemsResult.error) throw systemsResult.error;

      setAnatomyData({
        bones: bonesResult.data || [],
        muscles: musclesResult.data || [],
        nerves: nervesResult.data || [],
        systems: systemsResult.data || [],
      });

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch anatomy data');
      console.error('Error fetching anatomy data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPartById = (partId: string): AnatomyPart | null => {
    if (!anatomyData) return null;

    const bone = anatomyData.bones.find((b) => b.id === partId || b.svg_path_id === partId);
    if (bone) return bone;

    const muscle = anatomyData.muscles.find((m) => m.id === partId || m.svg_path_id === partId);
    if (muscle) return muscle;

    const nerve = anatomyData.nerves.find((n) => n.id === partId || n.svg_path_id === partId);
    if (nerve) return nerve;

    return null;
  };

  const getConnectionsForPart = (partId: string): Connection[] => {
    if (!anatomyData) return [];

    const connections: Connection[] = [];
    const part = getPartById(partId);
    if (!part) return [];

    if ('articulates_with' in part) {
      (part as Bone).articulates_with.forEach((boneId) => {
        connections.push({
          id: `${part.id}-${boneId}`,
          from_type: 'bone',
          from_id: part.id,
          to_type: 'bone',
          to_id: boneId,
          relationship_type: 'articulation',
          description: 'Articulates with',
        });
      });
    }

    if ('origin_bone_id' in part) {
      const muscle = part as Muscle;
      connections.push({
        id: `${muscle.id}-origin`,
        from_type: 'muscle',
        from_id: muscle.id,
        to_type: 'bone',
        to_id: muscle.origin_bone_id,
        relationship_type: 'origin',
        description: 'Origin point',
      });
      connections.push({
        id: `${muscle.id}-insertion`,
        from_type: 'muscle',
        from_id: muscle.id,
        to_type: 'bone',
        to_id: muscle.insertion_bone_id,
        relationship_type: 'insertion',
        description: 'Insertion point',
      });
      connections.push({
        id: `${muscle.id}-nerve`,
        from_type: 'muscle',
        from_id: muscle.id,
        to_type: 'nerve',
        to_id: muscle.nerve_supply_id,
        relationship_type: 'innervation',
        description: 'Innervated by',
      });
    }

    if ('innervates' in part) {
      const nerve = part as Nerve;
      nerve.innervates.forEach((muscleId) => {
        connections.push({
          id: `${nerve.id}-${muscleId}`,
          from_type: 'nerve',
          from_id: nerve.id,
          to_type: 'muscle',
          to_id: muscleId,
          relationship_type: 'innervation',
          description: 'Innervates',
        });
      });
    }

    return connections;
  };

  const setHoveredPart = (partId: string | null) => {
    const connections = partId ? getConnectionsForPart(partId) : [];
    setInteractionState((prev) => ({
      ...prev,
      hoveredPartId: partId,
      highlightedConnections: connections,
    }));
  };

  const setSelectedPart = (partId: string | null) => {
    setInteractionState((prev) => ({
      ...prev,
      selectedPartId: partId,
      showDetailPanel: partId !== null,
    }));
  };

  return (
    <AnatomyContext.Provider
      value={{
        anatomyData,
        loading,
        error,
        interactionState,
        setHoveredPart,
        setSelectedPart,
        getPartById,
        getConnectionsForPart,
      }}
    >
      {children}
    </AnatomyContext.Provider>
  );
}

export function useAnatomy() {
  const context = useContext(AnatomyContext);
  if (context === undefined) {
    throw new Error('useAnatomy must be used within an AnatomyProvider');
  }
  return context;
}
