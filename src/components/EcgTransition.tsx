/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface EcgTransitionProps {
  active?: boolean;
  fullscreen?: boolean;
  text?: string;
}

export const EcgTransition: React.FC<EcgTransitionProps> = ({
  active = true,
  fullscreen = false,
  text,
}) => {
  if (!active) return null;

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-[#8A1414] bg-gradient-to-b from-[#6A0C0C] via-[#991B1B] to-[#550707] flex flex-col items-center justify-center p-6 text-white transition-opacity duration-300">
        {/* ECG SVG */}
        <div className="w-full max-w-md h-24 relative flex items-center justify-center overflow-hidden">
          <svg
            viewBox="0 0 500 100"
            className="w-full h-full stroke-[#FF6B6B] drop-shadow-[0_0_12px_rgba(255,107,107,0.8)]"
            fill="none"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              d="M 0 50 L 120 50 L 135 44 L 145 50 L 160 50 L 175 10 L 195 90 L 210 50 L 225 50 L 240 38 L 260 50 L 370 50 L 385 44 L 395 50 L 410 50 L 425 10 L 445 90 L 460 50 L 500 50"
              className="animate-ecg-stroke"
            />
          </svg>
        </div>
        {text && (
          <p className="mt-4 text-sm font-medium tracking-wide text-red-100/90 animate-pulse">
            {text}
          </p>
        )}
      </div>
    );
  }

  // Linha superior sutil para transição de abas e carregamento
  return (
    <div className="w-full h-1 relative overflow-hidden bg-transparent z-30">
      <div className="absolute inset-0 bg-red-100/40" />
      <div className="absolute inset-0 flex items-center">
        <svg
          viewBox="0 0 500 20"
          className="w-full h-4 stroke-[#D95757] drop-shadow-[0_0_4px_rgba(217,87,87,0.6)]"
          fill="none"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="M 0 10 L 80 10 L 95 6 L 105 10 L 120 10 L 135 2 L 150 18 L 162 10 L 180 10 L 195 5 L 210 10 L 330 10 L 345 6 L 355 10 L 370 10 L 385 2 L 400 18 L 412 10 L 430 10 L 500 10"
            className="animate-ecg-stroke"
          />
        </svg>
      </div>
    </div>
  );
};
