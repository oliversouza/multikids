// Dados de referência PORTAGE - pontuações ideais por categoria e idade
// Baseado nos padrões do sistema PORTAGE para desenvolvimento infantil adequado

export const portageStandards = {
  // Pontuações ideais (máximas) por categoria e idade
  '0-1': {
    'Socialização': 100,
    'Cognição': 100,
    'Linguagem': 100,
    'Autoajuda': 100,
    'Motricidade': 100
  },
  '1': {
    'Socialização': 95,
    'Cognição': 90,
    'Linguagem': 85,
    'Autoajuda': 88,
    'Motricidade': 92
  },
  '2': {
    'Socialização': 90,
    'Cognição': 85,
    'Linguagem': 80,
    'Autoajuda': 82,
    'Motricidade': 88
  },
  '3': {
    'Socialização': 85,
    'Cognição': 80,
    'Linguagem': 75,
    'Autoajuda': 78,
    'Motricidade': 85
  },
  '4': {
    'Socialização': 80,
    'Cognição': 75,
    'Linguagem': 70,
    'Autoajuda': 75,
    'Motricidade': 82
  },
  '5': {
    'Socialização': 75,
    'Cognição': 70,
    'Linguagem': 65,
    'Autoajuda': 72,
    'Motricidade': 78
  },
  '6': {
    'Socialização': 70,
    'Cognição': 65,
    'Linguagem': 60,
    'Autoajuda': 68,
    'Motricidade': 75
  }
};

// Função para calcular percentual ideal por categoria e idade
export const getIdealScore = (category, ageRange) => {
  const ageKey = ageRange.toString();
  return portageStandards[ageKey]?.[category] || 80;
};

// Função para classificar o desempenho
export const classifyPerformance = (percentage, idealPercentage) => {
  const difference = percentage - idealPercentage;

  if (difference >= -5) return { level: 'Adequado', color: '#27ae60', description: 'Desenvolvimento adequado para a idade' };
  if (difference >= -15) return { level: 'Atenção', color: '#f39c12', description: 'Desenvolvimento em progresso, acompanhar' };
  return { level: 'Intervenção', color: '#e74c3c', description: 'Atraso significativo, intervenção recomendada' };
};