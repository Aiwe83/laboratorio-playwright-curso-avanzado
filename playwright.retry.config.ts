/**
 * CONFIGURACIÓN DE LA DEMOSTRACIÓN DE REINTENTOS
 *
 * Finalidad del archivo:
 * ejecutar exclusivamente el caso etiquetado `@retry-demo`, que falla una vez
 * de forma intencionada y pasa en el reintento. La separación protege la suite
 * normal, sus métricas y su informe frente a ese fallo didáctico.
 */
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  // `grep` incluye solo los títulos que contienen esta etiqueta.
  grep: /@retry-demo/,
  // La prueba comprueba que el primer intento falla y que el único reintento pasa.
  retries: 1,
  // Un único worker hace más fácil seguir en consola la secuencia intento 0 -> 1.
  workers: 1,
  // El informe usa otra carpeta para no reemplazar el informe de la suite estable.
  reporter: [['list'], ['html', { outputFolder: 'playwright-report-retry', open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:4188',
    // Conserva la traza del intento fallido, que es precisamente el objeto de la práctica.
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium-retry', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'node server.mjs',
    url: 'http://127.0.0.1:4188',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});

