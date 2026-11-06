/**
 * AUTOMATIZACIÓN DE UN CHROMIUM EXISTENTE MEDIANTE CDP
 *
 * Finalidad del archivo:
 * conectarse al navegador abierto por `iniciar-cdp.mjs`, reutilizar su contexto
 * y completar un registro de prueba. Demuestra la diferencia entre iniciar un
 * navegador nuevo y automatizar una instancia que ya está funcionando.
 *
 * Precondiciones:
 * - el portal debe responder en el puerto 4188;
 * - Chromium debe estar abierto con depuración remota en el puerto 9222.
 */
import { chromium, expect } from '@playwright/test';

const endpoint = 'http://127.0.0.1:9222';
// `connectOverCDP` automatiza el Chromium ya iniciado en lugar de crear otro.
const browser = await chromium.connectOverCDP(endpoint);
// El contexto contiene las pestañas y el estado de esa instancia persistente.
const context = browser.contexts()[0];

if (!context) {
  throw new Error('No se encontró un contexto de Chromium conectado mediante CDP.');
}

const page = context.pages()[0] ?? (await context.newPage());
await page.goto('http://127.0.0.1:4188');

// La condición hace que el script se pueda repetir: inicia sesión solamente si
// el navegador conectado muestra el formulario de acceso.
if (await page.getByRole('button', { name: 'Iniciar sesión' }).isVisible()) {
  await page.getByLabel('Usuario').fill('admin');
  await page.getByLabel('Contraseña').fill('playwright');
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();
}

await expect(page.getByRole('heading', { name: 'Administración de personas' })).toBeVisible();

// Cada ejecución necesita un correo distinto porque el portal rechaza duplicados.
// El timestamp conserva el objetivo didáctico sin depender de datos personales.
const uniqueEmail = `contacto.cdp.${Date.now()}@example.test`;
await page.getByLabel('Nombre completo').fill('Contacto CDP de prueba');
await page.getByLabel('Correo electrónico').fill(uniqueEmail);
await page.getByLabel('Perfil').selectOption({ label: 'QA' });
await page.getByLabel('Usuario activo').check();
await page.getByRole('button', { name: 'Guardar registro' }).click();

await expect(page.locator('#registration-status')).toHaveText(
  'Registro guardado: Contacto CDP de prueba.',
);
await expect(page.getByTestId('user-row').filter({ hasText: uniqueEmail })).toContainText('Activo');

// Se comprueban tanto la confirmación como la fila creada. El script no considera
// completada la demostración por el mero hecho de haber pulsado Guardar.

console.log(`Demostración CDP completada: ${uniqueEmail}`);
console.log('La automatización utilizó el navegador que ya estaba abierto en el puerto 9222.');

// Cierra la conexión realizada por este script. El ciclo completo del navegador
// persistente continúa bajo el control de `iniciar-cdp.mjs`.
await browser.close();
