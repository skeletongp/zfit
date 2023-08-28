# Usa una imagen base de Ubuntu
FROM ubuntu:latest

# Actualizar repositorios e instalar utilidades
RUN apt-get update && apt-get install -y curl

RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -

RUN apt-get install nodejs
# Instala dependencias globales de npm
RUN npm install -g @ionic/cli

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de tu proyecto al contenedor
COPY . .

# Instala las dependencias locales de npm
RUN npm install

# Expone el puerto en el que se ejecuta tu aplicación
EXPOSE 8100

# Comando para iniciar tu aplicación
CMD ["npm", "run", "dev"]
