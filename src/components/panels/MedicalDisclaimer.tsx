import { AlertCircle } from 'lucide-react';
import { MEDICAL_DISCLAIMER } from '../../utils/constants';

export function MedicalDisclaimer() {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 max-w-3xl z-30">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 shadow-lg">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-amber-900 mb-1">Medical Disclaimer</h3>
            <p className="text-xs text-amber-800 leading-relaxed">{MEDICAL_DISCLAIMER}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
