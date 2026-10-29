/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Droplet,
  Calendar,
  MapPin,
  UserCheck,
  Building2,
  CreditCard,
  Scale,
  FileText,
  Users,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ShieldCheck,
} from 'lucide-react';
import { DonationRecord } from '../types';
import { formatDateBR, getDonationTypeLabel } from '../utils/eligibilityRules';

interface DonationDetailModalProps {
  donation: DonationRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (donation: DonationRecord) => void;
  onDelete: (donation: DonationRecord) => void;
}

export const DonationDetailModal: React.FC<DonationDetailModalProps> = ({
  donation,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  const [showFullCpf, setShowFullCpf] = useState(false);

  if (!isOpen || !donation) return null;

  const isDestinada = donation.categoriaDoacao === 'destinada';

  // Máscara de CPF para privacidade: 123.***.***-00
  const getMaskedCpf = (cpf?: string) => {
    if (!cpf) return '';
    const clean = cpf.replace(/\D/g, '');
    if (clean.length === 11) {
      return `${clean.substring(0, 3)}.***.***-${clean.substring(9, 11)}`;
    }
    return '***.***.***-**';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FFFFFF] dark:bg-[#1A1A1E] text-[#242424] dark:text-[#F3F4F6] w-full max-w-md rounded-[28px] p-6 shadow-2xl border border-[#E9E9E6] dark:border-[#2E2E36] relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E9E9E6] dark:border-[#2E2E36]">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-2xl flex items-center justify-center ${
                isDestinada
                  ? 'bg-[#BDE8F0] dark:bg-[#1A363D] text-[#133B44] dark:text-[#7DD3FC]'
                  : 'bg-[#DCECCB] dark:bg-[#1E3825] text-[#1E3E17] dark:text-[#86EFAC]'
              }`}
            >
              {isDestinada ? <UserCheck className="w-5 h-5" /> : <Users className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-[#242424] dark:text-[#F3F4F6]">
                Detalhes da Doação
              </h3>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                  isDestinada
                    ? 'bg-[#BDE8F0] dark:bg-[#1A363D] text-[#133B44] dark:text-[#7DD3FC]'
                    : 'bg-[#DCECCB] dark:bg-[#1E3825] text-[#1E3E17] dark:text-[#86EFAC]'
                }`}
              >
                {isDestinada ? 'Doação Direcionada a Paciente' : 'Doação Voluntária'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#F7F7F5] dark:bg-[#25252B] hover:bg-[#E9E9E6] dark:hover:bg-[#32323A] flex items-center justify-center text-[#777777] dark:text-[#A0A0A0] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto space-y-3.5 py-4 text-xs pr-1">
          {/* Card Destinatário se for direcionada */}
          {isDestinada ? (
            <div className="p-4 rounded-2xl bg-[#EBF7F9] dark:bg-[#15272B] border border-[#BDE8F0] dark:border-[#204750] space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#133B44] dark:text-[#7DD3FC] block">
                Destinatário da Doação
              </span>
              <div className="text-base font-extrabold text-[#133B44] dark:text-[#E0F2FE]">
                {donation.destinatarioNome || 'Nome não especificado'}
              </div>

              {donation.destinatarioHospital && (
                <div className="flex items-center gap-1.5 text-xs text-[#35616B] dark:text-[#93C5CF]">
                  <Building2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Hospital: <strong>{donation.destinatarioHospital}</strong></span>
                </div>
              )}

              {donation.destinatarioCpf && (
                <div className="flex items-center justify-between text-xs pt-1 border-t border-[#BDE8F0]/80 dark:border-[#204750]/80 text-[#35616B] dark:text-[#93C5CF]">
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 shrink-0" />
                    <span>CPF: <strong>{showFullCpf ? donation.destinatarioCpf : getMaskedCpf(donation.destinatarioCpf)}</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowFullCpf(!showFullCpf)}
                    className="text-[10px] text-[#133B44] dark:text-[#7DD3FC] hover:underline flex items-center gap-1"
                  >
                    {showFullCpf ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showFullCpf ? 'Ocultar' : 'Ver CPF'}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-[#DCECCB]/40 dark:bg-[#1E3825]/40 border border-[#A8C98B] dark:border-[#2E5E3A] space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E3E17] dark:text-[#86EFAC]">
                <Users className="w-4 h-4" />
                <span>Doação Voluntária Sem Destinatário Específico</span>
              </div>
              <p className="text-[11px] text-[#3b6631] dark:text-[#94D4A4]">
                Esta doação foi realizada para o estoque geral do hemocentro, atendendo a qualquer paciente necessitado no estado.
              </p>
            </div>
          )}

          {/* Dados Gerais da Doação */}
          <div className="p-4 rounded-2xl bg-[#F7F7F5] dark:bg-[#232329] border border-[#E9E9E6] dark:border-[#2E2E36] space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#D95757]" />
                <span className="font-semibold text-[#777777] dark:text-[#9CA3AF]">Data da Coleta:</span>
              </div>
              <strong className="text-sm text-[#242424] dark:text-[#F3F4F6]">
                {formatDateBR(donation.data)}
              </strong>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#D95757]" />
                <span className="font-semibold text-[#777777] dark:text-[#9CA3AF]">Local / Hemocentro:</span>
              </div>
              <strong className="text-right text-[#242424] dark:text-[#F3F4F6] truncate max-w-[180px]">
                {donation.hemocentro}
              </strong>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplet className="w-4 h-4 text-[#D95757]" />
                <span className="font-semibold text-[#777777] dark:text-[#9CA3AF]">Modalidade:</span>
              </div>
              <strong className="text-[#242424] dark:text-[#F3F4F6]">
                {getDonationTypeLabel(donation.tipoDoacao)}
              </strong>
            </div>

            {donation.pesoNoDia && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-[#777777]" />
                  <span className="font-semibold text-[#777777] dark:text-[#9CA3AF]">Peso registrado:</span>
                </div>
                <strong className="text-[#242424] dark:text-[#F3F4F6]">{donation.pesoNoDia} kg</strong>
              </div>
            )}
          </div>

          {/* Observações */}
          {donation.observacoes && (
            <div className="p-3.5 rounded-2xl bg-[#F7F7F5] dark:bg-[#232329] border border-[#E9E9E6] dark:border-[#2E2E36] space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#777777] dark:text-[#9CA3AF]">
                <FileText className="w-3.5 h-3.5" />
                <span>Observações Registradas:</span>
              </div>
              <p className="text-xs text-[#444444] dark:text-[#D1D5DB] italic">
                "{donation.observacoes}"
              </p>
            </div>
          )}

          {/* Privacidade */}
          <div className="flex items-center gap-1.5 text-[10px] text-gray-500 dark:text-gray-400 px-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Registro seguro e confidencial armazenado em sua conta.</span>
          </div>
        </div>

        {/* Footer Actions: Editar / Excluir / Fechar */}
        <div className="pt-3 border-t border-[#E9E9E6] dark:border-[#2E2E36] flex items-center justify-between gap-2">
          <button
            onClick={() => {
              onClose();
              onDelete(donation);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Excluir</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(donation);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F7F7F5] dark:bg-[#25252B] hover:bg-[#E9E9E6] text-xs font-bold text-[#242424] dark:text-[#F3F4F6] transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Editar</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#242424] dark:bg-[#F3F4F6] text-white dark:text-[#121214] text-xs font-bold hover:opacity-90 transition-opacity"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
