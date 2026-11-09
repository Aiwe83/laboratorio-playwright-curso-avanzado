/**
 * CONFIGURACIÓN PRINCIPAL DE PLAYWRIGHT
 *
 * Finalidad del archivo:
 * definir cómo se descubre, prepara y ejecuta la suite estable del laboratorio.
 * Aquí se configuran el servidor local, la autenticación reutilizable, Chromium,
 * los reintentos de CI y los artefactos que ayudan a diagnosticar fallos.
 *
 * Flujo general:
 * 1. Playwright inicia `server.mjs` y espera que el portal responda.
 * 2. El proyecto `setup` inicia sesión y guarda el estado autenticado.
 * 3. El proyecto `chromium` reutiliza ese estado y ejecuta las pruebas.
 * 4. Se genera salida en consola, informe HTML y evidencias cuando corresponda.
 */
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Carpeta en la que Playwright busca archivos de prueba y carpeta en la que
  // guarda capturas, trazas y demás resultados de cada ejecución.
  testDir: './tests',
  outputDir: 'test-results',

  // Permite ejecutar archivos y casos en paralelo. El aislamiento de cada test
  // evita que compartan una misma página o modifiquen el estado de otro caso.
  fullyParallel: true,
  // Evita subir por accidente un test.only y ejecutar solo una parte de la suite.
  forbidOnly: true,
  // La demostración falla deliberadamente en el primer intento; se excluye de
  // la suite normal y solo se ejecuta con su configuración específica.
  grepInvert: /@retry-demo/,
  // En CI se reintenta y se usa un solo worker para obtener resultados reproducibles.
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    // `list` ofrece seguimiento inmediato en terminal; `html` conserva un
    // informe navegable y no intenta abrirlo automáticamente en CI.
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    // `junit` genera un XML estándar que Jenkins muestra en la pestaña
    // «Test Result» sin descargar nada (el informe HTML lo bloquea su CSP).
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],
  use: {
    // Las rutas relativas como `page.goto('/')` se resuelven contra esta URL.
    baseURL: 'http://127.0.0.1:4188',
    // Se recogen artefactos de diagnóstico solo cuando aportan valor, evitando
    // ocupar espacio con vídeo y capturas de todas las ejecuciones correctas.
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },
  projects: [
    {
      // Proyecto preparatorio: solo encuentra archivos terminados en `.setup.ts`.
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      // Impide ejecutar auth.setup.ts de nuevo como si fuera una prueba normal.
      testIgnore: /.*\.setup\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        // Reutiliza la sesión creada por el proyecto setup y evita iniciar sesión en cada test.
        storageState: 'playwright/.auth/admin.json',
      },
      // Playwright no inicia este proyecto hasta que auth.setup.ts termina correctamente.
      dependencies: ['setup'],
    },
  ],
  webServer: {
    // Playwright controla el ciclo del servidor y espera la URL antes de iniciar
    // los tests, eliminando la necesidad de arrancarlo manualmente.
    command: 'node server.mjs',
    url: 'http://127.0.0.1:4188',
    // En local permite conservar el servidor abierto; CI siempre parte de un entorno limpio.
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});

