/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  User,
  Heart,
  Scale,
  MapPin,
  Calendar,
  LogOut,
  Trash2,
  HelpCircle,
  Shield,
  Save,
  CheckCircle2,
  Clock,
  Plus,
  Sun,
  Moon,
  Laptop,
} from 'lucide-react';
import { BloodType, Gender, ThemeMode, UserProfile, WeightEntry } from '../types';
import { saveProfile, addWeightEntry, deleteFullAccount } from '../services/storageService';
import { formatDateBR } from '../utils/eligibilityRules';

interface ProfileViewProps {
  profile: UserProfile | null;
  weightHistory: WeightEntry[];
  themeMode: ThemeMode;
  isDark: boolean;
  onSetThemeMode: (theme: ThemeMode) => void;
  onUpdateProfile: (updated: UserProfile) => void;
  onRefreshWeight: () => void;
  onReopenTutorial: () => void;
  onOpenAndroidModal?: () => void;
  onLogout: () => void;
  onAccountDeleted: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  weightHistory,
  themeMode,
  isDark,
  onSetThemeMode,
  onUpdateProfile,
  onRefreshWeight,
  onReopenTutorial,
  onOpenAndroidModal,
  onLogout,
  onAccountDeleted,
}) => {
  if (!profile) return null;

  const [nome, setNome] = useState(profile.nome);
  const [dataNascimento, setDataNascimento] = useState(profile.dataNascimento || '');
  const [genero, setGenero] = useState<Gender>(profile.genero || 'M');
  const [cidade, setCidade] = useState(profile.cidade || 'São Luís');
  const [estado, setEstado] = useState(profile.estado || 'MA');
  const [hemocentro, setHemocentro] = useState(profile.hemocentroReferencia || 'HEMOMAR - São Luís');
  const [tipoSanguineo, setTipoSanguineo] = useState<BloodType>(profile.tipoSanguineo || 'O+');
  const [fatorRh, setFatorRh] = useState<'+' | '-' | 'desconhecido'>(profile.fatorRh || '+');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sincronizar campos locais caso o perfil seja atualizado externamente
  React.useEffect(() => {
    if (profile) {
      setNome(profile.nome);
      setDataNascimento(profile.dataNascimento || '');
      setGenero(profile.genero || 'M');
      setCidade(profile.cidade || 'São Luís');
      setEstado(profile.estado || 'MA');
      setHemocentro(profile.hemocentroReferencia || 'HEMOMAR - São Luís');
      setTipoSanguineo(profile.tipoSanguineo || 'O+');
      setFatorRh(profile.fatorRh || '+');
    }
  }, [profile]);

  // Novo registro de peso
  const [novoPeso, setNovoPeso] = useState('');
  const [dataNovoPeso, setDataNovoPeso] = useState(new Date().toISOString().split('T')[0]);
  const [isAddingWeight, setIsAddingWeight] = useState(false);

  // Confirmação de exclusão da conta
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteTypedConfirm, setDeleteTypedConfirm] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...profile,
      nome: nome.trim(),
      dataNascimento: dataNascimento || undefined,
      genero,
      cidade: cidade.trim(),
      estado: estado.trim(),
      hemocentroReferencia: hemocentro.trim(),
      tipoSanguineo,
      fatorRh,
    };
    saveProfile(updated);
    onUpdateProfile(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleAddWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(novoPeso);
    if (!w || w < 30 || w > 300) return;

    addWeightEntry(profile.uid, w, dataNovoPeso);
    const updatedProfile = {
      ...profile,
      pesoAtual: w,
      dataAtualizacaoPeso: dataNovoPeso,
    };
    saveProfile(updatedProfile);
    onUpdateProfile(updatedProfile);
    onRefreshWeight();
    setNovoPeso('');
    setIsAddingWeight(false);
  };

  const handleExecuteDeleteAccount = async () => {
    if (deleteTypedConfirm !== 'EXCLUIR') return;
    await deleteFullAccount(profile.uid, profile.email);
    setConfirmDelete(false);
    onAccountDeleted();
  };

  return (
    <div className="space-y-4 pb-24 animate-fadeIn">
      {/* Title */}
      <div className="px-1">
        <h2 className="text-2xl font-extrabold text-[#242424] dark:text-[#F3F4F6] tracking-tight">
          Meu Perfil & Configurações
        </h2>
        <p className="text-xs text-[#777777] dark:text-[#9CA3AF]">
          Gerencie dados do doador, peso, tema visual e privacidade
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Informações do perfil atualizadas com sucesso!</span>
        </div>
      )}

      {/* 2. CONTROLE DE TEMA (DARK MODE / CLARO / SISTEMA) */}
      <div className="bg-[#FFFFFF] dark:bg-[#1A1A1E] p-5 rounded-[28px] border border-[#E9E9E6] dark:border-[#2E2E36] shadow-xs space-y-3 text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-[#E9E9E6] dark:border-[#2E2E36]">
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-[#D95757]" />
            <h3 className="text-sm font-bold text-[#242424] dark:text-[#F3F4F6]">Aparência Visual</h3>
          </div>
          <span className="text-[11px] text-[#777777] dark:text-[#9CA3AF]">
            {themeMode === 'dark' ? 'Tema Escuro Ativo' : themeMode === 'light' ? 'Tema Claro Ativo' : 'Acompanhando Sistema'}
          </span>
        </div>

        <p className="text-xs text-[#666666] dark:text-[#A0A0A0]">
          Personalize a exibição do aplicativo para conforto visual em ambientes iluminados ou com pouca luz.
        </p>

        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            type="button"
            onClick={() => onSetThemeMode('light')}
            className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
              themeMode === 'light'
                ? 'bg-[#F5D9D5] dark:bg-[#3E1F1F] border-[#D95757] text-[#D95757] font-bold shadow-xs ring-2 ring-[#D95757]/30'
                : 'bg-[#F7F7F5] dark:bg-[#232329] border-[#E9E9E6] dark:border-[#2E2E36] text-[#777777] dark:text-[#A0A0A0] hover:bg-gray-100 dark:hover:bg-[#2E2E36]'
            }`}
          >
            <Sun className={`w-5 h-5 ${themeMode === 'light' ? 'text-[#D95757]' : 'text-amber-500'}`} />
            <span className="text-xs">Claro</span>
          </button>

          <button
            type="button"
            onClick={() => onSetThemeMode('dark')}
            className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
              themeMode === 'dark'
                ? 'bg-[#F5D9D5] dark:bg-[#3E1F1F] border-[#D95757] text-[#D95757] font-bold shadow-xs ring-2 ring-[#D95757]/30'
                : 'bg-[#F7F7F5] dark:bg-[#232329] border-[#E9E9E6] dark:border-[#2E2E36] text-[#777777] dark:text-[#A0A0A0] hover:bg-gray-100 dark:hover:bg-[#2E2E36]'
            }`}
          >
            <Moon className={`w-5 h-5 ${themeMode === 'dark' ? 'text-[#D95757]' : 'text-indigo-400'}`} />
            <span className="text-xs">Escuro</span>
          </button>

          <button
            type="button"
            onClick={() => onSetThemeMode('system')}
            className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
              themeMode === 'system'
                ? 'bg-[#F5D9D5] dark:bg-[#3E1F1F] border-[#D95757] text-[#D95757] font-bold shadow-xs ring-2 ring-[#D95757]/30'
                : 'bg-[#F7F7F5] dark:bg-[#232329] border-[#E9E9E6] dark:border-[#2E2E36] text-[#777777] dark:text-[#A0A0A0] hover:bg-gray-100 dark:hover:bg-[#2E2E36]'
            }`}
          >
            <Laptop className={`w-5 h-5 ${themeMode === 'system' ? 'text-[#D95757]' : 'text-emerald-500'}`} />
            <span className="text-xs">Sistema</span>
          </button>
        </div>

        {/* Status explicativo */}
        <div className="p-2.5 rounded-xl bg-[#F7F7F5] dark:bg-[#232329] border border-[#E9E9E6] dark:border-[#2E2E36] flex items-center justify-between text-[11px]">
          <span className="text-[#666666] dark:text-[#A0A0A0]">Tema em exibição:</span>
          <span className="font-bold text-[#D95757] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#D95757] animate-pulse" />
            {themeMode === 'light'
              ? '☀️ Tema Claro Ativo'
              : themeMode === 'dark'
              ? '🌙 Tema Escuro Ativo'
              : `⚙️ Sistema Android (${isDark ? 'Modo Escuro' : 'Modo Claro'})`}
          </span>
        </div>
      </div>

      {/* Formulário Principal de Perfil */}
      <form onSubmit={handleSaveProfile} className="bg-[#FFFFFF] dark:bg-[#1A1A1E] p-5 rounded-[28px] border border-[#E9E9E6] dark:border-[#2E2E36] shadow-xs space-y-3.5 text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-[#E9E9E6] dark:border-[#2E2E36]">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#D95757]" />
            <h3 className="text-sm font-bold text-[#242424] dark:text-[#F3F4F6]">Dados Pessoais</h3>
          </div>
          <span className="text-[11px] text-[#777777] dark:text-[#9CA3AF] font-mono">{profile.email}</span>
        </div>

        <div>
          <label className="block font-semibold text-[#242424] dark:text-[#F3F4F6] mb-1">Nome Completo</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#F7F7F5] dark:bg-[#232329] border border-[#E9E9E6] dark:border-[#2E2E36] text-xs text-[#242424] dark:text-[#F3F4F6] focus:outline-none focus:border-[#D95757]"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-[#242424] dark:text-[#F3F4F6] mb-1">Data de Nascimento</label>
            <input
              type="date"
              value={dataNascimento}
              onChange={(e) => setDataNascimento(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#F7F7F5] dark:bg-[#232329] border border-[#E9E9E6] dark:border-[#2E2E36] text-xs text-[#242424] dark:text-[#F3F4F6] focus:outline-none focus:border-[#D95757]"
            />
          </div>
          <div>
            <label className="block font-semibold text-[#242424] dark:text-[#F3F4F6] mb-1">Sexo (para regras)</label>
            <select
              value={genero}
              onChange={(e) => setGenero(e.target.value as Gender)}
              className="w-full px-3 py-2 rounded-xl bg-[#F7F7F5] dark:bg-[#232329] border border-[#E9E9E6] dark:border-[#2E2E36] text-xs text-[#242424] dark:text-[#F3F4F6] focus:outline-none focus:border-[#D95757]"
            >
              <option value="M">Masculino (60 dias / 4x)</option>
              <option value="F">Feminino (90 dias / 3x)</option>
              <option value="outro">Outro</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-[#242424] dark:text-[#F3F4F6] mb-1">Tipo Sanguíneo</label>
            <select
              value={tipoSanguineo}
              onChange={(e) => setTipoSanguineo(e.target.value as BloodType)}
              className="w-full px-3 py-2 rounded-xl bg-[#F7F7F5] dark:bg-[#232329] border border-[#E9E9E6] dark:border-[#2E2E36] text-xs text-[#242424] dark:text-[#F3F4F6] focus:outline-none focus:border-[#D95757]"
            >
              <option value="O+">O+</option>
              <option value="O-">O- (Doador Universal)</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+ (Receptor Universal)</option>
              <option value="AB-">AB-</option>
              <option value="Não sei">Não sei meu tipo sanguíneo</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold text-[#242424] dark:text-[#F3F4F6] mb-1">Fator Rh</label>
            <select
              value={fatorRh}
              onChange={(e) => setFatorRh(e.target.value as '+' | '-' | 'desconhecido')}
              className="w-full px-3 py-2 rounded-xl bg-[#F7F7F5] dark:bg-[#232329] border border-[#E9E9E6] dark:border-[#2E2E36] text-xs text-[#242424] dark:text-[#F3F4F6] focus:outline-none focus:border-[#D95757]"
            >
              <option value="+">Positivo (+)</option>
              <option value="-">Negativo (-)</option>
              <option value="desconhecido">Desconhecido</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-[#242424] dark:text-[#F3F4F6] mb-1">Cidade</label>
            <input
              type="text"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#F7F7F5] dark:bg-[#232329] border border-[#E9E9E6] dark:border-[#2E2E36] text-xs text-[#242424] dark:text-[#F3F4F6] focus:outline-none focus:border-[#D95757]"
            />
          </div>
          <div>
            <label className="block font-semibold text-[#242424] dark:text-[#F3F4F6] mb-1">Estado (UF)</label>
            <input
              type="text"
              maxLength={2}
              value={estado}
              onChange={(e) => setEstado(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 rounded-xl bg-[#F7F7F5] dark:bg-[#232329] border border-[#E9E9E6] dark:border-[#2E2E36] text-xs text-[#242424] dark:text-[#F3F4F6] uppercase focus:outline-none focus:border-[#D95757]"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-[#242424] dark:text-[#F3F4F6] mb-1">
            Hemocentro de Referência
          </label>
          <input
            type="text"
            value={hemocentro}
            onChange={(e) => setHemocentro(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#F7F7F5] dark:bg-[#232329] border border-[#E9E9E6] dark:border-[#2E2E36] text-xs text-[#242424] dark:text-[#F3F4F6] focus:outline-none focus:border-[#D95757]"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 rounded-xl bg-[#D95757] hover:bg-[#c24a4a] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>Salvar Alterações do Perfil</span>
        </button>
      </form>

      {/* Seção de Peso e Histórico */}
      <div className="bg-[#FFFFFF] dark:bg-[#1A1A1E] p-5 rounded-[28px] border border-[#E9E9E6] dark:border-[#2E2E36] shadow-xs space-y-3 text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-[#E9E9E6] dark:border-[#2E2E36]">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#2d4d1e] dark:text-[#86EFAC]" />
            <h3 className="text-sm font-bold text-[#242424] dark:text-[#F3F4F6]">Acompanhamento de Peso</h3>
          </div>
          <button
            onClick={() => setIsAddingWeight(!isAddingWeight)}
            className="flex items-center gap-1 text-[11px] font-bold text-[#2d4d1e] dark:text-[#86EFAC] hover:underline"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Atualizar Peso</span>
          </button>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#DCECCB]/40 dark:bg-[#1E3825]/40 border border-[#DCECCB] dark:border-[#2E5E3A] flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#2d4d1e] dark:text-[#86EFAC] tracking-wider block">
              Peso Atual
            </span>
            <div className="text-2xl font-extrabold text-[#242424] dark:text-[#F3F4F6]">
              {profile.pesoAtual} <span className="text-sm font-normal opacity-70">kg</span>
            </div>
            <span className="text-[10px] text-[#777777] dark:text-[#9CA3AF]">
              Última pesagem em {formatDateBR(profile.dataAtualizacaoPeso)}
            </span>
          </div>

          <div className="text-right">
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                profile.pesoAtual >= 50
                  ? 'bg-[#DCECCB] dark:bg-[#1E3825] text-[#2d4d1e] dark:text-[#86EFAC]'
                  : 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200'
              }`}
            >
              {profile.pesoAtual >= 50 ? 'Compatível (≥50kg)' : 'Abaixo do peso (mín. 50kg)'}
            </span>
          </div>
        </div>

        {/* Formulário para novo registro de peso */}
        {isAddingWeight && (
          <form onSubmit={handleAddWeight} className="p-3.5 rounded-2xl bg-[#F7F7F5] dark:bg-[#232329] border border-[#E9E9E6] dark:border-[#2E2E36] space-y-2.5">
            <span className="font-bold text-[#242424] dark:text-[#F3F4F6] block">Registrar Nova Pesagem</span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-semibold text-[#555] dark:text-[#A0A0A0] mb-0.5">
                  Novo Peso (kg)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="30"
                  max="250"
                  placeholder="Ex: 73.5"
                  value={novoPeso}
                  onChange={(e) => setNovoPeso(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#1A1A1E] border border-[#E9E9E6] dark:border-[#2E2E36] text-xs text-[#242424] dark:text-[#F3F4F6] focus:outline-none focus:border-[#D95757]"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-[#555] dark:text-[#A0A0A0] mb-0.5">
                  Data da Medição
                </label>
                <input
                  type="date"
                  value={dataNovoPeso}
                  onChange={(e) => setDataNovoPeso(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#1A1A1E] border border-[#E9E9E6] dark:border-[#2E2E36] text-xs text-[#242424] dark:text-[#F3F4F6] focus:outline-none focus:border-[#D95757]"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingWeight(false)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#1A1A1E] border border-[#E9E9E6] dark:border-[#2E2E36] text-xs font-semibold text-[#555] dark:text-[#A0A0A0]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-[#2d4d1e] dark:bg-[#2E5E3A] text-white text-xs font-bold hover:bg-[#233d18]"
              >
                Salvar Pesagem
              </button>
            </div>
          </form>
        )}

        {/* Histórico cronológico de peso */}
        <div className="space-y-1.5 pt-1">
          <span className="font-bold text-[#242424] dark:text-[#F3F4F6] text-[11px] block">
            Histórico de Pesagens ({weightHistory.length})
          </span>
          {weightHistory.length === 0 ? (
            <p className="text-[11px] text-[#777777] dark:text-[#9CA3AF]">Nenhum histórico registrado.</p>
          ) : (
            <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
              {weightHistory.map((w) => (
                <div
                  key={w.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-[#F7F7F5] dark:bg-[#232329] text-xs"
                >
                  <span className="font-semibold text-[#242424] dark:text-[#F3F4F6]">{w.peso} kg</span>
                  <span className="text-[10px] text-[#777777] dark:text-[#9CA3AF]">{formatDateBR(w.dataMedicao)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ações e Configurações da Conta */}
      <div className="bg-[#FFFFFF] dark:bg-[#1A1A1E] p-5 rounded-[28px] border border-[#E9E9E6] dark:border-[#2E2E36] shadow-xs space-y-3 text-xs">
        <h3 className="text-sm font-bold text-[#242424] dark:text-[#F3F4F6] pb-2 border-b border-[#E9E9E6] dark:border-[#2E2E36]">
          Ajuda & Conta
        </h3>

        <div className="space-y-2">
          {/* Rever Tutorial */}
          <button
            onClick={onReopenTutorial}
            className="w-full p-3 rounded-2xl bg-[#F7F7F5] dark:bg-[#232329] hover:bg-[#E9E9E6] dark:hover:bg-[#2D2D35] text-left flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <HelpCircle className="w-4 h-4 text-[#777777] dark:text-[#9CA3AF]" />
              <span className="font-semibold text-[#242424] dark:text-[#F3F4F6]">Rever Tutorial de Boas-Vindas</span>
            </div>
            <span className="text-[11px] text-[#777777] dark:text-[#9CA3AF]">7 passos</span>
          </button>

          {/* Exportar Projeto Android Studio (APK) */}
          {onOpenAndroidModal && (
            <button
              onClick={onOpenAndroidModal}
              className="w-full p-3 rounded-2xl bg-[#DCECCB]/60 dark:bg-[#1E3825]/60 hover:bg-[#DCECCB] dark:hover:bg-[#1E3825] text-left flex items-center justify-between transition-colors border border-[#DCECCB] dark:border-[#2E4A23]"
            >
              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-[#2d4d1e] dark:text-[#86EFAC]" />
                <span className="font-semibold text-[#2d4d1e] dark:text-[#86EFAC]">
                  Exportar Projeto Android Studio (APK)
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2d4d1e] text-white">
                ZIP
              </span>
            </button>
          )}

          {/* Sair da Conta (Logout) */}
          <button
            onClick={onLogout}
            className="w-full p-3 rounded-2xl bg-[#F7F7F5] dark:bg-[#232329] hover:bg-[#F5D9D5] dark:hover:bg-[#3E1F1F] text-left flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2.5 text-[#D95757]">
              <LogOut className="w-4 h-4" />
              <span className="font-bold">Encerrar Sessão (Sair)</span>
            </div>
          </button>

          {/* Excluir Conta */}
          <button
            onClick={() => setConfirmDelete(true)}
            className="w-full p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/40 text-left flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2.5 text-red-700 dark:text-red-400">
              <Trash2 className="w-4 h-4" />
              <span className="font-bold">Excluir Conta e Todos os Dados</span>
            </div>
            <span className="text-[10px] font-semibold text-red-600 dark:text-red-400">Irreversível</span>
          </button>
        </div>

        {/* Versão e Privacidade */}
        <div className="pt-3 border-t border-[#E9E9E6] dark:border-[#2E2E36] flex items-center justify-between text-[10px] text-[#888888] dark:text-[#9CA3AF]">
          <span>Meu Doador v1.2 • Samsung & Dark Mode</span>
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-emerald-600" />
            <span>Dados protegidos</span>
          </span>
        </div>
      </div>

      {/* Modal de Exclusão da Conta */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-[#1A1A1E] text-[#242424] dark:text-[#F3F4F6] rounded-[28px] p-6 max-w-sm w-full space-y-4 shadow-2xl border border-[#E9E9E6] dark:border-[#2E2E36]">
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold">Excluir Conta Definitivamente?</h3>
              <p className="text-xs text-[#777777] dark:text-[#9CA3AF]">
                Essa ação apagará permanentemente seu cadastro, histórico de doações, imagem do
                cartão e histórico de peso.
              </p>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="block text-[11px] font-semibold">
                Digite <strong>EXCLUIR</strong> para confirmar:
              </label>
              <input
                type="text"
                placeholder="EXCLUIR"
                value={deleteTypedConfirm}
                onChange={(e) => setDeleteTypedConfirm(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 rounded-xl bg-[#F7F7F5] dark:bg-[#232329] border border-red-300 dark:border-red-900 text-xs font-bold text-center tracking-widest text-red-600 dark:text-red-400 focus:outline-none focus:border-red-600"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setConfirmDelete(false);
                  setDeleteTypedConfirm('');
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#F7F7F5] dark:bg-[#25252B] text-xs font-semibold hover:bg-[#E9E9E6]"
              >
                Cancelar
              </button>
              <button
                onClick={handleExecuteDeleteAccount}
                disabled={deleteTypedConfirm !== 'EXCLUIR'}
                className="flex-1 py-2.5 rounded-xl bg-red-600 disabled:opacity-40 text-xs font-bold text-white hover:bg-red-700 transition-colors shadow-sm"
              >
                Excluir Tudo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
