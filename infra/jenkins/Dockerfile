# Jenkins local para ejecutar el Jenkinsfile del laboratorio.
# Se fija la versión para que la configuración sea repetible.
FROM jenkins/jenkins:2.580.2-lts-jdk21

USER root

# Solo se instala el cliente: el motor Docker sigue siendo el de Docker Desktop.
# En Debian 13 el binario `docker` está en `docker-cli` (`docker.io` es el motor).
RUN apt-get update \
    && apt-get install --yes --no-install-recommends docker-cli \
    && rm -rf /var/lib/apt/lists/*

USER jenkins

# docker-workflow: permite al Jenkinsfile usar "agent { docker { ... } }".
# git: permite "Pipeline script from SCM" con el repositorio de GitHub.
RUN jenkins-plugin-cli --plugins docker-workflow git
