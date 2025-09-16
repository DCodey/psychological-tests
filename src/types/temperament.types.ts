export interface TemperamentScores {
  E: number; // Extraversión (0-24)
  N: number; // Neuroticismo (0-24)
  L: number; // Mentira (0-7)
}

export interface TemperamentType {
  name: string;
  description: string;
  characteristics: string[];
  recommendations: string[];
}

export const TEMPERAMENT_TYPES: Record<string, TemperamentType> = {
  melancholic: {
    name: 'Melancólico',
    description: 'Persona introvertida y emocionalmente inestable',
    characteristics: [
      'Perfeccionista',
      'Sensible',
      'Analítico',
      'Pesimista',
      'Reservado',
      'Creativo'
    ],
    recommendations: [
      'Terapia cognitivo-conductual',
      'Ejercicios de relajación',
      'Establecer metas realistas',
      'Desarrollo de habilidades sociales'
    ]
  },
  choleric: {
    name: 'Colérico',
    description: 'Persona extrovertida y emocionalmente inestable',
    characteristics: [
      'Líder natural',
      'Decidido',
      'Impaciente',
      'Dominante',
      'Energético',
      'Ambicioso'
    ],
    recommendations: [
      'Técnicas de control de ira',
      'Desarrollo de la paciencia',
      'Aprender a delegar',
      'Práctica de empatía'
    ]
  },
  phlegmatic: {
    name: 'Flemático',
    description: 'Persona introvertida y emocionalmente estable',
    characteristics: [
      'Tranquilo',
      'Paciente',
      'Confiable',
      'Consistente',
      'Diplomático',
      'Buen oyente'
    ],
    recommendations: [
      'Desarrollo de la asertividad',
      'Establecer límites personales',
      'Aprender a decir que no',
      'Desarrollo de habilidades de liderazgo'
    ]
  },
  sanguine: {
    name: 'Sanguíneo',
    description: 'Persona extrovertida y emocionalmente estable',
    characteristics: [
      'Sociable',
      'Entusiasta',
      'Optimista',
      'Espontáneo',
      'Creativo',
      'Buen comunicador'
    ],
    recommendations: [
      'Desarrollo de la constancia',
      'Mejorar la organización',
      'Aprender a seguir instrucciones',
      'Desarrollo de la paciencia'
    ]
  }
};

export function determineTemperament(eScore: number, nScore: number): string {
  const mid = 12;
  
  if (eScore >= mid && nScore >= mid) return 'choleric';
  if (eScore < mid && nScore >= mid) return 'melancholic';
  if (eScore < mid && nScore < mid) return 'phlegmatic';
  return 'sanguine'; // eScore >= mid && nScore < mid
}
