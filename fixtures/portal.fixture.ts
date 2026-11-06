/**
 * FIXTURE DEL PORTAL
 *
 * Finalidad del archivo:
 * preparar automáticamente la pantalla de registro antes de cada prueba que
 * necesite trabajar con ella. De esta forma, los tests reciben un
 * `registroPage` listo para usar y no tienen que repetir la creación del Page
 * Object ni la navegación inicial.
 *
 * Flujo que implementa:
 * 1. Playwright crea una página nueva y aislada para el test.
 * 2. El fixture construye `RegistroPage` usando esa página.
 * 3. Abre el portal y comprueba que la pantalla esté preparada.
 * 4. Entrega el Page Object al test mediante `use`.
 * 5. Cuando termina el test, Playwright libera sus recursos automáticamente.
 */
import { test as base, expect } from '@playwright/test';
import { RegistroPage } from '../pages/RegistroPage';

// Declara qué recurso adicional recibirán los tests que importen este fixture.
// El tipo hace que TypeScript reconozca `registroPage` dentro de los argumentos
// del test y avise si se intenta utilizar un fixture que no existe.
type PortalFixtures = {
  registroPage: RegistroPage;
};

// `base.extend` crea una versión propia de `test` sin modificar Playwright.
// Cada caso sigue recibiendo una página nueva, de modo que una prueba no hereda
// el estado del navegador creado para otra.
export const test = base.extend<PortalFixtures>({
  registroPage: async ({ page }, use) => {
    const registroPage = new RegistroPage(page);

    // La preparación se realiza antes de entregar el fixture. Si `open` falla,
    // el cuerpo del test no comienza y el informe señala un error de preparación.
    await registroPage.open();

    // `use` marca el límite entre preparación y ejecución: entrega el Page
    // Object al test y mantiene vivo el fixture hasta que el caso finaliza.
    await use(registroPage);
  },
});

// Reexportar `expect` permite que los tests importen `test` y `expect` desde un
// único módulo. Así resulta menos probable mezclar por error este `test`
// personalizado con el `test` base que no contiene `registroPage`.
export { expect };

