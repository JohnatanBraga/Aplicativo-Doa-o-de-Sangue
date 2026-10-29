/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Não sei';
export type Gender = 'M' | 'F' | 'outro';
export type DonationType = 'sangue_total' | 'plaquetas' | 'hemacias_duplas' | 'plasma';
export type DonationCategory = 'voluntaria' | 'destinada';
export type ThemeMode = 'light' | 'dark' | 'system';

export interface UserProfile {
  uid: string;
  email: string;
  nome: string;
  dataNascimento?: string; // YYYY-MM-DD
  genero?: Gender;
  cidade: string;
  estado: string;
  hemocentroReferencia: string;
  tipoSanguineo: BloodType;
  fatorRh?: '+' | '-' | 'desconhecido';
  pesoAtual: number; // em kg
  dataAtualizacaoPeso: string; // ISO string ou YYYY-MM-DD
  tutorialConcluido: boolean;
  dataCriacao: string;
  themePreference?: ThemeMode;
}

export interface DonationRecord {
  id: string;
  userId: string;
  data: string; // YYYY-MM-DD
  hemocentro: string;
  cidade: string;
  estado: string;
  tipoDoacao: DonationType; // Sangue total, plaquetas, etc. (usado para regras médicas)
  
  // Nova funcionalidade: Categoria da doação (Voluntária vs Destinada a pessoa)
  categoriaDoacao: DonationCategory;
  destinatarioNome?: string; // Obrigatório se categoriaDoacao === 'destinada'
  destinatarioCpf?: string; // Opcional
  destinatarioHospital?: string; // Opcional
  
  pesoNoDia?: number;
  observacoes?: string;
  dataCriacao: string;
  dataAtualizacao: string;
}

export interface DonorCard {
  id: string;
  userId: string;
  dataUrl: string; // PNG base64
  formato: string;
  nomeArquivo: string;
  dataEnvio: string;
}

export interface Reminder {
  id: string;
  userId: string;
  titulo: string;
  descricao?: string;
  data: string; // YYYY-MM-DD
  concluido: boolean;
  dataCriacao: string;
}

export interface WeightEntry {
  id: string;
  userId: string;
  peso: number;
  dataMedicao: string;
}

export interface EligibilityStatus {
  aptoEstimado: boolean;
  statusTexto: string;
  statusTipo: 'apto' | 'aguardando_intervalo' | 'limite_atingido' | 'dados_pendentes';
  proximaDataEstimada: string | null;
  diasRestantes: number;
  dataUltimaDoacao: string | null;
  tipoUltimaDoacao: DonationType | null;
  intervaloMinimoDias: number;
  doacoesAnoCivil: number;
  doacoesUltimos12Meses: number;
  limiteMaximo12Meses: number;
  doacoesRestantes12Meses: number;
  mensagem: string;
  detalhes: string[];
}
