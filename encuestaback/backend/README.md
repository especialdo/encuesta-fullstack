# 📋 Backend

API REST construida con **NestJS**, arquitectura **hexagonal (ports & adapters)**, base de datos **PostgreSQL** con TypeORM, autenticación **JWT** y notificaciones en tiempo real con **WebSockets**.

---

## 🏗️ Arquitectura

El proyecto sigue el patrón de **arquitectura hexagonal** organizado por módulos:

```
src/
├── modules/
│   ├── auth/                         # Módulo de autenticación
│   │   ├── application/
│   │   │   ├── dtos/                 # DTOs de request/response
│   │   │   └── use-cases/            # Casos de uso (Register, SignIn)
│   │   ├── domain/
│   │   │   ├── entities/             # Entidades de dominio
│   │   │   ├── ports/
│   │   │   │   └── out/              # Puertos de salida (interfaces)
│   │   │   └── value-objects/        # Value objects
│   │   └── infrastructure/
│   │       ├── adapters/             # Adaptadores (bcrypt)
│   │       ├── api/controller/       # Controladores HTTP
│   │       ├── decorators/           # Decoradores personalizados
│   │       ├── entities/             # Entidades TypeORM
│   │       ├── guards/               # Guards JWT y roles
│   │       ├── mappers/              # Mappers dominio ↔ ORM
│   │       └── repositories/        # Implementaciones de repositorios
│   └── encuesta/                     # Módulo de encuestas
│       ├── application/
│       │   ├── assembler/            # Assemblers dominio → DTO
│       │   ├── dtos/                 # DTOs de encuesta
│       │   └── use-cases/            # Casos de uso CRUD + responder
│       ├── domain/
│       │   ├── entities/             # Encuesta, Pregunta, Opcion, RespuestaEncuesta
│       │   ├── ports/out/            # EncuestaRepositoryPort
│       │   └── value-objects/        # TipoPregunta enum
│       └── infrastructure/
│           ├── api/controller/       # EncuestaController
│           ├── entities-orm/         # Entidades TypeORM
│           ├── mappers/              # EncuestaMapper
│           └── repositories/        # EncuestaTypeOrmRepository
└── websocket/
    ├── encuesta.gateway.ts           # WebSocket Gateway (Socket.IO)
    └── encuesta-ws.module.ts         # Módulo WebSocket
```

---

## 🚀 Tecnologías

| Tecnología      | Versión | Uso                       |
| --------------- | ------- | ------------------------- |
| NestJS          | ^10     | Framework principal       |
| TypeORM         | ^0.3    | ORM para PostgreSQL       |
| PostgreSQL      | ^15     | Base de datos             |
| JWT             | —       | Autenticación             |
| Socket.IO       | ^4      | WebSockets en tiempo real |
| Bcrypt          | —       | Hash de contraseñas       |
| Swagger         | —       | Documentación API         |
| RxJS            | ^7      | Programación reactiva     |
| class-validator | —       | Validación de DTOs        |

---

## ⚙️ Instalación

### Requisitos previos

- Node.js >= 18
- PostgreSQL >= 15
- npm >= 9

### Pasos

```bash
# 1. Clonar el repositorio
git clone <url-repositorio>
cd backend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
```

### Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_password
DB_NAME=surveypro

# JWT
JWT_SECRET=tu_secret_muy_seguro
JWT_EXPIRES_IN=1d

# App
PORT=3000
```

```bash
# 4. Ejecutar migraciones (si aplica)
npm run migration:run

# 5. Iniciar en desarrollo
npm run start:dev

# 6. Iniciar en producción
npm run build
npm run start:prod
```

---

## 📡 Endpoints

La documentación completa está disponible en Swagger:

```
http://localhost:3000/api/docs
```

### Auth `v1`

| Método | Endpoint                | Descripción         | Auth |
| ------ | ----------------------- | ------------------- | ---- |
| POST   | `/api/v1/auth/register` | Registro de usuario | ❌   |
| POST   | `/api/v1/auth/login`    | Login → JWT         | ❌   |
| GET    | `/api/v1/auth/me`       | Perfil del token    | ✅   |

### Encuestas `v1`

| Método | Endpoint                           | Descripción          | Auth |
| ------ | ---------------------------------- | -------------------- | ---- |
| POST   | `/api/v1/encuestas`                | Crear encuesta       | ✅   |
| GET    | `/api/v1/encuestas/mis-encuestas`  | Listar mis encuestas | ✅   |
| DELETE | `/api/v1/encuestas/:id`            | Eliminar encuesta    | ✅   |
| GET    | `/api/v1/encuestas/:id/respuestas` | Ver respuestas       | ✅   |
| GET    | `/api/v1/encuestas/:id/publica`    | Ver encuesta pública | ❌   |
| POST   | `/api/v1/encuestas/:id/responder`  | Responder encuesta   | ❌   |

### Ejemplo request — Crear encuesta

```json
POST /api/v1/encuestas
Authorization: Bearer <token>

{
  "titulo": "Satisfacción del cliente",
  "descripcion": "Encuesta de satisfacción Q1 2026",
  "preguntas": [
    {
      "texto": "¿Cómo calificarías nuestro servicio?",
      "tipo": "cerrada",
      "opciones": [
        { "texto": "Excelente" },
        { "texto": "Bueno" },
        { "texto": "Regular" },
        { "texto": "Malo" }
      ]
    },
    {
      "texto": "¿Qué mejorarías?",
      "tipo": "abierta",
      "opciones": []
    }
  ]
}
```

### Ejemplo request — Responder encuesta

```json
POST /api/v1/encuestas/1/responder

{
  "nombreRespondente": "Juan Pérez",
  "respuestas": [
    { "preguntaId": 1, "opcionId": 2 },
    { "preguntaId": 2, "respuestaTexto": "Mejoraría los tiempos de entrega" }
  ]
}
```

---

## 🔌 WebSockets

El servidor expone un namespace WebSocket en `/encuestas` usando Socket.IO.

### Conexión

```javascript
const socket = io('http://localhost:3000/encuestas', {
  transports: ['websocket'],
});
```

### Eventos disponibles

| Evento            | Dirección          | Descripción                   |
| ----------------- | ------------------ | ----------------------------- |
| `join-encuesta`   | Cliente → Servidor | Unirse a sala de una encuesta |
| `leave-encuesta`  | Cliente → Servidor | Salir de sala                 |
| `joined`          | Servidor → Cliente | Confirmación de unión         |
| `nueva-respuesta` | Servidor → Cliente | Nueva respuesta recibida      |

### Payload `nueva-respuesta`

```json
{
  "encuestaId": 1,
  "nombreRespondente": "Juan Pérez",
  "fechaRespuesta": "2026-03-11T17:00:00.000Z",
  "totalRespuestas": 3
}
```

---

## 🔐 Tipos de pregunta

| Tipo       | Descripción                     |
| ---------- | ------------------------------- |
| `abierta`  | Respuesta de texto libre        |
| `cerrada`  | Selección de una sola opción    |
| `multiple` | Selección de múltiples opciones |

---

## 🧪 Scripts disponibles

```bash
npm run start:dev      # Desarrollo con hot reload
npm run start:debug    # Debug mode
npm run build          # Compilar a producción
npm run start:prod     # Ejecutar build de producción
npm run lint           # Lint del código
npm run test           # Ejecutar tests unitarios
npm run test:e2e       # Ejecutar tests e2e
```

---

## 👤 Autor

Desarrollado como parte del proyecto **SurveyPro** — plataforma de encuestas en tiempo real.
