/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Bell, Heart, Sun, Moon } from 'lucide-react';
import { ThemeMode, UserProfile } from '../types';

interface HeaderProps {
  profile: UserProfile | null;
  themeMode: ThemeMode;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenCalendarModal: () => void;
  onGoToProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  isDark,
  onToggleTheme,
  onOpenCalendarModal,
  onGoToProfile,
}) => {
  const initial = profile?.nome ? profile.nome.trim().charAt(0).toUpperCase() : 'U';

  return (
    <header className="w-full bg-[#FFFFFF]/90 dark:bg-[#1A1A1E]/90 backdrop-blur-md sticky top-0 z-20 border-b border-[#E9E9E6] dark:border-[#2E2E36] px-4 py-3 flex items-center justify-between transition-colors">
      {/* Nome do aplicativo: Meu Doador com ícone */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-2xl bg-[#D95757] flex items-center justify-center text-white shadow-sm shadow-red-500/20">
          <Heart className="w-5 h-5 fill-current" />
        </div>
        <h1 className="font-extrabold text-lg tracking-tight text-[#242424] dark:text-[#F3F4F6]">
          Meu Doador
        </h1>
      </div>

      {/* Apenas: Ícone de Tema (Escuro ou claro), Notificações e Perfil */}
      <div className="flex items-center gap-2">
        {/* 1. Ícone de Tema (Escuro ou claro) */}
        <button
          onClick={onToggleTheme}
          className="w-9 h-9 rounded-2xl bg-[#F7F7F5] dark:bg-[#25252B] hover:bg-[#E9E9E6] dark:hover:bg-[#32323A] flex items-center justify-center text-[#242424] dark:text-[#F3F4F6] transition-colors"
          title={isDark ? 'Mudar para Tema Claro' : 'Mudar para Tema Escuro'}
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-[#555555]" />
          )}
        </button>

        {/* 2. Notificações / Calendário */}
        <button
          onClick={onOpenCalendarModal}
          className="w-9 h-9 rounded-2xl bg-[#F7F7F5] dark:bg-[#25252B] hover:bg-[#E9E9E6] dark:hover:bg-[#32323A] flex items-center justify-center text-[#242424] dark:text-[#F3F4F6] transition-colors relative"
          title="Notificações e Lembretes"
        >
          <Bell className="w-4 h-4 text-[#555555] dark:text-[#CCCCCC]" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#D95757]" />
        </button>

        {/* 3. Perfil do Usuário */}
        <button
          onClick={onGoToProfile}
          className="w-9 h-9 rounded-2xl bg-[#F5D9D5] dark:bg-[#3E1F1F] text-[#D95757] dark:text-[#F87171] font-bold text-sm flex items-center justify-center border border-[#F5D9D5] dark:border-[#3E1F1F] hover:scale-105 active:scale-95 transition-all shadow-xs"
          title={profile ? `Perfil: ${profile.nome}` : 'Meu Perfil'}
        >
          {initial}
        </button>
      </div>
    </header>
  );
};
