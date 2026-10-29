/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, User, Heart, AlertCircle, CheckCircle2 } from 'lucide-react';
import { loginUser, registerUser, seedDemoDataIfEmpty } from '../services/storageService';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onSuccess: (profile: UserProfile, isNewUser: boolean) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onSuccess }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  // Campos
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (isForgotPassword) {
      if (!email.trim() || !email.includes('@')) {
        setErrorMsg('Informe um endereço de e-mail válido.');
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setSuccessMsg(
          `Instruções de redefinição de senha foram enviadas para ${email}. Verifique sua caixa de entrada e spam.`
        );
      }, 700);
      return;
    }

    if (isRegistering) {
      if (!nome.trim()) {
        setErrorMsg('Por favor, informe seu nome completo.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setErrorMsg('Por favor, informe um e-mail válido.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('A senha deve ter pelo menos 6 caracteres.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('As senhas digitadas não coincidem.');
        return;
      }

      setLoading(true);
      try {
        const profile = registerUser(nome, email, password);
        setLoading(false);
        onSuccess(profile, true);
      } catch (err: unknown) {
        setLoading(false);
        setErrorMsg(err instanceof Error ? err.message : 'Erro ao criar conta.');
      }
    } else {
      // Login
      if (!email.trim() || !email.includes('@')) {
        setErrorMsg('Informe seu e-mail cadastrado.');
        return;
      }
      if (!password) {
        setErrorMsg('Informe sua senha.');
        return;
      }

      setLoading(true);
      try {
        const profile = loginUser(email, password);
        setLoading(false);
        onSuccess(profile, false);
      } catch (err: unknown) {
        setLoading(false);
        setErrorMsg(err instanceof Error ? err.message : 'Erro ao realizar login.');
      }
    }
  };

  const handleDemoLogin = () => {
    setLoading(true);
    setTimeout(() => {
      const demoProfile = seedDemoDataIfEmpty();
      setLoading(false);
      onSuccess(demoProfile, false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FFFFFF] dark:bg-[#1A1A1E] w-full max-w-md rounded-[28px] p-6 sm:p-8 shadow-2xl border border-[#E9E9E6] dark:border-[#2E2E36] relative overflow-hidden text-[#242424] dark:text-[#EEEEEE]">
        {/* Accent Top Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#D95757] via-[#BDE8F0] to-[#DCECCB]" />

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-[#F5D9D5] dark:bg-[#3D1E1E] flex items-center justify-center text-[#D95757] dark:text-[#F57070] mb-3 shadow-inner">
            <Heart className="w-7 h-7 fill-current" />
          </div>
          <h2 className="text-2xl font-bold text-[#242424] dark:text-white">
            {isForgotPassword
              ? 'Recuperar Senha'
              : isRegistering
              ? 'Criar Conta no Meu Doador'
              : 'Bem-vindo de volta!'}
          </h2>
          <p className="text-sm text-[#777777] dark:text-[#A0A0A5] mt-1">
            {isForgotPassword
              ? 'Digite seu e-mail para receber as instruções'
              : isRegistering
              ? 'Cadastre-se para acompanhar sua jornada de doações'
              : 'Acesse suas doações, cartão e estimativas'}
          </p>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div>
              <label className="block text-xs font-semibold text-[#242424] dark:text-[#D1D1D6] mb-1">Nome Completo</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777777] dark:text-[#A0A0A5]" />
                <input
                  type="text"
                  placeholder="Ex: João da Silva"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F7F7F5] dark:bg-[#25252B] border border-[#E9E9E6] dark:border-[#383842] text-sm text-[#242424] dark:text-white focus:outline-none focus:border-[#D95757] focus:bg-white dark:focus:bg-[#1A1A1E] transition-all"
                  required={isRegistering}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#242424] dark:text-[#D1D1D6] mb-1">E-mail</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777777] dark:text-[#A0A0A5]" />
              <input
                type="email"
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F7F7F5] dark:bg-[#25252B] border border-[#E9E9E6] dark:border-[#383842] text-sm text-[#242424] dark:text-white focus:outline-none focus:border-[#D95757] focus:bg-white dark:focus:bg-[#1A1A1E] transition-all"
                required
              />
            </div>
          </div>

          {!isForgotPassword && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-[#242424] dark:text-[#D1D1D6]">Senha</label>
                {!isRegistering && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(true);
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="text-xs text-[#D95757] dark:text-[#F57070] hover:underline"
                  >
                    Esqueci minha senha
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777777] dark:text-[#A0A0A5]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-[#F7F7F5] dark:bg-[#25252B] border border-[#E9E9E6] dark:border-[#383842] text-sm text-[#242424] dark:text-white focus:outline-none focus:border-[#D95757] focus:bg-white dark:focus:bg-[#1A1A1E] transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#777777] dark:text-[#A0A0A5] hover:text-[#242424] dark:hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {isRegistering && (
            <div>
              <label className="block text-xs font-semibold text-[#242424] dark:text-[#D1D1D6] mb-1">Confirmar Senha</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777777] dark:text-[#A0A0A5]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Repita sua senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F7F7F5] dark:bg-[#25252B] border border-[#E9E9E6] dark:border-[#383842] text-sm text-[#242424] dark:text-white focus:outline-none focus:border-[#D95757] focus:bg-white dark:focus:bg-[#1A1A1E] transition-all"
                  required={isRegistering}
                />
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-[#D95757] hover:bg-[#c24a4a] active:scale-[0.99] text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : isForgotPassword ? (
              'Enviar link de redefinição'
            ) : isRegistering ? (
              'Criar Minha Conta'
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        {/* Toggle between Login / Register / Forgot */}
        <div className="mt-5 text-center text-xs text-[#777777] dark:text-[#A0A0A5] space-y-2">
          {isForgotPassword ? (
            <button
              onClick={() => {
                setIsForgotPassword(false);
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className="text-[#D95757] dark:text-[#F57070] font-semibold hover:underline"
            >
              Voltar para o Login
            </button>
          ) : isRegistering ? (
            <p>
              Já tem uma conta?{' '}
              <button
                onClick={() => {
                  setIsRegistering(false);
                  setErrorMsg(null);
                }}
                className="text-[#D95757] dark:text-[#F57070] font-semibold hover:underline"
              >
                Faça login
              </button>
            </p>
          ) : (
            <p>
              Não possui uma conta?{' '}
              <button
                onClick={() => {
                  setIsRegistering(true);
                  setErrorMsg(null);
                }}
                className="text-[#D95757] dark:text-[#F57070] font-semibold hover:underline"
              >
                Cadastre-se gratuitamente
              </button>
            </p>
          )}

          {/* Atalho Demo */}
          <div className="pt-3 border-t border-[#E9E9E6]/60 dark:border-[#2E2E36]">
            <button
              onClick={handleDemoLogin}
              type="button"
              className="w-full py-2 px-3 rounded-2xl bg-[#DCECCB] dark:bg-[#1E3316] hover:bg-[#cfdfbe] dark:hover:bg-[#27421D] text-[#2d4d1e] dark:text-[#A8C98B] font-medium text-xs transition-all flex items-center justify-center gap-1.5"
            >
              <span>Entrar com Conta de Teste (Doador Exemplo)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
