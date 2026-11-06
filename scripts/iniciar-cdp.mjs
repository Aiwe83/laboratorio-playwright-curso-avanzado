/**
 * INICIO DE CHROMIUM PARA LA DEMOSTRACIÓN CDP
 *
 * Finalidad del archivo:
 * abrir un Chromium persistente con depuración remota en el puerto 9222. El
 * navegador permanece vivo para que `conectar-cdp.mjs`, ejecutado desde otra
 * terminal, se conecte y automatice esa misma instancia mediante CDP.
 *
 * Uso esperado:
 * 1. Mantener el portal local en ejecución.
 * 2. Ejecutar el comando que inicia este script.
 * 3. Sin cerrar esa terminal, ejecutar el comando de conexión en otra.
 */
import { rm } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from '@playwright/test';

const port = 9222;
// El argumento opcional permite hacer la demostración sin ventana gráfica.
const headless = process.argv.includes('--headless');
const profileDirectory = path.resolve('.cdp-profile');

// Se usa un perfil exclusivo y temporal. Así la práctica no lee ni modifica el
// historial, cookies o extensiones del perfil personal del navegador.
await rm(profileDirectory, { recursive: true, force: true });

// Un contexto persistente está asociado al directorio de perfil y mantiene la
// instancia abierta mientras el segundo script se conecta desde otra terminal.
const context = await chromium.launchPersistentContext(profileDirectory, {
  headless,
  args: [
    `--remote-debugging-port=${port}`,
    '--remote-debugging-address=127.0.0.1',
  ],
});

const page = context.pages()[0] ?? (await context.newPage());
// Se reutiliza la pestaña inicial si Chromium ya la creó; en caso contrario se
// abre una. Esto evita generar pestañas vacías innecesarias.
await page.goto('http://127.0.0.1:4188');

console.log(`Chromium disponible mediante CDP en http://127.0.0.1:${port}`);
console.log('Mantén esta terminal abierta y ejecuta npm run cdp:connect desde otra terminal.');

let closing = false;
const close = async () => {
  // Ctrl+C genera SIGINT y algunos cierres del proceso generan SIGTERM. Las dos
  // señales pueden llegar casi juntas; la bandera evita cerrar dos veces.
  if (closing) return;
  closing = true;
  await context.close();
};

process.once('SIGINT', close);
process.once('SIGTERM', close);

// La promesa mantiene el script activo hasta que se cierra realmente Chromium.
await new Promise((resolve) => context.once('close', resolve));
// Después del cierre se elimina el perfil temporal y no quedan sesiones locales.
await rm(profileDirectory, { recursive: true, force: true });
