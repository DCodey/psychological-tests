interface Test {
  id: string;
  testName: string;
  patientName: string;
  date: string;
  securityKey?: string;
  results?: any;
}

const STORAGE_KEY = 'psicotest_tests';

export const testStorage = {
  // Obtener todas las pruebas
  getAllTests: (): Test[] => {
    if (typeof window === 'undefined') return [];
    const tests = localStorage.getItem(STORAGE_KEY);
    return tests ? JSON.parse(tests) : [];
  },

  // Guardar una nueva prueba
  saveTest: (test: Omit<Test, 'id'>): Test => {
    const tests = testStorage.getAllTests();
    const newTest = {
      ...test,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    
    const updatedTests = [...tests, newTest];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTests));
    return newTest;
  },

  // Obtener una prueba por ID
  getTestById: (id: string): Test | undefined => {
    const tests = testStorage.getAllTests();
    return tests.find(test => test.id === id);
  },

  // Actualizar una prueba existente (por ejemplo, para agregar resultados)
  updateTest: (id: string, updates: Partial<Test>): Test | null => {
    const tests = testStorage.getAllTests();
    const index = tests.findIndex(test => test.id === id);
    
    if (index === -1) return null;
    
    const updatedTest = { ...tests[index], ...updates };
    const updatedTests = [...tests];
    updatedTests[index] = updatedTest;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTests));
    return updatedTest;
  },

  // Eliminar una prueba
  deleteTest: (id: string): boolean => {
    const tests = testStorage.getAllTests();
    const updatedTests = tests.filter(test => test.id !== id);
    
    if (tests.length === updatedTests.length) return false;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTests));
    return true;
  },

  // Limpiar todas las pruebas (útil para desarrollo)
  clearAllTests: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  }
};

export type { Test };
