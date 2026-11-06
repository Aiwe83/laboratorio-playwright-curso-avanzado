/**
 * PRUEBAS DE REGRESIÓN: REGISTRO PARAMETRIZADO Y CORREO DUPLICADO
 *
 * Finalidad del archivo:
 * verificar que el portal registra correctamente varios perfiles y rechaza un
 * correo ya existente. Los datos válidos proceden de `data/personas.ts`; el
 * fixture proporciona una pantalla abierta mediante `RegistroPage`.
 *
 * Cobertura:
 * - mensaje de confirmación después de guardar;
 * - aparición del perfil y estado correctos en la tabla;
 * - regla de unicidad del correo;
 * - ausencia de una segunda fila cuando el correo está repetido.
 */
import { personas } from '../../data/personas';
import { expect, test } from '../../fixtures/portal.fixture';

test.describe('@regression registro parametrizado', () => {
  // Cada elemento genera un test independiente: si uno falla, el informe identifica
  // exactamente qué conjunto de datos produjo el problema.
  for (const persona of personas) {
    test(`registra a ${persona.name}`, async ({ registroPage }) => {
      // `test.step` agrupa las acciones con nombres funcionales en el informe y
      // permite identificar si falló la operación o la comprobación posterior.
      await test.step('Completar y guardar el formulario', async () => {
        await registroPage.register(persona);
      });

      await test.step('Comprobar el mensaje y la fila creada', async () => {
        // El mensaje confirma la respuesta inmediata del formulario.
        await expect(registroPage.status).toHaveText(`Registro guardado: ${persona.name}.`);
        // La tabla confirma el efecto persistente visible. Ambas comprobaciones
        // evitan un falso positivo en el que aparezca un mensaje pero no se cree la fila.
        await expect(registroPage.rowFor(persona.email)).toContainText(persona.role);
        await expect(registroPage.rowFor(persona.email)).toContainText(persona.active ? 'Activo' : 'Inactivo');
      });
    });
  }

  test('rechaza un correo duplicado', async ({ registroPage }) => {
    await test.step('Enviar un correo que ya existe', async () => {
      await registroPage.register({
        name: 'Otra Ana',
        email: 'ana.qa@example.test',
        role: 'QA',
        active: true,
      });
    });

    await test.step('Comprobar que no se duplica la persona', async () => {
      await expect(registroPage.status).toHaveText('Ya existe una persona con ese correo.');
      // El mensaje por sí solo no garantiza que la aplicación haya respetado la
      // regla. El recuento protege frente a una inserción duplicada silenciosa.
      await expect(registroPage.rows.filter({ hasText: 'ana.qa@example.test' })).toHaveCount(1);
    });
  });
});

