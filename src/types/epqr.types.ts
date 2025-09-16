export interface EPQRQuestion {
  id: number;
  text: string;
  scale: 'E' | 'N' | 'P' | 'L'; // Escalas: Extraversión, Neuroticismo, Psicoticismo, Mentira
  positive: boolean; // Si la respuesta 'Sí' suma puntos
}

export interface PatientData {
  id: string;
  fullName: string;
  age: number;
  createdAt: string;
  testCompleted?: boolean;
  testStartedAt?: string;
  testCompletedAt?: string;
}

export interface EPQRResult {
  id: string;
  patientId: string;
  E: number; // Extraversión
  N: number; // Neuroticismo
  L: number; // Mentira
  date: string; // Fecha de realización del test
  testDate?: string; // Alias opcional para compatibilidad
  answers: boolean[];
  responses?: boolean[]; // Alias para answers
  patientData: Omit<PatientData, 'id'>;
  patientName?: string; // Alias para patientData.fullName
  patientAge?: number | string;  // Alias para patientData.age
  secretKey?: string;   // Clave secreta para cifrar/descifrar
  testId?: string;      // ID del test
}

export interface SharedResult {
  id: string;
  result: EPQRResult;
  createdAt: string;
}

export interface EPQRInterpretation {
  level: 'bajo' | 'medio' | 'alto';
  description: string;
}

export interface TotalScoreInterpretation {
  E: number;
  N: number;
  L: number;
}

export interface EPQRScaleInterpretation {
  E: {
    [key: string]: EPQRInterpretation;
  };
  N: {
    [key: string]: EPQRInterpretation;
  };
  L: {
    [key: string]: EPQRInterpretation;
  };
}
