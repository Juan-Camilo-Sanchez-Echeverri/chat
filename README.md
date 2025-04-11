# Chat Institucional MundoLearn

## Clonar el proyecto

Para clonar el proyecto y ubicarse en la carpeta del proyecto, se deben ejecutar los siguientes comandos:

```bash
git clone `URL_DEL_REPOSITORIO`
cd ml-chat
```

## Instalación de Node.js o NVM (Node Version Manager)

Si se tiene instalado [Node.js](https://nodejs.org/) o [NVM](https://github.com/nvm-sh/nvm) en el sistema, se puede saltar este paso.

Para instalar Node.js, se debe ejecutar el siguiente comando:

```bash
sudo apt-get update

sudo apt-get install nodejs

# Para verificar la versión de Node.js
node -v
```

Si se desea instalar NVM, se deben ejecutar los siguientes comandos:

```bash
# Descargar e instalar nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# Instalar la última versión de Node.js
nvm install node

# Verificar la instalación:
node -v

# Verificar la instalación de npm:
npm -v
```

## Instalar dependencias

Para instalar las dependencias, se debe ejecutar el siguiente comando:

```bash
npm install
```

## Configurar variables de entorno

Cree los archivos de entorno necesarios en la raíz del proyecto y añada las variables de entorno necesarias. Puede usar el archivo de ejemplo como referencia.

- Para entorno **local**:

  ```bash
  cp .env.example .env.local
  ```

- Para entorno de **desarrollo**:

  ```bash
  cp .env.example .env.development
  ```

- Para entorno de **producción**:

  ```bash
  cp .env.example .env
  ```

Edite los archivos `.env.local`, `.env.development` y `.env` con sus configuraciones.

## Ejecutar en local

Para iniciar el servidor en la máquina local, ejecute:

```bash
# Modo normal
npm run start

# Modo watch
npm run start:dev
```

El servidor se ejecutará en `http://localhost:<PORT>` donde `<PORT>` es el puerto configurado en el archivo `.env.local`.

## Desarrollo

Para iniciar el proyecto en un servidor de desarrollo, ejecute:

```bash
npm run start:development
```

El servidor estará disponible en `http://localhost:<PORT>`, donde `<PORT>` es el puerto configurado en el archivo `.env.development`.

## Producción con Docker

Asegúrese de tener [Docker](https://www.docker.com/) instalado. Si no, siga los siguientes pasos para instalarlo.

### Instalación de Docker

```bash
# Instalar Docker:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Añadir el repositorio a las fuentes de Apt:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
```

### Instalar los paquetes de Docker

```bash
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### Verificar que la instalación sea exitosa ejecutando la imagen hello-world:

```bash
sudo docker run hello-world
```

Si tiene problemas con la instalación, revise la siguiente [Documentación](https://docs.docker.com/engine/install/ubuntu/).

### Ejecutar la aplicación con Docker

**1. Ejecutar el contenedor usando npm:**

```bash
npm run start:docker
```

**2. Usando Docker Compose:**

```bash
docker-compose up -d
```

El servidor se ejecutará en `http://localhost:<PORT>` donde `<PORT>` es el puerto configurado en el archivo `.env`.

## Uso de PM2

PM2 es un administrador de procesos de Node.js que facilita la gestión de aplicaciones en producción y desarrollo. A continuación, se detallan los pasos para instalar y usar PM2.

### Instalación de PM2

Para instalar PM2 globalmente en el sistema, ejecute:

```bash
npm install -g pm2
```

### Uso de PM2 en Desarrollo

Para iniciar la aplicación en modo desarrollo con PM2, ejecute:

```bash
npm run pm2:start:dev
```

Para reiniciar la aplicación en modo desarrollo con PM2, ejecute:

```bash
npm run pm2:restart:dev
```

El servidor se ejecutará en `http://localhost:<PORT>` donde `<PORT>` es el puerto configurado en el archivo `.env.development`.

### Uso de PM2 en Producción

Para iniciar la aplicación en modo producción con PM2, ejecute:

```bash
npm run pm2:start:prod
```

Para reiniciar la aplicación en modo producción con PM2, ejecute:

```bash
npm run pm2:restart:prod
```

El servidor se ejecutará en `http://localhost:<PORT>` donde `<PORT>` es el puerto configurado en el archivo `.env`.
