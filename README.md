# 🚀 App Prod Tubos

<div align="center">

[![GitHub forks](https://img.shields.io/github/forks/yepemar99/app-prod-tubos?style=for-the-badge)](https://github.com/yepemar99/app-prod-tubos/network)
[![GitHub issues](https://img.shields.io/github/issues/yepemar99/app-prod-tubos?style=for-the-badge)](https://github.com/yepemar99/app-prod-tubos/issues)
[![GitHub license](https://img.shields.io/github/license/yepemar99/app-prod-tubos?style=for-the-badge)](LICENSE) **Una aplicación de escritorio multiplataforma para la gestión y visualización de datos de producción relacionados con tubos o tuberías.**

</div>

## 📖 Descripción General

"App Prod Tubos" es una aplicación de escritorio robusta diseñada para optimizar la gestión y visualización de datos en entornos de producción, enfocándose específicamente en componentes como tubos o tuberías. Desarrollada con Electron, ofrece una experiencia nativa en Windows, macOS y Linux, proporcionando una herramienta dedicada para contextos industriales y de fabricación. Esta aplicación aprovecha un stack frontend moderno con React para ofrecer una interfaz de usuario intuitiva y fluida, garantizando una interacción eficiente con los datos e información operativa clave.

## ✨ Características

-   🎯 **Compatibilidad Multiplataforma**: Disponible en Windows, macOS y Linux gracias a Electron.
-   🖥️ **Interfaz de Usuario Intuitiva**: Impulsada por React para una experiencia de escritorio dinámica y fluida.
-   ⚙️ **Configuración Personalizable**: Comportamiento de la aplicación configurable a través de `settings.json`.
-   🛠️ **Flujo de Trabajo de Desarrollo Optimizado**: Integración con Electron Forge y Webpack para un desarrollo y empaquetado eficientes.
-   💡 **Código Base Robusto**: Utiliza TypeScript para una mayor seguridad de tipos y mantenibilidad, junto con ESLint y Prettier para una calidad de código consistente.

## 🛠️ Stack Tecnológico

**Núcleo (Core):**
![Electron](https://img.shields.io/badge/Electron-2B2E3A?style=for-the-badge&logo=electron&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

**Frontend (Proceso de Renderizado):**
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

**Herramientas de Construcción (Build Tools):**
![Webpack](https://img.shields.io/badge/Webpack-8DD6F9?style=for-the-badge&logo=webpack&logoColor=black)
![Babel](https://img.shields.io/badge/Babel-FCC73F?style=for-the-badge&logo=babel&logoColor=black)
![NPM](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)

**Calidad de Código:**
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7BA3E?style=for-the-badge&logo=prettier&logoColor=white)

## 🚀 Inicio Rápido

Sigue estos pasos para configurar y poner en marcha el entorno de desarrollo.

### Prerrequisitos

-   **Node.js**: [Versión LTS](https://nodejs.org/en/download/) (por ejemplo, v18.x.x o v20.x.x)
-   **npm**: Incluido con Node.js

### Instalación

1.  **Clonar el repositorio**
    ```bash
    git clone [https://github.com/yepemar99/app-prod-tubos.git](https://github.com/yepemar99/app-prod-tubos.git)
    cd app-prod-tubos
    ```

2.  **Instalar dependencias**
    ```bash
    npm install
    ```

3.  **Configuración del entorno**
    Este proyecto utiliza `settings.json` para la configuración específica de la aplicación. No se detecta explícitamente ningún archivo `.env`.
    Revisa `settings.json` y ajústalo según sea necesario:
    ```json
    // settings.json
    {
      "appName": "App Prod Tubos",
      "version": "1.0.0",
      "defaultWindowWidth": 800,
      "defaultWindowHeight": 600
    }
    ```

4.  **Iniciar el servidor de desarrollo**
    ```bash
    npm start
    ```
    Esto lanzará la aplicación de Electron en modo de desarrollo.

## 📁 Estructura del Proyecto

```
app-prod-tubos/
├── .github/              # TODO: Potencialmente para logos/capturas de pantalla
├── .gitignore            # Especifica los archivos intencionalmente no rastreados a ignorar
├── .prettierrc           # Configuración de Prettier para el formato de código
├── package-lock.json     # Registra el árbol de dependencias exacto
├── package.json          # Metadatos del proyecto, scripts y dependencias
├── settings.json         # Configuración específica de la aplicación
├── src/                  # Código fuente principal de la aplicación
│   ├── main/             # Código fuente del proceso principal de Electron (Main Process)
│   │   └── index.ts      # Punto de entrada principal para Electron
│   ├── renderer/         # Código fuente del proceso de renderizado (Aplicación React)
│   │   ├── App.tsx       # Componente principal de React
│   │   ├── index.ts      # Punto de entrada del renderizador
│   │   └── assets/       # Activos estáticos para el renderizador (ej. imágenes)
│   └── preload.ts        # Script de precarga (preload) para IPC seguro
├── webpack.main.config.js    # Configuración de Webpack para el proceso principal de Electron
├── webpack.renderer.config.js  # Configuración de Webpack para el proceso de renderizado de Electron
└── webpack.rules.js          # Reglas compartidas de Webpack utilizadas en ambas configuraciones
```

## ⚙️ Configuración

### Ajustes de la Aplicación
El archivo `settings.json` contiene las configuraciones globales de la aplicación.

| Clave | Descripción | Por defecto |
|-----|-------------|---------|
| `appName` | Nombre visible de la aplicación. | `App Prod Tubos` |
| `version` | Cadena de texto de la versión de la aplicación. | `1.0.0` |
| `defaultWindowWidth` | Ancho inicial de la ventana principal de la aplicación. | `800` |
| `defaultWindowHeight` | Alto inicial de la ventana principal de la aplicación. | `600` |

### Configuración de Construcción (Build)
Las configuraciones de Webpack se dividen en `webpack.main.config.js` para el proceso principal de Electron y `webpack.renderer.config.js` para el proceso de renderizado (UI de React). Las reglas compartidas se definen en `webpack.rules.js`.

## 🔧 Desarrollo

### Scripts Disponibles

| Comando             | Descripción                                          |
|---------------------|------------------------------------------------------|
| `npm start`         | Inicia la aplicación en modo de desarrollo.          |
| `npm run package`   | Empaqueta la aplicación para la plataforma actual.   |
| `npm run make`      | Crea instaladores distribuibles para la plataforma actual. |
| `npm run publish`   | Publica la aplicación en un destino de despliegue configurado. |
| `npm run lint`      | Ejecuta ESLint para verificar la calidad y el estilo del código. |
| `npm run test`      | Marcador de posición (placeholder) para ejecutar pruebas. |

### Flujo de Trabajo de Desarrollo
-   Inicia la aplicación en modo de desarrollo usando `npm start`.
-   Modifica `src/main` para la lógica del proceso principal de Electron y `src/renderer` para la UI de React.
-   Webpack reconstruye y actualiza automáticamente la aplicación ante cualquier cambio en el código.
-   Asegúrate de mantener la calidad del código ejecutando `npm run lint` antes de realizar un commit.

## 🧪 Pruebas (Testing)

El archivo `package.json` incluye un script de prueba como marcador de posición.
```bash
# Actualmente, el script 'test' es un marcador de posición.
# Si se implementan pruebas (por ejemplo, con Jest o Spectron),
# las instrucciones para ejecutarlas aparecerán aquí.
npm run test
