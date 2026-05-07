export const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-for-dev-purposes-only-12345678'
);

export const ACCESS_TOKEN_EXPIRES = '15m';
export const REFRESH_TOKEN_EXPIRES = '7d';

export type ClientSegment = 'VAREJO' | 'PRIVATE' | 'CORPORATE';

export interface User {
  id: string;
  email: string;
  name: string;
  segment: ClientSegment;
}

export const MOCK_USERS: Record<string, User & { passwordHash: string }> = {
  'user_varejo': {
    id: 'usr_1',
    email: 'joao.varejo@empresa.com.br',
    name: 'João Silva (Varejo)',
    segment: 'VAREJO',
    passwordHash: 'senha123',
  },
  'user_corporate': {
    id: 'usr_2',
    email: 'maria.corp@itau.com.br',
    name: 'Maria Santos (Corporate)',
    segment: 'CORPORATE',
    passwordHash: 'senha456',
  },
};

export interface Offer {
  id: string;
  name: string;
  summary: string;
  description: string;
  whyThisOffer: string;
  category: 'credito' | 'investimento' | 'seguros';
  minAmount: number;
  maxAmount: number;
  eligibility: string;
  conditions: {
    rateFrom: number;
    termMonths: number[];
  };
}

export const MOCK_OFFERS: Offer[] = [
  {
    id: '123',
    name: 'Capital de Giro',
    summary: 'Linha de crédito para fluxo de caixa com taxas reduzidas.',
    description: 'O Capital de Giro é ideal para manter o equilíbrio financeiro da sua empresa, cobrindo despesas operacionais ou aproveitando oportunidades de mercado.',
    whyThisOffer: 'Baseado no seu faturamento médio dos últimos 6 meses e seu excelente histórico de pagamentos.',
    category: 'credito',
    minAmount: 50000,
    maxAmount: 500000,
    eligibility: 'Pré-aprovado até R$ 300.000',
    conditions: {
      rateFrom: 1.25,
      termMonths: [12, 24, 36],
    },
  },
  {
    id: '456',
    name: 'Antecipação de Recebíveis',
    summary: 'Receba hoje o que venderia a prazo no cartão.',
    description: 'Transforme suas vendas a prazo em dinheiro na mão agora mesmo, sem burocracia.',
    whyThisOffer: 'Notamos um aumento no seu volume de vendas parceladas este mês.',
    category: 'credito',
    minAmount: 1000,
    maxAmount: 100000,
    eligibility: 'Disponível para faturamento via adquirentes parceiras.',
    conditions: {
      rateFrom: 0.99,
      termMonths: [1],
    },
  },
];

// In-memory database simulation for simulation progress
export const SIMULATION_STORAGE = new Map<string, any>();
