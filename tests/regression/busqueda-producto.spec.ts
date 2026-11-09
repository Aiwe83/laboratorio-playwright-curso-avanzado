/**
 * PRUEBA DE REGRESIÓN: BÚSQUEDA POR "Producto" (EJERCICIO FINAL 3)
 *
 * Finalidad del archivo:
 * registrar una persona cuyo nombre contiene "Producto" y comprobar que el
 * buscador deja una sola fila. Los datos iniciales del portal (Ana QA y Luis Dev)
 * no contienen ese texto, así que la única coincidencia posible es la creada aquí.
 */
import type { Persona } from '../../data/personas';
import { expect, test } from '../../fixtures/portal.fixture';

const personaProducto: Persona = {
  name: 'Paula Producto',
  email: 'paula.producto@example.test',
  role: 'Producto',
  active: true,
};

test('@regression busca una persona de Producto', async ({ registroPage }) => {
  await test.step('Registrar la persona de Producto', async () => {
    await registroPage.register(personaProducto);
    await expect(registroPage.status).toHaveText(`Registro guardado: ${personaProducto.name}.`);
  });

  await test.step('Buscar "Producto" y comprobar una sola fila', async () => {
    await registroPage.search.fill('Producto');
    await expect(registroPage.rows).toHaveCount(1);
    await expect(registroPage.rows.first()).toContainText(personaProducto.name);
  });
});
