# Sistema Seguro de Tests Psicológicos

## Descripción

Este sistema implementa un flujo completamente seguro para la administración de tests psicológicos, donde:

- **El psicólogo** crea tests y genera URLs seguras sin exponer claves
- **El paciente** responde el test sin conocer la clave secreta
- **Los datos** se almacenan completamente cifrados
- **Solo el psicólogo** puede descifrar los resultados con la clave secreta

## Arquitectura de Seguridad

### Cifrado
- **Algoritmo**: AES-256-GCM
- **Derivación de clave**: PBKDF2 con 100,000 iteraciones
- **Salt aleatorio**: 256 bits por cada cifrado
- **IV aleatorio**: 128 bits por cada cifrado

### Flujo de Datos
1. **Creación del test**: Datos del paciente + clave secreta → Cifrado AES → Almacenamiento local
2. **Acceso del paciente**: Token único → Datos cifrados → Test (sin descifrar)
3. **Respuestas del paciente**: Respuestas → Cifrado con clave derivada → Almacenamiento
4. **Visualización de resultados**: Clave secreta manual → Descifrado → Visualización

## Componentes del Sistema

### 1. SecurePsychologistCreate (`/psychologist/epqr`)
- Formulario para crear tests
- Genera token único
- Cifra datos del paciente
- Genera URL segura para el paciente
- Descarga información del test

### 2. SecurePatientTest (`/test/:token`)
- Carga test por token
- Muestra preguntas del EPQR
- Cifra respuestas sin conocer la clave secreta
- Interfaz amigable para el paciente

### 3. SecureResultView (`/result/:token`)
- Solicita clave secreta al psicólogo
- Descifra datos del paciente y respuestas
- Muestra resultados completos
- Verifica integridad de los datos

### 4. PsychologistDashboard (`/psychologist`)
- Lista todos los tests creados
- Estadísticas de tests completados/pendientes
- Acciones: ver resultados, descargar backup, eliminar

## URLs del Sistema

```
/psychologist              - Dashboard del psicólogo
/psychologist/epqr         - Crear nuevo test EPQR
/test/{token}              - Test para el paciente
/result/{token}            - Ver resultados (requiere clave)
```

## Características de Seguridad

### ✅ Implementadas
- [x] Cifrado AES-256-GCM para todos los datos sensibles
- [x] URLs sin claves secretas (solo tokens únicos)
- [x] El paciente no conoce la clave secreta
- [x] Verificación de integridad de datos
- [x] Almacenamiento local cifrado
- [x] Interfaz separada para psicólogo y paciente

### 🔒 Nivel de Seguridad
- **Alto**: Los datos están cifrados con estándares industriales
- **Privacidad**: El paciente no puede acceder a sus propios datos cifrados
- **Control**: Solo el psicólogo con la clave secreta puede descifrar
- **Integridad**: Los datos incluyen hashes de verificación

## Uso del Sistema

### Para el Psicólogo

1. **Crear Test**:
   - Ir a `/psychologist/epqr`
   - Llenar datos del paciente
   - Establecer clave secreta
   - Copiar URL generada
   - Enviar URL al paciente

2. **Ver Resultados**:
   - Ir a `/psychologist` (dashboard)
   - Hacer clic en "Ver resultados"
   - Ingresar clave secreta
   - Revisar resultados descifrados

### Para el Paciente

1. **Responder Test**:
   - Acceder a la URL proporcionada
   - Responder preguntas del EPQR
   - Las respuestas se cifran automáticamente
   - Confirmar finalización

## Almacenamiento

### Estructura en localStorage
```javascript
// Test creado
test_{token}: {
  encryptedPatientData: "cifrado_aes...",
  testType: "EPQR",
  createdAt: "2024-01-01T00:00:00.000Z",
  status: "pending|completed",
  completedAt?: "2024-01-01T00:00:00.000Z",
  encryptedResults?: "cifrado_aes..."
}
```

### Datos Cifrados del Paciente
```javascript
{
  fullName: "Juan Pérez",
  age: 25,
  secretKey: "clave-secreta-123",
  testType: "EPQR",
  createdAt: "2024-01-01T00:00:00.000Z"
}
```

### Respuestas Cifradas
```javascript
{
  responses: [true, false, true, ...],
  testType: "EPQR",
  completedAt: "2024-01-01T00:00:00.000Z",
  integrityHash: "sha256_hash..."
}
```

## Consideraciones de Seguridad

### ✅ Fortalezas
- Cifrado robusto con AES-256-GCM
- Claves derivadas con PBKDF2
- Salt e IV únicos por cifrado
- Verificación de integridad
- Separación de responsabilidades

### ⚠️ Limitaciones Actuales
- Almacenamiento local (no persistente entre dispositivos)
- Sin autenticación de usuarios
- Sin backup automático en la nube
- Sin auditoría de accesos

### 🔧 Mejoras Futuras
- Integración con backend seguro
- Autenticación de psicólogos
- Backup encriptado en la nube
- Logs de auditoría
- Múltiples tipos de tests

## Instalación y Uso

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Ejecutar en desarrollo**:
   ```bash
   npm run dev
   ```

3. **Acceder al sistema**:
   - Ir a `http://localhost:5173`
   - Usar el botón "Ver Panel del Psicólogo"

## Soporte

Para problemas o preguntas sobre el sistema seguro, revisar:
- Logs de la consola del navegador
- Datos en localStorage del navegador
- Verificar que crypto-js esté instalado correctamente
