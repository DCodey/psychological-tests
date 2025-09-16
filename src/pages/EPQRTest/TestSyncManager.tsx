import React, { useState, useEffect } from 'react';
import { decryptData, encryptData, generateHash } from '../../utils/crypto';

interface TestData {
  encryptedPatientData: string;
  testType: string;
  createdAt: string;
  status: string;
  completedAt?: string;
  encryptedResults?: string;
}

interface PatientTestData {
  token: string;
  responses: boolean[];
  completedAt: string;
  encryptedResults: string;
}

export class TestSyncManager {
  private static instance: TestSyncManager;
  
  static getInstance(): TestSyncManager {
    if (!TestSyncManager.instance) {
      TestSyncManager.instance = new TestSyncManager();
    }
    return TestSyncManager.instance;
  }

  /**
   * Sincroniza los tests del paciente con los del psicólogo
   */
  syncPatientTests(): void {
    try {
      // Buscar todos los tests del paciente
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('patient_test_')) {
          const token = key.replace('patient_test_', '');
          const patientTestStr = localStorage.getItem(key);
          
          if (patientTestStr) {
            try {
              const patientTest: PatientTestData = JSON.parse(patientTestStr);
              
              // Verificar si el test del psicólogo existe
              const psychologistTestStr = localStorage.getItem(`test_${token}`);
              
              if (psychologistTestStr) {
                // Actualizar el test del psicólogo con los resultados del paciente
                const psychologistTest: TestData = JSON.parse(psychologistTestStr);
                const updatedTest: TestData = {
                  ...psychologistTest,
                  status: 'completed',
                  completedAt: patientTest.completedAt,
                  encryptedResults: patientTest.encryptedResults
                };
                
                localStorage.setItem(`test_${token}`, JSON.stringify(updatedTest));
                console.log(`Test ${token} sincronizado exitosamente`);
              } else {
                // Crear un test del psicólogo basado en el test del paciente
                const newTest: TestData = {
                  encryptedPatientData: '', // No disponible
                  testType: 'EPQR',
                  createdAt: new Date().toISOString(),
                  status: 'completed',
                  completedAt: patientTest.completedAt,
                  encryptedResults: patientTest.encryptedResults
                };
                
                localStorage.setItem(`test_${token}`, JSON.stringify(newTest));
                console.log(`Test ${token} creado desde datos del paciente`);
              }
            } catch (error) {
              console.error(`Error al sincronizar test ${token}:`, error);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error en la sincronización:', error);
    }
  }

  /**
   * Obtiene todos los tests disponibles (psicólogo + paciente)
   */
  getAllTests(): Array<{token: string, data: TestData | PatientTestData, type: 'psychologist' | 'patient'}> {
    const tests: Array<{token: string, data: TestData | PatientTestData, type: 'psychologist' | 'patient'}> = [];
    
    try {
      // Buscar tests del psicólogo
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('test_')) {
          const token = key.replace('test_', '');
          const testStr = localStorage.getItem(key);
          
          if (testStr) {
            try {
              const testData: TestData = JSON.parse(testStr);
              tests.push({ token, data: testData, type: 'psychologist' });
            } catch (error) {
              console.error(`Error al parsear test ${token}:`, error);
            }
          }
        }
      }
      
      // Buscar tests del paciente que no estén en el psicólogo
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('patient_test_')) {
          const token = key.replace('patient_test_', '');
          
          // Verificar si ya existe en tests del psicólogo
          const exists = tests.some(t => t.token === token && t.type === 'psychologist');
          
          if (!exists) {
            const testStr = localStorage.getItem(key);
            if (testStr) {
              try {
                const testData: PatientTestData = JSON.parse(testStr);
                tests.push({ token, data: testData, type: 'patient' });
              } catch (error) {
                console.error(`Error al parsear test del paciente ${token}:`, error);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error al obtener tests:', error);
    }
    
    return tests;
  }

  /**
   * Limpia tests antiguos (más de 30 días)
   */
  cleanupOldTests(): void {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    try {
      // Limpiar tests del psicólogo
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('test_')) {
          const testStr = localStorage.getItem(key);
          if (testStr) {
            try {
              const testData: TestData = JSON.parse(testStr);
              const createdAt = new Date(testData.createdAt);
              
              if (createdAt < thirtyDaysAgo) {
                localStorage.removeItem(key);
                console.log(`Test ${key} eliminado por antigüedad`);
              }
            } catch (error) {
              console.error(`Error al verificar antigüedad del test ${key}:`, error);
            }
          }
        }
      }
      
      // Limpiar tests del paciente
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('patient_test_')) {
          const testStr = localStorage.getItem(key);
          if (testStr) {
            try {
              const testData: PatientTestData = JSON.parse(testStr);
              const completedAt = new Date(testData.completedAt);
              
              if (completedAt < thirtyDaysAgo) {
                localStorage.removeItem(key);
                console.log(`Test del paciente ${key} eliminado por antigüedad`);
              }
            } catch (error) {
              console.error(`Error al verificar antigüedad del test del paciente ${key}:`, error);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error en la limpieza:', error);
    }
  }
}

// Hook para usar el TestSyncManager
export function useTestSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const syncTests = async () => {
    setIsSyncing(true);
    try {
      const syncManager = TestSyncManager.getInstance();
      syncManager.syncPatientTests();
      syncManager.cleanupOldTests();
      setLastSync(new Date());
    } catch (error) {
      console.error('Error en la sincronización:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    // Sincronizar automáticamente al cargar
    syncTests();
  }, []);

  return {
    syncTests,
    isSyncing,
    lastSync
  };
}
