/**
 * PAGE OBJECT DE REGISTRO DE PERSONAS
 *
 * Finalidad del archivo:
 * representar la pantalla "Administración de personas" mediante una clase.
 * Aquí se centralizan sus elementos y las acciones reutilizables del formulario.
 * Los tests pueden expresar qué comportamiento comprueban sin conocer los
 * selectores ni repetir los pasos necesarios para rellenar la interfaz.
 *
 * Responsabilidades de la clase:
 * - localizar los controles y resultados de la pantalla;
 * - abrir el portal y comprobar que terminó de cargar;
 * - completar y enviar el formulario con una `Persona`;
 * - devolver la fila asociada a un correo para que el test la valide.
 *
 * Las aserciones propias de cada escenario permanecen en los archivos `.spec.ts`.
 * Así esta clase describe cómo usar la página, mientras los tests deciden cuál
 * debe ser el resultado correcto en cada caso.
 */
import { expect, type Locator, type Page } from '@playwright/test';
import type { Persona } from '../data/personas';

export class RegistroPage {
  // Los localizadores se crean una sola vez en el constructor y se reutilizan
  // durante el test. `Locator` no guarda un elemento antiguo: Playwright vuelve
  // a resolverlo cuando se ejecuta una acción o aserción, lo que ayuda frente a
  // actualizaciones dinámicas del DOM.
  readonly heading: Locator;
  readonly fullName: Locator;
  readonly email: Locator;
  readonly role: Locator;
  readonly active: Locator;
  readonly save: Locator;
  readonly status: Locator;
  readonly search: Locator;
  readonly rows: Locator;

  // `private readonly page` guarda la pestaña concreta que Playwright ha creado
  // para el caso. Todas las acciones de este Page Object ocurren en esa pestaña.
  constructor(private readonly page: Page) {
    // Se priorizan roles y etiquetas accesibles porque reflejan cómo identifica
    // un usuario los controles y suelen ser más estables que una cadena CSS.
    // El id solo se conserva para el mensaje de estado, ya que la aplicación no
    // expone para ese elemento un nombre accesible equivalente.
    this.heading = page.getByRole('heading', { name: 'Administración de personas' });
    this.fullName = page.getByLabel('Nombre completo');
    this.email = page.getByLabel('Correo electrónico');
    this.role = page.getByLabel('Perfil');
    this.active = page.getByLabel('Usuario activo');
    this.save = page.getByRole('button', { name: 'Guardar registro' });
    this.status = page.locator('#registration-status');
    this.search = page.getByLabel('Buscar persona');
    this.rows = page.getByTestId('user-row');
  }

  /**
   * Abre la ruta raíz definida por `baseURL` en `playwright.config.ts`.
   *
   * La comprobación del encabezado funciona como condición de disponibilidad:
   * `goto` puede terminar antes de que toda la interfaz esté lista, mientras
   * `toBeVisible` reintenta automáticamente hasta que aparece el contenido útil.
   */
  async open(): Promise<void> {
    await this.page.goto('/');
    await expect(this.heading).toBeVisible();
  }

  /**
   * Completa y envía el formulario utilizando un objeto tipado `Persona`.
   *
   * El checkbox se lleva expresamente al estado solicitado. No se utiliza un
   * simple `click`, porque un clic invertiría el estado actual y podría producir
   * un resultado distinto si la interfaz cambiase su valor inicial.
   * La función termina después del clic; el test debe comprobar el mensaje y la
   * tabla para demostrar que la operación realmente produjo el resultado esperado.
   */
  async register(persona: Persona): Promise<void> {
    await this.fullName.fill(persona.name);
    await this.email.fill(persona.email);
    await this.role.selectOption({ label: persona.role });
    if (persona.active) await this.active.check();
    else await this.active.uncheck();
    await this.save.click();
  }

  /**
   * Devuelve la fila cuyo texto contiene el correo indicado.
   *
   * Se usa el correo porque actúa como dato único en esta práctica. El método no
   * realiza una aserción: devuelve un `Locator` para que cada escenario decida si
   * quiere comprobar su contenido, su visibilidad o su número de apariciones.
   */
  rowFor(email: string): Locator {
    return this.rows.filter({ hasText: email });
  }
}

