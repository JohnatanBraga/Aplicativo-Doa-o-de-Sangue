/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Home, Droplet, CreditCard, BookOpen, User } from 'lucide-react';

export type NavTab = 'home' | 'donations' | 'card' | 'guide' | 'profile';

interface BottomNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const tabs = [
    { id: 'home' as NavTab, label: 'Início', icon: Home },
    { id: 'donations' as NavTab, label: 'Doações', icon: Droplet },
    { id: 'card' as NavTab, label: 'Meu Cartão', icon: CreditCard },
    { id: 'guide' as NavTab, label: 'Guia', icon: BookOpen },
    { id: 'profile' as NavTab, label: 'Perfil', icon: User },
  ];

  return (
    <nav className="w-full bg-[#FFFFFF]/95 dark:bg-[#1A1A1E]/95 backdrop-blur-md border-t border-[#E9E9E6] dark:border-[#2E2E36] px-2 py-2 fixed bottom-0 left-0 right-0 z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] transition-colors">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'bg-[#F5D9D5]/70 dark:bg-[#3E1F1F]/70 text-[#D95757] font-bold scale-105'
                  : 'text-[#777777] dark:text-[#9CA3AF] hover:text-[#242424] dark:hover:text-[#F3F4F6]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#D95757]" />
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
