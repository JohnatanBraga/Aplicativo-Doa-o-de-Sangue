/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  X,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Heart,
  Droplet,
  Info,
  ShieldCheck,
} from 'lucide-react';
import { EligibilityStatus, UserProfile } from '../types';
import { formatDateBR, getDonationTypeLabel } from '../utils/eligibilityRules';

interface EligibilityModalProps {
  isOpen: boolean;
  eligibility: EligibilityStatus;
  profile: UserProfile | null;
  onClose: () => void;
  onGoToGuide: () => void;
}

export const EligibilityModal: React.FC<EligibilityModalProps> = ({
  isOpen,
  eligibility,
  profile,
  onClose,
  onGoToGuide,
}) => {
  if (!isOpen) return null;

  const currentYear = new Date().getFullYear();
  const genderLabel =
    profile?.genero === 'F'
      ? 'Feminino (90 dias / até 3 doações por ano)'
      : 'Masculino (60 dias / até 4 doações por ano)';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FFFFFF] dark:bg-[#1A1A1E] w-full max-w-md rounded-[28px] p-6 shadow-2xl border border-[#E9E9E6] dark:border-[#2E2E36] relative max-h-[90vh] flex flex-col text-[#242424] dark:text-[#EEEEEE]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E9E9E6] dark:border-[#2E2E36]">
          <div className="flex items-center gap-2">
            <div
              className={`w-9 h-9 rounded-2xl flex items-center justify-center ${
                eligibility.aptoEstimado
                  ? 'bg-[#DCECCB] dark:bg-[#203618] text-[#2d4d1e] dark:text-[#A8C98B]'
                  : 'bg-[#F5D9D5] dark:bg-[#3D1E1E] text-[#D95757] dark:text-[#F5A3A3]'
              }`}
            >
              {eligibility.aptoEstimado ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <Clock className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-[#242424] dark:text-white">Posso Doar Novamente?</h3>
              <span className="text-[11px] text-[#777777] dark:text-[#A0A0A5]">
                Estimativa com base nos intervalos regulamentares
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#F7F7F5] dark:bg-[#25252B] hover:bg-[#E9E9E6] dark:hover:bg-[#32323A] flex items-center justify-center text-[#777777] dark:text-[#A0A0A5] hover:text-[#242424] dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto space-y-4 py-3 pr-1 text-xs">
          {/* Main Status Hero Card */}
          <div
            className={`p-4 rounded-2xl border ${
              eligibility.aptoEstimado
                ? 'bg-[#DCECCB]/40 dark:bg-[#1C2C16]/50 border-[#A8C98B] dark:border-[#335522]'
                : eligibility.statusTipo === 'limite_atingido'
                ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50'
                : 'bg-[#BDE8F0]/40 dark:bg-[#122A30]/50 border-[#BDE8F0] dark:border-[#1E4852]'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#555555] dark:text-[#9E9EA4]">
                  Situação Estimada
                </span>
                <h4 className="text-lg font-extrabold text-[#242424] dark:text-white mt-0.5">
                  {eligibility.statusTexto}
                </h4>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white dark:bg-[#25252B] text-[#242424] dark:text-white shadow-xs">
                {eligibility.aptoEstimado
                  ? 'Elegível'
                  : `${eligibility.diasRestantes} dias restantes`}
              </span>
            </div>

            <p className="mt-2 text-xs text-[#444444] dark:text-[#C5C5CB] leading-relaxed">
              {eligibility.mensagem}
            </p>
          </div>

          {/* Comparativo de Períodos: Ano Civil vs Janela Móvel de 12 Meses */}
          <div className="space-y-2">
            <span className="font-bold text-[#242424] dark:text-white block">
              Contagem e Limites Regulamentares
            </span>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-2xl bg-[#F7F7F5] dark:bg-[#25252B] border border-[#E9E9E6] dark:border-[#2E2E36]">
                <span className="text-[10px] text-[#777777] dark:text-[#A0A0A5] block">Ano Civil ({currentYear})</span>
                <div className="text-xl font-extrabold text-[#242424] dark:text-white mt-0.5">
                  {eligibility.doacoesAnoCivil}
                  <span className="text-xs font-normal text-[#777777] dark:text-[#A0A0A5]">
                    {' '}
                    / {eligibility.limiteMaximo12Meses} máx.
                  </span>
                </div>
                <span className="text-[10px] text-[#555555] dark:text-[#888890]">1º Jan a 31 Dez</span>
              </div>

              <div className="p-3 rounded-2xl bg-[#F7F7F5] dark:bg-[#25252B] border border-[#E9E9E6] dark:border-[#2E2E36]">
                <span className="text-[10px] text-[#777777] dark:text-[#A0A0A5] block">Últimos 12 Meses (Móvel)</span>
                <div className="text-xl font-extrabold text-[#D95757] dark:text-[#F57070] mt-0.5">
                  {eligibility.doacoesUltimos12Meses}
                  <span className="text-xs font-normal text-[#777777] dark:text-[#A0A0A5]">
                    {' '}
                    / {eligibility.limiteMaximo12Meses} máx.
                  </span>
                </div>
                <span className="text-[10px] text-[#555555] dark:text-[#888890]">
                  {eligibility.doacoesRestantes12Meses} vaga(s) restante(s)
                </span>
              </div>
            </div>
          </div>

          {/* Dados de Referência Aplicados */}
          <div className="p-3.5 rounded-2xl bg-[#F7F7F5] dark:bg-[#25252B] border border-[#E9E9E6] dark:border-[#2E2E36] space-y-2">
            <span className="font-bold text-[#242424] dark:text-white block">Parâmetros de Cálculo</span>
            <div className="space-y-1 text-[11px] text-[#555555] dark:text-[#A0A0A5]">
              <div className="flex justify-between">
                <span>Perfil cadastrado:</span>
                <strong className="text-[#242424] dark:text-white">{genderLabel}</strong>
              </div>
              <div className="flex justify-between">
                <span>Última doação:</span>
                <strong className="text-[#242424] dark:text-white">
                  {eligibility.dataUltimaDoacao
                    ? formatDateBR(eligibility.dataUltimaDoacao)
                    : 'Nenhuma anterior'}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Intervalo mínimo exigido:</span>
                <strong className="text-[#242424] dark:text-white">{eligibility.intervaloMinimoDias} dias</strong>
              </div>
              <div className="flex justify-between">
                <span>Próxima data calculada:</span>
                <strong className="text-[#D95757] dark:text-[#F57070]">
                  {eligibility.proximaDataEstimada
                    ? formatDateBR(eligibility.proximaDataEstimada)
                    : 'Imediata'}
                </strong>
              </div>
            </div>
          </div>

          {/* Detalhes informativos */}
          <div className="space-y-1.5">
            <span className="font-bold text-[#242424] dark:text-white block">Critérios Observados</span>
            <ul className="space-y-1 text-[11px] text-[#666666] dark:text-[#A0A0A5] list-disc list-inside">
              {eligibility.detalhes.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Aviso Legal de Triagem */}
          <div className="p-3 rounded-2xl bg-[#F7F7F5] dark:bg-[#25252B] border border-[#E9E9E6] dark:border-[#2E2E36] flex items-start gap-2 text-[10px] text-[#777777] dark:text-[#A0A0A5]">
            <Info className="w-4 h-4 text-[#888888] dark:text-[#9999A0] shrink-0 mt-0.5" />
            <span>
              <strong>Atenção:</strong> Estar abaixo do limite e dentro do prazo não garante a
              aptidão. No dia da doação, o hemocentro realizará hematócrito, aferição de pressão e
              entrevista de triagem que determinarão a liberação médica da coleta.
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-[#E9E9E6] dark:border-[#2E2E36] flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onGoToGuide();
            }}
            className="text-xs font-semibold text-[#D95757] dark:text-[#F57070] hover:underline"
          >
            Ver Guia de Preparação
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#242424] dark:bg-[#D95757] text-white text-xs font-bold hover:bg-black dark:hover:bg-[#C24545] transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
