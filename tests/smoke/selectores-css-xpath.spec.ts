/**
 * PRUEBAS SMOKE: SELECTORES Y REUTILIZACIÓN DE SESIÓN
 *
 * Finalidad del archivo:
 * realizar dos comprobaciones rápidas del portal. La primera muestra, con fines
 * didácticos, cómo localizar elementos mediante CSS y XPath. La segunda verifica
 * que el proyecto de autenticación entregó una sesión válida al proyecto Chromium.
 *
 * En el resto del laboratorio se prefieren localizadores accesibles (`getByRole`,
 * `getByLabel`) porque expresan mejor la intención y dependen menos del HTML.
 */
import { expect, test } from '@playwright/test';

test('@smoke localiza elementos con CSS y XPath', async ({ page }) => {
  await page.goto('/');

  // El selector CSS combina formulario, id, tipo de elemento y atributo name.
  // Es preciso, pero está acoplado a la estructura interna del formulario.
  const cssNameInput = page.locator('form#registration-form input[name="fullName"]');

  // XPath recorre la tabla y localiza una fila que contiene una celda con el texto.
  // Resulta útil para aprender la sintaxis, aunque suele ser más difícil de leer
  // y mantener que un localizador accesible o un `data-testid`.
  const xpathAnaRow = page.locator('//table[@id="users-table"]//tr[td[contains(., "Ana QA")]]');

  await expect(cssNameInput).toBeVisible();
  await expect(xpathAnaRow).toContainText('ana.qa@example.test');
});

test('@smoke reutiliza la sesión creada por el proyecto setup', async ({ page }) => {
  await page.goto('/');
  // Se comprueban las dos caras de la precondición: aparece una señal positiva
  // de sesión autenticada y desaparece el control propio de una sesión anónima.
  await expect(page.getByText('Sesión autenticada como admin.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Iniciar sesión' })).toHaveCount(0);
});

