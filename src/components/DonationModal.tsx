/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  MapPin,
  Droplet,
  Scale,
  FileText,
  AlertTriangle,
  UserCheck,
  Building2,
  CreditCard,
  Users,
  Heart,
  ShieldAlert,
} from 'lucide-react';
import { DonationCategory, DonationRecord, DonationType, UserProfile } from '../types';

interface DonationModalProps {
  isOpen: boolean;
  initialDonation?: DonationRecord | null;
  profile: UserProfile | null;
  existingDonations: DonationRecord[];
  onClose: () => void;
  onSave: (donationData: {
    data: string;
    hemocentro: string;
    cidade: string;
    estado: string;
    tipoDoacao: DonationType;
    categoriaDoacao: DonationCategory;
    destinatarioNome?: string;
    destinatarioCpf?: string;
    destinatarioHospital?: string;
    pesoNoDia?: number;
    observacoes?: string;
  }) => void;
}

export const DonationModal: React.FC<DonationModalProps> = ({
  isOpen,
  initialDonation,
  profile,
  existingDonations,
  onClose,
  onSave,
}) => {
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [hemocentro, setHemocentro] = useState('HEMOMAR - Centro de Hematologia e Hemoterapia do Maranhão');
  const [cidade, setCidade] = useState('São Luís');
  const [estado, setEstado] = useState('MA');
  const [tipoDoacao, setTipoDoacao] = useState<DonationType>('sangue_total');

  // Nova funcionalidade: Categoria da doação (Voluntária vs Destinada)
  const [categoriaDoacao, setCategoriaDoacao] = useState<DonationCategory>('voluntaria');
  const [destinatarioNome, setDestinatarioNome] = useState('');
  const [destinatarioCpf, setDestinatarioCpf] = useState('');
  const [destinatarioHospital, setDestinatarioHospital] = useState('');

  const [pesoNoDia, setPesoNoDia] = useState<string>('72');
  const [observacoes, setObservacoes] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [warningMsg, setWarningMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialDonation) {
      setData(initialDonation.data);
      setHemocentro(initialDonation.hemocentro);
      setCidade(initialDonation.cidade);
      setEstado(initialDonation.estado);
      setTipoDoacao(initialDonation.tipoDoacao);
      setCategoriaDoacao(initialDonation.categoriaDoacao || 'voluntaria');
      setDestinatarioNome(initialDonation.destinatarioNome || '');
      setDestinatarioCpf(initialDonation.destinatarioCpf || '');
      setDestinatarioHospital(initialDonation.destinatarioHospital || '');
      setPesoNoDia(initialDonation.pesoNoDia ? String(initialDonation.pesoNoDia) : '');
      setObservacoes(initialDonation.observacoes || '');
    } else {
      setData(new Date().toISOString().split('T')[0]);
      setHemocentro(profile?.hemocentroReferencia || 'HEMOMAR - São Luís');
      setCidade(profile?.cidade || 'São Luís');
      setEstado(profile?.estado || 'MA');
      setTipoDoacao('sangue_total');
      setCategoriaDoacao('voluntaria');
      setDestinatarioNome('');
      setDestinatarioCpf('');
      setDestinatarioHospital('');
      setPesoNoDia(profile?.pesoAtual ? String(profile.pesoAtual) : '70');
      setObservacoes('');
    }
    setErrorMsg(null);
    setWarningMsg(null);
  }, [initialDonation, profile, isOpen]);

  // Checagem de duplicidade de data
  useEffect(() => {
    if (!data) return;
    const sameDay = existingDonations.find(
      (d) => d.data === data && (!initialDonation || d.id !== initialDonation.id)
    );
    if (sameDay) {
      setWarningMsg(`Atenção: Já existe uma doação cadastrada em ${data} no hemocentro ${sameDay.hemocentro}.`);
    } else {
      setWarningMsg(null);
    }
  }, [data, existingDonations, initialDonation]);

  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];

  // Formatação de CPF: 000.000.000-00
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.substring(0, 11);
    if (v.length > 9) {
      v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    } else if (v.length > 6) {
      v = v.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (v.length > 3) {
      v = v.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }
    setDestinatarioCpf(v);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validação de data futura
    if (data > todayStr) {
      setErrorMsg('Não é permitido registrar uma doação concluída com data futura.');
      return;
    }

    if (!hemocentro.trim()) {
      setErrorMsg('Informe o hemocentro ou posto de coleta.');
      return;
    }

    // Validação de doação destinada
    if (categoriaDoacao === 'destinada') {
      if (!destinatarioNome.trim()) {
        setErrorMsg('Para doações destinadas a uma pessoa, informe obrigatoriamente o nome do destinatário.');
        return;
      }
    }

    onSave({
      data,
      hemocentro: hemocentro.trim(),
      cidade: cidade.trim() || 'São Luís',
      estado: estado.trim() || 'MA',
      tipoDoacao,
      categoriaDoacao,
      destinatarioNome: categoriaDoacao === 'destinada' ? destinatarioNome.trim() : undefined,
      destinatarioCpf: categoriaDoacao === 'destinada' && destinatarioCpf.trim() ? destinatarioCpf.trim() : undefined,
      destinatarioHospital: categoriaDoacao === 'destinada' && destinatarioHospital.trim() ? destinatarioHospital.trim() : undefined,
      pesoNoDia: pesoNoDia ? parseFloat(pesoNoDia) : undefined,
      observacoes: observacoes.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FFFFFF] dark:bg-[#1A1A1E] text-[#242424] dark:text-[#F3F4F6] w-full max-w-lg rounded-[28px] p-5 sm:p-7 shadow-2xl border border-[#E9E9E6] dark:border-[#2E2E36] relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#E9E9E6] dark:border-[#2E2E36]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#F5D9D5] dark:bg-[#3E1F1F] text-[#D95757] flex items-center justify-center">
              <Droplet className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#242424] dark:text-[#F3F4F6]">
                {initialDonation ? 'Editar Registro de Doação' : 'Registrar Doação de Sangue'}
              </h3>
              <p className="text-[11px] text-[#777777] dark:text-[#9CA3AF]">
                Voluntária ou direcionada para um paciente específico
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#F7F7F5] dark:bg-[#25252B] hover:bg-[#E9E9E6] dark:hover:bg-[#32323A] flex items-center justify-center text-[#777777] dark:text-[#A0A0A0] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="mt-3 p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {warningMsg && (
          <div className="mt-3 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
            <span>{warningMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 py-3.5 pr-1 text-xs">
          {/* SELEÇÃO DO TIPO DE DOAÇÃO: VOLUNTÁRIA OU DESTINADA */}
          <div className="p-3.5 rounded-2xl bg-[#F7F7F5] dark:bg-[#232329] border border-[#E9E9E6] dark:border-[#2E2E36] space-y-2">
            <label className="block font-bold text-[#242424] dark:text-[#F3F4F6] text-xs">
              Tipo da Doação Realizada <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCategoriaDoacao('voluntaria')}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  categoriaDoacao === 'voluntaria'
                    ? 'bg-[#DCECCB] dark:bg-[#1E3825] border-[#A8C98B] dark:border-[#2E5E3A] text-[#1E3E17] dark:text-[#D1E7D5] font-bold shadow-xs'
                    : 'bg-white dark:bg-[#1A1A1E] border-[#E9E9E6] dark:border-[#2E2E36] text-[#666666] dark:text-[#9CA3AF] hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Users className="w-4 h-4 text-[#2d4d1e] dark:text-[#86EFAC]" />
                  <span className="text-xs">Doação Voluntária</span>
                </div>
                <span className="text-[10px] font-normal opacity-90 leading-tight">
                  Estoque geral para quem precisar
                </span>
              </button>

              <button
                type="button"
                onClick={() => setCategoriaDoacao('destinada')}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  categoriaDoacao === 'destinada'
                    ? 'bg-[#BDE8F0] dark:bg-[#1A363D] border-[#7DC4D3] dark:border-[#24525C] text-[#133B44] dark:text-[#C4E9F0] font-bold shadow-xs'
                    : 'bg-white dark:bg-[#1A1A1E] border-[#E9E9E6] dark:border-[#2E2E36] text-[#666666] dark:text-[#9CA3AF] hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <UserCheck className="w-4 h-4 text-[#133B44] dark:text-[#7DD3FC]" />
                  <span className="text-xs">Destinada a Pessoa</span>
                </div>
                <span className="text-[10px] font-normal opacity-90 leading-tight">
                  Para paciente específico ou cirurgia
                </span>
              </button>
            </div>
          </div>

          {/* CAMPOS ESPECÍFICOS DE DESTINATÁRIO (Exibidos se categoriaDoacao === 'destinada') */}
          {categoriaDoacao === 'destinada' && (
            <div className="p-3.5 rounded-2xl bg-[#EBF7F9] dark:bg-[#15272B] border border-[#BDE8F0] dark:border-[#204750] space-y-3 animate-fadeIn">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#133B44] dark:text-[#7DD3FC]">
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>Dados do Destinatário (Paciente)</span>
              </div>
              <p className="text-[10px] text-[#557E88] dark:text-[#88B8C2]">
                Informe os dados de quem receberá a doação (não preencha seus próprios dados aqui).
              </p>

              <div>
                <label className="block font-semibold text-[#133B44] dark:text-[#E0F2FE] mb-1">
                  Nome do Destinatário <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <UserCheck className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#557E88]" />
                  <input
                    type="text"
                    placeholder="Nome completo do paciente beneficiado"
                    value={destinatarioNome}
                    onChange={(e) => setDestinatarioNome(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-[#1A1A1E] border border-[#BDE8F0] dark:border-[#2E2E36] text-xs text-[#242424] dark:text-[#F3F4F6] focus:outline-none focus:border-[#D95757]"
                    required={categoriaDoacao === 'destinada'}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-semibold text-[#133B44] dark:text-[#E0F2FE] mb-1">
                    CPF do Destinatário <span className="text-[10px] font-normal opacity-70">(Opcional)</span>
                  </label>
                  <div className="relative">
                    <CreditCard className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#557E88]" />
                    <input
                      type="text"
                      placeholder="000.000.000-00"
                      value={destinatarioCpf}
                      onChange={handleCpfChange}
                      maxLength={14}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-[#1A1A1E] border border-[#BDE8F0] dark:border-[#2E2E36] text-xs text-[#242424] dark:text-[#F3F4F6] focus:outline-none focus:border-[#D95757]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#133B44] dark:text-[#E0F2FE] mb-1">
                    Hospital de Destino <span className="text-[10px] font-normal opacity-70">(Opcional)</span>
                  </label>
                  <div className="relative">
                    <Building2 className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#557E88]" />
                    <input
                      type="text"
                      placeholder="Ex: Hospital UDI, São Domingos"
                      value={destinatarioHospital}
                      onChange={(e) => setDestinatarioHospital(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-[#1A1A1E] border border-[#BDE8F0] dark:border-[#2E2E36] text-xs text-[#242424] dark:text-[#F3F4F6] focus:outline-none focus:border-[#D95757]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DATA E HEMOCENTRO DA DOAÇÃO */}
          <div>
            <label className="block font-semibold text-[#242424] dark:text-[#F3F4F6] mb-1">
              Data da Coleta <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#777777]" />
              <input
                type="date"
                max={todayStr}
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F7F7F5] dark:bg-[#232329] border border-[#E9E9E6] dark:border-[#2E2E36] text-xs text-[#242424] dark:text-[#F3F4F6] focus:outline-none focus:border-[#D95757]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#242424] dark:text-[#F3F4F6] mb-1">
              Hemocentro / Posto de Coleta <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#777777]" />
              <input
                type="text"
                value={hemocentro}
                onChange={(e) => setHemocentro(e.target.value)}
                placeholder="Ex: HEMOMAR - Centro de Hematologia e Hemoterapia do Maranhão"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F7F7F5] dark:bg-[#232329] border border-[#E9E9E6] dark:border-[#2E2E36] text-xs text-[#242424] dark:text-[#F3F4F6] focus:outline-none focus:border-[#D95757]"
                required
              />
            </div>
            <div className="flex gap-1.5 mt-1.5">
              <button
                type="button"
                onClick={() => setHemocentro('HEMOMAR - São Luís')}
                className="px-2 py-0.5 rounded-lg bg-[#DCECCB] dark:bg-[#1E3825] text-[#2d4d1e] dark:text-[#86EFAC] text-[10px] font-semibold"
              >
                + HEMOMAR São Luís
              </button>
              <button
                type="button"
                onClick={() => setHemocentro('HEMOMAR - Posto Shopping')}
                className="px-2 py-0.5 rounded-lg bg-[#F7F7F5] dark:bg-[#25252B] text-[#555] dark:text-[#A0A0A0] text-[10px] font-semibold"
              >
                + Posto Móvel
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#242424] dark:text-[#F3F4F6] mb-1">
                Modalidade de Coleta
              </label>
              <select
                value={tipoDoacao}
                onChange={(e) => setTipoDoacao(e.target.value as DonationType)}
                className="w-full px-3 py-2 rounded-xl bg-[#F7F7F5] dark:bg-[#232329] border border-[#E9E9E6] dark:border-[#2E2E36] text-xs text-[#242424] dark:text-[#F3F4F6] focus:outline-none focus:border-[#D95757]"
              >
                <option value="sangue_total">Sangue Total</option>
                <option value="plaquetas">Plaquetas (Aférese)</option>
                <option value="hemacias_duplas">Hemácias Duplas</option>
                <option value="plasma">Plasma</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-[#242424] dark:text-[#F3F4F6] mb-1">
                Peso no Dia (kg)
              </label>
              <div className="relative">
                <Scale className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#777777]" />
                <input
                  type="number"
                  step="0.5"
                  min="40"
                  max="200"
                  placeholder="Ex: 72"
                  value={pesoNoDia}
                  onChange={(e) => setPesoNoDia(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#F7F7F5] dark:bg-[#232329] border border-[#E9E9E6] dark:border-[#2E2E36] text-xs text-[#242424] dark:text-[#F3F4F6] focus:outline-none focus:border-[#D95757]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#242424] dark:text-[#F3F4F6] mb-1">
              Observações (Opcional)
            </label>
            <div className="relative">
              <FileText className="w-3.5 h-3.5 absolute left-3 top-3 text-[#777777]" />
              <textarea
                rows={2}
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Ex: Triagem tranquila, recuperação rápida."
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#F7F7F5] dark:bg-[#232329] border border-[#E9E9E6] dark:border-[#2E2E36] text-xs text-[#242424] dark:text-[#F3F4F6] focus:outline-none focus:border-[#D95757]"
              />
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#222228] border border-gray-200 dark:border-[#2E2E36] text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span>
              Privacidade garantida: Os dados de destinatários e CPF são mantidos restritos à sua conta no dispositivo.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#E9E9E6] dark:border-[#2E2E36]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#F7F7F5] dark:bg-[#25252B] hover:bg-[#E9E9E6] dark:hover:bg-[#32323A] text-xs font-semibold text-[#242424] dark:text-[#F3F4F6] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#D95757] hover:bg-[#c24a4a] text-white text-xs font-bold shadow-md transition-all active:scale-95"
            >
              {initialDonation ? 'Salvar Alterações' : 'Salvar Doação'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
