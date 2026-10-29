/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';

interface SplashScreenProps {
  hasSession: boolean;
  onFinish: () => void;
  isDark?: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ hasSession, onFinish }) => {
  const targetDuration = hasSession ? 2800 : 3800;
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
    }, 40);

    return () => clearInterval(interval);
  }, [targetDuration, onFinish]);

  return (
    <div
      onClick={onFinish}
      className="fixed inset-0 z-50 flex flex-col justify-between items-center cursor-pointer select-none overflow-hidden bg-gradient-to-b from-[#700406] via-[#4D0102] to-[#2B0001] text-white transition-opacity duration-500 p-4"
    >
      {/* Luz ambiente suave vermelha centralizada no fundo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Espaço superior flexível */}
      <div className="pt-2 sm:pt-4 z-10 flex items-center justify-center opacity-90">
        <span className="text-[11px] font-semibold tracking-wider text-red-200/80 uppercase">
          Aplicativo Oficial Meu Doador
        </span>
      </div>

      {/* Imagem de Referência Sobreposta por cima do fundo vermelho */}
      <div className="relative flex-1 flex items-center justify-center my-auto z-10 w-full max-w-sm px-2 animate-fadeIn">
        <div className="relative flex items-center justify-center max-h-[76vh]">
          <img
            src="/assets/aistudio/Refer_ncia_visual_B___Tela_de_abertura_c7474da3.png"
            alt="Meu Doador — Tela de Abertura"
            className="max-h-[74vh] sm:max-h-[78vh] w-auto max-w-full object-contain rounded-[28px] sm:rounded-[36px] shadow-[0_20px_50px_rgba(0,0,0,0.7)] border border-red-500/20 select-none animate-heartbeat"
          />
        </div>
      </div>

      {/* Rodapé com Carregamento & Botão de Acesso Rápido */}
      <div className="pb-4 sm:pb-6 flex flex-col items-center gap-2.5 z-10 w-full max-w-xs px-4">
        <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-red-100/90">
          <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          <span>Preparando seu espaço... {progress}%</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onFinish();
          }}
          className="flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold bg-white/15 hover:bg-white/25 active:scale-95 text-white backdrop-blur-md border border-white/20 transition-all shadow-md"
        >
          <span>Toque para entrar</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
