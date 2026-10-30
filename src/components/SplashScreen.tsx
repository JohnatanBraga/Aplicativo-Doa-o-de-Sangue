/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Heart, ChevronRight } from 'lucide-react';

interface SplashScreenProps {
  hasSession: boolean;
  onFinish: () => void;
  isDark?: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish, isDark = true }) => {
  // Duração de 7 segundos de carregamento conforme solicitado
  const targetDuration = 7000;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / targetDuration) * 100));
      setProgress(pct);
      if (elapsed >= targetDuration) {
        clearInterval(interval);
        onFinish();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [targetDuration, onFinish]);

  return (
    <div
      onClick={onFinish}
      className={`fixed inset-0 z-50 flex flex-col justify-between items-center cursor-pointer select-none overflow-hidden transition-colors duration-500 p-6 ${
        isDark
          ? 'bg-[#0E0F12] text-white'
          : 'bg-[#F9F9F7] text-[#242424]'
      }`}
      title="Toque para entrar"
    >
      {/* Luz ambiente suave centralizada atrás do coração pulsante */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-96 sm:h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Topo: Logo Minimalista & Título */}
      <div className="pt-8 sm:pt-12 flex flex-col items-center z-10 animate-fadeIn">
        <div className="w-12 h-12 rounded-2xl bg-[#D95757] flex items-center justify-center text-white shadow-lg shadow-red-500/25 mb-3">
          <Heart className="w-6 h-6 fill-white stroke-none" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-1.5">
          <span className={isDark ? 'text-gray-100' : 'text-[#242424]'}>Meu</span>
          <span className="text-[#D95757]">Doador</span>
        </h1>
        <p className={`text-xs font-medium tracking-wide mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Acompanhamento & Gestão de Doações de Sangue
        </p>
      </div>

      {/* Centro: Elemento Principal do Batimento Cardíaco com a imagem anexada */}
      <div className="relative flex flex-col items-center justify-center my-auto z-10 w-full max-w-sm px-4">
        {/* Imagem do Coração com pulso de batimento cardíaco realista */}
        <div className="relative animate-heartbeat flex items-center justify-center">
          <img
            src="/assets/aistudio/coracao_com_brilho_transparente_3d202c6f.png"
            alt="Batimento Cardíaco"
            className="w-56 sm:w-64 h-auto max-h-[320px] object-contain drop-shadow-[0_15px_40px_rgba(217,87,87,0.45)] select-none pointer-events-none"
          />
        </div>

        {/* Conceito de Vida & Saúde */}
        <div className="mt-5 text-center space-y-1">
          <p className={`text-lg sm:text-xl font-bold tracking-tight ${isDark ? 'text-gray-100' : 'text-[#242424]'}`}>
            Cada batimento conta
          </p>
          <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Cada doação de sangue pode salvar até 4 vidas
          </p>
        </div>

        {/* Linha de Eletrocardiograma (ECG) fluida */}
        <div className="w-full h-8 mt-3 flex items-center justify-center overflow-hidden">
          <svg
            viewBox="0 0 320 40"
            className="w-64 h-8 stroke-[#D95757] drop-shadow-[0_0_8px_rgba(217,87,87,0.7)]"
            fill="none"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              d="M 0 20 L 75 20 L 90 15 L 100 20 L 115 20 L 128 3 L 145 37 L 158 20 L 172 20 L 186 12 L 200 20 L 320 20"
              className="animate-ecg-stroke"
            />
          </svg>
        </div>
      </div>

      {/* Rodapé: Carregamento dos 7 segundos e Acesso Rápido */}
      <div className="pb-6 sm:pb-8 flex flex-col items-center gap-3 z-10 w-full max-w-xs px-4">
        <div className="flex items-center gap-2 text-xs font-medium tracking-wide">
          <div className="w-3.5 h-3.5 rounded-full border-2 border-[#D95757]/40 border-t-[#D95757] animate-spin" />
          <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
            Preparando seu espaço... ({progress}%)
          </span>
        </div>

        {/* Barra de progresso dos 7 segundos */}
        <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-black/10'}`}>
          <div
            className="h-full bg-gradient-to-r from-[#D95757] to-[#FF7070] transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onFinish();
          }}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all border active:scale-95 mt-1 ${
            isDark
              ? 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
              : 'bg-black/5 hover:bg-black/10 text-gray-700 border-black/10'
          }`}
        >
          <span>Toque para avançar</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
