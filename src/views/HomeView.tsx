/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Calendar,
  Clock,
  Heart,
  Droplet,
  ArrowRight,
  PlusCircle,
  CreditCard,
  BookOpen,
  Info,
  CheckCircle,
  Users,
  UserCheck,
  Activity,
} from 'lucide-react';
import { DonationRecord, EligibilityStatus, UserProfile } from '../types';
import { formatDateBR, getDonationTypeLabel } from '../utils/eligibilityRules';
import { NavTab } from '../components/BottomNav';

interface HomeViewProps {
  profile: UserProfile | null;
  donations: DonationRecord[];
  eligibility: EligibilityStatus;
  onNavigate: (tab: NavTab) => void;
  onOpenNewDonationModal: () => void;
  onOpenEligibilityModal: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  profile,
  donations,
  eligibility,
  onNavigate,
  onOpenNewDonationModal,
  onOpenEligibilityModal,
}) => {
  const firstName = profile?.nome ? profile.nome.split(' ')[0] : 'Doador';
  const totalDonations = donations.length;
  const currentYear = new Date().getFullYear();

  // Contagens por categoria
  const voluntariasCount = donations.filter((d) => d.categoriaDoacao !== 'destinada').length;
  const destinadasCount = donations.filter((d) => d.categoriaDoacao === 'destinada').length;

  // Última doação
  const sortedDonations = [...donations].sort(
    (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
  );
  const lastDonation = sortedDonations.length > 0 ? sortedDonations[0] : null;

  return (
    <div className="space-y-4 pb-24 animate-fadeIn">
      {/* 10.1 Saudação Personalizada */}
      <div className="pt-1 px-1 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-[#242424] dark:text-[#F3F4F6] tracking-tight">
            Olá, {firstName}! 👋
          </h2>
          <p className="text-xs text-[#777777] dark:text-[#9CA3AF]">
            Acompanhe o ritmo das suas doações e salve vidas.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DCECCB] dark:bg-[#1E3825] text-[#2d4d1e] dark:text-[#86EFAC] text-[11px] font-bold">
          <Activity className="w-3.5 h-3.5 animate-pulse text-[#D95757]" />
          <span>Ativo</span>
        </div>
      </div>

      {/* 1. TELA INICIAL — ELEMENTO PRINCIPAL DO BATIMENTO CARDÍACO */}
      {/* Utiliza diretamente a imagem anexada coracao_com_brilho_transparente_3d202c6f.png com pulso orgânico e sem o antigo fundo vermelho sobreposto */}
      <div
        onClick={onOpenEligibilityModal}
        className="cursor-pointer group relative overflow-hidden rounded-[30px] p-5 sm:p-6 bg-gradient-to-br from-[#FFFFFF] to-[#FBFBF9] dark:from-[#1C1C21] dark:to-[#17171B] border border-[#E9E9E6] dark:border-[#2E2E36] shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
      >
        {/* Glow sutil de fundo sem poluição visual */}
        <div className="absolute top-1/2 right-4 -translate-y-1/2 w-48 h-48 bg-red-500/10 dark:bg-red-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 relative z-10">
          {/* Informações da Próxima Doação */}
          <div className="space-y-2 flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D95757] animate-pulse" />
              <span className="text-xs font-bold tracking-wider uppercase text-[#D95757]">
                Ritmo & Próxima Doação
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#242424] dark:text-[#F3F4F6] tracking-tight">
              {eligibility.aptoEstimado
                ? 'Você já pode doar!'
                : eligibility.proximaDataEstimada
                ? formatDateBR(eligibility.proximaDataEstimada)
                : 'Data a definir'}
            </h3>

            <p className="text-xs text-[#666666] dark:text-[#A0A0A0] leading-relaxed max-w-sm">
              {eligibility.aptoEstimado
                ? 'Seu intervalo regulamentar foi concluído. Agende seu comparecimento ao hemocentro!'
                : `Faltam ${eligibility.diasRestantes} dias para cumprir o intervalo médico seguro.`}
            </p>

            {/* Linha de ECG fluida e elegante */}
            <div className="w-full max-w-[220px] h-6 flex items-center justify-center sm:justify-start overflow-hidden pt-1">
              <svg
                viewBox="0 0 220 30"
                className="w-full h-6 stroke-[#D95757] drop-shadow-[0_0_6px_rgba(217,87,87,0.6)]"
                fill="none"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path
                  d="M 0 15 L 50 15 L 60 11 L 68 15 L 78 15 L 88 2 L 100 28 L 109 15 L 118 15 L 128 9 L 138 15 L 220 15"
                  className="animate-ecg-stroke"
                />
              </svg>
            </div>
          </div>

          {/* Elemento Visual do Batimento Cardíaco: A imagem 3D transparente fornecida */}
          <div className="relative shrink-0 flex items-center justify-center">
            <div className="relative animate-heartbeat flex items-center justify-center">
              <img
                src="/assets/aistudio/coracao_com_brilho_transparente_3d202c6f.png"
                alt="Batimento Cardíaco"
                className="w-32 sm:w-36 h-auto max-h-[150px] object-contain drop-shadow-[0_8px_25px_rgba(217,87,87,0.45)] select-none pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Status / Ação Rápida */}
        <div className="mt-4 pt-3.5 border-t border-[#E9E9E6]/80 dark:border-[#2E2E36] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-3 py-1 rounded-full font-bold ${
                eligibility.aptoEstimado
                  ? 'bg-[#DCECCB] dark:bg-[#1E3825] text-[#2d4d1e] dark:text-[#86EFAC]'
                  : eligibility.statusTipo === 'limite_atingido'
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200'
                  : 'bg-[#BDE8F0] dark:bg-[#1A363D] text-[#1b4b57] dark:text-[#7DD3FC]'
              }`}
            >
              {eligibility.aptoEstimado
                ? 'Elegível para Doar'
                : `${eligibility.diasRestantes} dias restantes`}
            </span>
            <span className="text-[11px] text-[#777777] dark:text-[#9CA3AF]">
              {eligibility.tipoUltimaDoacao
                ? getDonationTypeLabel(eligibility.tipoUltimaDoacao)
                : 'Sangue Total'}
            </span>
          </div>

          <button
            type="button"
            className="flex items-center gap-1 text-xs font-bold text-[#D95757] group-hover:translate-x-1 transition-transform"
          >
            <span>Ver detalhes médicos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Disclaimer médico */}
        <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-[#888888] dark:text-[#9CA3AF]">
          <Info className="w-3 h-3 shrink-0" />
          <span>Estimativa informativa. A aptidão final cabe à equipe de triagem do hemocentro.</span>
        </div>
      </div>

      {/* 10.3 Cartões Estatísticos com Suporte a Doações Voluntárias e Destinadas */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        {/* Total de doações */}
        <div
          onClick={() => onNavigate('donations')}
          className="cursor-pointer bg-[#FFFFFF] dark:bg-[#1A1A1E] border border-[#E9E9E6] dark:border-[#2E2E36] rounded-[24px] p-3 sm:p-4 text-center transition-all shadow-xs hover:border-[#D95757]/40 flex flex-col justify-between"
        >
          <div className="w-8 h-8 mx-auto rounded-xl bg-[#F5D9D5] dark:bg-[#3E1F1F] flex items-center justify-center text-[#D95757] mb-1">
            <Droplet className="w-4 h-4 fill-current" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#242424] dark:text-[#F3F4F6]">
            {totalDonations}
          </div>
          <span className="text-[11px] font-semibold text-[#777777] dark:text-[#9CA3AF] leading-tight">
            Total Geral
          </span>
        </div>

        {/* Voluntárias */}
        <div
          onClick={() => onNavigate('donations')}
          className="cursor-pointer bg-[#DCECCB]/60 dark:bg-[#1E3825]/60 hover:bg-[#DCECCB] dark:hover:bg-[#1E3825] border border-[#DCECCB] dark:border-[#2E5E3A] rounded-[24px] p-3 sm:p-4 text-center transition-all shadow-xs flex flex-col justify-between"
        >
          <div className="w-8 h-8 mx-auto rounded-xl bg-white/70 dark:bg-black/30 flex items-center justify-center text-[#2d4d1e] dark:text-[#86EFAC] mb-1">
            <Users className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#1E3E17] dark:text-[#86EFAC]">
            {voluntariasCount}
          </div>
          <span className="text-[11px] font-semibold text-[#2d4d1e] dark:text-[#86EFAC] leading-tight">
            Voluntárias
          </span>
        </div>

        {/* Destinadas a Pacientes */}
        <div
          onClick={() => onNavigate('donations')}
          className="cursor-pointer bg-[#BDE8F0]/60 dark:bg-[#1A363D]/60 hover:bg-[#BDE8F0] dark:hover:bg-[#1A363D] border border-[#BDE8F0] dark:border-[#204750] rounded-[24px] p-3 sm:p-4 text-center transition-all shadow-xs flex flex-col justify-between"
        >
          <div className="w-8 h-8 mx-auto rounded-xl bg-white/70 dark:bg-black/30 flex items-center justify-center text-[#133B44] dark:text-[#7DD3FC] mb-1">
            <UserCheck className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#133B44] dark:text-[#7DD3FC]">
            {destinadasCount}
          </div>
          <span className="text-[11px] font-semibold text-[#133B44] dark:text-[#7DD3FC] leading-tight">
            Direcionadas
          </span>
        </div>
      </div>

      {/* 10.4 Última Doação Registrada */}
      <div className="rounded-[28px] p-5 bg-[#FFFFFF] dark:bg-[#1A1A1E] border border-[#E9E9E6] dark:border-[#2E2E36] shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#D95757]" />
            <h4 className="text-sm font-bold text-[#242424] dark:text-[#F3F4F6]">
              Última Doação Registrada
            </h4>
          </div>
          <button
            onClick={() => onNavigate('donations')}
            className="text-xs font-semibold text-[#777777] dark:text-[#9CA3AF] hover:text-[#D95757] transition-colors"
          >
            Ver histórico
          </button>
        </div>

        {lastDonation ? (
          <div className="bg-[#F7F7F5] dark:bg-[#232329] p-3.5 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#242424] dark:text-[#F3F4F6]">
                  {formatDateBR(lastDonation.data)}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    lastDonation.categoriaDoacao === 'destinada'
                      ? 'bg-[#BDE8F0] dark:bg-[#1A363D] text-[#133B44] dark:text-[#7DD3FC]'
                      : 'bg-[#DCECCB] dark:bg-[#1E3825] text-[#1E3E17] dark:text-[#86EFAC]'
                  }`}
                >
                  {lastDonation.categoriaDoacao === 'destinada'
                    ? `Destinada: ${lastDonation.destinatarioNome || 'Paciente'}`
                    : 'Voluntária'}
                </span>
              </div>
              <p className="text-xs text-[#777777] dark:text-[#9CA3AF] truncate max-w-[200px] sm:max-w-xs">
                {lastDonation.hemocentro}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-[#2d4d1e] dark:text-[#86EFAC] bg-[#DCECCB] dark:bg-[#1E3825] px-2.5 py-1 rounded-xl">
                Concluída
              </span>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-[#F7F7F5] dark:bg-[#232329] text-center space-y-2">
            <p className="text-xs text-[#777777] dark:text-[#9CA3AF]">
              Você ainda não cadastrou nenhuma doação anterior.
            </p>
            <button
              onClick={onOpenNewDonationModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D95757] text-white text-xs font-bold hover:bg-[#c24a4a] transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Registrar Primeira Doação</span>
            </button>
          </div>
        )}
      </div>

      {/* 10.5 Atalhos Rápidos */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#777777] dark:text-[#9CA3AF] px-1">
          Ações Rápidas
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {/* Atalho 1: Registrar doação */}
          <button
            onClick={onOpenNewDonationModal}
            className="p-4 rounded-[24px] bg-[#FFFFFF] dark:bg-[#1A1A1E] hover:bg-[#fafaf8] dark:hover:bg-[#222228] border border-[#E9E9E6] dark:border-[#2E2E36] shadow-xs flex items-center gap-3 text-left transition-all active:scale-[0.99]"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#D95757] text-white flex items-center justify-center shrink-0 shadow-sm shadow-red-200">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#242424] dark:text-[#F3F4F6] block">
                Nova Doação
              </span>
              <span className="text-[10px] text-[#777777] dark:text-[#9CA3AF]">
                Voluntária ou destinada
              </span>
            </div>
          </button>

          {/* Atalho 2: Meu Cartão */}
          <button
            onClick={() => onNavigate('card')}
            className="p-4 rounded-[24px] bg-[#FFFFFF] dark:bg-[#1A1A1E] hover:bg-[#fafaf8] dark:hover:bg-[#222228] border border-[#E9E9E6] dark:border-[#2E2E36] shadow-xs flex items-center gap-3 text-left transition-all active:scale-[0.99]"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#BDE8F0] dark:bg-[#1A363D] text-[#1b4b57] dark:text-[#7DD3FC] flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#242424] dark:text-[#F3F4F6] block">
                Meu Cartão
              </span>
              <span className="text-[10px] text-[#777777] dark:text-[#9CA3AF]">
                Comprovante PNG
              </span>
            </div>
          </button>

          {/* Atalho 3: Posso Doar? */}
          <button
            onClick={onOpenEligibilityModal}
            className="p-4 rounded-[24px] bg-[#FFFFFF] dark:bg-[#1A1A1E] hover:bg-[#fafaf8] dark:hover:bg-[#222228] border border-[#E9E9E6] dark:border-[#2E2E36] shadow-xs flex items-center gap-3 text-left transition-all active:scale-[0.99]"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#DCECCB] dark:bg-[#1E3825] text-[#2d4d1e] dark:text-[#86EFAC] flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#242424] dark:text-[#F3F4F6] block">
                Posso Doar?
              </span>
              <span className="text-[10px] text-[#777777] dark:text-[#9CA3AF]">
                Intervalo e prazos
              </span>
            </div>
          </button>

          {/* Atalho 4: Guia para Doar */}
          <button
            onClick={() => onNavigate('guide')}
            className="p-4 rounded-[24px] bg-[#FFFFFF] dark:bg-[#1A1A1E] hover:bg-[#fafaf8] dark:hover:bg-[#222228] border border-[#E9E9E6] dark:border-[#2E2E36] shadow-xs flex items-center gap-3 text-left transition-all active:scale-[0.99]"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#F5D9D5] dark:bg-[#3E1F1F] text-[#D95757] flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#242424] dark:text-[#F3F4F6] block">
                Guia do Doador
              </span>
              <span className="text-[10px] text-[#777777] dark:text-[#9CA3AF]">
                Preparo e triagem
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
