/**
 * SERVIDOR WEB LOCAL DEL LABORATORIO
 *
 * Finalidad del archivo:
 * publicar la aplicación estática contenida en `app/` para que Playwright pueda
 * probarla en `http://127.0.0.1:4188`. Es un servidor mínimo y autocontenido para
 * formación; no pretende sustituir un servidor preparado para producción.
 *
 * Playwright lo inicia automáticamente mediante la sección `webServer` de sus
 * configuraciones y espera a que la URL responda antes de lanzar las pruebas.
 */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// En módulos ES no existe `__dirname`; la URL del módulo se convierte en una
// ruta del sistema para localizar `app/` independientemente de la terminal usada.
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const appDirectory = path.join(currentDirectory, 'app');
// La variable PORT permite cambiar el puerto desde el entorno. Si no se define,
// se usa el mismo 4188 indicado como `baseURL` en la configuración de Playwright.
const port = Number(process.env.PORT ?? 4188);

const server = createServer(async (request, response) => {
  // URL extrae únicamente el pathname y evita tratar parámetros de consulta
  // como parte del nombre físico del archivo solicitado.
  const pathname = new URL(request.url ?? '/', `http://${request.headers.host}`).pathname;

  // La práctica no necesita icono. Responder 204 evita un error 404 innecesario
  // cuando el navegador solicita `/favicon.ico` automáticamente.
  if (pathname === '/favicon.ico') {
    response.writeHead(204);
    response.end();
    return;
  }

  // La raíz sirve index.html; cualquier otra ruta se interpreta respecto de app/.
  const requestedFile = pathname === '/' ? 'index.html' : pathname.slice(1);
  const filePath = path.resolve(appDirectory, requestedFile);

  // `path.resolve` normaliza segmentos como `../`. La comprobación posterior
  // impide que una petición construida manualmente lea archivos fuera de `app/`.
  if (!filePath.startsWith(`${appDirectory}${path.sep}`) && filePath !== path.join(appDirectory, 'index.html')) {
    response.writeHead(403);
    response.end('Acceso denegado');
    return;
  }

  try {
    const content = await readFile(filePath);
    // La aplicación de la práctica solo publica HTML. Si se incorporasen CSS,
    // JavaScript o imágenes separados, habría que asignar su MIME correspondiente.
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(content);
  } catch {
    response.writeHead(404);
    response.end('Recurso no encontrado');
  }
});

server.listen(port, '127.0.0.1', () => {
  // Escuchar solo en loopback mantiene el servidor accesible desde este equipo,
  // sin exponerlo como servicio a otros dispositivos de la red.
  console.log(`Portal avanzado disponible en http://127.0.0.1:${port}`);
});

