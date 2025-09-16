import type { EPQRScaleInterpretation } from '../../types/epqr.types';

export const getInterpretation = (scale: keyof EPQRScaleInterpretation, score: number): string => {
  const interpretations: EPQRScaleInterpretation = {
    E: {
      bajo: {
        level: 'bajo',
        description: 'Persona reservada, introvertida, tranquila y reflexiva.'
      },
      medio: {
        level: 'medio',
        description: 'Equilibrio entre extraversión e introversión.'
      },
      alto: {
        level: 'alto',
        description: 'Persona sociable, habladora, espontánea y activa.'
      }
    },
    N: {
      bajo: {
        level: 'bajo',
        description: 'Persona estable emocionalmente, relajada y segura.'
      },
      medio: {
        level: 'medio',
        description: 'Equilibrio en la estabilidad emocional.'
      },
      alto: {
        level: 'alto',
        description: 'Persona ansiosa, preocupada y con cambios de humor frecuentes.'
      }
    },
    P: {
      bajo: {
        level: 'bajo',
        description: 'Persona empática, cooperativa y con buen autocontrol.'
      },
      medio: {
        level: 'medio',
        description: 'Equilibrio en rasgos de psicoticismo.'
      },
      alto: {
        level: 'alto',
        description: 'Persona fría, agresiva, impulsiva y con poca empatía.'
      }
    },
    L: {
      bajo: {
        level: 'bajo',
        description: 'Respuestas muy sinceras, sin intento de dar una buena imagen.'
      },
      medio: {
        level: 'medio',
        description: 'Alguna tendencia a dar respuestas socialmente deseables.'
      },
      alto: {
        level: 'alto',
        description: 'Posible intento de dar una buena imagen o falta de sinceridad.'
      }
    }
  };

  let level: 'bajo' | 'medio' | 'alto' = 'medio';
  
  if (scale === 'E' || scale === 'N') {
    if (score <= 5) level = 'bajo';
    else if (score <= 15) level = 'medio';
    else level = 'alto';
  } else if (scale === 'P') {
    if (score <= 3) level = 'bajo';
    else if (score <= 7) level = 'medio';
    else level = 'alto';
  } else if (scale === 'L') {
    if (score <= 2) level = 'bajo';
    else if (score <= 5) level = 'medio';
    else level = 'alto';
  }

  return interpretations[scale][level].description;
};
