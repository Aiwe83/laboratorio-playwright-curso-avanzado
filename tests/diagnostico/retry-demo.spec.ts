/**
 * DEMOSTRACIÓN CONTROLADA DE REINTENTOS
 *
 * Finalidad del archivo:
 * enseñar cómo Playwright repite un caso fallido. Este test está diseñado para
 * fallar en el intento inicial (`retry === 0`) y aprobar en el único reintento
 * (`retry === 1`). Por esa razón no forma parte de la ejecución estable y usa
 * `playwright.retry.config.ts` mediante el comando específico de demostración.
 *
 * IMPORTANTE: un reintento puede reducir fallos ocasionales, pero no corrige una
 * prueba inestable. En una suite real se debe investigar la causa del primer fallo.
 */
import { expect, test } from '@playwright/test';

test('@retry-demo demuestra un reintento controlado', async ({ page }, testInfo) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Portal avanzado de Playwright');

  // `testInfo.retry` vale 0 en la primera ejecución y 1 en el primer reintento.
  // Como la expectativa exige 1, se provoca de manera predecible la secuencia
  // fallo inicial -> reintento correcto que esta práctica quiere demostrar.
  expect(testInfo.retry, 'Este caso didáctico debe llegar al reintento 1').toBe(1);
});

