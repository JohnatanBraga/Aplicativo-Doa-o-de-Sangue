/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  UserProfile,
  DonationRecord,
  Reminder,
  WeightEntry,
  EligibilityStatus,
  ThemeMode,
} from './types';
import {
  getCurrentUserUid,
  getProfile,
  getDonations,
  getReminders,
  getWeightHistory,
  seedDemoDataIfEmpty,
  saveProfile,
  addDonation,
  updateDonation,
  deleteDonation,
  logout,
  getThemePreference,
  saveThemePreference,
} from './services/storageService';
import { calculateEligibility } from './utils/eligibilityRules';

// Components
import { SplashScreen } from './components/SplashScreen';
import { EcgTransition } from './components/EcgTransition';
import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { AuthModal } from './components/AuthModal';
import { TutorialModal } from './components/TutorialModal';
import { DonationModal } from './components/DonationModal';

// Views & Modals
import { HomeView } from './views/HomeView';
import { DonationsView } from './views/DonationsView';
import { CardView } from './views/CardView';
import { GuideView } from './views/GuideView';
import { ProfileView } from './views/ProfileView';
import { EligibilityModal } from './views/EligibilityModal';
import { CalendarModal } from './views/CalendarModal';
import { AndroidProjectModal } from './views/AndroidProjectModal';

