# Ejemplo avanzado del curso de Playwright

Este es el segundo laboratorio de [Introducción a la automatización de pruebas Web con Playwright](https://viewnext.udemy.com/course/introduccion-a-la-automatizacion-de-pruebas-web-playwright/). Continúa el laboratorio `laboratorio-playwright-curso-paso-a-paso` y practica los temas que faltaban para completar el recorrido: CSS y XPath, formularios, organización avanzada, sesión reutilizable, pruebas con datos, evidencias, reintentos, CDP y CI.

La aplicación es un portal ficticio que se ejecuta únicamente en tu equipo. No utiliza datos reales ni se conecta a GISS.

## Qué aprenderás

| Tema | Archivo principal |
| --- | --- |
| Selectores CSS y XPath | `tests/smoke/selectores-css-xpath.spec.ts` |
| Guardar y reutilizar una sesión | `tests/auth.setup.ts` |
| Separar datos de prueba | `data/personas.ts` |
| Crear fixtures personalizados | `fixtures/portal.fixture.ts` |
| Parametrizar escenarios | `tests/regression/registro-parametrizado.spec.ts` |
| Etiquetar smoke y regression | `package.json` y títulos de los tests |
| Organizar el informe con `test.step` | `tests/regression/*.spec.ts` |
| Adjuntar capturas al informe | `tests/regression/busqueda-evidencia.spec.ts` |
| Investigar reintentos | `playwright.retry.config.ts` |
| Conectarse a un navegador por CDP | `scripts/iniciar-cdp.mjs` y `scripts/conectar-cdp.mjs` |
| Ejecutar en GitHub Actions | `.github/workflows/playwright.yml` |
| Parametrizar y programar Jenkins | `Jenkinsfile` |
| Levantar un Jenkins local con Docker | `infra/jenkins/compose.yaml` y `infra/jenkins/Dockerfile` |

## Relación con la parte final del curso

| Contenido del curso | Dónde se practica |
| --- | --- |
| Registro, aserciones y datos dinámicos | Primer laboratorio y pasos 7–8 de este laboratorio |
| Page Objects | `pages/RegistroPage.ts` y `fixtures/portal.fixture.ts` |
| Mejorar el informe con pasos | `test.step` en los escenarios de regresión |
| Protocolo CDP | Paso 12 sobre un navegador y un portal locales |
| Jenkins parametrizado y periódico | Paso 14 y `Jenkinsfile` |
| GitHub Actions | Paso 13 y `.github/workflows/playwright.yml` |

La práctica del curso que utiliza LinkedIn mediante CDP se sustituye aquí por un portal local ficticio. Así aprendes la conexión técnica sin actuar sobre una cuenta externa ni utilizar contactos reales.

## Flujo del laboratorio

```text
Autenticarse una vez → reutilizar la sesión → registrar personas → buscar → guardar evidencias → ejecutar en CI
```

Credenciales locales:

```text
Usuario: admin
Contraseña: playwright
```

## Ruta desde la que debes ejecutar los comandos

Salvo cuando un paso indique expresamente otra cosa, abre una terminal PowerShell y sitúate en:

```powershell
Set-Location -LiteralPath 'C:\Users\PABLOFRANCODEFRANCHI\OneDrive - IBM\Escritorio\VisualStudio\VisualStudio\Testing\contexto_para_el_proyecto\curso_de_testing\laboratorios_de_testing\laboratorio-playwright-curso-avanzado'
Get-Location
```

**Esperamos ver:** la ruta termina en `laboratorio-playwright-curso-avanzado`. Mantén esta ubicación para evitar ejecutar `npm` desde otra carpeta.

## Paso 1 Entrar e instalar

1. En VS Code abre el menú **Terminal** y pulsa **Nuevo terminal**.
2. Copia estos comandos en la terminal:

```powershell
Set-Location -LiteralPath 'C:\Users\PABLOFRANCODEFRANCHI\OneDrive - IBM\Escritorio\VisualStudio\VisualStudio\Testing\contexto_para_el_proyecto\curso_de_testing\laboratorios_de_testing\laboratorio-playwright-curso-avanzado'
npm install
npx playwright install chromium
```

3. Espera a que termine cada comando antes de ejecutar el siguiente.

**Esperamos ver:** las dependencias quedan instaladas y Chromium está disponible sin mensajes de error. Solo hace falta repetir este paso si borras `node_modules`, cambias de equipo o Playwright solicita instalar el navegador de nuevo.

## Paso 2 Instalar la extensión de Playwright

1. En la barra lateral de VS Code, abre **Extensiones**.
2. Busca `Playwright Test for VS Code`.
3. Instala la extensión publicada por **Microsoft**.
4. Reinicia VS Code solo si el icono de pruebas no aparece.

Después aparecerá el icono de **Testing** (matraz) en la barra lateral. Desde ahí podrás ejecutar una prueba, depurarla y mostrar el navegador sin escribir comandos. La extensión es opcional: todos los ejercicios también se pueden hacer desde la terminal.

## Paso 3 Explorar la aplicación

1. En la terminal del laboratorio ejecuta:

```powershell
npm start
```

2. Espera el mensaje `Portal avanzado disponible en http://127.0.0.1:4188`.
3. Abre [http://127.0.0.1:4188](http://127.0.0.1:4188) en el navegador.
4. Inicia sesión con `admin` y `playwright`.
5. Registra una persona ficticia y usa el buscador para localizarla.
6. Vuelve a la terminal y pulsa `Ctrl+C` para detener el servidor.

El portal se usa solo para conocer el flujo. Las pruebas de Playwright inician el servidor por sí mismas cuando lo necesitan.

## Paso 4 Comprender la sesión reutilizable

1. Cierra el servidor manual del paso anterior si continúa abierto.
2. Ejecuta:

```powershell
npm test
```

3. En el resultado de la terminal, busca primero el proyecto `setup`. Ese proyecto inicia sesión una vez y guarda el estado en `playwright/.auth/admin.json`.
4. Las pruebas posteriores reutilizan ese estado y acceden directamente al portal autenticado.

El archivo `playwright/.auth/admin.json` está ignorado por Git porque un estado de autenticación real puede contener información sensible. No lo subas al repositorio.

**Esperamos ver:** `7 passed`. Una prueba corresponde al proyecto `setup` y las demás reutilizan la sesión guardada.

## Paso 5 Practicar CSS y XPath

1. Ejecuta las pruebas mostrando el navegador:

```powershell
npm run test:smoke -- --headed
```

2. Abre `tests/smoke/selectores-css-xpath.spec.ts`.
3. Busca y compara estos dos localizadores:

```typescript
page.locator('form#registration-form input[name="fullName"]');
page.locator('//table[@id="users-table"]//tr[td[contains(., "Ana QA")]]');
```

4. El primer localizador utiliza CSS y el segundo XPath.
5. Comprueba en el navegador que ambos encuentran el elemento previsto.

CSS y XPath son útiles para entender el DOM y mantener aplicaciones antiguas. Cuando exista una etiqueta o un rol accesible estable, prefiere `getByLabel` o `getByRole`.

## Paso 6 Ejecutar pruebas por grupos

1. Ejecuta las pruebas rápidas:

```powershell
npm run test:smoke
```

2. Después ejecuta las pruebas funcionales completas:

```powershell
npm run test:regression
```

3. Compara la cantidad de pruebas ejecutadas en cada comando.

Las etiquetas `@smoke` y `@regression` permiten elegir qué conjunto ejecutar sin mover archivos. Usa `smoke` para una comprobación rápida antes de un cambio pequeño y `regression` cuando quieras comprobar los flujos completos.

## Paso 7 Entender datos, Page Object y fixture

1. Revisa estos archivos en este orden:

1. `data/personas.ts`: contiene los datos de entrada.
2. `pages/RegistroPage.ts`: concentra elementos y acciones.
3. `fixtures/portal.fixture.ts`: entrega un `RegistroPage` ya abierto.
4. `tests/regression/registro-parametrizado.spec.ts`: genera un caso por cada persona.

2. Ejecuta el resultado mostrando el navegador:

```powershell
npm run test:regression -- --headed
```

3. Añade una tercera persona con un correo ficticio diferente a `data/personas.ts`.
4. Guarda el archivo y repite el comando.
5. Comprueba que Playwright crea un caso adicional sin tener que duplicar el código de la prueba.

En el informe, cada registro aparece dividido en **Completar y guardar el formulario** y **Comprobar el mensaje y la fila creada**. Esos bloques proceden de `test.step` y facilitan explicar dónde falla el flujo.

## Paso 8 Revisar formularios y validaciones

1. Abre `tests/regression/registro-parametrizado.spec.ts`.
2. Localiza el último caso: intenta registrar de nuevo `ana.qa@example.test`.
3. Ese caso debe comprobar el mensaje de duplicado, no crear otra fila.

4. Para recorrerlo paso a paso, ejecuta:

```powershell
npx playwright test --debug=inspector tests/regression/registro-parametrizado.spec.ts
```

## Paso 9 Consultar las evidencias

1. Ejecuta las pruebas:

```powershell
npm test
npm run test:report
```

2. Se abrirá el informe HTML de Playwright en el navegador.
3. Abre el caso `filtra resultados y adjunta evidencia`.
4. Dentro de ese caso, busca la captura `resultado-busqueda`.

La configuración también conserva:

- screenshot cuando falla una prueba;
- trace en el primer reintento;
- vídeo en el primer reintento.

## Paso 10 Analizar un reintento controlado

1. Ejecuta solo la demostración de reintento:

```powershell
npm run test:retry-demo
```

2. Observa que el primer intento falla de forma intencionada y el reintento pasa.
3. En el informe, el resultado aparece como **flaky**.

Esto permite observar el mecanismo sin introducir inestabilidad en la suite normal.

Un reintento aporta evidencia adicional, pero no corrige la causa de una prueba inestable. En un proyecto real debes investigar tiempos, datos compartidos, selectores o dependencias externas.

## Paso 11 Usar el modo interactivo

1. Ejecuta:

```powershell
npm run test:ui
```

2. En la ventana de UI Mode, elige una prueba de la lista.
3. Pulsa el botón de ejecutar y revisa la secuencia de acciones que aparece.
4. Abre las capturas o el DOM cuando necesites entender un paso.

También puedes utilizar el icono de Testing de VS Code para ejecutar o depurar desde el editor.

## Paso 12 Conectarse a Chromium mediante CDP

CDP significa **Chrome DevTools Protocol**. Permite que Playwright se conecte a un navegador Chromium que ya está abierto. En este ejercicio se utiliza un perfil temporal y el portal local.

Necesitas tres terminales de VS Code, todas situadas en la ruta del laboratorio.

### Terminal 1: iniciar el portal

```powershell
Set-Location -LiteralPath 'C:\Users\PABLOFRANCODEFRANCHI\OneDrive - IBM\Escritorio\VisualStudio\VisualStudio\Testing\contexto_para_el_proyecto\curso_de_testing\laboratorios_de_testing\laboratorio-playwright-curso-avanzado'
npm start
```

**Esperamos ver:** `Portal avanzado disponible en http://127.0.0.1:4188`. Mantén la terminal abierta.

### Terminal 2: abrir Chromium con CDP

```powershell
Set-Location -LiteralPath 'C:\Users\PABLOFRANCODEFRANCHI\OneDrive - IBM\Escritorio\VisualStudio\VisualStudio\Testing\contexto_para_el_proyecto\curso_de_testing\laboratorios_de_testing\laboratorio-playwright-curso-avanzado'
npm run cdp:browser
```

**Esperamos ver:** Chromium abre el portal y la terminal muestra `Chromium disponible mediante CDP en http://127.0.0.1:9222`. Déjala abierta.

### Terminal 3: conectarse al navegador existente

```powershell
Set-Location -LiteralPath 'C:\Users\PABLOFRANCODEFRANCHI\OneDrive - IBM\Escritorio\VisualStudio\VisualStudio\Testing\contexto_para_el_proyecto\curso_de_testing\laboratorios_de_testing\laboratorio-playwright-curso-avanzado'
npm run cdp:connect
```

**Qué debes observar:** el script utiliza la ventana que ya estaba abierta, inicia sesión y registra `Contacto CDP de prueba` con un correo ficticio único.

**Esperamos ver en la terminal 3:** `Demostración CDP completada` y el correo generado. Al terminar se cierra el Chromium de la demostración. Pulsa `Ctrl+C` en las otras terminales si continúan activas.

## Paso 13 Ejecutar en GitHub Actions

En este paso voy a subir el laboratorio a mi cuenta de GitHub para que las pruebas se ejecuten en un equipo remoto cada vez que envíe cambios. El archivo que define esa ejecución ya existe en `.github/workflows/playwright.yml`.

> **Importante:** no ejecuto este paso desde el botón **Run workflow**. El workflow actual se inicia automáticamente cuando hago un `push` o creo un *pull request*.

### 13.1 Comprobar el laboratorio antes de subirlo

1. Abro una terminal en la carpeta `laboratorio-playwright-curso-avanzado`.
2. Ejecuto:

```powershell
npm run check:ci
```

3. Espero que finalice sin errores. Si falla aquí, corrijo el error antes de subir el código a GitHub.

### 13.2 Crear un repositorio vacío en GitHub

1. Abro [mi perfil de GitHub](https://github.com/Aiwe83).
2. Pulso **Repositories** y después **New**.
3. Escribo como nombre, por ejemplo, `laboratorio-playwright-curso-avanzado`.
4. Elijo la visibilidad que corresponda a la práctica.
5. Dejo sin marcar **Add a README file**, **Add .gitignore** y **Choose a license**. El proyecto ya contiene sus propios archivos.
6. Pulso **Create repository**.
7. Copio la dirección HTTPS que muestra GitHub. Tendrá este formato:

```text
https://github.com/Aiwe83/laboratorio-playwright-curso-avanzado.git
```

### 13.3 Conectar la carpeta local y subirla

En la misma terminal, ejecuto estos comandos uno a uno. Sustituyo la URL del último comando solo si elegí otro nombre de repositorio:

```powershell
git init
git add .
git commit -m "Añade laboratorio avanzado de Playwright"
git branch -M main
git remote add origin https://github.com/Aiwe83/laboratorio-playwright-curso-avanzado.git
git push -u origin main
```

Si Git solicita iniciar sesión, completo la autorización en el navegador y vuelvo a la terminal. Si es la primera vez que uso Git en este ordenador y el comando `git commit` pide mi identidad, ejecuto una vez:

```powershell
git config --global user.name "Mi nombre"
git config --global user.email "mi-correo@ejemplo.com"
```

Después repito `git commit -m "Añade laboratorio avanzado de Playwright"` y continúo con los comandos restantes.

### 13.4 Ver la ejecución automática

1. Vuelvo al repositorio en GitHub.
2. Pulso la pestaña **Actions**.
3. Abro la ejecución llamada **Pruebas Playwright** que se creó al hacer el `git push`.
4. Espero que terminen en verde los pasos: descargar el repositorio, preparar Node.js, instalar dependencias, instalar Chromium y ejecutar la validación.

**Qué ejecuta GitHub:** `npm run check:ci`, que primero comprueba TypeScript y después ejecuta las pruebas de Playwright.

### 13.5 Descargar las evidencias

1. Dentro de la ejecución terminada, bajo hasta la sección **Artifacts**.
2. Pulso `evidencias-playwright` para descargarlo.
3. Descomprimo el archivo descargado.
4. Abro la carpeta `playwright-report` y ejecuto `index.html` para consultar el informe.

El artefacto contiene el informe de Playwright y los resultados de prueba. GitHub lo conserva durante 14 días.

### 13.6 Ejecutar de nuevo tras un cambio

Cada vez que modifique la práctica, ejecuto:

```powershell
git add .
git commit -m "Describe el cambio realizado"
git push
```

El nuevo `push` crea otra ejecución automáticamente. Así puedo comprobar en GitHub que el laboratorio sigue funcionando después de cada cambio.

## Paso 14 Ejecutar en Jenkins

El `Jenkinsfile` ejecuta las pruebas dentro de la imagen oficial de Playwright, por lo que Jenkins necesita Docker y el complemento **Docker Pipeline**. Si no tienes un Jenkins, el laboratorio incluye uno local en `infra/jenkins/` que se ejecuta con Docker Desktop.

**Cómo funciona:** Jenkins descarga el repositorio desde GitHub, no desde tu carpeta local. Por eso cada cambio debe estar subido (Paso 13) antes de lanzarlo, y los informes se quedan en Jenkins: no aparecen en tu carpeta `playwright-report`.

### 14.1 Levantar Jenkins en local

1. Abre Docker Desktop y espera a que indique que el motor está en marcha.
2. Desde la carpeta del laboratorio, ejecuta:

```powershell
docker volume create jenkins_home
docker compose -f infra/jenkins/compose.yaml up -d --build
```

3. Abre `http://127.0.0.1:8080` en el navegador.

**Qué hace:** construye una imagen de Jenkins con el cliente de Docker y los complementos `docker-workflow` y `git`. El volumen `jenkins_home` conserva usuarios, trabajos y ejecuciones aunque borres el contenedor. Jenkins solo escucha en `127.0.0.1`, así que no es accesible desde otros equipos.

Para pararlo usa `docker compose -f infra/jenkins/compose.yaml stop` y para volver a arrancarlo, `docker compose -f infra/jenkins/compose.yaml start`.

### 14.2 Desbloquear Jenkins la primera vez

1. La pantalla **Unlock Jenkins** pide una contraseña inicial. Obtenla con:

```powershell
docker exec jenkins-playwright cat /var/jenkins_home/secrets/initialAdminPassword
```

   Si usas Git Bash en lugar de PowerShell, escribe `//var/...` con doble barra: Git Bash convierte `/var` en una ruta de Windows y el comando falla con `No such file or directory`. Jenkins borra este fichero al terminar el asistente, así que solo existe la primera vez.

2. Pega la contraseña y pulsa **Continue**.
3. Elige **Install suggested plugins** y espera a que termine.
4. Crea tu usuario administrador y guarda la contraseña.
5. Deja la URL `http://127.0.0.1:8080/` y pulsa **Save and Finish** y después **Start using Jenkins**.

### 14.3 Crear el trabajo

1. Sube primero el laboratorio a GitHub siguiendo el Paso 13. El repositorio debe ser **público**; si es privado, Jenkins necesita una credencial (ver 14.6).
2. Pulsa **New Item** (en algunas versiones aparece como **New Task** o **Create a job**).
3. Escribe el nombre `laboratorio-playwright-avanzado`.
4. Elige el tipo **Pipeline** y pulsa **OK**.
5. En la sección **Pipeline**, cambia **Definition** a **Pipeline script from SCM**.
6. En **SCM** selecciona **Git** y pega la URL del repositorio.
7. En **Branch Specifier** Jenkins propone `*/master`. Cámbialo a `*/main`: es la rama de este repositorio.
8. Comprueba que **Script Path** contiene `Jenkinsfile`.
9. Pulsa **Save**.

### 14.4 Ejecutar el pipeline

1. Pulsa **Build Now** una sola vez. Esta primera ejecución lee el `Jenkinsfile` y descarga la imagen de Playwright (unos 2 GB), por lo que tarda más.
2. Recarga la página: el botón pasa a llamarse **Build with Parameters**.
3. Pulsa **Build with Parameters**.
4. Elige `completa`, `smoke` o `regression` en `SUITE` y decide si ejecutas `EJECUTAR_RETRY_DEMO`.
5. Pulsa **Build** y abre la ejecución creada en la lista **Builds**.
6. Pulsa **Pipeline Overview** para ver las etapas **Instalar** y **Validar** y **Console Output** para leer el registro completo.

El bloque `cron('H 2 * * 1-5')` programa una ejecución de lunes a viernes, en una hora nocturna distribuida por Jenkins. Si solo quieres ejecuciones manuales, elimina el bloque `triggers` antes de crear el trabajo.

**Esperamos ver:** el pipeline seleccionado termina en verde con `Finished: SUCCESS` y Jenkins archiva `playwright-report` y `test-results`.

### 14.5 Consultar los resultados

- **Sin descargar nada:** en la ejecución, pulsa **Test Result**. Jenkins lee `test-results/junit.xml` y muestra cada prueba con su estado, duración y error. Tras dos o más ejecuciones, la página del trabajo muestra la gráfica **Test Result Trend**.
- **Informe HTML completo (trazas, capturas, vídeos):** si lo abres en Jenkins con **view** se ve en negro, porque la política de seguridad de Jenkins (CSP) bloquea el JavaScript del informe. Descarga todos los artefactos en un ZIP desde `http://127.0.0.1:8080/job/laboratorio-playwright-avanzado/<número>/artifact/*zip*/archive.zip`, descomprímelo y abre `playwright-report/index.html` con doble clic.

### 14.6 Problemas frecuentes

| Mensaje en **Console Output** | Causa | Solución |
| --- | --- | --- |
| `Authentication failed` / `Password authentication is not supported` | El repositorio es privado y el trabajo no tiene credencial. | Hazlo público o crea en GitHub un *fine-grained token* con permiso **Contents: Read-only** y añádelo en **Credentials** como **Username with password** (usuario de GitHub y el token como contraseña). Nunca pegues el token en el repositorio. |
| `couldn't find remote ref refs/heads/master` o `Couldn't find any revision to build` | El **Branch Specifier** sigue en `*/master`. | En **Configure**, cámbialo a `*/main`. |
| `docker: not found` | El Jenkins usado no tiene el cliente de Docker. | Usa el de `infra/jenkins/` o instala el cliente de Docker en el agente. |
| No aparece **Build with Parameters** | Jenkins todavía no ha leído el `Jenkinsfile`. | Lanza una vez **Build Now** y recarga la página. |

## Paso 15 Validación final

1. Asegúrate de estar en la carpeta del laboratorio.
2. Ejecuta:

```powershell
npm run check
```

3. Comprueba que termina sin errores y que la terminal muestra todas las pruebas normales superadas.

El caso didáctico `@retry-demo` está excluido de esta comprobación y solo se ejecuta con su comando específico. Si la validación falla, revisa el nombre de la prueba que falló, abre el informe con `npm run test:report` y corrige la causa antes de continuar.

## Ejercicios finales

Realiza cada ejercicio en orden. Después de cada uno, ejecuta la prueba afectada y guarda el archivo antes de seguir.

1. **Nueva persona.** Abre `data/personas.ts`, añade una persona con perfil `Desarrollo` y un correo ficticio que no esté repetido. Ejecuta `npm run test:regression` y confirma que aparece un caso nuevo.
2. **Cerrar sesión.** Crea una prueba con la etiqueta `@smoke` que inicie sesión, pulse el botón de cierre de sesión y compruebe que vuelve a aparecer el formulario de acceso. Ejecuta `npm run test:smoke`.
3. **Búsqueda.** Crea una prueba que registre o utilice una persona cuyo nombre contenga `Producto`, escriba ese texto en el buscador y compruebe que la tabla muestra una sola fila.
4. **Evidencia de fallo.** Cambia temporalmente una expectativa correcta para provocar un fallo. Ejecuta la prueba, abre `npm run test:report` y localiza el *screenshot* o el *trace*. Deshaz después el cambio temporal.
5. **Integración continua.** Ejecuta el workflow en GitHub Actions siguiendo el Paso 13 o el pipeline de Jenkins siguiendo el Paso 14. Conserva el enlace de la ejecución o el artefacto descargado como evidencia.
6. **CDP.** Completa el Paso 12 y explica con tus palabras: Playwright no abre otra ventana en la tercera terminal, sino que se conecta al Chromium que ya estaba abierto en la segunda terminal mediante el puerto `9222`.

## Comandos rápidos

| Comando | Para qué sirve |
| --- | --- |
| `npm start` | Inicia el portal local. |
| `npm test` | Ejecuta toda la suite normal. |
| `npm run test:smoke` | Ejecuta los controles rápidos. |
| `npm run test:regression` | Ejecuta los escenarios funcionales. |
| `npm run test:debug` | Abre Playwright Inspector. |
| `npm run test:ui` | Abre UI Mode. |
| `npm run test:retry-demo` | Muestra un fallo seguido de un reintento correcto. |
| `npm run cdp:browser` | Abre Chromium local con CDP en el puerto 9222. |
| `npm run cdp:connect` | Se conecta al Chromium abierto y registra un contacto ficticio. |
| `npm run test:report` | Abre el informe HTML. |
| `npm run check` | Revisa TypeScript y ejecuta la suite normal. |

## Bibliografía y fuentes

- [Curso de Udemy · Introducción a la automatización de pruebas Web con Playwright](https://www.udemy.com/course/introduccion-a-la-automatizacion-de-pruebas-web-playwright/): temario de referencia para los ejercicios del laboratorio.
- [Playwright · Locators](https://playwright.dev/docs/locators): criterios para localizar elementos de forma estable.
- [Playwright · Page object models](https://playwright.dev/docs/pom): organización de localizadores y acciones reutilizables.
- [Playwright · Authentication](https://playwright.dev/docs/auth): creación y reutilización de `storageState`.
- [Playwright · `connectOverCDP`](https://playwright.dev/docs/api/class-browsertype#browser-type-connect-over-cdp): conexión a un navegador Chromium existente.
- [Playwright · Continuous Integration](https://playwright.dev/docs/ci): ejecución en GitHub Actions y otros servidores CI.

5. En el Inspector, pulsa **Resume** para avanzar por cada acción y comprueba el mensaje mostrado por el portal.
