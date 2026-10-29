/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Heart,
  User,
  History,
  CreditCard,
  Clock,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  X,
} from 'lucide-react';
import { UserProfile, BloodType, Gender } from '../types';
import { saveProfile } from '../services/storageService';

interface TutorialModalProps {
  isOpen: boolean;
  profile: UserProfile;
  onFinish: (updatedProfile: UserProfile) => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({
  isOpen,
  profile,
  onFinish,
}) => {
  const [step, setStep] = useState(1);
  const totalSteps = 7;

  // Form states during step 2 (Profile setup)
  const [nome, setNome] = useState(profile.nome || '');
  const [dataNascimento, setDataNascimento] = useState(profile.dataNascimento || '1995-05-15');
  const [genero, setGenero] = useState<Gender>(profile.genero || 'M');
  const [cidade, setCidade] = useState(profile.cidade || 'São Luís');
  const [estado, setEstado] = useState(profile.estado || 'MA');
  const [hemocentro, setHemocentro] = useState(
    profile.hemocentroReferencia || 'HEMOMAR - Centro de Hematologia e Hemoterapia do Maranhão'
  );
  const [pesoAtual, setPesoAtual] = useState(profile.pesoAtual || 70);
  const [tipoSanguineo, setTipoSanguineo] = useState<BloodType>(profile.tipoSanguineo || 'O+');

  if (!isOpen) return null;

  const handleSaveProfileData = () => {
    const updated: UserProfile = {
      ...profile,
      nome: nome.trim() || profile.nome,
      dataNascimento,
      genero,
      cidade: cidade.trim(),
      estado: estado.trim(),
      hemocentroReferencia: hemocentro.trim(),
      pesoAtual: Number(pesoAtual) || 70,
      tipoSanguineo,
      dataAtualizacaoPeso: new Date().toISOString().split('T')[0],
    };
    saveProfile(updated);
    return updated;
  };

  const handleNext = () => {
    if (step === 2) {
      handleSaveProfileData();
    }
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    const finalProfile: UserProfile = {
      ...profile,
      tutorialConcluido: true,
    };
    saveProfile(finalProfile);
    onFinish(finalProfile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FFFFFF] dark:bg-[#1A1A1E] w-full max-w-lg rounded-[28px] p-6 sm:p-8 shadow-2xl border border-[#E9E9E6] dark:border-[#2E2E36] relative flex flex-col max-h-[90vh] text-[#242424] dark:text-[#EEEEEE]">
        {/* Top header with Progress & Skip */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E9E9E6] dark:border-[#2E2E36]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#D95757] dark:text-[#F57070] uppercase tracking-wider">
              Tutorial Interativo
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F7F7F5] dark:bg-[#25252B] font-semibold text-[#777777] dark:text-[#A0A0A5]">
              {step} de {totalSteps}
            </span>
          </div>
          <button
            onClick={handleComplete}
            className="text-xs font-semibold text-[#777777] dark:text-[#A0A0A5] hover:text-[#242424] dark:hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>Pular</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-[#F7F7F5] dark:bg-[#25252B] rounded-full my-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#D95757] to-[#A8C98B] transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          {/* ETAPA 1: Boas-vindas */}
          {step === 1 && (
            <div className="text-center py-4 space-y-4">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-[#F5D9D5] dark:bg-[#3D1E1E] flex items-center justify-center text-[#D95757] dark:text-[#F57070] shadow-sm animate-heartbeat">
                <Heart className="w-10 h-10 fill-current" />
              </div>
              <h3 className="text-2xl font-bold text-[#242424] dark:text-white">
                Bem-vindo ao Meu Doador! ❤️
              </h3>
              <p className="text-sm text-[#777777] dark:text-[#A0A0A5] max-w-md mx-auto leading-relaxed">
                Aqui você poderá acompanhar suas doações de sangue, organizar seu histórico,
                guardar seu cartão digital e consultar informações importantes para se preparar
                para uma nova doação.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-4 max-w-sm mx-auto text-left">
                <div className="p-3 rounded-2xl bg-[#DCECCB]/60 dark:bg-[#1E3316]/60 border border-[#DCECCB] dark:border-[#2E4A23] text-xs">
                  <span className="font-bold text-[#2d4d1e] dark:text-[#A8C98B] block mb-0.5">Histórico Claro</span>
                  <span className="text-[#555] dark:text-[#A0A0A5]">Todas as suas doações e hemocentros organizados.</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#BDE8F0]/60 dark:bg-[#122A30]/60 border border-[#BDE8F0] dark:border-[#1E4852] text-xs">
                  <span className="font-bold text-[#1b4b57] dark:text-[#67D5E8] block mb-0.5">Próxima Doação</span>
                  <span className="text-[#555] dark:text-[#A0A0A5]">Estimativas de elegibilidade com base nas regras.</span>
                </div>
              </div>
            </div>
          )}

          {/* ETAPA 2: Perfil */}
          {step === 2 && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#BDE8F0] dark:bg-[#173842] flex items-center justify-center text-[#1b4b57] dark:text-[#BDE8F0]">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#242424] dark:text-white">Seu Perfil de Doador</h3>
                  <p className="text-xs text-[#777777] dark:text-[#A0A0A5]">
                    Essas informações são usadas para calcular seus prazos com precisão.
                  </p>
                </div>
              </div>

              <div className="space-y-3 bg-[#F7F7F5] dark:bg-[#25252B] p-4 rounded-2xl border border-[#E9E9E6] dark:border-[#2E2E36]">
                <div>
                  <label className="block text-xs font-semibold text-[#242424] dark:text-[#D1D1D6] mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#1A1A1E] border border-[#E9E9E6] dark:border-[#383842] text-xs text-[#242424] dark:text-white focus:outline-none focus:border-[#D95757]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#242424] dark:text-[#D1D1D6] mb-1">
                      Data de Nascimento
                    </label>
                    <input
                      type="date"
                      value={dataNascimento}
                      onChange={(e) => setDataNascimento(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#1A1A1E] border border-[#E9E9E6] dark:border-[#383842] text-xs text-[#242424] dark:text-white focus:outline-none focus:border-[#D95757]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#242424] dark:text-[#D1D1D6] mb-1">
                      Sexo Biológico (para intervalos)
                    </label>
                    <select
                      value={genero}
                      onChange={(e) => setGenero(e.target.value as Gender)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#1A1A1E] border border-[#E9E9E6] dark:border-[#383842] text-xs text-[#242424] dark:text-white focus:outline-none focus:border-[#D95757]"
                    >
                      <option value="M">Masculino (60 dias / até 4x ano)</option>
                      <option value="F">Feminino (90 dias / até 3x ano)</option>
                      <option value="outro">Outro / Prefiro não informar</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#242424] dark:text-[#D1D1D6] mb-1">
                      Peso Atual (kg)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="40"
                      max="200"
                      value={pesoAtual}
                      onChange={(e) => setPesoAtual(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#1A1A1E] border border-[#E9E9E6] dark:border-[#383842] text-xs text-[#242424] dark:text-white focus:outline-none focus:border-[#D95757]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#242424] dark:text-[#D1D1D6] mb-1">
                      Tipo Sanguíneo
                    </label>
                    <select
                      value={tipoSanguineo}
                      onChange={(e) => setTipoSanguineo(e.target.value as BloodType)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#1A1A1E] border border-[#E9E9E6] dark:border-[#383842] text-xs text-[#242424] dark:text-white focus:outline-none focus:border-[#D95757]"
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
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#242424] dark:text-[#D1D1D6] mb-1">
                    Hemocentro de Referência
                  </label>
                  <input
                    type="text"
                    value={hemocentro}
                    onChange={(e) => setHemocentro(e.target.value)}
                    placeholder="Ex: HEMOMAR - São Luís"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#1A1A1E] border border-[#E9E9E6] dark:border-[#383842] text-xs text-[#242424] dark:text-white focus:outline-none focus:border-[#D95757]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ETAPA 3: Histórico */}
          {step === 3 && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#DCECCB] dark:bg-[#203618] flex items-center justify-center text-[#2d4d1e] dark:text-[#A8C98B]">
                  <History className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#242424] dark:text-white">Registro de Doações</h3>
                  <p className="text-xs text-[#777777] dark:text-[#A0A0A5]">
                    Mantenha o histórico de onde e quando você doou.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F7F7F5] dark:bg-[#25252B] border border-[#E9E9E6] dark:border-[#2E2E36] space-y-3 text-xs text-[#242424] dark:text-[#EEEEEE]">
                <p>
                  Você pode cadastrar <strong>doações anteriores</strong> e novas doações,
                  classificando entre <strong>doações voluntárias</strong> ou <strong>destinadas a uma pessoa</strong>.
                </p>
                <ul className="space-y-1.5 list-disc list-inside text-[#777777] dark:text-[#A0A0A5]">
                  <li>Armazene destinatário, hospital e CPF com máscara de privacidade.</li>
                  <li>Filtre por tipo de doação e acompanhe contagens anuais.</li>
                  <li>Veja estatísticas anuais e médias de intervalo.</li>
                </ul>
              </div>
            </div>
          )}

          {/* ETAPA 4: Cartão de Doador */}
          {step === 4 && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#F5D9D5] dark:bg-[#3D1E1E] flex items-center justify-center text-[#D95757] dark:text-[#F57070]">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#242424] dark:text-white">Meu Cartão em PNG</h3>
                  <p className="text-xs text-[#777777] dark:text-[#A0A0A5]">
                    Tenha seu comprovante sempre no seu bolso.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F7F7F5] dark:bg-[#25252B] border border-[#E9E9E6] dark:border-[#2E2E36] space-y-3 text-xs text-[#242424] dark:text-[#EEEEEE]">
                <p>
                  Se você possui o <strong>cartão de doador em formato PNG ou imagem</strong>,
                  pode carregá-lo diretamente da galeria do seu celular.
                </p>
                <div className="p-3 bg-white dark:bg-[#1A1A1E] rounded-xl border border-[#E9E9E6] dark:border-[#2E2E36] text-[#777777] dark:text-[#A0A0A5]">
                  🔍 <strong>Recursos do leitor:</strong> Zoom in, zoom out, ajuste para tela e
                  segurança total com armazenamento local isolado.
                </div>
              </div>
            </div>
          )}

          {/* ETAPA 5: Acompanhamento de Elegibilidade */}
          {step === 5 && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#BDE8F0] dark:bg-[#173842] flex items-center justify-center text-[#1b4b57] dark:text-[#BDE8F0]">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#242424] dark:text-white">Posso Doar Novamente?</h3>
                  <p className="text-xs text-[#777777] dark:text-[#A0A0A5]">
                    Estimativas baseadas nos intervalos oficiais.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F7F7F5] dark:bg-[#25252B] border border-[#E9E9E6] dark:border-[#2E2E36] space-y-3 text-xs text-[#242424] dark:text-[#EEEEEE]">
                <p>
                  O aplicativo analisa automaticamente seus intervalos mínimos (ex: 60 dias para
                  homens, 90 dias para mulheres) e o limite de doações nos últimos 12 meses.
                </p>
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-amber-900 dark:text-amber-200 text-xs">
                  ⚠️ <strong>Aviso Importante:</strong> Nossos cálculos são estimativas informativas.
                  A aptidão final é sempre decidida pela equipe médica do hemocentro na triagem.
                </div>
              </div>
            </div>
          )}

          {/* ETAPA 6: Guia Completo */}
          {step === 6 && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#DCECCB] dark:bg-[#203618] flex items-center justify-center text-[#2d4d1e] dark:text-[#A8C98B]">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#242424] dark:text-white">Guia do Doador</h3>
                  <p className="text-xs text-[#777777] dark:text-[#A0A0A5]">
                    Tudo sobre requisitos, preparação e triagem clínica.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F7F7F5] dark:bg-[#25252B] border border-[#E9E9E6] dark:border-[#2E2E36] space-y-3 text-xs text-[#242424] dark:text-[#EEEEEE]">
                <p>Consulte a qualquer momento:</p>
                <ul className="space-y-1.5 list-disc list-inside text-[#777777] dark:text-[#A0A0A5]">
                  <li>Checklist interativo antes de sair de casa.</li>
                  <li>Requisitos básicos (sono, jejum, peso, idade).</li>
                  <li>Principais perguntas da entrevista de triagem.</li>
                  <li>Cuidados após a doação para seu bem-estar.</li>
                </ul>
              </div>
            </div>
          )}

          {/* ETAPA 7: Conclusão */}
          {step === 7 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-[#DCECCB] dark:bg-[#203618] flex items-center justify-center text-[#2d4d1e] dark:text-[#A8C98B]">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-[#242424] dark:text-white">
                Tudo pronto para começar! ❤️
              </h3>
              <p className="text-sm text-[#777777] dark:text-[#A0A0A5] max-w-sm mx-auto leading-relaxed">
                Seu espaço está preparado para acompanhar sua nobre jornada como doador de sangue.
                Você pode rever este tutorial a qualquer momento nas Configurações.
              </p>
            </div>
          )}
        </div>

        {/* Bottom Nav Controls */}
        <div className="pt-4 border-t border-[#E9E9E6] dark:border-[#2E2E36] flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="px-4 py-2 rounded-2xl bg-[#F7F7F5] dark:bg-[#25252B] hover:bg-[#eaeae7] dark:hover:bg-[#32323A] text-xs font-semibold text-[#242424] dark:text-white flex items-center gap-1.5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            className="px-6 py-2.5 rounded-2xl bg-[#D95757] hover:bg-[#c24a4a] text-xs font-bold text-white shadow-md flex items-center gap-1.5 transition-all active:scale-95 ml-auto"
          >
            <span>{step === totalSteps ? 'Ir para o Início' : 'Avançar'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
