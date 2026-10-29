/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Smartphone, Bell, Heart, Code2, Sun, Moon } from 'lucide-react';
import { ThemeMode, UserProfile } from '../types';

interface HeaderProps {
  profile: UserProfile | null;
  themeMode: ThemeMode;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenAndroidModal: () => void;
  onOpenCalendarModal: () => void;
  onGoToProfile: () => void;
  isSimulatedDevice: boolean;
  onToggleDeviceSimulation: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  themeMode,
  isDark,
  onToggleTheme,
  onOpenAndroidModal,
  onOpenCalendarModal,
  onGoToProfile,
  isSimulatedDevice,
  onToggleDeviceSimulation,
}) => {
  return (
    <header className="w-full bg-[#FFFFFF]/90 dark:bg-[#1A1A1E]/90 backdrop-blur-md sticky top-0 z-20 border-b border-[#E9E9E6] dark:border-[#2E2E36] px-4 py-3 flex items-center justify-between transition-colors">
      {/* Brand logo & small greeting */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-2xl bg-[#D95757] flex items-center justify-center text-white shadow-sm shadow-red-500/20">
          <Heart className="w-5 h-5 fill-current" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-base tracking-tight text-[#242424] dark:text-[#F3F4F6]">
              Meu Doador
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-[#DCECCB] dark:bg-[#1E3825] text-[#2d4d1e] dark:text-[#86EFAC]">
              BR
            </span>
          </div>
          <p className="text-[11px] text-[#777777] dark:text-[#9CA3AF] leading-none">
            {profile ? `Olá, ${profile.nome.split(' ')[0]}!` : 'Acompanhamento de doações'}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1.5">
        {/* Alternador de Tema Escuro / Claro */}
        <button
          onClick={onToggleTheme}
          className="w-8 h-8 rounded-2xl bg-[#F7F7F5] dark:bg-[#25252B] hover:bg-[#E9E9E6] dark:hover:bg-[#32323A] flex items-center justify-center text-[#242424] dark:text-[#F3F4F6] transition-colors"
          title={isDark ? 'Mudar para Tema Claro' : 'Mudar para Tema Escuro'}
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-[#555555]" />
          )}
        </button>

        {/* Botão de Projeto Android Nativo / APK */}
        <button
          onClick={onOpenAndroidModal}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-2xl bg-[#DCECCB] dark:bg-[#1E3825] hover:bg-[#c9e0b4] dark:hover:bg-[#284c32] text-[#2d4d1e] dark:text-[#86EFAC] text-xs font-bold transition-all shadow-xs"
          title="Ver e baixar Projeto Android Nativo (Jetpack Compose / APK)"
        >
          <Code2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Projeto APK</span>
        </button>

        {/* Lembretes / Calendário */}
        <button
          onClick={onOpenCalendarModal}
          className="w-8 h-8 rounded-2xl bg-[#F7F7F5] dark:bg-[#25252B] hover:bg-[#E9E9E6] dark:hover:bg-[#32323A] flex items-center justify-center text-[#242424] dark:text-[#F3F4F6] transition-colors relative"
          title="Calendário e Lembretes"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D95757]" />
        </button>

        {/* Alternador de Moldura Samsung Galaxy */}
        <button
          onClick={onToggleDeviceSimulation}
          className={`w-8 h-8 rounded-2xl flex items-center justify-center transition-colors ${
            isSimulatedDevice
              ? 'bg-[#BDE8F0] dark:bg-[#1A363D] text-[#1b4b57] dark:text-[#7DD3FC]'
              : 'bg-[#F7F7F5] dark:bg-[#25252B] text-[#777777] dark:text-[#A0A0A0] hover:bg-[#E9E9E6]'
          }`}
          title={isSimulatedDevice ? 'Modo Tela Cheia' : 'Modo Simulador Samsung Galaxy'}
        >
          <Smartphone className="w-4 h-4" />
        </button>

        {/* Avatar Profile */}
        <button
          onClick={onGoToProfile}
          className="w-8 h-8 rounded-2xl bg-[#F5D9D5] dark:bg-[#3E1F1F] text-[#D95757] font-bold text-xs flex items-center justify-center border border-[#F5D9D5] dark:border-[#3E1F1F] hover:scale-105 transition-transform"
          title="Meu Perfil"
        >
          {profile?.nome ? profile.nome.charAt(0).toUpperCase() : 'U'}
        </button>
      </div>
    </header>
  );
};
