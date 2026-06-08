# 🚀 App Prod Tubos

<div align="center">

[![GitHub forks](https://img.shields.io/github/forks/yepemar99/app-prod-tubos?style=for-the-badge)](https://github.com/yepemar99/app-prod-tubos/network)
[![GitHub issues](https://img.shields.io/github/issues/yepemar99/app-prod-tubos?style=for-the-badge)](https://github.com/yepemar99/app-prod-tubos/issues)
[![GitHub license](https://img.shields.io/github/license/yepemar99/app-prod-tubos?style=for-the-badge)](LICENSE) **Una aplicación de escritorio multiplataforma para la gestión y visualización de datos de producción relacionados con tubos o tuberías.**

</div>

## 📖 Descripción General

"App Prod Tubos" es una aplicación de escritorio robusta diseñada para optimizar la gestión y visualización de datos en entornos de producción, enfocándose específicamente en componentes como tubos o tuberías. Desarrollada con Electron, ofrece una experiencia nativa en Windows, macOS y Linux, proporcionando una herramienta dedicada para contextos industriales y de fabricación. Esta aplicación aprovecha un stack frontend moderno con React para ofrecer una interfaz de usuario intuitiva y fluida, garantizando una interacción eficiente con los datos e información operativa clave.

## ✨ Características

- 🎯 **Compatibilidad Multiplataforma**: Disponible en Windows, macOS y Linux gracias a Electron.
- 🖥️ **Interfaz de Usuario Intuitiva**: Impulsada por React para una experiencia de escritorio dinámica y fluida.
- ⚙️ **Configuración Personalizable**: Comportamiento de la aplicación configurable a través de `settings.json`.
- 🛠️ **Flujo de Trabajo de Desarrollo Optimizado**: Integración con Electron Forge y Webpack para un desarrollo y empaquetado eficientes.
- 💡 **Código Base Robusto**: Utiliza TypeScript para una mayor seguridad de tipos y mantenibilidad, junto con ESLint y Prettier para una calidad de código consistente.

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

- **Node.js**: [Versión LTS](https://nodejs.org/en/download/) (por ejemplo, v18.x.x o v20.x.x)
- **npm**: Incluido con Node.js

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

| Clave                 | Descripción                                             | Por defecto      |
| --------------------- | ------------------------------------------------------- | ---------------- |
| `appName`             | Nombre visible de la aplicación.                        | `App Prod Tubos` |
| `version`             | Cadena de texto de la versión de la aplicación.         | `1.0.0`          |
| `defaultWindowWidth`  | Ancho inicial de la ventana principal de la aplicación. | `800`            |
| `defaultWindowHeight` | Alto inicial de la ventana principal de la aplicación.  | `600`            |

### Configuración de Construcción (Build)

Las configuraciones de Webpack se dividen en `webpack.main.config.js` para el proceso principal de Electron y `webpack.renderer.config.js` para el proceso de renderizado (UI de React). Las reglas compartidas se definen en `webpack.rules.js`.

## 🔧 Desarrollo

### Scripts Disponibles

| Comando           | Descripción                                                      |
| ----------------- | ---------------------------------------------------------------- |
| `npm start`       | Inicia la aplicación en modo de desarrollo.                      |
| `npm run package` | Empaqueta la aplicación para la plataforma actual.               |
| `npm run make`    | Crea instaladores distribuibles para la plataforma actual.       |
| `npm run publish` | Publica la aplicación en un destino de despliegue configurado.   |
| `npm run lint`    | Ejecuta ESLint para verificar la calidad y el estilo del código. |
| `npm run test`    | Marcador de posición (placeholder) para ejecutar pruebas.        |

### Flujo de Trabajo de Desarrollo

- Inicia la aplicación en modo de desarrollo usando `npm start`.
- Modifica `src/main` para la lógica del proceso principal de Electron y `src/renderer` para la UI de React.
- Webpack reconstruye y actualiza automáticamente la aplicación ante cualquier cambio en el código.
- Asegúrate de mantener la calidad del código ejecutando `npm run lint` antes de realizar un commit.

## Database Local

```
USE [prod_local_tubos];
GO

CREATE TABLE dbo.Operarios (
    id INT IDENTITY(1,1) NOT NULL,
    nombre NVARCHAR(100) NULL,
    creado DATE NULL CONSTRAINT DF_Operarios_creado DEFAULT CAST(SYSDATETIME() AS DATE),
    apellido1 NVARCHAR(100) NULL,
    apellido2 NVARCHAR(100) NULL,

    -- Definición de la Llave Primaria (Primary Key)
    CONSTRAINT PK_Operarios PRIMARY KEY CLUSTERED (id)
);
GO

CREATE TABLE dbo.Turnos (
    id INT IDENTITY(1,1) NOT NULL,
    entrada VARCHAR(50) NOT NULL,
    salida VARCHAR(50) NOT NULL,
    creado DATETIME2(7) NULL CONSTRAINT DF_Turnos_creado DEFAULT SYSDATETIME(),
    prefijo VARCHAR(10) NULL,

    -- Definición de la Llave Primaria (Primary Key)
    CONSTRAINT PK_Turnos PRIMARY KEY CLUSTERED (id)
);
GO

CREATE TABLE dbo.Lotes_Tubos (
    id BIGINT IDENTITY(1,1) NOT NULL,
    maquina_id BIGINT NULL,
    lote_fleje_id BIGINT NULL,
    turno_id BIGINT NULL,
    operario_id BIGINT NULL,
    num_paq_inicial INT NULL,
    num_paq_final INT NULL,
    creado DATETIME2(7) NOT NULL CONSTRAINT DF_Lotes_Tubos_creado DEFAULT SYSDATETIME(),
    lote VARCHAR(255) NULL,
    num_paq INT NULL,
    tubo_id BIGINT NULL,

    -- Definición de la Llave Primaria (Primary Key)
    CONSTRAINT PK_Lotes_Tubos PRIMARY KEY CLUSTERED (id)
);
GO

CREATE TABLE dbo.Prod_Tubos (
    id BIGINT IDENTITY(1,1) NOT NULL,
    operario_id BIGINT NOT NULL,
    turno_id BIGINT NOT NULL,
    maquina_id BIGINT NOT NULL,
    tubo_id BIGINT NOT NULL,
    cant_tubos_buenos INT NOT NULL,
    cant_tubos_malos INT NOT NULL,
    concentracion_taladrina FLOAT NOT NULL,
    observacion TEXT NOT NULL,
    creado DATETIME2(7) NULL CONSTRAINT DF_Prod_Tubos_creado DEFAULT SYSDATETIME(),
    control_dimensional_id BIGINT NOT NULL,
    lote_tubo_id BIGINT NULL,
    paquetes DECIMAL(10,2) NULL,

    -- Definición de la Llave Primaria (Primary Key)
    CONSTRAINT PK_Prod_Tubos PRIMARY KEY CLUSTERED (id)
);
GO

CREATE TABLE dbo.Tubos (
    id BIGINT IDENTITY(1,1) NOT NULL,
    calidad_id BIGINT NOT NULL,
    tipo_id BIGINT NOT NULL,
    art_concepto VARCHAR(50) NOT NULL,
    activo BIT NOT NULL,
    ancho DECIMAL(10,3) NOT NULL,
    alto DECIMAL(10,3) NOT NULL,
    longitud DECIMAL(10,3) NOT NULL,
    diametro DECIMAL(10,3) NOT NULL,
    espesor DECIMAL(10,3) NOT NULL,
    peso_unitario DECIMAL(10,3) NOT NULL,
    peso_total DECIMAL(10,3) NOT NULL,
    creado DATETIME2(2) NOT NULL CONSTRAINT DF_Tubos_creado DEFAULT SYSDATETIME(),
    medida VARCHAR(50) NULL,
    fleje_id BIGINT NULL,
    num_por_paq INT NOT NULL,
    unidades DECIMAL(10,3) NULL,
    alto_paq DECIMAL(10,3) NOT NULL,
    ancho_paq DECIMAL(10,3) NOT NULL,
    num_paquetes DECIMAL(10,2) NOT NULL,

    -- Definición de la Llave Primaria (Primary Key)
    CONSTRAINT PK_Tubos PRIMARY KEY CLUSTERED (id)
);
GO

CREATE TABLE dbo.Flejes (
    id BIGINT IDENTITY(1,1) NOT NULL,
    ancho DECIMAL(10,2) NOT NULL,
    espesor DECIMAL(10,3) NOT NULL,
    peso_total DECIMAL(18,2) NOT NULL,
    concepto VARCHAR(255) NOT NULL,
    unidades INT NOT NULL,
    peso_medio DECIMAL(18,4) NOT NULL,
    activo BIT NOT NULL,
    art_concepto VARCHAR(255) NOT NULL,
    creado DATETIME2(7) NOT NULL CONSTRAINT DF_Flejes_creado DEFAULT SYSDATETIME(),
    calidad_id INT NULL,

    -- Definición de la Llave Primaria (Primary Key)
    CONSTRAINT PK_Flejes PRIMARY KEY CLUSTERED (id)
);
GO

CREATE TABLE dbo.Maquinas (
    id BIGINT IDENTITY(1,1) NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    creado DATETIME2(2) NOT NULL CONSTRAINT DF_Maquinas_creado DEFAULT SYSDATETIME(),
    maquina NVARCHAR(100) NULL,

    -- Definición de la Llave Primaria (Primary Key)
    CONSTRAINT PK_Maquinas PRIMARY KEY CLUSTERED (id)
);
GO

Aquí tienes el código para crear la tabla dbo.Control_Dimensional basándonos exactamente en la estructura de tu última imagen.

Para esta tabla, regresamos al uso de identificadores tipo INT estándar. Prácticamente todas las columnas permiten valores nulos (NULL), a excepción de la llave primaria. Manteniendo las condiciones (id autoincremental y creado con la fecha y hora por defecto), el script queda así:

SQL
USE [prod_tubos];
GO

CREATE TABLE dbo.Control_Dimensional (
    id INT IDENTITY(1,1) NOT NULL,
    creado DATETIME2(7) NULL CONSTRAINT DF_Control_Dimensional_creado DEFAULT SYSDATETIME(),
    maquina_id INT NULL,
    medida_de DECIMAL(10,2) NULL,
    medida_hb DECIMAL(10,2) NULL,
    medida_espesor DECIMAL(10,2) NULL,
    medida_conv DECIMAL(10,2) NULL,
    medida_rectang DECIMAL(10,2) NULL,
    medida_redondeo DECIMAL(10,2) NULL,
    medida_revirado_alt DECIMAL(10,2) NULL,
    medida_rectitud DECIMAL(10,2) NULL,
    medida_long DECIMAL(10,2) NULL,
    medida_revirado_base DECIMAL(10,2) NULL,
    tubo_id INT NULL,
    medida_va DECIMAL(10,2) NULL,

    -- Definición de la Llave Primaria (Primary Key)
    CONSTRAINT PK_Control_Dimensional PRIMARY KEY CLUSTERED (id)
);
GO

CREATE TABLE dbo.Tipos_Calidad (
    id BIGINT IDENTITY(1,1) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    creado DATETIME2(7) NOT NULL CONSTRAINT DF_Tipos_Calidad_creado DEFAULT SYSDATETIME(),
    label_bobina NVARCHAR(255) NULL,
    label_fleje VARCHAR(100) NULL,
    label_tubo NVARCHAR(255) NULL,
    mostrar_tubos BIT NULL,

    -- Definición de la Llave Primaria (Primary Key)
    CONSTRAINT PK_Tipos_Calidad PRIMARY KEY CLUSTERED (id)
);
GO
```
