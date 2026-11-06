/*
 * PIPELINE DE INTEGRACIÓN CONTINUA DEL LABORATORIO
 *
 * Finalidad del archivo:
 * instalar el proyecto en un entorno reproducible, validar tipos, ejecutar la
 * suite seleccionada y conservar los informes. También permite lanzar de forma
 * opcional la demostración de reintentos, separada de la validación normal.
 *
 * Etapas: Instalar -> Validar -> Demostración opcional -> Publicar evidencias.
 */
pipeline {
  // La imagen incluye versiones compatibles de navegadores y dependencias del
  // sistema. Fijar la etiqueta reduce diferencias entre ejecuciones del agente.
  agent {
    docker {
      image 'mcr.microsoft.com/playwright:v1.59.1-noble'
    }
  }

  parameters {
    // Limita la selección a tres suites conocidas y evita modificar el pipeline
    // cada vez que se quiere ejecutar una parte concreta de las pruebas.
    choice(
      name: 'SUITE',
      choices: ['completa', 'smoke', 'regression'],
      description: 'Conjunto de pruebas que ejecutará el pipeline'
    )
    booleanParam(
      name: 'EJECUTAR_RETRY_DEMO',
      defaultValue: false,
      description: 'Ejecuta también la demostración didáctica de reintento'
    )
  }

  triggers {
    // Ejecuta el pipeline de lunes a viernes alrededor de las 02:00. `H` asigna
    // un minuto estable pero distribuido para no saturar Jenkins a la hora exacta.
    cron('H 2 * * 1-5')
  }

  stages {
    stage('Instalar') {
      steps {
        // `npm ci` respeta exactamente package-lock.json y parte de node_modules
        // limpio, comportamiento más reproducible que `npm install` en CI.
        sh 'npm ci'
      }
    }

    stage('Validar') {
      steps {
        script {
          // El parámetro funciona como clave de un mapa cerrado: selecciona una
          // orden conocida y nunca ejecuta texto libre introducido por el usuario.
          def comandos = [
            completa: 'npm run check:ci',
            smoke: 'npm run typecheck && npm run test:smoke',
            regression: 'npm run typecheck && npm run test:regression'
          ]
          sh comandos[params.SUITE]
        }
      }
    }

    stage('Demostración de reintento') {
      when {
        // Esta etapa queda fuera por defecto porque su primer fallo es deliberado.
        expression { params.EJECUTAR_RETRY_DEMO }
      }
      steps {
        sh 'npm run test:retry-demo'
      }
    }
  }

  post {
    always {
      // `always` conserva las evidencias aunque falle una etapa. `allowEmptyArchive`
      // evita que la publicación oculte el resultado original si no hubo artefactos.
      archiveArtifacts artifacts: 'playwright-report/**/*,test-results/**/*', allowEmptyArchive: true
    }
  }
}

