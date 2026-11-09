/**
 * DATOS DE PRUEBA PARA EL REGISTRO PARAMETRIZADO
 *
 * Finalidad del archivo:
 * separar los datos de entrada del código que ejecuta la prueba. La suite puede
 * repetir el mismo comportamiento con personas diferentes sin copiar y pegar
 * todo el test. Todos los valores son ficticios y el dominio `.test` está
 * reservado para ejemplos, por lo que no representa correos reales.
 */

// Este contrato define la forma exacta de cada conjunto de datos. La unión de
// literales en `role` limita los perfiles admitidos y permite que TypeScript
// detecte antes de ejecutar si hay un campo ausente o un perfil mal escrito.
export type Persona = {
  name: string;
  email: string;
  role: 'QA' | 'Desarrollo' | 'Producto';
  active: boolean;
};

// La prueba recorre este array y genera un caso independiente por persona.
// Añadir una entrada crea automáticamente otro caso en el informe, conservando
// el mismo flujo y las mismas comprobaciones para todos los conjuntos de datos.
export const personas: Persona[] = [
  { name: 'Marta QA', email: 'marta.qa@example.test', role: 'QA', active: true },
  { name: 'Carlos Producto', email: 'carlos.producto@example.test', role: 'Producto', active: false },
  // Ejercicio final 1: una entrada más genera automáticamente un caso nuevo.
  { name: 'Diego Desarrollo', email: 'diego.desarrollo@example.test', role: 'Desarrollo', active: true },
];

