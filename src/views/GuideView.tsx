/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BookOpen,
  CheckSquare,
  Square,
  AlertTriangle,
  Info,
  Clock,
  Heart,
  HelpCircle,
  ShieldAlert,
  ChevronDown,
  RotateCcw,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export const GuideView: React.FC = () => {
  // Checklist de 8 itens interativos
  const [checklist, setChecklist] = useState<boolean[]>([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  const checklistItems = [
    'Tenho idade (16 a 69 anos) e peso compatíveis (mínimo 50 kg).',
    'Estou me sentindo bem de saúde hoje e não estou em jejum.',
    'Dormi pelo menos 6 horas nas últimas 24 horas.',
    'Bebi bastante água e fiz uma refeição leve e adequada.',
    'Evitei bebidas alcoólicas nas últimas 12 a 24 horas.',
    'Separei meu documento oficial com foto (RG, CNH ou Carteira de Trabalho).',
    'Sei informar os medicamentos tomados e procedimentos recentes (tatuagem/cirurgia).',
    'Vou responder a todas as perguntas da triagem com sinceridade e tranquilidade.',
  ];

  const toggleChecklistItem = (index: number) => {
    setChecklist((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const resetChecklist = () => {
    setChecklist(Array(8).fill(false));
  };

  const checkedCount = checklist.filter(Boolean).length;

  // Seções expansíveis
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    requisitos: true,
    preparo: true,
    triagem: false,
    avaliacao: false,
    adiamento: false,
    etapas: false,
    pos: false,
  });

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-4 pb-24 animate-fadeIn">
      {/* Top Title */}
      <div className="px-1">
        <h2 className="text-2xl font-extrabold text-[#242424] dark:text-[#F3F4F6] tracking-tight">
          Guia do Doador
        </h2>
        <p className="text-xs text-[#777777] dark:text-[#9CA3AF]">
          Informações completas sobre requisitos, triagem e preparação para doação
        </p>
      </div>

      {/* 16.1 Aviso Inicial Obrigatório */}
      <div className="p-4 rounded-[24px] bg-[#FFF8E6] dark:bg-[#2C2413] border border-[#FFE8A3] dark:border-[#52411E] text-xs text-[#73510D] dark:text-[#FDE68A] space-y-1 shadow-xs">
        <div className="flex items-center gap-1.5 font-bold">
          <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0" />
          <span>Aviso Informativo Importante</span>
        </div>
        <p className="leading-relaxed text-[11px] opacity-90">
          Este guia é puramente informativo. A decisão de liberar ou adiar a doação cabe
          exclusivamente à equipe médica e de triagem do hemocentro (como o HEMOMAR), conforme as
          normas sanitárias vigentes e a avaliação clínica individual.
        </p>
      </div>

      {/* 16.9 Checklist Interativo Antes de Sair de Casa */}
      <div className="bg-[#FFFFFF] dark:bg-[#1A1A1E] p-5 rounded-[28px] border border-[#E9E9E6] dark:border-[#2E2E36] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#DCECCB] dark:bg-[#1E3825] text-[#2d4d1e] dark:text-[#86EFAC] flex items-center justify-center">
              <CheckSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#242424] dark:text-[#F3F4F6]">Checklist Pré-Doação</h3>
              <p className="text-[11px] text-[#777777] dark:text-[#9CA3AF]">
                {checkedCount} de 8 itens verificados
              </p>
            </div>
          </div>

          <button
            onClick={resetChecklist}
            className="flex items-center gap-1 text-[11px] font-semibold text-[#777777] dark:text-[#9CA3AF] hover:text-[#D95757] transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Limpar</span>
          </button>
        </div>

        {/* Barra de Progresso do Checklist */}
        <div className="w-full h-2 bg-[#F7F7F5] dark:bg-[#25252B] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#D95757] to-[#A8C98B] transition-all duration-300"
            style={{ width: `${(checkedCount / 8) * 100}%` }}
          />
        </div>

        {/* Lista de Itens Clicáveis */}
        <div className="space-y-2 pt-1">
          {checklistItems.map((item, idx) => {
            const isChecked = checklist[idx];
            return (
              <div
                key={idx}
                onClick={() => toggleChecklistItem(idx)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-2.5 select-none ${
                  isChecked
                    ? 'bg-[#DCECCB]/40 dark:bg-[#1E3825]/40 border-[#A8C98B] dark:border-[#2E5E3A] text-[#242424] dark:text-[#F3F4F6]'
                    : 'bg-[#F7F7F5] dark:bg-[#232329] border-[#E9E9E6] dark:border-[#2E2E36] text-[#666666] dark:text-[#A0A0A0] hover:bg-white dark:hover:bg-[#282830]'
                }`}
              >
                <button type="button" className="mt-0.5 shrink-0 text-[#2d4d1e] dark:text-[#86EFAC]">
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 fill-[#2d4d1e] text-white dark:fill-[#86EFAC] dark:text-[#121215]" />
                  ) : (
                    <Square className="w-4 h-4 text-[#888888] dark:text-[#666666]" />
                  )}
                </button>
                <span className={`text-xs ${isChecked ? 'font-semibold' : 'font-normal'}`}>
                  {item}
                </span>
              </div>
            );
          })}
        </div>

        {checkedCount === 8 && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Excelente! Você completou todos os pontos do checklist de preparação.</span>
          </div>
        )}
      </div>

      {/* 16.2 Requisitos Básicos (Acordeom) */}
      <div className="bg-[#FFFFFF] dark:bg-[#1A1A1E] rounded-[28px] border border-[#E9E9E6] dark:border-[#2E2E36] shadow-xs overflow-hidden">
        <button
          onClick={() => toggleSection('requisitos')}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-[#F7F7F5]/60 dark:hover:bg-[#232329]/60 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#BDE8F0] dark:bg-[#1A363D] text-[#1b4b57] dark:text-[#7DD3FC] flex items-center justify-center font-bold text-xs">
              01
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#242424] dark:text-[#F3F4F6]">Requisitos Básicos Obrigatórios</h4>
              <p className="text-[11px] text-[#777777] dark:text-[#9CA3AF]">Idade, peso, sono, documentos e intervalos</p>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-[#777777] dark:text-[#9CA3AF] transition-transform ${
              expandedSections.requisitos ? 'rotate-180' : ''
            }`}
          />
        </button>

        {expandedSections.requisitos && (
          <div className="p-4 pt-1 border-t border-[#E9E9E6] dark:border-[#2E2E36] space-y-2.5 text-xs text-[#444444] dark:text-[#D1D5DB]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 bg-[#F7F7F5] dark:bg-[#232329] rounded-2xl">
                <span className="font-bold text-[#242424] dark:text-[#F3F4F6] block mb-0.5">Idade</span>
                <span>Entre 16 e 69 anos. Para menores de 18 anos é exigido consentimento formal do responsável. A primeira doação deve ser até os 60 anos.</span>
              </div>
              <div className="p-3 bg-[#F7F7F5] dark:bg-[#232329] rounded-2xl">
                <span className="font-bold text-[#242424] dark:text-[#F3F4F6] block mb-0.5">Peso Mínimo</span>
                <span>Pelo menos 50 kg para doar sangue total.</span>
              </div>
              <div className="p-3 bg-[#F7F7F5] dark:bg-[#232329] rounded-2xl">
                <span className="font-bold text-[#242424] dark:text-[#F3F4F6] block mb-0.5">Descanso & Sono</span>
                <span>Ter dormido pelo menos 6 horas contínuas nas últimas 24 horas.</span>
              </div>
              <div className="p-3 bg-[#F7F7F5] dark:bg-[#232329] rounded-2xl">
                <span className="font-bold text-[#242424] dark:text-[#F3F4F6] block mb-0.5">Alimentação & Jejum</span>
                <span>Não estar em jejum! Faça uma refeição leve. Evite alimentos gordurosos 3 horas antes da coleta.</span>
              </div>
              <div className="p-3 bg-[#F7F7F5] dark:bg-[#232329] rounded-2xl">
                <span className="font-bold text-[#242424] dark:text-[#F3F4F6] block mb-0.5">Bebidas Alcoólicas</span>
                <span>Não consumir bebidas alcoólicas nas 12 a 24 horas anteriores à doação.</span>
              </div>
              <div className="p-3 bg-[#F7F7F5] dark:bg-[#232329] rounded-2xl">
                <span className="font-bold text-[#242424] dark:text-[#F3F4F6] block mb-0.5">Documentação</span>
                <span>Apresentar documento de identificação original com foto emitido por órgão oficial (RG, CNH, Passaporte, etc.).</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 16.3 Como se Preparar */}
      <div className="bg-[#FFFFFF] dark:bg-[#1A1A1E] rounded-[28px] border border-[#E9E9E6] dark:border-[#2E2E36] shadow-xs overflow-hidden">
        <button
          onClick={() => toggleSection('preparo')}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-[#F7F7F5]/60 dark:hover:bg-[#232329]/60 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#DCECCB] dark:bg-[#1E3825] text-[#2d4d1e] dark:text-[#86EFAC] flex items-center justify-center font-bold text-xs">
              02
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#242424] dark:text-[#F3F4F6]">Como se Preparar (Véspera e Dia)</h4>
              <p className="text-[11px] text-[#777777] dark:text-[#9CA3AF]">Dicas práticas para uma coleta tranquila</p>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-[#777777] dark:text-[#9CA3AF] transition-transform ${
              expandedSections.preparo ? 'rotate-180' : ''
            }`}
          />
        </button>

        {expandedSections.preparo && (
          <div className="p-4 pt-1 border-t border-[#E9E9E6] dark:border-[#2E2E36] space-y-3 text-xs text-[#444444] dark:text-[#D1D5DB]">
            <div className="space-y-1">
              <span className="font-bold text-[#242424] dark:text-[#F3F4F6] block">Na véspera da doação:</span>
              <ul className="list-disc list-inside space-y-1 text-[#666666] dark:text-[#9CA3AF]">
                <li>Durma cedo e procure completar pelo menos 6 horas de repouso de qualidade.</li>
                <li>Mantenha boa hidratação ao longo de todo o dia anterior.</li>
                <li>Evite exercícios físicos extenuantes ou consumo de bebidas alcoólicas.</li>
              </ul>
            </div>
            <div className="space-y-1 pt-2 border-t border-[#E9E9E6] dark:border-[#2E2E36]">
              <span className="font-bold text-[#242424] dark:text-[#F3F4F6] block">No dia da doação:</span>
              <ul className="list-disc list-inside space-y-1 text-[#666666] dark:text-[#9CA3AF]">
                <li>Tome café da manhã ou almoce normalmente — nunca doe em jejum!</li>
                <li>Beba bastante água nas 2 horas antes de chegar ao hemocentro.</li>
                <li>Use roupas confortáveis com mangas fáceis de dobrar.</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* 16.4 Perguntas Comuns da Triagem */}
      <div className="bg-[#FFFFFF] dark:bg-[#1A1A1E] rounded-[28px] border border-[#E9E9E6] dark:border-[#2E2E36] shadow-xs overflow-hidden">
        <button
          onClick={() => toggleSection('triagem')}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-[#F7F7F5]/60 dark:hover:bg-[#232329]/60 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#F5D9D5] dark:bg-[#3E1F1F] text-[#D95757] flex items-center justify-center font-bold text-xs">
              03
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#242424] dark:text-[#F3F4F6]">Perguntas Frequentes na Triagem</h4>
              <p className="text-[11px] text-[#777777] dark:text-[#9CA3AF]">O que a equipe de saúde irá perguntar</p>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-[#777777] dark:text-[#9CA3AF] transition-transform ${
              expandedSections.triagem ? 'rotate-180' : ''
            }`}
          />
        </button>

        {expandedSections.triagem && (
          <div className="p-4 pt-1 border-t border-[#E9E9E6] dark:border-[#2E2E36] space-y-3 text-xs text-[#444444] dark:text-[#D1D5DB]">
            <p className="text-[11px] text-[#777777] dark:text-[#9CA3AF]">
              A entrevista é totalmente confidencial e individual. Algumas das perguntas usuais:
            </p>
            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-[#F7F7F5] dark:bg-[#232329]">
                <strong className="text-[#242424] dark:text-[#F3F4F6]">Saúde recente:</strong> Teve febre, gripe, resfriado ou infecções nos últimos dias? Sente fraqueza ou tontura?
              </div>
              <div className="p-2.5 rounded-xl bg-[#F7F7F5] dark:bg-[#232329]">
                <strong className="text-[#242424] dark:text-[#F3F4F6]">Medicamentos:</strong> Faz uso contínuo de remédios? Tomou antibióticos ou anti-inflamatórios recentemente?
              </div>
              <div className="p-2.5 rounded-xl bg-[#F7F7F5] dark:bg-[#232329]">
                <strong className="text-[#242424] dark:text-[#F3F4F6]">Procedimentos:</strong> Fez tatuagem, micropigmentação ou colocou piercing nos últimos 6 a 12 meses? Passou por cirurgias?
              </div>
              <div className="p-2.5 rounded-xl bg-[#F7F7F5] dark:bg-[#232329]">
                <strong className="text-[#242424] dark:text-[#F3F4F6]">Viagens e Vacinas:</strong> Esteve em regiões de risco para malária ou febre amarela? Tomou vacinas recentemente?
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 16.7 Como Funciona o Atendimento Passo a Passo */}
      <div className="bg-[#FFFFFF] dark:bg-[#1A1A1E] rounded-[28px] border border-[#E9E9E6] dark:border-[#2E2E36] shadow-xs overflow-hidden">
        <button
          onClick={() => toggleSection('etapas')}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-[#F7F7F5]/60 dark:hover:bg-[#232329]/60 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#DCECCB] dark:bg-[#1E3825] text-[#2d4d1e] dark:text-[#86EFAC] flex items-center justify-center font-bold text-xs">
              04
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#242424] dark:text-[#F3F4F6]">Etapas do Atendimento no Hemocentro</h4>
              <p className="text-[11px] text-[#777777] dark:text-[#9CA3AF]">Do cadastro ao lanche final (~40 a 60 min)</p>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-[#777777] dark:text-[#9CA3AF] transition-transform ${
              expandedSections.etapas ? 'rotate-180' : ''
            }`}
          />
        </button>

        {expandedSections.etapas && (
          <div className="p-4 pt-1 border-t border-[#E9E9E6] dark:border-[#2E2E36] space-y-2 text-xs text-[#444444] dark:text-[#D1D5DB]">
            {[
              { num: '1', title: 'Recepção e Cadastro', desc: 'Apresentação de documento com foto e checagem no sistema.' },
              { num: '2', title: 'Triagem Clínica & Hematócrito', desc: 'Pesagem, aferição de pressão arterial, temperatura e teste rápido de anemia na ponta do dedo.' },
              { num: '3', title: 'Entrevista Individual', desc: 'Conversa reservada e sigilosa com profissional de saúde.' },
              { num: '4', title: 'Coleta de Sangue', desc: 'Procedimento seguro e estéril realizado em cadeira reclinável (~8 a 12 min).' },
              { num: '5', title: 'Lanche e Hidratação', desc: 'Repouso de 15 minutos com suco e lanche reforçado oferecido pelo hemocentro.' },
            ].map((st) => (
              <div key={st.num} className="flex items-start gap-3 p-2 rounded-xl hover:bg-[#F7F7F5] dark:hover:bg-[#232329]">
                <span className="w-5 h-5 rounded-full bg-[#D95757] text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {st.num}
                </span>
                <div>
                  <strong className="text-[#242424] dark:text-[#F3F4F6] block">{st.title}</strong>
                  <span className="text-[#666666] dark:text-[#9CA3AF] text-[11px]">{st.desc}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 16.8 Cuidados Pós-Doação */}
      <div className="bg-[#FFFFFF] dark:bg-[#1A1A1E] rounded-[28px] border border-[#E9E9E6] dark:border-[#2E2E36] shadow-xs overflow-hidden">
        <button
          onClick={() => toggleSection('pos')}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-[#F7F7F5]/60 dark:hover:bg-[#232329]/60 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#BDE8F0] dark:bg-[#1A363D] text-[#1b4b57] dark:text-[#7DD3FC] flex items-center justify-center font-bold text-xs">
              05
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#242424] dark:text-[#F3F4F6]">Cuidados Depois da Doação</h4>
              <p className="text-[11px] text-[#777777] dark:text-[#9CA3AF]">Como garantir sua perfeita recuperação</p>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-[#777777] dark:text-[#9CA3AF] transition-transform ${
              expandedSections.pos ? 'rotate-180' : ''
            }`}
          />
        </button>

        {expandedSections.pos && (
          <div className="p-4 pt-1 border-t border-[#E9E9E6] dark:border-[#2E2E36] space-y-2 text-xs text-[#444444] dark:text-[#D1D5DB]">
            <ul className="list-disc list-inside space-y-1.5 text-[#666666] dark:text-[#9CA3AF]">
              <li>Beba bastante líquido (água e sucos naturais) nas próximas 4 a 6 horas.</li>
              <li>Mantenha o curativo no braço por pelo menos 4 horas.</li>
              <li>Não faça esforços físicos intensos nem carregue peso com o braço da coleta nas primeiras 12 horas.</li>
              <li>Não consuma álcool até o dia seguinte.</li>
              <li>Se sentir tontura ou fraqueza, sente-se colocando a cabeça entre os joelhos ou deite-se com as pernas elevadas.</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
