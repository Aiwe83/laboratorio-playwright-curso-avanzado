/**
 * PRUEBA SMOKE: INICIAR Y CERRAR SESIÓN (EJERCICIO FINAL 2)
 *
 * Finalidad del archivo:
 * comprobar el ciclo completo de acceso: entrar con las credenciales ficticias,
 * pulsar "Cerrar sesión" y volver a ver el formulario de acceso.
 *
 * Por qué se vacía `storageState`:
 * el proyecto `chromium` carga la sesión guardada por `auth.setup.ts`, así que el
 * test empezaría ya autenticado. Con un estado vacío el contexto arranca anónimo
 * y el test puede iniciar sesión de verdad. Cerrar sesión aquí no afecta a otros
 * tests: cada uno recibe un contexto nuevo con su propio `localStorage`.
 */
import { expect, test } from '@playwright/test';

test.use({ storageState: { cookies: [], origins: [] } });

test('@smoke inicia y cierra sesión', async ({ page }) => {
  await page.goto('/');

  await test.step('Iniciar sesión', async () => {
    await page.getByLabel('Usuario', { exact: true }).fill('admin');
    await page.getByLabel('Contraseña', { exact: true }).fill('playwright');
    await page.getByRole('button', { name: 'Iniciar sesión', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Administración de personas', exact: true })).toBeVisible();
  });

  await test.step('Cerrar sesión y volver al acceso', async () => {
    await page.getByRole('button', { name: 'Cerrar sesión', exact: true }).click();
    // Dos comprobaciones: vuelve el formulario de acceso y desaparece la zona privada.
    await expect(page.getByRole('button', { name: 'Iniciar sesión', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Administración de personas', exact: true })).toHaveCount(0);
  });
});
