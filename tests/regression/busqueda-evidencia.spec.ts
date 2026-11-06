/**
 * PRUEBA DE REGRESIÓN: BÚSQUEDA Y EVIDENCIA
 *
 * Finalidad del archivo:
 * comprobar que el buscador filtra la tabla de personas correctamente y mostrar
 * cómo adjuntar una captura al resultado de Playwright. El caso valida primero
 * el comportamiento visible y solo después genera la evidencia, evitando que
 * una captura sustituya a las aserciones automáticas.
 *
 * Precondición:
 * el fixture abre el portal con la sesión reutilizable y entrega `registroPage`.
 *
 * Resultado esperado:
 * al buscar "QA" queda una sola fila, corresponde a "Ana QA" y la captura queda
 * disponible dentro del informe del test con el nombre `resultado-busqueda`.
 */
import { expect, test } from '../../fixtures/portal.fixture';

test('@regression filtra resultados y adjunta evidencia', async ({ registroPage, page }, testInfo) => {
  await test.step('Filtrar la tabla por QA', async () => {
    // `fill` sustituye cualquier contenido previo y provoca el evento que la
    // aplicación utiliza para actualizar la tabla.
    await registroPage.search.fill('QA');

    // Estas aserciones son web-first: Playwright vuelve a consultar la interfaz
    // hasta que el filtrado termina o vence el tiempo de espera. No hace falta
    // añadir una pausa fija, que sería más lenta y menos fiable.
    await expect(registroPage.rows).toHaveCount(1);
    await expect(registroPage.rows.first()).toContainText('Ana QA');
  });

  await test.step('Adjuntar la evidencia al informe', async () => {
    // `testInfo` contiene la información y los artefactos del caso actual.
    // `attach` incorpora los bytes de la captura a ese caso concreto sin usar un
    // nombre fijo en disco que pudiera sobrescribirse en ejecuciones paralelas.
    // `fullPage` incluye toda la página, incluso la parte fuera del área visible.
    // `contentType` permite que el informe interprete y muestre el adjunto como imagen.
    await testInfo.attach('resultado-busqueda', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });
  });
});

