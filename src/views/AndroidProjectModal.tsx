/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Code2,
  Download,
  Check,
  Copy,
  FolderGit2,
  Smartphone,
  AlertCircle,
  FileCode,
  Sparkles,
} from 'lucide-react';
import JSZip from 'jszip';
import { ANDROID_PROJECT_FILES } from '../androidExport/projectFiles';

interface AndroidProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidProjectModal: React.FC<AndroidProjectModalProps> = ({ isOpen, onClose }) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const currentFile = ANDROID_PROJECT_FILES[selectedFileIndex];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setDownloading(true);
    try {
      const zip = new JSZip();
      ANDROID_PROJECT_FILES.forEach((file) => {
        zip.file(file.path, file.content);
      });

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'MeuDoador_AndroidStudio_Project.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erro ao gerar zip:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FFFFFF] dark:bg-[#1A1A1E] w-full max-w-3xl rounded-[28px] p-5 sm:p-7 shadow-2xl border border-[#E9E9E6] dark:border-[#2E2E36] relative max-h-[92vh] flex flex-col text-[#242424] dark:text-[#EEEEEE]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E9E9E6] dark:border-[#2E2E36]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#DCECCB] dark:bg-[#203618] text-[#2d4d1e] dark:text-[#A8C98B] flex items-center justify-center font-bold">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#242424] dark:text-white">
                Projeto Nativo Android (APK)
              </h3>
              <p className="text-[11px] text-[#777777] dark:text-[#A0A0A5]">
                Kotlin 2.0 • Jetpack Compose • Material 3 • Gradle DSL
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#F7F7F5] dark:bg-[#25252B] hover:bg-[#E9E9E6] dark:hover:bg-[#32323A] flex items-center justify-center text-[#777777] dark:text-[#A0A0A5] hover:text-[#242424] dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Diagnóstico Transparente do Ambiente (Atendendo ao item 2.1 do PRD) */}
        <div className="my-3 p-3.5 rounded-2xl bg-[#BDE8F0]/30 dark:bg-[#122A30]/50 border border-[#BDE8F0] dark:border-[#1E4852] text-xs text-[#153e48] dark:text-[#BDE8F0] space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-[#1b4b57] dark:text-[#67D5E8]">
            <Smartphone className="w-4 h-4 shrink-0 text-[#1b4b57] dark:text-[#67D5E8]" />
            <span>Capacidades Técnicas do Ambiente & Estrutura Android</span>
          </div>
          <p className="text-[11px] leading-relaxed dark:text-[#D1E8ED]">
            O ambiente atual de nuvem do Google AI Studio executa uma instância Web/Node.js sem o
            Android SDK e compilador Gradle instalados no container para gerar diretamente o binário
            .APK.
            <br />
            Por essa razão, além de disponibilizarmos a aplicação 100% funcional na tela, fornecemos
            abaixo o <strong>projeto Android nativo completo</strong> pronto para ser aberto no
            Android Studio para compilação com 1 clique do seu arquivo APK instalável no Samsung
            Galaxy.
          </p>
        </div>

        {/* Action Download Button */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E9E9E6] dark:border-[#2E2E36]">
          <span className="text-xs font-bold text-[#242424] dark:text-white">Arquivos do Projeto:</span>
          <button
            onClick={handleDownloadZip}
            disabled={downloading}
            className="px-4 py-2 rounded-xl bg-[#2d4d1e] hover:bg-[#233d18] dark:bg-[#3E6B2A] dark:hover:bg-[#4E8535] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {downloading ? (
              <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>Baixar Projeto Android Studio (.ZIP)</span>
          </button>
        </div>

        {/* File Tabs & Code Inspector */}
        <div className="flex-1 overflow-hidden flex flex-col sm:flex-row gap-3 pt-3 min-h-0">
          {/* File list */}
          <div className="sm:w-64 overflow-y-auto space-y-1 pr-1 border-r border-[#E9E9E6]/60 dark:border-[#2E2E36]">
            {ANDROID_PROJECT_FILES.map((file, idx) => (
              <button
                key={file.path}
                onClick={() => setSelectedFileIndex(idx)}
                className={`w-full text-left p-2 rounded-xl text-[11px] transition-all flex items-center gap-2 ${
                  selectedFileIndex === idx
                    ? 'bg-[#F5D9D5] dark:bg-[#3D1E1E] text-[#D95757] dark:text-[#F57070] font-bold shadow-xs'
                    : 'text-[#555555] dark:text-[#A0A0A5] hover:bg-[#F7F7F5] dark:hover:bg-[#25252B]'
                }`}
              >
                <FileCode className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{file.path}</span>
              </button>
            ))}
          </div>

          {/* Code viewer */}
          <div className="flex-1 flex flex-col bg-[#141416] rounded-2xl overflow-hidden border border-[#2E2E36] text-white">
            <div className="flex items-center justify-between px-3 py-2 bg-[#1C1C22] border-b border-[#2E2E36] text-[11px]">
              <span className="font-mono text-gray-300 truncate">{currentFile.path}</span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
            <pre className="flex-1 overflow-auto p-3 text-[11px] font-mono leading-relaxed text-gray-200 select-all">
              {currentFile.content}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 mt-3 border-t border-[#E9E9E6] dark:border-[#2E2E36] flex items-center justify-between text-xs text-[#777777] dark:text-[#A0A0A5]">
          <span>Abra no Android Studio &gt; Build &gt; Build APK(s)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#242424] dark:bg-[#32323A] text-white font-bold hover:bg-black dark:hover:bg-[#40404C] transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
