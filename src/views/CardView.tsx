/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  CreditCard,
  Upload,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Trash2,
  Download,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Maximize2,
  Eye,
} from 'lucide-react';
import { DonorCard, UserProfile } from '../types';
import { getDonorCard, saveDonorCard, deleteDonorCard } from '../services/storageService';

interface CardViewProps {
  profile: UserProfile | null;
}

export const CardView: React.FC<CardViewProps> = ({ profile }) => {
  const [card, setCard] = useState<DonorCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      loadCard();
    }
  }, [profile]);

  const loadCard = async () => {
    if (!profile) return;
    setLoading(true);
    const existing = await getDonorCard(profile.uid);
    setCard(existing);
    setLoading(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const newCard: DonorCard = {
        id: 'card_' + Date.now(),
        userId: profile.uid,
        dataUrl,
        formato: file.type || 'image/png',
        nomeArquivo: file.name,
        dataEnvio: new Date().toISOString(),
      };
      await saveDonorCard(newCard);
      setCard(newCard);
      setZoom(1);
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async () => {
    if (!profile) return;
    await deleteDonorCard(profile.uid);
    setCard(null);
    setConfirmDelete(false);
    setZoom(1);
  };

  // Criar Cartão Digital Demonstrativo caso o usuário queira testar sem enviar imagem
  const handleGenerateSampleCard = async () => {
    if (!profile) return;
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fundo Gradiente Elegante
    const grad = ctx.createLinearGradient(0, 0, 1000, 600);
    grad.addColorStop(0, '#B31B1B');
    grad.addColorStop(0.5, '#7D0909');
    grad.addColorStop(1, '#4A0606');
    ctx.fillStyle = grad;
    ctx.roundRect(0, 0, 1000, 600, 40);
    ctx.fill();

    // Bordas douradas discretas
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 4;
    ctx.roundRect(20, 20, 960, 560, 30);
    ctx.stroke();

    // Cabeçalho
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('CARTÃO DO DOADOR DE SANGUE', 60, 90);

    ctx.fillStyle = '#DCECCB';
    ctx.font = '22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('REDE BRASILEIRA DE HEMOCENTROS • HEMOMAR', 60, 130);

    // Linha divisória
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(60, 160);
    ctx.lineTo(940, 160);
    ctx.stroke();

    // Nome
    ctx.fillStyle = '#FFAAAA';
    ctx.font = '18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('NOME DO DOADOR', 60, 210);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 32px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(profile.nome.toUpperCase(), 60, 255);

    // Informações em colunas
    ctx.fillStyle = '#FFAAAA';
    ctx.font = '18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('TIPO SANGUÍNEO', 60, 330);
    ctx.fillText('DOCUMENTO / ID', 350, 330);
    ctx.fillText('HEMOCENTRO VINCULADO', 650, 330);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 44px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(profile.tipoSanguineo || 'O+', 60, 385);

    ctx.font = 'bold 26px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(profile.uid.substring(0, 14).toUpperCase(), 350, 380);
    ctx.fillText('HEMOMAR - SÃO LUÍS', 650, 380);

    // Rodapé
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = 'italic 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('“Cada gota é um gesto de solidariedade e vida.”', 60, 520);

    // Chip visual decorativo
    ctx.fillStyle = '#E5C07B';
    ctx.roundRect(840, 60, 80, 60, 12);
    ctx.fill();

    const dataUrl = canvas.toDataURL('image/png');
    const sampleCard: DonorCard = {
      id: 'card_sample_' + Date.now(),
      userId: profile.uid,
      dataUrl,
      formato: 'image/png',
      nomeArquivo: 'cartao_doador_oficial_amostra.png',
      dataEnvio: new Date().toISOString(),
    };

    await saveDonorCard(sampleCard);
    setCard(sampleCard);
    setZoom(1);
  };

  const handleDownload = () => {
    if (!card) return;
    const link = document.createElement('a');
    link.href = card.dataUrl;
    link.download = card.nomeArquivo || 'meu_cartao_doador.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 pb-24 animate-fadeIn">
      {/* Top Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-2xl font-extrabold text-[#242424] dark:text-[#F3F4F6] tracking-tight">
            Meu Cartão de Doador
          </h2>
          <p className="text-xs text-[#777777] dark:text-[#9CA3AF]">
            Armazene e consulte seu comprovante oficial em imagem PNG
          </p>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
        />

        {card ? (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-2xl bg-[#F7F7F5] dark:bg-[#25252B] hover:bg-[#E9E9E6] text-xs font-bold text-[#242424] dark:text-[#F3F4F6] transition-all"
            >
              Substituir
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="w-8 h-8 rounded-2xl bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-[#D95757] flex items-center justify-center transition-colors"
              title="Excluir Cartão"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ) : null}
      </div>

      {/* Main Card Display or Empty State */}
      {loading ? (
        <div className="bg-[#FFFFFF] dark:bg-[#1A1A1E] p-12 rounded-[28px] border border-[#E9E9E6] dark:border-[#2E2E36] flex flex-col items-center justify-center text-center space-y-2">
          <div className="w-8 h-8 rounded-full border-2 border-[#D95757] border-t-transparent animate-spin" />
          <span className="text-xs text-[#777777] dark:text-[#9CA3AF]">Carregando seu cartão seguro...</span>
        </div>
      ) : card ? (
        <div className="space-y-3">
          {/* Viewer Container */}
          <div className="bg-[#1C1C21] rounded-[28px] p-3 sm:p-4 border border-[#E9E9E6] dark:border-[#2E2E36] overflow-hidden relative shadow-lg flex flex-col items-center min-h-[260px] sm:min-h-[340px] justify-center">
            {/* Control Bar Overlay */}
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-2xl text-white border border-white/20">
              <button
                onClick={() => setZoom((prev) => Math.max(0.6, prev - 0.2))}
                className="w-7 h-7 rounded-xl hover:bg-white/20 flex items-center justify-center transition-colors"
                title="Reduzir Zoom"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono px-1">{Math.round(zoom * 100)}%</span>
              <button
                onClick={() => setZoom((prev) => Math.min(3.0, prev + 0.2))}
                className="w-7 h-7 rounded-xl hover:bg-white/20 flex items-center justify-center transition-colors"
                title="Aumentar Zoom"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoom(1)}
                className="w-7 h-7 rounded-xl hover:bg-white/20 flex items-center justify-center transition-colors"
                title="Resetar Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsFullscreen(true)}
                className="w-7 h-7 rounded-xl hover:bg-white/20 flex items-center justify-center transition-colors ml-1"
                title="Expandir Tela Cheia"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Imagem do Cartão com Zoom e Proporção Preservada */}
            <div className="w-full flex items-center justify-center overflow-auto p-4 cursor-grab active:cursor-grabbing max-h-[460px]">
              <img
                src={card.dataUrl}
                alt="Cartão de Doador de Sangue"
                style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
                className="max-w-full h-auto rounded-2xl shadow-2xl transition-transform duration-200 select-none object-contain pointer-events-auto"
              />
            </div>
          </div>

          {/* Card Info and Download Bar */}
          <div className="bg-[#FFFFFF] dark:bg-[#1A1A1E] p-4 rounded-[24px] border border-[#E9E9E6] dark:border-[#2E2E36] flex items-center justify-between text-xs shadow-xs">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 font-bold text-[#242424] dark:text-[#F3F4F6]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Cartão Armazenado com Sucesso</span>
              </div>
              <p className="text-[11px] text-[#777777] dark:text-[#9CA3AF]">
                {card.nomeArquivo} • Imagem protegida e preservada na íntegra
              </p>
            </div>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F7F7F5] dark:bg-[#25252B] hover:bg-[#E9E9E6] text-xs font-bold text-[#242424] dark:text-[#F3F4F6] transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#777777] dark:text-[#9CA3AF]" />
              <span>Baixar PNG</span>
            </button>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-[#FFFFFF] dark:bg-[#1A1A1E] p-8 rounded-[28px] border border-[#E9E9E6] dark:border-[#2E2E36] text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-[#F5D9D5] dark:bg-[#3E1F1F] flex items-center justify-center text-[#D95757]">
            <CreditCard className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#242424] dark:text-[#F3F4F6]">Nenhum cartão cadastrado</h3>
            <p className="text-xs text-[#777777] dark:text-[#9CA3AF] max-w-sm mx-auto leading-relaxed">
              Carregue a foto ou imagem PNG do seu cartão de doador emitido pelo HEMOMAR ou outro
              hemocentro para tê-lo sempre à mão no aplicativo.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[#D95757] hover:bg-[#c24a4a] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Upload className="w-4 h-4" />
              <span>Selecionar Imagem PNG na Galeria</span>
            </button>

            <button
              onClick={handleGenerateSampleCard}
              className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-[#DCECCB] dark:bg-[#1E3825] hover:bg-[#cfdfbe] text-[#2d4d1e] dark:text-[#86EFAC] text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Gerar Cartão Digital Demonstrativo</span>
            </button>
          </div>

          <div className="pt-4 border-t border-[#E9E9E6] dark:border-[#2E2E36] text-[11px] text-[#888888] dark:text-[#9CA3AF] flex items-center justify-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-[#999999]" />
            <span>O aplicativo preserva o formato e as informações originais do seu cartão.</span>
          </div>
        </div>
      )}

      {/* Modal Tela Cheia */}
      {isFullscreen && card && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col p-4 animate-fadeIn">
          <div className="flex justify-between items-center text-white pb-3 border-b border-white/20">
            <span className="text-xs font-bold tracking-wide">Visualização em Alta Resolução</span>
            <button
              onClick={() => setIsFullscreen(false)}
              className="px-3 py-1.5 rounded-xl bg-white/20 text-xs font-bold text-white hover:bg-white/30"
            >
              Fechar Tela Cheia
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center overflow-auto p-4">
            <img
              src={card.dataUrl}
              alt="Cartão em tela cheia"
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Remoção do Cartão */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-[#1A1A1E] rounded-[28px] p-6 max-w-sm w-full space-y-4 shadow-2xl border border-[#E9E9E6] dark:border-[#2E2E36] text-[#242424] dark:text-[#EEEEEE]">
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-[#242424] dark:text-white">Remover Cartão de Doador?</h3>
              <p className="text-xs text-[#777777] dark:text-[#A0A0A5] mt-1">
                A imagem do cartão será excluída do armazenamento seguro deste dispositivo.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#F7F7F5] dark:bg-[#25252B] text-xs font-semibold text-[#242424] dark:text-white hover:bg-[#E9E9E6] dark:hover:bg-[#32323A] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl bg-[#D95757] text-xs font-bold text-white hover:bg-red-700 transition-colors shadow-sm"
              >
                Sim, Remover
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
