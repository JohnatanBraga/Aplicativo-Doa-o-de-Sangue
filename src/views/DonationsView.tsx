/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Droplet,
  Plus,
  Search,
  Filter,
  Calendar,
  MapPin,
  Scale,
  Edit2,
  Trash2,
  AlertCircle,
  FileText,
  BarChart2,
  Download,
  Users,
  UserCheck,
  Building2,
  Eye,
  Heart,
} from 'lucide-react';
import { DonationRecord, DonationType, DonationCategory, UserProfile } from '../types';
import { formatDateBR, getDonationTypeLabel } from '../utils/eligibilityRules';
import { DonationDetailModal } from './DonationDetailModal';

interface DonationsViewProps {
  profile: UserProfile | null;
  donations: DonationRecord[];
  onOpenNewDonationModal: () => void;
  onEditDonation: (donation: DonationRecord) => void;
  onDeleteDonation: (donationId: string) => void;
}

export const DonationsView: React.FC<DonationsViewProps> = ({
  profile,
  donations,
  onOpenNewDonationModal,
  onEditDonation,
  onDeleteDonation,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | DonationCategory>('all');
  const [viewMode, setViewMode] = useState<'list' | 'stats'>('list');

  // Modais de detalhe e exclusão
  const [donationToView, setDonationToView] = useState<DonationRecord | null>(null);
  const [donationToDelete, setDonationToDelete] = useState<DonationRecord | null>(null);

  // Anos disponíveis a partir das doações
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    donations.forEach((d) => {
      const year = d.data.split('-')[0];
      if (year) years.add(year);
    });
    return Array.from(years).sort((a, b) => Number(b) - Number(a));
  }, [donations]);

  // Contadores por categoria
  const countVoluntarias = useMemo(() => {
    return donations.filter((d) => d.categoriaDoacao !== 'destinada').length;
  }, [donations]);

  const countDestinadas = useMemo(() => {
    return donations.filter((d) => d.categoriaDoacao === 'destinada').length;
  }, [donations]);

  // Doações filtradas
  const filteredDonations = useMemo(() => {
    return donations
      .filter((d) => {
        const matchesSearch =
          d.hemocentro.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.cidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (d.destinatarioNome && d.destinatarioNome.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (d.destinatarioHospital && d.destinatarioHospital.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (d.observacoes && d.observacoes.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesYear =
          selectedYear === 'all' || d.data.startsWith(selectedYear);

        const matchesCategory =
          selectedCategory === 'all' ||
          (selectedCategory === 'destinada' && d.categoriaDoacao === 'destinada') ||
          (selectedCategory === 'voluntaria' && d.categoriaDoacao !== 'destinada');

        return matchesSearch && matchesYear && matchesCategory;
      })
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  }, [donations, searchTerm, selectedYear, selectedCategory]);

  // Estatísticas anuais e mensais
  const statsByYear = useMemo(() => {
    const map: Record<string, number> = {};
    donations.forEach((d) => {
      const y = d.data.split('-')[0];
      map[y] = (map[y] || 0) + 1;
    });
    return map;
  }, [donations]);

  const statsByMonthCurrentYear = useMemo(() => {
    const months = Array(12).fill(0);
    const targetYear = selectedYear === 'all' ? new Date().getFullYear().toString() : selectedYear;
    donations.forEach((d) => {
      if (d.data.startsWith(targetYear)) {
        const m = parseInt(d.data.split('-')[1], 10) - 1;
        if (m >= 0 && m < 12) {
          months[m]++;
        }
      }
    });
    return { targetYear, months };
  }, [donations, selectedYear]);

  const monthLabels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  // Exportar dados em CSV
  const handleExportCSV = () => {
    if (donations.length === 0) return;
    const header = 'Data,Tipo de Doação,Destinatário,Hospital,Hemocentro,Cidade,Estado,Modalidade,Peso no Dia (kg),Observações\n';
    const rows = donations.map((d) =>
      `"${d.data}","${d.categoriaDoacao === 'destinada' ? 'Destinada a Pessoa' : 'Voluntária'}","${(d.destinatarioNome || '').replace(/"/g, '""')}","${(d.destinatarioHospital || '').replace(/"/g, '""')}","${d.hemocentro.replace(/"/g, '""')}","${d.cidade}","${d.estado}","${getDonationTypeLabel(d.tipoDoacao)}","${d.pesoNoDia || ''}","${(d.observacoes || '').replace(/"/g, '""')}"`
    ).join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `meu_doador_historico_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 pb-24 animate-fadeIn">
      {/* Top Title & Header Actions */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-2xl font-extrabold text-[#242424] dark:text-[#F3F4F6] tracking-tight">
            Minhas Doações
          </h2>
          <p className="text-xs text-[#777777] dark:text-[#9CA3AF]">
            {donations.length} {donations.length === 1 ? 'doação registrada' : 'doações registradas'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Alternador Lista / Estatísticas */}
          <div className="flex items-center p-1 bg-[#F7F7F5] dark:bg-[#202026] border border-[#E9E9E6] dark:border-[#2E2E36] rounded-2xl">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 text-xs font-bold rounded-xl transition-all ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-[#2C2C34] text-[#242424] dark:text-[#F3F4F6] shadow-xs'
                  : 'text-[#777777] dark:text-[#9CA3AF] hover:text-[#242424]'
              }`}
            >
              Lista
            </button>
            <button
              onClick={() => setViewMode('stats')}
              className={`px-3 py-1 text-xs font-bold rounded-xl transition-all flex items-center gap-1 ${
                viewMode === 'stats'
                  ? 'bg-white dark:bg-[#2C2C34] text-[#242424] dark:text-[#F3F4F6] shadow-xs'
                  : 'text-[#777777] dark:text-[#9CA3AF] hover:text-[#242424]'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Gráficos</span>
            </button>
          </div>

          {/* Adicionar Doação */}
          <button
            onClick={onOpenNewDonationModal}
            className="w-10 h-10 rounded-2xl bg-[#D95757] hover:bg-[#c24a4a] text-white flex items-center justify-center shadow-md active:scale-95 transition-all"
            title="Registrar Nova Doação"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* FILTROS E BUSCA */}
      <div className="bg-[#FFFFFF] dark:bg-[#1A1A1E] p-3 rounded-[24px] border border-[#E9E9E6] dark:border-[#2E2E36] space-y-2.5 shadow-xs">
        {/* Campo de Busca */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777777] dark:text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Buscar por destinatário, hospital ou hemocentro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F7F7F5] dark:bg-[#232329] border border-[#E9E9E6] dark:border-[#2E2E36] text-xs text-[#242424] dark:text-[#F3F4F6] focus:outline-none focus:border-[#D95757] transition-all"
          />
        </div>

        {/* Filtro por Categoria: Todas / Voluntárias / Destinadas */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-[#242424] dark:bg-[#F3F4F6] text-white dark:text-[#121214]'
                : 'bg-[#F7F7F5] dark:bg-[#232329] text-[#777777] dark:text-[#9CA3AF] hover:bg-[#E9E9E6]'
            }`}
          >
            Todas ({donations.length})
          </button>
          <button
            onClick={() => setSelectedCategory('voluntaria')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1 ${
              selectedCategory === 'voluntaria'
                ? 'bg-[#DCECCB] dark:bg-[#1E3825] text-[#1E3E17] dark:text-[#86EFAC] ring-2 ring-[#A8C98B]'
                : 'bg-[#F7F7F5] dark:bg-[#232329] text-[#777777] dark:text-[#9CA3AF] hover:bg-[#E9E9E6]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Voluntárias ({countVoluntarias})</span>
          </button>
          <button
            onClick={() => setSelectedCategory('destinada')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1 ${
              selectedCategory === 'destinada'
                ? 'bg-[#BDE8F0] dark:bg-[#1A363D] text-[#133B44] dark:text-[#7DD3FC] ring-2 ring-[#7DC4D3]'
                : 'bg-[#F7F7F5] dark:bg-[#232329] text-[#777777] dark:text-[#9CA3AF] hover:bg-[#E9E9E6]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Destinadas ({countDestinadas})</span>
          </button>
        </div>

        {/* Filtro por Ano */}
        {availableYears.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 border-t border-[#E9E9E6]/60 dark:border-[#2E2E36]/60 text-xs">
            <span className="text-[#777777] dark:text-[#9CA3AF] font-semibold text-[11px] shrink-0 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Ano:
            </span>
            <button
              onClick={() => setSelectedYear('all')}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all shrink-0 ${
                selectedYear === 'all'
                  ? 'bg-gray-300 dark:bg-gray-700 text-[#242424] dark:text-white'
                  : 'text-[#777777] dark:text-[#9CA3AF] hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Todos
            </button>
            {availableYears.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all shrink-0 ${
                  selectedYear === year
                    ? 'bg-[#D95757] text-white'
                    : 'text-[#777777] dark:text-[#9CA3AF] hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {year} ({statsByYear[year] || 0})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* VIEW: ESTATÍSTICAS E GRÁFICOS */}
      {viewMode === 'stats' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Card de Gráfico por Mês */}
          <div className="bg-[#FFFFFF] dark:bg-[#1A1A1E] p-5 rounded-[28px] border border-[#E9E9E6] dark:border-[#2E2E36] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#242424] dark:text-[#F3F4F6]">
                  Distribuição Mensal em {statsByMonthCurrentYear.targetYear}
                </h3>
                <p className="text-[11px] text-[#777777] dark:text-[#9CA3AF]">
                  Frequência de coletas ao longo dos 12 meses
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#DCECCB] dark:bg-[#1E3825] text-[#2d4d1e] dark:text-[#86EFAC]">
                {statsByMonthCurrentYear.months.reduce((a, b) => a + b, 0)} doações
              </span>
            </div>

            {/* Gráfico de Barras em Tailwind */}
            <div className="grid grid-cols-12 gap-1 sm:gap-2 items-end h-36 pt-4 border-b border-[#E9E9E6] dark:border-[#2E2E36]">
              {statsByMonthCurrentYear.months.map((count, idx) => {
                const maxCount = Math.max(...statsByMonthCurrentYear.months, 1);
                const heightPct = count > 0 ? Math.max(20, Math.round((count / maxCount) * 100)) : 6;
                return (
                  <div key={idx} className="flex flex-col items-center h-full justify-end group">
                    {count > 0 && (
                      <span className="text-[10px] font-bold text-[#D95757] mb-1">
                        {count}
                      </span>
                    )}
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full max-w-[20px] rounded-t-lg transition-all duration-300 ${
                        count > 0
                          ? 'bg-gradient-to-t from-[#D95757] to-[#F5D9D5] dark:to-[#5E2B2B]'
                          : 'bg-[#F0F0EE] dark:bg-[#26262D]'
                      }`}
                    />
                    <span className="text-[9px] text-[#777777] dark:text-[#9CA3AF] mt-1.5 font-medium truncate">
                      {monthLabels[idx]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Comparativo de Anos */}
          <div className="bg-[#FFFFFF] dark:bg-[#1A1A1E] p-5 rounded-[28px] border border-[#E9E9E6] dark:border-[#2E2E36] shadow-xs">
            <h3 className="text-sm font-bold text-[#242424] dark:text-[#F3F4F6] mb-3">
              Histórico por Ano Civil
            </h3>
            <div className="space-y-2">
              {Object.keys(statsByYear).length === 0 ? (
                <p className="text-xs text-[#777777] dark:text-[#9CA3AF]">Nenhum registro para exibir estatísticas.</p>
              ) : (
                Object.entries(statsByYear)
                  .sort(([a], [b]) => Number(b) - Number(a))
                  .map(([year, count]) => (
                    <div
                      key={year}
                      className="flex items-center justify-between p-3 rounded-2xl bg-[#F7F7F5] dark:bg-[#232329] border border-[#E9E9E6] dark:border-[#2E2E36]"
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#777777] dark:text-[#9CA3AF]" />
                        <span className="text-xs font-bold text-[#242424] dark:text-[#F3F4F6]">{year}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-[#E9E9E6] dark:bg-[#2E2E36] h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-[#D95757] h-full rounded-full"
                            style={{ width: `${Math.min(100, (count / 4) * 100)}%` }}
                          />
                        </div>
                        <span className="text-xs font-extrabold text-[#242424] dark:text-[#F3F4F6]">
                          {count} {count === 1 ? 'doação' : 'doações'}
                        </span>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* Exportar Dados */}
          <div className="flex justify-end pt-1">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#FFFFFF] dark:bg-[#1A1A1E] hover:bg-[#F7F7F5] dark:hover:bg-[#25252B] border border-[#E9E9E6] dark:border-[#2E2E36] text-xs font-bold text-[#242424] dark:text-[#F3F4F6] transition-colors"
            >
              <Download className="w-4 h-4 text-[#777777]" />
              <span>Exportar Histórico em Planilha (CSV)</span>
            </button>
          </div>
        </div>
      )}

      {/* VIEW: LISTA CRONOLÓGICA */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {filteredDonations.length === 0 ? (
            <div className="bg-[#FFFFFF] dark:bg-[#1A1A1E] p-8 rounded-[28px] border border-[#E9E9E6] dark:border-[#2E2E36] text-center space-y-3 shadow-xs">
              <div className="w-14 h-14 mx-auto rounded-3xl bg-[#F7F7F5] dark:bg-[#25252B] flex items-center justify-center text-[#777777]">
                <Droplet className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-[#242424] dark:text-[#F3F4F6]">
                Nenhuma doação encontrada
              </h3>
              <p className="text-xs text-[#777777] dark:text-[#9CA3AF] max-w-xs mx-auto">
                {searchTerm || selectedYear !== 'all' || selectedCategory !== 'all'
                  ? 'Nenhum registro corresponde aos filtros selecionados.'
                  : 'Cadastre suas doações voluntárias ou destinadas para manter seu histórico organizado.'}
              </p>
              <button
                onClick={onOpenNewDonationModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#D95757] text-white text-xs font-bold shadow-md hover:bg-[#c24a4a] transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Registrar Nova Doação</span>
              </button>
            </div>
          ) : (
            filteredDonations.map((donation) => {
              const isDestinada = donation.categoriaDoacao === 'destinada';
              return (
                <div
                  key={donation.id}
                  className="bg-[#FFFFFF] dark:bg-[#1A1A1E] rounded-[24px] p-4 sm:p-5 border border-[#E9E9E6] dark:border-[#2E2E36] shadow-xs hover:border-[#D95757]/40 transition-all space-y-3"
                >
                  {/* Header do Cartão de Doação */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      {/* Etiquetas de Categoria e Modalidade */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-sm font-extrabold text-[#242424] dark:text-[#F3F4F6]">
                          {formatDateBR(donation.data)}
                        </span>

                        {/* Etiqueta de Categoria (Voluntária vs Destinada) */}
                        {isDestinada ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#BDE8F0] dark:bg-[#1A363D] text-[#133B44] dark:text-[#7DD3FC]">
                            <UserCheck className="w-3 h-3" />
                            <span>Doação Destinada</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#DCECCB] dark:bg-[#1E3825] text-[#1E3E17] dark:text-[#86EFAC]">
                            <Users className="w-3 h-3" />
                            <span>Doação Voluntária</span>
                          </span>
                        )}

                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F7F7F5] dark:bg-[#25252B] text-[#555555] dark:text-[#A0A0A0]">
                          {getDonationTypeLabel(donation.tipoDoacao)}
                        </span>
                      </div>

                      {/* Se for destinada: Exibir Paciente e Hospital em evidência */}
                      {isDestinada && donation.destinatarioNome && (
                        <div className="p-2.5 rounded-xl bg-[#EBF7F9] dark:bg-[#15272B] border border-[#BDE8F0]/70 dark:border-[#204750] text-xs">
                          <div className="flex items-center gap-1.5 font-bold text-[#133B44] dark:text-[#E0F2FE]">
                            <Heart className="w-3.5 h-3.5 text-[#D95757] fill-current" />
                            <span>Destinatário: {donation.destinatarioNome}</span>
                          </div>
                          {donation.destinatarioHospital && (
                            <div className="flex items-center gap-1 text-[11px] text-[#35616B] dark:text-[#93C5CF] mt-0.5">
                              <Building2 className="w-3 h-3" />
                              <span>Hospital: {donation.destinatarioHospital}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Local / Hemocentro */}
                      <div className="flex items-center gap-1.5 text-xs text-[#555555] dark:text-[#9CA3AF]">
                        <MapPin className="w-3.5 h-3.5 text-[#D95757] shrink-0" />
                        <span className="font-semibold">{donation.hemocentro}</span>
                        <span className="text-[#888888]">• {donation.cidade}/{donation.estado}</span>
                      </div>
                    </div>

                    {/* Ações: Ver Detalhes, Editar, Excluir */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => setDonationToView(donation)}
                        className="w-8 h-8 rounded-xl bg-[#F7F7F5] dark:bg-[#25252B] hover:bg-[#BDE8F0] dark:hover:bg-[#1A363D] text-[#777777] hover:text-[#1b4b57] dark:hover:text-[#7DD3FC] flex items-center justify-center transition-colors"
                        title="Ver detalhes completos"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onEditDonation(donation)}
                        className="w-8 h-8 rounded-xl bg-[#F7F7F5] dark:bg-[#25252B] hover:bg-[#DCECCB] dark:hover:bg-[#1E3825] text-[#777777] hover:text-[#2d4d1e] dark:hover:text-[#86EFAC] flex items-center justify-center transition-colors"
                        title="Editar registro"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDonationToDelete(donation)}
                        className="w-8 h-8 rounded-xl bg-[#F7F7F5] dark:bg-[#25252B] hover:bg-[#F5D9D5] dark:hover:bg-[#3E1F1F] text-[#777777] hover:text-[#D95757] flex items-center justify-center transition-colors"
                        title="Excluir registro"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Informações adicionais se houver */}
                  {(donation.pesoNoDia || donation.observacoes) && (
                    <div className="pt-2 border-t border-[#E9E9E6]/80 dark:border-[#2E2E36]/80 flex flex-wrap items-center gap-3 text-xs text-[#777777] dark:text-[#9CA3AF]">
                      {donation.pesoNoDia && (
                        <span className="flex items-center gap-1 bg-[#F7F7F5] dark:bg-[#232329] px-2 py-0.5 rounded-lg text-[11px]">
                          <Scale className="w-3 h-3 text-[#777777]" />
                          <span>Peso: <strong>{donation.pesoNoDia} kg</strong></span>
                        </span>
                      )}
                      {donation.observacoes && (
                        <span className="flex items-center gap-1 italic text-[11px] text-[#666666] dark:text-[#A0A0A0] line-clamp-1">
                          <FileText className="w-3 h-3 shrink-0" />
                          <span>"{donation.observacoes}"</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Modal de Detalhes da Doação */}
      <DonationDetailModal
        donation={donationToView}
        isOpen={Boolean(donationToView)}
        onClose={() => setDonationToView(null)}
        onEdit={(d) => {
          onEditDonation(d);
          setDonationToView(null);
        }}
        onDelete={(d) => {
          setDonationToDelete(d);
          setDonationToView(null);
        }}
      />

      {/* Modal de Confirmação de Exclusão */}
      {donationToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-[#1A1A1E] text-[#242424] dark:text-[#F3F4F6] rounded-[28px] p-6 max-w-sm w-full space-y-4 shadow-2xl border border-[#E9E9E6] dark:border-[#2E2E36]">
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold">Excluir Doação?</h3>
              <p className="text-xs text-[#777777] dark:text-[#9CA3AF] mt-1">
                Deseja realmente remover o registro do dia {formatDateBR(donationToDelete.data)}
                {donationToDelete.destinatarioNome ? ` destinado a ${donationToDelete.destinatarioNome}` : ''}?
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDonationToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-[#F7F7F5] dark:bg-[#25252B] text-xs font-semibold text-[#242424] dark:text-[#F3F4F6] hover:bg-[#E9E9E6] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onDeleteDonation(donationToDelete.id);
                  setDonationToDelete(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#D95757] text-xs font-bold text-white hover:bg-red-700 transition-colors shadow-sm"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
