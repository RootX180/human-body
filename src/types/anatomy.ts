export type LayerType = 'skin' | 'muscular' | 'skeletal' | 'nervous';

export type SystemName = 'Skeletal System' | 'Muscular System' | 'Nervous System' | 'Integumentary System';

export interface PositionData {
  x: number;
  y: number;
  labelOffset?: {
    x: number;
    y: number;
  };
}

export interface Bone {
  id: string;
  name: string;
  common_name: string;
  description: string;
  biomechanical_function: string;
  svg_path_id: string;
  articulates_with: string[];
  position_data: PositionData;
  fun_fact?: string;
  reference_sources: string[];
  created_at: string;
}

export interface Muscle {
  id: string;
  name: string;
  common_name: string;
  description: string;
  biomechanical_function: string;
  svg_path_id: string;
  origin_bone_id: string;
  insertion_bone_id: string;
  nerve_supply_id: string;
  muscle_group: string;
  action: string;
  position_data: PositionData;
  fun_fact?: string;
  reference_sources: string[];
  created_at: string;
}

export interface Nerve {
  id: string;
  name: string;
  common_name?: string;
  description: string;
  biomechanical_function: string;
  svg_path_id: string;
  origin_point: string;
  innervates: string[];
  position_data: PositionData;
  fun_fact?: string;
  reference_sources: string[];
  created_at: string;
}

export interface AnatomySystem {
  id: string;
  name: SystemName;
  layer_order: number;
  unlock_requirement: string | null;
  color_theme: string;
  description: string;
}

export interface Connection {
  id: string;
  from_type: 'bone' | 'muscle' | 'nerve';
  from_id: string;
  to_type: 'bone' | 'muscle' | 'nerve';
  to_id: string;
  relationship_type: 'origin' | 'insertion' | 'articulation' | 'innervation';
  description: string;
}

export interface LayerVisibility {
  skeletal: number;
  muscular: number;
  nervous: number;
  skin: number;
}

export interface InteractionState {
  hoveredPartId: string | null;
  selectedPartId: string | null;
  highlightedConnections: Connection[];
  showDetailPanel: boolean;
}

export type AnatomyPart = Bone | Muscle | Nerve;

export interface AnatomyData {
  bones: Bone[];
  muscles: Muscle[];
  nerves: Nerve[];
  systems: AnatomySystem[];
}
