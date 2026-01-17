
import React from 'react';
import { OnboardingType } from '../types';

interface Props {
  data: OnboardingType;
}

export const OnboardingSlide: React.FC<Props> = ({ data }) => {
  return (
    <div className="w-full flex flex-col items-center text-center animate-fadeIn">
      {/* Icon Area */}
      <div className="mb-10 flex items-center justify-center">
        {data.iconType === 'map' && (
          <div className="w-32 h-32 bg-gray-100 flex flex-col items-center justify-center rounded-lg">
             <i className="fa-solid fa-location-dot text-[#0057b7] text-4xl mb-1"></i>
             <div className="text-[#0057b7] font-black text-xl leading-none">ATLAS</div>
             <div className="text-[#0057b7] font-black text-xl leading-none">LOCAL</div>
          </div>
        )}

        {data.id === 1 && (
          <div className="relative">
             <div className="w-32 h-24 bg-blue-100 rounded-lg transform rotate-3 flex items-center justify-center overflow-hidden border-4 border-white shadow-sm">
                <img 
                  src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?auto=format&fit=crop&q=80&w=100" 
                  className="w-full h-full object-cover opacity-80" 
                  alt="map preview" 
                />
             </div>
             <div className="absolute inset-0 flex items-center justify-center">
                <i className="fa-solid fa-map text-blue-400 text-5xl"></i>
             </div>
          </div>
        )}

        {data.showLocationIcon && (
          <div className="relative flex flex-col items-center">
             <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                <div className="w-4 h-4 bg-white rounded-full opacity-30 absolute top-3 left-4"></div>
             </div>
             <div className="w-1 h-8 bg-gray-300 -mt-1 rounded-full"></div>
          </div>
        )}
      </div>

      <h1 className="text-2xl font-extrabold text-[#1a1a1a] mb-4">
        {data.title}
      </h1>

      <p className="text-gray-500 text-base leading-relaxed px-4 mb-8">
        {data.description}
      </p>

      {/* Feature list for step 2 */}
      {data.features && (
        <div className="w-full max-w-[240px] flex flex-col gap-5 mt-4">
          {data.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-4 text-left">
              <div className={`w-8 flex justify-center ${feature.color}`}>
                <i className={`fa-solid ${feature.icon} text-xl`}></i>
              </div>
              <span className="text-gray-700 font-medium">{feature.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