export default function App() {
  // Theme State (Dark / Light / System)
  const [themeMode, setThemeMode] = useState<ThemeMode>(getThemePreference());
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(() => {
    return window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)').matches : false;
  });

  // Calculate actual isDark
  const isDarkActive = useMemo(() => {
    if (themeMode === 'dark') return true;
    if (themeMode === 'light') return false;
    return systemPrefersDark;
  }, [themeMode, systemPrefersDark]);

  // Synchronize system media query listener
  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemPrefersDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Update HTML and body element class & native colorScheme
  useEffect(() => {
    if (isDarkActive) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
  }, [isDarkActive]);

  const handleSetThemeMode = (mode: ThemeMode) => {
    setThemeMode(mode);
    saveThemePreference(mode);
  };

  const handleToggleTheme = () => {
    const nextMode: ThemeMode = isDarkActive ? 'light' : 'dark';
    handleSetThemeMode(nextMode);
  };

  // Splash Screen State
  const [showSplash, setShowSplash] = useState(true);

  // User & Data State
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([]);

  // Navigation State
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Samsung Galaxy Frame Simulation Toggle
  const [isSimulatedDevice, setIsSimulatedDevice] = useState(true);

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [editingDonation, setEditingDonation] = useState<DonationRecord | null>(null);
  const [isEligibilityOpen, setIsEligibilityOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isAndroidModalOpen, setIsAndroidModalOpen] = useState(false);

  // Initial Load & Auth Check
  useEffect(() => {
    const uid = getCurrentUserUid();
    if (uid) {
      const p = getProfile(uid);
      if (p) {
        setProfile(p);
        loadUserData(p.uid);
        return;
      }
    }
    // Seed initial demo user for instant functional review
    const demoProfile = seedDemoDataIfEmpty();
    setProfile(demoProfile);
    loadUserData(demoProfile.uid);
  }, []);

  const loadUserData = (uid: string) => {
    setDonations(getDonations(uid));
    setReminders(getReminders(uid));
    setWeightHistory(getWeightHistory(uid));
  };

  // Calculate Eligibility dynamically
  const eligibility: EligibilityStatus = useMemo(() => {
    return calculateEligibility(profile, donations);
  }, [profile, donations]);

  // Tab change with ECG animation
  const handleSelectTab = (tab: NavTab) => {
    if (tab === currentTab) return;
    setIsTransitioning(true);
    setCurrentTab(tab);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 450);
  };

  // Splash Screen Finish
  const handleSplashFinish = () => {
    setShowSplash(false);
    if (!profile) {
      setIsAuthOpen(true);
    } else if (!profile.tutorialConcluido) {
      setIsTutorialOpen(true);
    }
  };

  // Auth Success
  const handleAuthSuccess = (newProfile: UserProfile, isNewUser: boolean) => {
    setProfile(newProfile);
    loadUserData(newProfile.uid);
    setIsAuthOpen(false);
    if (isNewUser || !newProfile.tutorialConcluido) {
      setIsTutorialOpen(true);
    }
  };

  // Logout
  const handleLogout = () => {
    logout();
    setProfile(null);
    setDonations([]);
    setReminders([]);
    setWeightHistory([]);
    setIsAuthOpen(true);
  };

  // Account Deleted
  const handleAccountDeleted = () => {
    setProfile(null);
    setDonations([]);
    setReminders([]);
    setWeightHistory([]);
    setIsAuthOpen(true);
  };

  // Donation CRUD (com suporte a Doação Voluntária vs Destinada)
  const handleSaveDonation = (data: {
    data: string;
    hemocentro: string;
    cidade: string;
    estado: string;
    tipoDoacao: any;
    categoriaDoacao: any;
    destinatarioNome?: string;
    destinatarioCpf?: string;
    destinatarioHospital?: string;
    pesoNoDia?: number;
    observacoes?: string;
  }) => {
    if (!profile) return;
    if (editingDonation) {
      updateDonation(profile.uid, {
        ...editingDonation,
        ...data,
      });
    } else {
      addDonation(profile.uid, data);
    }
    setDonations(getDonations(profile.uid));
    setWeightHistory(getWeightHistory(profile.uid));
    setIsDonationModalOpen(false);
    setEditingDonation(null);
  };

  const handleDeleteDonation = (donationId: string) => {
    if (!profile) return;
    deleteDonation(profile.uid, donationId);
    setDonations(getDonations(profile.uid));
  };

  return (
    <div className="min-h-screen bg-[#F0F0EE] dark:bg-[#0A0A0C] flex flex-col items-center justify-center font-sans antialiased selection:bg-[#F5D9D5] selection:text-[#D95757] transition-colors duration-300">
      {/* 1. Tela de Abertura com Coração Transparente Pulsando */}
      {showSplash && (
        <SplashScreen
          hasSession={Boolean(profile)}
          onFinish={handleSplashFinish}
          isDark={isDarkActive}
        />
      )}

      {/* Main Container / Samsung Galaxy Frame Simulator */}
      <div
        className={`w-full transition-all duration-300 relative ${
          isSimulatedDevice
            ? 'max-w-[430px] my-0 sm:my-6 rounded-none sm:rounded-[46px] shadow-2xl border-0 sm:border-[8px] border-[#2A2A2A] dark:border-[#1E1E24] bg-[#F7F7F5] dark:bg-[#121215] overflow-hidden min-h-screen sm:min-h-[880px]'
            : 'max-w-xl mx-auto bg-[#F7F7F5] dark:bg-[#121215] min-h-screen shadow-md'
        }`}
      >
        {/* Samsung Galaxy Speaker & Camera Punch-hole */}
        {isSimulatedDevice && (
          <div className="hidden sm:flex items-center justify-between px-7 pt-3 pb-1 bg-white dark:bg-[#1A1A1E] select-none text-[11px] font-semibold text-[#333333] dark:text-[#A0A0A0] border-b border-[#E9E9E6]/50 dark:border-[#2E2E36]/50 transition-colors">
            <span>12:45</span>
            <div className="w-4 h-4 rounded-full bg-black/80 ring-2 ring-gray-200 dark:ring-gray-700" />
            <div className="flex items-center gap-1.5 text-[10px]">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>
        )}

        {/* Top Header */}
        <Header
          profile={profile}
          themeMode={themeMode}
          isDark={isDarkActive}
          onToggleTheme={handleToggleTheme}
          onOpenAndroidModal={() => setIsAndroidModalOpen(true)}
          onOpenCalendarModal={() => setIsCalendarOpen(true)}
          onGoToProfile={() => handleSelectTab('profile')}
          isSimulatedDevice={isSimulatedDevice}
          onToggleDeviceSimulation={() => setIsSimulatedDevice(!isSimulatedDevice)}
        />

        {/* Transição Suave com Eletrocardiograma */}
        <EcgTransition active={isTransitioning} />

        {/* View Switcher */}
        <main className="px-4 py-4 min-h-[calc(100vh-140px)]">
          {currentTab === 'home' && (
            <HomeView
              profile={profile}
              donations={donations}
              eligibility={eligibility}
              onNavigate={handleSelectTab}
              onOpenNewDonationModal={() => {
                setEditingDonation(null);
                setIsDonationModalOpen(true);
              }}
              onOpenEligibilityModal={() => setIsEligibilityOpen(true)}
            />
          )}

          {currentTab === 'donations' && (
            <DonationsView
              profile={profile}
              donations={donations}
              onOpenNewDonationModal={() => {
                setEditingDonation(null);
                setIsDonationModalOpen(true);
              }}
              onEditDonation={(d) => {
                setEditingDonation(d);
                setIsDonationModalOpen(true);
              }}
              onDeleteDonation={handleDeleteDonation}
            />
          )}

          {currentTab === 'card' && <CardView profile={profile} />}

          {currentTab === 'guide' && <GuideView />}

          {currentTab === 'profile' && (
            <ProfileView
              profile={profile}
              weightHistory={weightHistory}
              themeMode={themeMode}
              isDark={isDarkActive}
              onSetThemeMode={handleSetThemeMode}
              onUpdateProfile={(updated) => setProfile(updated)}
              onRefreshWeight={() => {
                if (profile) setWeightHistory(getWeightHistory(profile.uid));
              }}
              onReopenTutorial={() => setIsTutorialOpen(true)}
              onLogout={handleLogout}
              onAccountDeleted={handleAccountDeleted}
            />
          )}
        </main>

        {/* Bottom Navigation */}
        <BottomNav currentTab={currentTab} onSelectTab={handleSelectTab} />
      </div>

      {/* MODALS */}
      {/* Autenticação & Cadastro */}
      <AuthModal
        isOpen={isAuthOpen}
        onSuccess={handleAuthSuccess}
      />

      {/* Tutorial Interativo em 7 Etapas */}
      {profile && (
        <TutorialModal
          isOpen={isTutorialOpen}
          profile={profile}
          onFinish={(updatedProfile) => {
            setProfile(updatedProfile);
            setIsTutorialOpen(false);
          }}
        />
      )}

      {/* Modal de Nova / Edição de Doação */}
      <DonationModal
        isOpen={isDonationModalOpen}
        initialDonation={editingDonation}
        profile={profile}
        existingDonations={donations}
        onClose={() => {
          setIsDonationModalOpen(false);
          setEditingDonation(null);
        }}
        onSave={handleSaveDonation}
      />

      {/* Modal Posso Doar Novamente? */}
      <EligibilityModal
        isOpen={isEligibilityOpen}
        eligibility={eligibility}
        profile={profile}
        onClose={() => setIsEligibilityOpen(false)}
        onGoToGuide={() => {
          setIsEligibilityOpen(false);
          handleSelectTab('guide');
        }}
      />

      {/* Modal Calendário & Lembretes Internos */}
      <CalendarModal
        isOpen={isCalendarOpen}
        profile={profile}
        donations={donations}
        eligibility={eligibility}
        reminders={reminders}
        onClose={() => setIsCalendarOpen(false)}
        onRefreshReminders={() => {
          if (profile) setReminders(getReminders(profile.uid));
        }}
      />

      {/* Modal Projeto Android Nativo (APK) */}
      <AndroidProjectModal
        isOpen={isAndroidModalOpen}
        onClose={() => setIsAndroidModalOpen(false)}
      />
    </div>
  );
}
