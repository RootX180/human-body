import { X, BookOpen, Zap, Link2 } from 'lucide-react';
import { useAnatomy } from '../../contexts/AnatomyContext';
import { Bone, Muscle, Nerve } from '../../types/anatomy';
import { SourcesToggle } from './SourcesToggle';
import { useState } from 'react';

export function DetailPanel() {
  const { interactionState, setSelectedPart, getPartById, anatomyData } = useAnatomy();
  const [showSources, setShowSources] = useState(false);

  if (!interactionState.showDetailPanel || !interactionState.selectedPartId) {
    return null;
  }

  const part = getPartById(interactionState.selectedPartId);
  if (!part) return null;

  const handleClose = () => {
    setSelectedPart(null);
  };

  const renderBoneDetails = (bone: Bone) => (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
          <Link2 className="w-4 h-4 mr-2" />
          Articulates With
        </h4>
        <div className="flex flex-wrap gap-2">
          {bone.articulates_with.map((boneId) => {
            const connectedBone = anatomyData?.bones.find((b) => b.id === boneId);
            return (
              <span
                key={boneId}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
              >
                {connectedBone?.common_name || 'Unknown'}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderMuscleDetails = (muscle: Muscle) => {
    const originBone = anatomyData?.bones.find((b) => b.id === muscle.origin_bone_id);
    const insertionBone = anatomyData?.bones.find((b) => b.id === muscle.insertion_bone_id);
    const nerve = anatomyData?.nerves.find((n) => n.id === muscle.nerve_supply_id);

    return (
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Action</h4>
          <p className="text-sm text-gray-600">{muscle.action}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Origin</h4>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            {originBone?.common_name || 'Unknown'}
          </span>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Insertion</h4>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
            {insertionBone?.common_name || 'Unknown'}
          </span>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
            <Zap className="w-4 h-4 mr-2" />
            Nerve Supply
          </h4>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
            {nerve?.name || 'Unknown'}
          </span>
        </div>
      </div>
    );
  };

  const renderNerveDetails = (nerve: Nerve) => {
    const innervatedMuscles = anatomyData?.muscles.filter((m) =>
      nerve.innervates.includes(m.id)
    );

    return (
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Origin</h4>
          <p className="text-sm text-gray-600">{nerve.origin_point}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Innervates</h4>
          <div className="flex flex-wrap gap-2">
            {innervatedMuscles?.map((muscle) => (
              <span
                key={muscle.id}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium"
              >
                {muscle.common_name}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-40 overflow-y-auto animate-slide-in-right">
      <div className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{part.common_name}</h2>
            <p className="text-sm text-gray-500 italic">{part.name}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{part.description}</p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <h3 className="text-sm font-semibold text-blue-900 mb-2 flex items-center">
              <BookOpen className="w-4 h-4 mr-2" />
              The Mechanic's View
            </h3>
            <p className="text-sm text-blue-800 leading-relaxed">
              {part.biomechanical_function}
            </p>
          </div>

          {'articulates_with' in part && renderBoneDetails(part as Bone)}
          {'origin_bone_id' in part && renderMuscleDetails(part as Muscle)}
          {'innervates' in part && renderNerveDetails(part as Nerve)}

          {part.fun_fact && (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-sm font-semibold text-yellow-900 mb-2">Fun Fact</h3>
              <p className="text-sm text-yellow-800">{part.fun_fact}</p>
            </div>
          )}

          <SourcesToggle
            sources={part.reference_sources}
            isOpen={showSources}
            onToggle={() => setShowSources(!showSources)}
          />
        </div>
      </div>
    </div>
  );
}
