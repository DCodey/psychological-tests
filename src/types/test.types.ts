export interface TestResponse {
  responses: boolean[];
  timestamp: number;
  patientName?: string;
  patientAge?: number;
}

export interface TestResult extends TestResponse {
  scores: {
    E: number;
    N: number;
    P: number;
    L: number;
  };
  interpretation: string;
}

export type TestMode = 'psychologist' | 'patient';

export interface Test {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  questions: number;
  url: string;
}
