/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DonationRecord, DonationType, EligibilityStatus, UserProfile } from '../types';

/**
 * Calcula a elegibilidade informativa para nova doação de sangue.
 * Regras baseadas na Portaria de Consolidação nº 5/2017 do Ministério da Saúde do Brasil e ANVISA:
 * - Sangue Total:
 *   - Homem: intervalo mínimo 60 dias (2 meses), até 4 doações por período móvel de 12 meses.
 *   - Mulher: intervalo mínimo 90 dias (3 meses), até 3 doações por período móvel de 12 meses.
 * - Plaquetas: intervalo mínimo de 48 horas, até 24 doações por período de 12 meses.
 */
export function calculateEligibility(
  profile: UserProfile | null,
  donations: DonationRecord[],
  referenceDate: Date = new Date()
): EligibilityStatus {
  const detalhes: string[] = [];
  const refTime = referenceDate.getTime();

  // Ordenar doações por data decrescente (mais recente primeiro)
  const sortedDonations = [...donations].sort(
    (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
  );

  const lastDonation = sortedDonations.length > 0 ? sortedDonations[0] : null;
  const currentYear = referenceDate.getFullYear();

  // 1. Contagem no ano civil (1 de janeiro a 31 de dezembro)
  const doacoesAnoCivil = sortedDonations.filter(d => {
    const dYear = new Date(d.data + 'T00:00:00').getFullYear();
    return dYear === currentYear;
  }).length;

  // 2. Contagem no período móvel dos últimos 12 meses (365 dias antes da data de referência)
  const oneYearAgoTime = new Date(referenceDate);
  oneYearAgoTime.setFullYear(oneYearAgoTime.getFullYear() - 1);
  const oneYearAgoMs = oneYearAgoTime.getTime();

  const doacoesUltimos12Meses = sortedDonations.filter(d => {
    const dTime = new Date(d.data + 'T00:00:00').getTime();
    return dTime >= oneYearAgoMs && dTime <= refTime;
  }).length;

  // Determinar limites com base no perfil e tipo da última doação
  const gender = profile?.genero || 'M'; // default ou pendente
  const lastType: DonationType = lastDonation?.tipoDoacao || 'sangue_total';

  let intervaloMinimoDias = 60;
  let limiteMaximo12Meses = 4;

  if (lastType === 'sangue_total') {
    if (gender === 'F') {
      intervaloMinimoDias = 90;
      limiteMaximo12Meses = 3;
    } else {
      intervaloMinimoDias = 60;
      limiteMaximo12Meses = 4;
    }
  } else if (lastType === 'plaquetas') {
    intervaloMinimoDias = 7; // Mínimo 48h a 7 dias
    limiteMaximo12Meses = 24;
  } else {
    // Hemácias duplas ou plasma
    intervaloMinimoDias = 120;
    limiteMaximo12Meses = 2;
  }

  const doacoesRestantes12Meses = Math.max(0, limiteMaximo12Meses - doacoesUltimos12Meses);

  // Sem doações anteriores registradas
  if (!lastDonation) {
    return {
      aptoEstimado: true,
      statusTexto: 'Pronto para a primeira doação!',
      statusTipo: 'apto',
      proximaDataEstimada: referenceDate.toISOString().split('T')[0],
      diasRestantes: 0,
      dataUltimaDoacao: null,
      tipoUltimaDoacao: null,
      intervaloMinimoDias,
      doacoesAnoCivil: 0,
      doacoesUltimos12Meses: 0,
      limiteMaximo12Meses,
      doacoesRestantes12Meses: limiteMaximo12Meses,
      mensagem: 'Nenhuma doação cadastrada no histórico. Você pode iniciar sua jornada quando desejar!',
      detalhes: [
        'Lembre-se de levar documento oficial com foto ao hemocentro.',
        'Certifique-se de ter dormido pelo menos 6 horas e não estar em jejum.',
        'A triagem do hemocentro confirmará sua aptidão.'
      ]
    };
  }

  // Com doações: calcular próxima data pelo intervalo
  const lastDonationDate = new Date(lastDonation.data + 'T00:00:00');
  const nextEligibleByInterval = new Date(lastDonationDate);
  nextEligibleByInterval.setDate(nextEligibleByInterval.getDate() + intervaloMinimoDias);

  const diffMs = nextEligibleByInterval.getTime() - refTime;
  const diasRestantesIntervalo = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  const proximaDataStr = nextEligibleByInterval.toISOString().split('T')[0];

  // Verificar se atingiu o limite de doações nos últimos 12 meses
  if (doacoesUltimos12Meses >= limiteMaximo12Meses) {
    // Encontrar quando a doação mais antiga que contribui para o limite completará 1 ano
    const qualifyingDonations = sortedDonations
      .filter(d => new Date(d.data + 'T00:00:00').getTime() >= oneYearAgoMs)
      .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

    let dateFreeAfterLimit = nextEligibleByInterval;
    if (qualifyingDonations.length >= limiteMaximo12Meses) {
      const oldestInWindow = new Date(qualifyingDonations[0].data + 'T00:00:00');
      oldestInWindow.setFullYear(oldestInWindow.getFullYear() + 1);
      oldestInWindow.setDate(oldestInWindow.getDate() + 1);
      if (oldestInWindow > dateFreeAfterLimit) {
        dateFreeAfterLimit = oldestInWindow;
      }
    }

    const diasParaLiberar = Math.max(
      1,
      Math.ceil((dateFreeAfterLimit.getTime() - refTime) / (1000 * 60 * 60 * 24))
    );

    return {
      aptoEstimado: false,
      statusTexto: 'Limite do período atingido',
      statusTipo: 'limite_atingido',
      proximaDataEstimada: dateFreeAfterLimit.toISOString().split('T')[0],
      diasRestantes: diasParaLiberar,
      dataUltimaDoacao: lastDonation.data,
      tipoUltimaDoacao: lastDonation.tipoDoacao,
      intervaloMinimoDias,
      doacoesAnoCivil,
      doacoesUltimos12Meses,
      limiteMaximo12Meses,
      doacoesRestantes12Meses: 0,
      mensagem: `Você atingiu o limite máximo de ${limiteMaximo12Meses} doações nos últimos 12 meses. Aguarde a renovação do período para preservar sua saúde.`,
      detalhes: [
        `Limite de segurança: ${limiteMaximo12Meses} doações por período móvel de 12 meses.`,
        `Doações no período atual: ${doacoesUltimos12Meses}.`,
        `Previsão de liberação de nova cota: ${formatDateBR(dateFreeAfterLimit.toISOString().split('T')[0])}.`
      ]
    };
  }

  // Verificar se ainda está cumprindo o intervalo mínimo
  if (diasRestantesIntervalo > 0) {
    return {
      aptoEstimado: false,
      statusTexto: `Intervalo em andamento (${diasRestantesIntervalo} dias restantes)`,
      statusTipo: 'aguardando_intervalo',
      proximaDataEstimada: proximaDataStr,
      diasRestantes: diasRestantesIntervalo,
      dataUltimaDoacao: lastDonation.data,
      tipoUltimaDoacao: lastDonation.tipoDoacao,
      intervaloMinimoDias,
      doacoesAnoCivil,
      doacoesUltimos12Meses,
      limiteMaximo12Meses,
      doacoesRestantes12Meses,
      mensagem: `Aguarde o cumprimento do intervalo mínimo de ${intervaloMinimoDias} dias após sua última doação em ${formatDateBR(lastDonation.data)}.`,
      detalhes: [
        `Intervalo mínimo exigido: ${intervaloMinimoDias} dias (${lastType === 'sangue_total' ? (gender === 'F' ? 'Mulheres: 90 dias' : 'Homens: 60 dias') : 'Plaquetas/Aférese'}).`,
        `Data estimada para nova doação: ${formatDateBR(proximaDataStr)}.`,
        `Você ainda possui margem para ${doacoesRestantes12Meses} doação(ões) nos próximos 12 meses.`
      ]
    };
  }

  // Data estimada atingida!
  return {
    aptoEstimado: true,
    statusTexto: 'Data estimada atingida!',
    statusTipo: 'apto',
    proximaDataEstimada: proximaDataStr,
    diasRestantes: 0,
    dataUltimaDoacao: lastDonation.data,
    tipoUltimaDoacao: lastDonation.tipoDoacao,
    intervaloMinimoDias,
    doacoesAnoCivil,
    doacoesUltimos12Meses,
    limiteMaximo12Meses,
    doacoesRestantes12Meses,
    mensagem: 'O intervalo mínimo foi cumprido. Você já pode comparecer ao hemocentro para avaliação e triagem!',
    detalhes: [
      `Última doação foi há mais de ${intervaloMinimoDias} dias (${formatDateBR(lastDonation.data)}).`,
      `Margem disponível: ${doacoesRestantes12Meses} doação(ões) restantes no período móvel de 12 meses.`,
      'A aptidão final depende exclusivamente da entrevista clínica e dos exames de triagem no hemocentro.'
    ]
  };
}

export function formatDateBR(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

export function getDonationTypeLabel(type: DonationType): string {
  switch (type) {
    case 'sangue_total':
      return 'Sangue Total';
    case 'plaquetas':
      return 'Plaquetas (Aférese)';
    case 'hemacias_duplas':
      return 'Hemácias Duplas';
    case 'plasma':
      return 'Plasma';
    default:
      return 'Sangue Total';
  }
}
