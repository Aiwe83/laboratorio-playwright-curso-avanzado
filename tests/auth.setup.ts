/**
 * PREPARACIÓN DE LA SESIÓN AUTENTICADA
 *
 * Finalidad del archivo:
 * iniciar sesión una sola vez y guardar cookies y almacenamiento del navegador
 * en `playwright/.auth/admin.json`. Las demás pruebas cargan ese estado y pueden
 * comenzar directamente en la zona privada, reduciendo repetición y tiempo.
 *
 * Este archivo se ejecuta antes del proyecto Chromium porque la dependencia está
 * declarada en `playwright.config.ts`.
 */
import { expect, test as setup } from '@playwright/test';

// Mantener la ruta en una constante evita que el setup y su escritura apunten a
// destinos distintos. El archivo contiene estado de sesión y no datos de prueba.
const authFile = 'playwright/.auth/admin.json';

setup('crear sesión autenticada reutilizable', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Usuario').fill('admin');
  await page.getByLabel('Contraseña').fill('playwright');
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  // No basta con hacer clic: esta aserción confirma que la aplicación terminó
  // la autenticación antes de serializar la sesión. Guardarla antes podría crear
  // un estado incompleto que haría fallar todas las pruebas dependientes.
  await expect(page.getByRole('heading', { name: 'Administración de personas' })).toBeVisible();

  // `storageState` serializa cookies y localStorage del contexto actual. En los
  // tests posteriores Playwright crea contextos nuevos, pero precargados con
  // este estado; no se comparte una pestaña viva entre casos.
  await page.context().storageState({ path: authFile });
});

