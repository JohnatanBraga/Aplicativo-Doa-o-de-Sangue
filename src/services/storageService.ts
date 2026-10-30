/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DonationRecord, DonorCard, Reminder, UserProfile, WeightEntry, ThemeMode } from '../types';

const ACCOUNTS_KEY = 'meu_doador_accounts_v1';
const CURRENT_USER_KEY = 'meu_doador_current_user_v1';
const DB_NAME = 'MeuDoador_IndexedDB';
const DB_VERSION = 1;
const STORE_CARDS = 'donor_cards';

interface StoredAccount {
  uid: string;
  email: string;
  passwordHash: string;
  nome: string;
}

// Inicializar IndexedDB para armazenar o cartão de doador em PNG
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_CARDS)) {
        db.createObjectStore(STORE_CARDS, { keyPath: 'userId' });
      }
    };
  });
}

// ----------------- AUTENTICAÇÃO E CONTAS -----------------

export function getAccounts(): StoredAccount[] {
  try {
    const data = localStorage.getItem(ACCOUNTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveAccount(account: StoredAccount): void {
  const accounts = getAccounts();
  const existingIndex = accounts.findIndex(a => a.email.toLowerCase() === account.email.toLowerCase());
  if (existingIndex >= 0) {
    accounts[existingIndex] = account;
  } else {
    accounts.push(account);
  }
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function registerUser(nome: string, email: string, passwordHash: string): UserProfile {
  const accounts = getAccounts();
  const emailNorm = email.trim().toLowerCase();
  if (accounts.some(a => a.email.toLowerCase() === emailNorm)) {
    throw new Error('Já existe uma conta cadastrada com este e-mail.');
  }

  const uid = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
  const newAccount: StoredAccount = {
    uid,
    email: emailNorm,
    passwordHash,
    nome: nome.trim(),
  };
  saveAccount(newAccount);

  const initialProfile: UserProfile = {
    uid,
    email: emailNorm,
    nome: nome.trim(),
    genero: 'M',
    cidade: 'São Luís',
    estado: 'MA',
    hemocentroReferencia: 'HEMOMAR - Centro de Hematologia e Hemoterapia do Maranhão',
    tipoSanguineo: 'O+',
    fatorRh: '+',
    pesoAtual: 72,
    dataAtualizacaoPeso: new Date().toISOString().split('T')[0],
    tutorialConcluido: false,
    dataCriacao: new Date().toISOString(),
  };

  saveProfile(initialProfile);
  setCurrentUserUid(uid);

  // Registrar peso inicial no histórico
  addWeightEntry(uid, 72, new Date().toISOString().split('T')[0]);

  return initialProfile;
}

export function loginUser(email: string, passwordHash: string): UserProfile {
  const accounts = getAccounts();
  const emailNorm = email.trim().toLowerCase();
  const account = accounts.find(a => a.email.toLowerCase() === emailNorm);

  if (!account) {
    throw new Error('E-mail não encontrado. Verifique os dados ou crie uma nova conta.');
  }

  if (account.passwordHash !== passwordHash) {
    throw new Error('Senha incorreta. Tente novamente.');
  }

  setCurrentUserUid(account.uid);
  let profile = getProfile(account.uid);
  if (!profile) {
    profile = {
      uid: account.uid,
      email: account.email,
      nome: account.nome,
      cidade: 'São Luís',
      estado: 'MA',
      hemocentroReferencia: 'HEMOMAR',
      tipoSanguineo: 'O+',
      pesoAtual: 70,
      dataAtualizacaoPeso: new Date().toISOString().split('T')[0],
      tutorialConcluido: true,
      dataCriacao: new Date().toISOString(),
    };
    saveProfile(profile);
  }
  return profile;
}

export function getCurrentUserUid(): string | null {
  return localStorage.getItem(CURRENT_USER_KEY);
}

export function setCurrentUserUid(uid: string | null): void {
  if (uid) {
    localStorage.setItem(CURRENT_USER_KEY, uid);
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

export function logout(): void {
  setCurrentUserUid(null);
}

export const THEME_KEY = 'meu_doador_theme_mode';

export function getThemePreference(): ThemeMode {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      return saved as ThemeMode;
    }
  } catch {
    // fallback
  }
  return 'system';
}

export function saveThemePreference(theme: ThemeMode): void {
  localStorage.setItem(THEME_KEY, theme);
}

// ----------------- PERFIL -----------------

export function getProfile(userId: string): UserProfile | null {
  try {
    const raw = localStorage.getItem(`meu_doador_profile_${userId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveProfile(profile: UserProfile): void {
  localStorage.setItem(`meu_doador_profile_${profile.uid}`, JSON.stringify(profile));
  
  // Sincronizar nome e email no registro geral de contas (ACCOUNTS_KEY)
  try {
    const accounts = getAccounts();
    const index = accounts.findIndex(a => a.uid === profile.uid || a.email.toLowerCase() === profile.email.toLowerCase());
    if (index >= 0) {
      accounts[index].nome = profile.nome.trim();
      accounts[index].email = profile.email.trim().toLowerCase();
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    }
  } catch (err) {
    console.error('Erro ao sincronizar conta:', err);
  }
}

// ----------------- DOAÇÕES -----------------

export function getDonations(userId: string): DonationRecord[] {
  try {
    const raw = localStorage.getItem(`meu_doador_donations_${userId}`);
    if (!raw) return [];
    const parsed: DonationRecord[] = JSON.parse(raw);
    // Garantir compatibilidade retroativa com registros anteriores
    return parsed.map(d => ({
      ...d,
      categoriaDoacao: d.categoriaDoacao || 'voluntaria',
    }));
  } catch {
    return [];
  }
}

export function saveDonations(userId: string, donations: DonationRecord[]): void {
  localStorage.setItem(`meu_doador_donations_${userId}`, JSON.stringify(donations));
}

export function addDonation(userId: string, donation: Omit<DonationRecord, 'id' | 'userId' | 'dataCriacao' | 'dataAtualizacao'>): DonationRecord {
  const donations = getDonations(userId);
  const now = new Date().toISOString();
  const newDonation: DonationRecord = {
    ...donation,
    id: 'don_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    userId,
    dataCriacao: now,
    dataAtualizacao: now,
  };
  donations.push(newDonation);
  saveDonations(userId, donations);

  // Se informou peso no dia, adiciona ao histórico de peso também
  if (donation.pesoNoDia && donation.pesoNoDia > 0) {
    addWeightEntry(userId, donation.pesoNoDia, donation.data);
  }

  return newDonation;
}

export function updateDonation(userId: string, donation: DonationRecord): void {
  const donations = getDonations(userId);
  const index = donations.findIndex(d => d.id === donation.id);
  if (index >= 0) {
    donations[index] = {
      ...donation,
      dataAtualizacao: new Date().toISOString(),
    };
    saveDonations(userId, donations);
  }
}

export function deleteDonation(userId: string, donationId: string): void {
  const donations = getDonations(userId);
  const filtered = donations.filter(d => d.id !== donationId);
  saveDonations(userId, filtered);
}

// ----------------- CARTÃO DE DOADOR (IndexedDB para arquivos PNG pesados) -----------------

export async function getDonorCard(userId: string): Promise<DonorCard | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_CARDS], 'readonly');
      const store = transaction.objectStore(STORE_CARDS);
      const request = store.get(userId);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch {
    // Fallback para localStorage se IndexedDB falhar
    const raw = localStorage.getItem(`meu_doador_card_${userId}`);
    return raw ? JSON.parse(raw) : null;
  }
}

export async function saveDonorCard(card: DonorCard): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_CARDS], 'readwrite');
      const store = transaction.objectStore(STORE_CARDS);
      const request = store.put(card);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch {
    localStorage.setItem(`meu_doador_card_${card.userId}`, JSON.stringify(card));
  }
}

export async function deleteDonorCard(userId: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_CARDS], 'readwrite');
      const store = transaction.objectStore(STORE_CARDS);
      const request = store.delete(userId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch {
    localStorage.removeItem(`meu_doador_card_${userId}`);
  }
}

// ----------------- HISTÓRICO DE PESO -----------------

export function getWeightHistory(userId: string): WeightEntry[] {
  try {
    const raw = localStorage.getItem(`meu_doador_weight_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addWeightEntry(userId: string, peso: number, dataMedicao: string): WeightEntry {
  const entries = getWeightHistory(userId);
  const newEntry: WeightEntry = {
    id: 'w_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    userId,
    peso,
    dataMedicao,
  };
  entries.push(newEntry);
  // Ordenar por data decrescente
  entries.sort((a, b) => new Date(b.dataMedicao).getTime() - new Date(a.dataMedicao).getTime());
  localStorage.setItem(`meu_doador_weight_${userId}`, JSON.stringify(entries));

  // Atualizar também o pesoAtual no perfil
  const profile = getProfile(userId);
  if (profile) {
    profile.pesoAtual = peso;
    profile.dataAtualizacaoPeso = dataMedicao;
    saveProfile(profile);
  }

  return newEntry;
}

// ----------------- LEMBRETES -----------------

export function getReminders(userId: string): Reminder[] {
  try {
    const raw = localStorage.getItem(`meu_doador_reminders_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveReminders(userId: string, reminders: Reminder[]): void {
  localStorage.setItem(`meu_doador_reminders_${userId}`, JSON.stringify(reminders));
}

export function addReminder(userId: string, reminder: Omit<Reminder, 'id' | 'userId' | 'dataCriacao'>): Reminder {
  const reminders = getReminders(userId);
  const newRem: Reminder = {
    ...reminder,
    id: 'rem_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    userId,
    dataCriacao: new Date().toISOString(),
  };
  reminders.push(newRem);
  saveReminders(userId, reminders);
  return newRem;
}

export function toggleReminder(userId: string, reminderId: string): void {
  const reminders = getReminders(userId);
  const item = reminders.find(r => r.id === reminderId);
  if (item) {
    item.concluido = !item.concluido;
    saveReminders(userId, reminders);
  }
}

export function deleteReminder(userId: string, reminderId: string): void {
  const reminders = getReminders(userId);
  const filtered = reminders.filter(r => r.id !== reminderId);
  saveReminders(userId, filtered);
}

// ----------------- EXCLUSÃO TOTAL DA CONTA -----------------

export async function deleteFullAccount(userId: string, userEmail?: string): Promise<void> {
  const accounts = getAccounts();
  const emailNorm = userEmail ? userEmail.trim().toLowerCase() : '';
  const updatedAccounts = accounts.filter(
    a => a.uid !== userId && (!emailNorm || a.email.toLowerCase() !== emailNorm)
  );
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(updatedAccounts));

  localStorage.removeItem(`meu_doador_profile_${userId}`);
  localStorage.removeItem(`meu_doador_donations_${userId}`);
  localStorage.removeItem(`meu_doador_weight_${userId}`);
  localStorage.removeItem(`meu_doador_reminders_${userId}`);
  localStorage.removeItem(`meu_doador_card_${userId}`);

  try {
    await deleteDonorCard(userId);
  } catch (err) {
    console.error('Erro ao deletar cartão:', err);
  }

  setCurrentUserUid(null);
}

// ----------------- CRIAÇÃO DE DADOS DE AMOSTRA INICIAIS -----------------

export function seedDemoDataIfEmpty(): UserProfile {
  const existingUid = getCurrentUserUid();
  if (existingUid) {
    const p = getProfile(existingUid);
    if (p) return p;
  }

  const accounts = getAccounts();
  if (accounts.length > 0) {
    const p = getProfile(accounts[0].uid);
    if (p) {
      setCurrentUserUid(p.uid);
      return p;
    }
  }

  // Se a conta de demonstração já existir, remove para recriar sem erro de duplicidade
  const demoEmail = 'doador@exemplo.com';
  const cleanAccounts = accounts.filter(a => a.email.toLowerCase() !== demoEmail);
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(cleanAccounts));

  const demoUser = registerUser('Jonatas Braga', demoEmail, '123456');

  demoUser.hemocentroReferencia = 'HEMOMAR - Centro de Hematologia e Hemoterapia do Maranhão';
  demoUser.cidade = 'São Luís';
  demoUser.estado = 'MA';
  demoUser.tipoSanguineo = 'O+';
  demoUser.pesoAtual = 74;
  demoUser.genero = 'M';
  demoUser.tutorialConcluido = true;
  saveProfile(demoUser);

  // Cadastrar doações anteriores representativas (respeitando o ano atual e histórico)
  const today = new Date();
  const d1 = new Date(today);
  d1.setDate(d1.getDate() - 75); // Doação há 75 dias atrás (elegível para sangue total de homem!)

  const d2 = new Date(today);
  d2.setDate(d2.getDate() - 160);

  const d3 = new Date(today);
  d3.setDate(d3.getDate() - 250);

  const d4 = new Date(today);
  d4.setFullYear(d4.getFullYear() - 1);
  d4.setDate(d4.getDate() - 30);

  addDonation(demoUser.uid, {
    data: d1.toISOString().split('T')[0],
    hemocentro: 'HEMOMAR - São Luís',
    cidade: 'São Luís',
    estado: 'MA',
    tipoDoacao: 'sangue_total',
    categoriaDoacao: 'destinada',
    destinatarioNome: 'Maria Clara Pereira',
    destinatarioCpf: '123.456.789-00',
    destinatarioHospital: 'Hospital UDI - São Luís',
    pesoNoDia: 74,
    observacoes: 'Doação direcionada para cirurgia cardíaca. Paciente recebeu o sangue com sucesso.',
  });

  addDonation(demoUser.uid, {
    data: d2.toISOString().split('T')[0],
    hemocentro: 'HEMOMAR - São Luís',
    cidade: 'São Luís',
    estado: 'MA',
    tipoDoacao: 'sangue_total',
    categoriaDoacao: 'voluntaria',
    pesoNoDia: 73.5,
    observacoes: 'Campanha Junho Vermelho. Doação voluntária para o estoque geral do estado.',
  });

  addDonation(demoUser.uid, {
    data: d3.toISOString().split('T')[0],
    hemocentro: 'HEMOMAR - Posto de Coleta',
    cidade: 'São Luís',
    estado: 'MA',
    tipoDoacao: 'sangue_total',
    categoriaDoacao: 'voluntaria',
    pesoNoDia: 73,
    observacoes: 'Doação voluntária regular.',
  });

  addDonation(demoUser.uid, {
    data: d4.toISOString().split('T')[0],
    hemocentro: 'HEMOMAR - São Luís',
    cidade: 'São Luís',
    estado: 'MA',
    tipoDoacao: 'sangue_total',
    categoriaDoacao: 'destinada',
    destinatarioNome: 'Carlos Eduardo Mendes',
    destinatarioHospital: 'Hospital São Domingos',
    pesoNoDia: 72,
    observacoes: 'Doação para reposição de leito.',
  });

  // Lembrete
  addReminder(demoUser.uid, {
    titulo: 'Agendar nova doação no HEMOMAR',
    descricao: 'Lembrar de beber 500ml de água antes de sair de casa e levar RG original.',
    data: today.toISOString().split('T')[0],
    concluido: false,
  });

  return demoUser;
}
