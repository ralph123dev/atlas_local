
import React from 'react';

interface Props {
  showSkip?: boolean;
  onSkip: () => void;
}

export const OnboardingHeader: React.FC<Props> = ({ showSkip, onSkip }) => {
  return (
    <div className="h-12 flex justify-end items-center w-full">
      {showSkip && (
        <button 
          onClick={onSkip}
          className="text-gray-500 font-medium hover:text-gray-800 transition-colors"
        >
          Passer l'introduction
        </button>
      )}
    </div>
  );
};


