# 📋 Frontend

Aplicación web construida con **Angular 21**, **NgRx** para manejo de estado, **Angular Material** para la UI y **Socket.IO** para actualizaciones en tiempo real.

---

## 🏗️ Arquitectura

El proyecto sigue una arquitectura modular con separación por funcionalidad:

```
src/app/
├── auth/                             # Módulo de autenticación
│   ├── dtos/                         # DTOs request/response
│   ├── guards/                       # authGuard, publicGuard
│   ├── interceptors/                 # AuthInterceptor (JWT)
│   ├── models/                       # User, AuthState
│   └── services/                     # AuthService
├── pages/                            # Módulo principal (lazy loaded)
│   ├── dashboard/                    # Lista de encuestas del usuario
│   ├── crear-encuesta/               # Formulario dinámico de creación
│   ├── responder-encuesta/           # Vista pública para responder
│   └── resultados/                   # Análisis y resultados en tiempo real
├── Store/                            # NgRx Store global
│   ├── auth/
│   │   ├── actions/                  # LoginActions, RegisterActions, SessionActions
│   │   ├── effects/                  # AuthEffects
│   │   ├── reducers/                 # authReducer
│   │   └── selectors/                # selectToken, selectUser, etc.
│   └── encuesta/
│       ├── actions/                  # EncuestasActions, ResultadosActions
│       ├── effects/                  # EncuestasEffects, ResultadosEffects
│       ├── reducers/                 # encuestasReducer, resultadosReducer
│       └── selectors/                # selectEncuestas, selectData, etc.
└── services/
    └── encuesta-ws.service.ts        # WebSocket service (Socket.IO)
```

---

## 🚀 Tecnologías

| Tecnología       | Versión | Uso                       |
| ---------------- | ------- | ------------------------- |
| Angular          | 21      | Framework principal       |
| NgRx             | ^18     | Manejo de estado          |
| Angular Material | ^19     | Componentes UI            |
| Socket.IO Client | ^4      | WebSockets en tiempo real |
| RxJS             | ^7      | Programación reactiva     |
| TypeScript       | ^5      | Tipado estático           |

---

## ⚙️ Instalación

### Requisitos previos

- Node.js >= 18
- npm >= 9
- Angular CLI >= 19

```bash
# 1. Instalar Angular CLI globalmente (si no lo tienes)
npm install -g @angular/cli

# 2. Clonar el repositorio
git clone <url-repositorio>
cd frontend

# 3. Instalar dependencias
npm install

# 4. Iniciar en desarrollo
ng serve

# La app estará disponible en http://localhost:4200
```

---

## 🔧 Configuración

El backend corre por defecto en `http://localhost:3000`. Si necesitas cambiarlo, actualiza las URLs en:

```typescript
// src/app/auth/services/auth.service.ts
private readonly BASE_URL = 'http://localhost:3000/api/auth';

// src/app/Store/encuesta/services/encuestas.service.ts
private readonly BASE_URL = 'http://localhost:3000/api/encuestas';

// src/app/services/encuesta-ws.service.ts
private readonly WS_URL = 'http://localhost:3000/encuestas';
```

---

## 📱 Módulos y páginas

### 🔐 Auth

| Página   | Ruta             | Descripción               |
| -------- | ---------------- | ------------------------- |
| Login    | `/auth/login`    | Inicio de sesión con JWT  |
| Registro | `/auth/register` | Registro de nuevo usuario |

### 📊 Panel (requiere autenticación)

| Página         | Ruta                       | Descripción                                  |
| -------------- | -------------------------- | -------------------------------------------- |
| Dashboard      | `/panel/dashboard`         | Lista de mis encuestas con opciones          |
| Crear encuesta | `/panel/crear`             | Formulario dinámico con preguntas y opciones |
| Resultados     | `/encuesta/:id/resultados` | Gráficas + tabla + tiempo real               |

### 🌐 Pública (sin autenticación)

| Página    | Ruta                      | Descripción                       |
| --------- | ------------------------- | --------------------------------- |
| Responder | `/encuesta/:id/responder` | Formulario público para responder |

---

## 🗃️ Estado NgRx

### Auth State

```typescript
interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
```

### Encuestas State

```typescript
interface EncuestasState {
  encuestas: EncuestaResponseDto[];
  encuestaActiva: EncuestaResponseDto | null;
  loading: boolean;
  loadingCrear: boolean;
  error: string | null;
}
```

### Resultados State

```typescript
interface ResultadosState {
  data: ResultadosData | null;
  loading: boolean;
  error: string | null;
}
```

---

## 🔌 WebSocket — Tiempo real

El servicio `EncuestaWsService` gestiona la conexión Socket.IO con el backend.

### Flujo de tiempo real en resultados

```
Admin abre /encuesta/:id/resultados
        ↓
Angular conecta WebSocket → join-encuesta { encuestaId }
        ↓
Usuario responde encuesta (ruta pública)
        ↓
Backend guarda respuesta → emite 'nueva-respuesta' a la sala
        ↓
Angular recibe evento → recarga datos automáticamente
        ↓
Banner verde + Snackbar con nombre del respondente
```

### Uso del servicio

```typescript
// Conectar y unirse a sala
this.wsService.connect();
this.wsService.joinEncuesta(encuestaId);

// Escuchar nuevas respuestas
this.wsService
  .onNuevaRespuesta()
  .pipe(takeUntil(this.destroy$))
  .subscribe((event) => {
    console.log('Nueva respuesta:', event.nombreRespondente);
  });

// Al salir del componente
this.wsService.leaveEncuesta(encuestaId);
this.wsService.disconnect();
```

---

## 🎨 Diseño

La aplicación usa un tema corporativo azul con:

- **Sidebar oscuro** (`#0D1B2A`) con navegación
- **Cards con sombra suave** para las encuestas
- **Gráficas de barras horizontales** con porcentajes para resultados
- **Tabla expandible** con detalle de respuestas por respondente
- **Banner animado** verde para notificaciones en tiempo real
- **Badge EN VIVO** con punto pulsante en la vista de resultados

---

## 🧪 Scripts disponibles

```bash
ng serve                # Desarrollo (puerto 4200)
ng build                # Build de producción
ng build --watch        # Build con watch mode
ng test                 # Tests unitarios con Karma
ng lint                 # Lint del código
```

---

## 📦 Estructura de un módulo NgRx típico

```
Store/encuesta/
├── actions/
│   └── encuestas.actions.ts     # createActionGroup con todos los eventos
├── effects/
│   └── encuestas.effects.ts     # Efectos HTTP y navegación
├── reducers/
│   └── encuestas.reducer.ts     # createFeature + createReducer
└── selectors/
    └── encuestas.selectors.ts   # Selectors derivados del feature
```

---

## 🔐 Interceptor JWT

El `AuthInterceptor` agrega automáticamente el token JWT a todas las peticiones HTTP:

```typescript
// Agrega: Authorization: Bearer <token>
// a todas las peticiones excepto las rutas públicas
```

---

## 👤 Autor

Desarrollado como parte del proyecto **Arnaldo Rafael** — plataforma de encuestas en tiempo real.
