# no_sql_AP_N3_C2

# Proyecto HTML + MongoDB

No puedes conectar un formulario web (HTML/JS) directamente a MongoDB por seguridad. Necesitas un backend (como Node.js con Express) que reciba los datos de tu formulario y los guarde en la base de datos local.

## Preparar MongoDB local

```
La instancia de MongoDB debe estar corriendo.
Por defecto, el servidor local utiliza la siguiente cadena de conexión: mongodb://localhost:27017
Se puede utilizar la herramienta oficial MongoDB Compass para revisar las bases de datos y colecciones.
```

## Crear el Backend (Node.js y Express)

1. Clonar el repositorio:
   ```
   git clone <url-repositorio>
   cd repositorio
   ```

2. Instalar dependencias necesarias:
   Descargar e instalar Node.js.
   Una vez instalado, ejecutar por terminal:
   ```
   npm init -y
   npm install express mongoose cors body-parser
   ```

   Si no permite ejecución de Scripts, ejecutar por terminal:
   ```
   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

## Uso

Una vez codificado el backend, iniciar la aplicación, ejecutando el siguiente comando:
```