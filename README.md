# Image Processor Landing Page

Este proyecto es una aplicación web simple que permite a los usuarios subir imágenes y procesarlas mediante varios scripts de Node.js. La aplicación está diseñada para ser fácil de usar y proporciona una interfaz amigable.

## Estructura del Proyecto

El proyecto tiene la siguiente estructura de archivos:

```
image-processor-landing
├── public
│   ├── css
│   │   └── styles.css        # Estilos CSS para la página de aterrizaje
│   ├── js
│   │   └── scripts.js        # Código JavaScript para la interacción del usuario
│   └── index.html            # Página de aterrizaje con el formulario de subida
├── src
│   ├── scripts
│   │   ├── processImage1.js  # Script para procesar imágenes de una manera específica
│   │   ├── processImage2.js  # Script para procesar imágenes de otra manera
│   │   └── processImage3.js  # Tercer script para el procesamiento de imágenes
│   └── server.js             # Punto de entrada del servidor Node.js
├── uploads                    # Directorio para almacenar imágenes subidas
├── package.json               # Configuración del proyecto para npm
├── .gitignore                 # Archivos y directorios a ignorar por Git
└── README.md                  # Documentación del proyecto
```

## Instalación

1. Clona el repositorio en tu máquina local:
   ```
   git clone <URL_DEL_REPOSITORIO>
   ```

2. Navega al directorio del proyecto:
   ```
   cd image-processor-landing
   ```

3. Instala las dependencias necesarias:
   ```
   npm install
   ```

## Uso

1. Inicia el servidor:
   ```
   node src/server.js
   ```

2. Abre tu navegador y ve a `http://localhost:3000` para acceder a la página de aterrizaje.

3. Usa el formulario para subir una imagen y selecciona el procesamiento que deseas aplicar.

## Contribuciones

Las contribuciones son bienvenidas. Si deseas mejorar el proyecto, por favor abre un issue o envía un pull request.

## Licencia

Este proyecto está bajo la Licencia MIT.