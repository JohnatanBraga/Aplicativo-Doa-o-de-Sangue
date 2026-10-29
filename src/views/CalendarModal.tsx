/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Calendar as CalendarIcon,
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  Bell,
  Droplet,
  Clock,
} from 'lucide-react';
import { DonationRecord, EligibilityStatus, Reminder, UserProfile } from '../types';
import { formatDateBR } from '../utils/eligibilityRules';
import { addReminder, deleteReminder, toggleReminder } from '../services/storageService';

interface CalendarModalProps {
  isOpen: boolean;
  profile: UserProfile | null;
  donations: DonationRecord[];
  eligibility: EligibilityStatus;
  reminders: Reminder[];
  onClose: () => void;
  onRefreshReminders: () => void;
}

export const CalendarModal: React.FC<CalendarModalProps> = ({
  isOpen,
  profile,
  donations,
  eligibility,
  reminders,
  onClose,
  onRefreshReminders,
}) => {
  const [novoTitulo, setNovoTitulo] = useState('');
  const [novaData, setNovaData] = useState(
    eligibility.proximaDataEstimada || new Date().toISOString().split('T')[0]
  );
  const [novaDescricao, setNovaDescricao] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !novoTitulo.trim() || !novaData) return;

    addReminder(profile.uid, {
      titulo: novoTitulo.trim(),
      data: novaData,
      descricao: novaDescricao.trim() || undefined,
      concluido: false,
    });

    setNovoTitulo('');
    setNovaDescricao('');
    setIsAdding(false);
    onRefreshReminders();
  };

  const handleToggle = (id: string) => {
    if (!profile) return;
    toggleReminder(profile.uid, id);
    onRefreshReminders();
  };

  const handleDelete = (id: string) => {
    if (!profile) return;
    deleteReminder(profile.uid, id);
    onRefreshReminders();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FFFFFF] dark:bg-[#1A1A1E] w-full max-w-md rounded-[28px] p-6 shadow-2xl border border-[#E9E9E6] dark:border-[#2E2E36] relative max-h-[90vh] flex flex-col text-[#242424] dark:text-[#EEEEEE]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E9E9E6] dark:border-[#2E2E36]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#BDE8F0] dark:bg-[#173842] text-[#1b4b57] dark:text-[#BDE8F0] flex items-center justify-center">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#242424] dark:text-white">Calendário & Lembretes</h3>
              <p className="text-[11px] text-[#777777] dark:text-[#A0A0A5]">Organize suas próximas doações</p>
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
          {/* Próxima data de elegibilidade sugerida */}
          {eligibility.proximaDataEstimada && (
            <div className="p-3.5 rounded-2xl bg-[#DCECCB]/50 dark:bg-[#1C2C16]/50 border border-[#A8C98B] dark:border-[#335522] flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-[#2d4d1e] dark:text-[#A8C98B] tracking-wider block">
                  Data Sugerida pelo Sistema
                </span>
                <span className="text-sm font-extrabold text-[#242424] dark:text-white">
                  {formatDateBR(eligibility.proximaDataEstimada)}
                </span>
                <p className="text-[11px] text-[#555555] dark:text-[#A0A0A5]">
                  Intervalo mínimo completado para nova doação.
                </p>
              </div>
              <button
                onClick={() => {
                  setNovaData(eligibility.proximaDataEstimada || '');
                  setNovoTitulo('Doação de Sangue no HEMOMAR');
                  setIsAdding(true);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-[#2d4d1e] dark:bg-[#3E6B2A] text-white text-[11px] font-bold hover:bg-[#233d18] transition-colors shrink-0"
              >
                + Criar Lembrete
              </button>
            </div>
          )}

          {/* Form para adicionar lembrete */}
          {isAdding ? (
            <form onSubmit={handleAdd} className="p-4 rounded-2xl bg-[#F7F7F5] dark:bg-[#25252B] border border-[#E9E9E6] dark:border-[#2E2E36] space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#242424] dark:text-white">Novo Lembrete Interno</span>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="text-xs text-[#777777] dark:text-[#A0A0A5] hover:text-[#242424] dark:hover:text-white"
                >
                  Cancelar
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#242424] dark:text-[#D1D1D6] mb-1">
                  Título do Lembrete
                </label>
                <input
                  type="text"
                  placeholder="Ex: Doar sangue no HEMOMAR"
                  value={novoTitulo}
                  onChange={(e) => setNovoTitulo(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#1A1A1E] border border-[#E9E9E6] dark:border-[#383842] text-xs text-[#242424] dark:text-white focus:outline-none focus:border-[#D95757]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#242424] dark:text-[#D1D1D6] mb-1">Data</label>
                <input
                  type="date"
                  value={novaData}
                  onChange={(e) => setNovaData(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#1A1A1E] border border-[#E9E9E6] dark:border-[#383842] text-xs text-[#242424] dark:text-white focus:outline-none focus:border-[#D95757]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#242424] dark:text-[#D1D1D6] mb-1">
                  Observações (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Beber água e levar RG original"
                  value={novaDescricao}
                  onChange={(e) => setNovaDescricao(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#1A1A1E] border border-[#E9E9E6] dark:border-[#383842] text-xs text-[#242424] dark:text-white focus:outline-none focus:border-[#D95757]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-[#D95757] text-white font-bold text-xs hover:bg-[#c24a4a] transition-colors"
              >
                Salvar Lembrete
              </button>
            </form>
          ) : (
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#242424] dark:text-white">Meus Lembretes ({reminders.length})</span>
              <button
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-1 text-xs font-bold text-[#D95757] dark:text-[#F57070] hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar</span>
              </button>
            </div>
          )}

          {/* Lista de Lembretes */}
          <div className="space-y-2">
            {reminders.length === 0 ? (
              <div className="p-4 rounded-2xl bg-[#F7F7F5] dark:bg-[#25252B] text-center text-[#777777] dark:text-[#A0A0A5]">
                <Bell className="w-6 h-6 mx-auto mb-1 text-[#888888] dark:text-[#A0A0A5]" />
                <p>Nenhum lembrete interno cadastrado.</p>
              </div>
            ) : (
              reminders.map((rem) => (
                <div
                  key={rem.id}
                  className={`p-3 rounded-2xl border flex items-start justify-between gap-2 transition-all ${
                    rem.concluido
                      ? 'bg-[#F7F7F5] dark:bg-[#202026] border-[#E9E9E6] dark:border-[#2E2E36] opacity-60'
                      : 'bg-white dark:bg-[#25252B] border-[#E9E9E6] dark:border-[#2E2E36] shadow-xs'
                  }`}
                >
                  <div
                    onClick={() => handleToggle(rem.id)}
                    className="flex items-start gap-2.5 cursor-pointer flex-1"
                  >
                    <button type="button" className="mt-0.5 text-[#2d4d1e] dark:text-[#A8C98B]">
                      {rem.concluido ? (
                        <CheckCircle2 className="w-4 h-4 fill-[#2d4d1e] dark:fill-[#A8C98B] text-white dark:text-[#1A1A1E]" />
                      ) : (
                        <Circle className="w-4 h-4 text-[#888888] dark:text-[#A0A0A5]" />
                      )}
                    </button>
                    <div>
                      <span
                        className={`text-xs block font-bold text-[#242424] dark:text-white ${
                          rem.concluido ? 'line-through text-[#888888] dark:text-[#777780]' : ''
                        }`}
                      >
                        {rem.titulo}
                      </span>
                      <span className="text-[11px] text-[#D95757] dark:text-[#F57070] font-semibold">
                        {formatDateBR(rem.data)}
                      </span>
                      {rem.descricao && (
                        <p className="text-[10px] text-[#777777] dark:text-[#A0A0A5] mt-0.5">{rem.descricao}</p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(rem.id)}
                    className="w-7 h-7 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-[#888888] dark:text-[#A0A0A5] hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#E9E9E6] dark:border-[#2E2E36] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#242424] dark:bg-[#32323A] text-white text-xs font-bold hover:bg-black dark:hover:bg-[#40404C] transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
