import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

interface SourcesToggleProps {
  sources: string[];
  isOpen: boolean;
  onToggle: () => void;
}

export function SourcesToggle({ sources, isOpen, onToggle }: SourcesToggleProps) {
  if (!sources || sources.length === 0) {
    return null;
  }

  return (
    <div className="border-t pt-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
      >
        <span>References & Sources</span>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {isOpen && (
        <div className="mt-3 space-y-2">
          {sources.map((source, index) => (
            <div key={index} className="flex items-start space-x-2">
              <ExternalLink className="w-3 h-3 text-gray-400 mt-1 flex-shrink-0" />
              <a
                href={source}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800 underline break-words"
              >
                {source}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
