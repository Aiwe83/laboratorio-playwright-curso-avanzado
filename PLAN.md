# Plan del segundo ejemplo de Playwright

## Objetivo

Completar mediante práctica guiada los temas avanzados que no cubría el primer laboratorio y dejar una suite reproducible tanto en local como en integración continua.

## Fases

1. **Aplicación de práctica**
   - Crear un portal local con acceso, formulario de registro, tabla y buscador.
   - Mantener datos ficticios y una interfaz accesible.

2. **Selectores y formularios**
   - Practicar CSS y XPath sobre elementos reales.
   - Validar registro correcto, campos y correo duplicado.

3. **Arquitectura de pruebas**
   - Reutilizar la autenticación mediante `storageState`.
   - Separar datos, Page Objects y fixtures.
   - Parametrizar casos con diferentes perfiles y estados.

4. **Organización y diagnóstico**
   - Separar controles `@smoke` y `@regression`.
   - Configurar informes, capturas, trazas y vídeos.
   - Incluir una demostración aislada de reintento sin afectar la suite normal.
   - Organizar el informe mediante pasos legibles con `test.step`.

5. **Conexión mediante CDP**
   - Abrir un Chromium local con un puerto de depuración controlado.
   - Conectarse al navegador existente mediante `connectOverCDP`.
   - Practicar el recorrido sobre el portal ficticio, sin cuentas ni datos externos.

6. **Integración continua**
   - Añadir un workflow de GitHub Actions.
   - Añadir un pipeline declarativo, parametrizado y programado para Jenkins.
   - Conservar informes y evidencias como artefactos.

7. **Guía y ejercicios**
   - Documentar todos los comandos paso a paso.
   - Añadir ejercicios para comprobar que se entienden los conceptos.

8. **Validación final**
   - Instalar dependencias y Chromium.
   - Ejecutar TypeScript, suite normal, grupos y demostración de reintento.
   - Revisar la aplicación en Chromium, la consola, la red y accesibilidad.

## Criterios de aceptación

- Todos los pasos del `README.md` pueden seguirse desde PowerShell.
- La suite normal termina sin fallos.
- Los grupos `smoke` y `regression` pueden ejecutarse por separado.
- La demostración de reintento termina correctamente y queda fuera de la suite normal.
- GitHub Actions y Jenkins ejecutan el mismo control utilizado en local.
- La aplicación no presenta errores de consola y alcanza una revisión satisfactoria de accesibilidad.

## Estado final

- [x] Aplicación local creada y revisada en Chromium.
- [x] Selectores CSS/XPath y validaciones de formulario implementados.
- [x] Autenticación, datos, Page Object y fixture separados.
- [x] Suites `smoke`, `regression` y reintento controlado comprobadas.
- [x] Evidencias e informe HTML configurados.
- [x] Pasos del informe y demostración local de CDP añadidos.
- [x] GitHub Actions y Jenkins preparados.
- [x] Guía paso a paso y ejercicios terminados.
- [x] TypeScript, pruebas, modo CI, consola, red y accesibilidad validados.

