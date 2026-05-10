# FitTrack Pro 🏋️

> Plataforma SaaS fullstack de gestión de entrenamientos personales

![Estado](https://img.shields.io/badge/estado-en%20desarrollo-yellow)
![Stack](https://img.shields.io/badge/stack-React%20%7C%20NestJS%20%7C%20PostgreSQL-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 📋 Descripción

FitTrack Pro es una plataforma SaaS que permite gestionar entrenamientos personales, hacer seguimiento de progreso de fuerza, registrar revisiones corporales con fotos y métricas, y visualizar la evolución a lo largo del tiempo. Diseñada para uso real — no es un proyecto de demo.

## 🚀 Stack Tecnológico

**Frontend**
- React 19 + TypeScript
- Tailwind CSS
- React Query (TanStack)
- React Hook Form + Zod
- Recharts

**Backend**
- NestJS + TypeScript
- PostgreSQL + Prisma ORM v5
- JWT Authentication + Guards
- Swagger / OpenAPI
- Multer (gestión de fotos)

**DevOps**
- Docker + docker-compose
- GitHub Actions CI/CD
- Deploy en Railway (próximamente)

## ✅ Features implementadas

- [x] Estructura monorepo (frontend + backend)
- [x] Base de datos PostgreSQL en Docker
- [x] Esquema de datos completo (usuarios, ejercicios, planes, sesiones, revisiones)
- [x] Autenticación completa: registro, login, JWT
- [x] Roles de usuario: ADMIN, TRAINER, CLIENT
- [x] Planes de suscripción: FREE, PRO, PREMIUM
- [x] Validación automática de DTOs con class-validator
- [x] Documentación Swagger en `/api/docs`
- [x] JWT Guard — rutas protegidas por token
- [x] CRUD completo de ejercicios con filtros por músculo y equipamiento
- [x] Módulo de planes de entrenamiento
- [x] Módulo de workouts con gestión de ejercicios (series, reps, descanso)
- [x] Registro de sesiones de entrenamiento
- [x] Registro de series con peso y repeticiones
- [x] Historial de sesiones ordenado por fecha
- [x] Progreso por ejercicio a lo largo del tiempo
- [x] Récords personales por ejercicio
- [x] Revisiones corporales con fotos (frontal, espalda, lateral)
- [x] Tracking de peso, medidas (pecho, cintura, brazos, piernas) y % grasa corporal
- [x] Intervalo de revisiones parametrizable (7, 14, 21 o 28 días)
- [x] Recordatorio de próxima revisión con cuenta atrás
- [x] Seeder con datos reales: 24 ejercicios con vídeos de referencia en español
- [x] Rutina Upper/Lower de hipertrofia real (4 días) para ganar masa muscular

## 🔜 Próximamente

- [ ] Plan de hipertrofia para gimnasio (cuando cambie de casa a gym)
- [ ] Frontend completo en React + TypeScript
- [ ] Dashboard con gráficas de progreso (peso, fuerza, volumen)
- [ ] Comparativa visual entre revisiones corporales
- [ ] Feedback automático basado en progreso
- [ ] CI/CD con GitHub Actions
- [ ] Deploy en producción

## 🌱 Seeder

El proyecto incluye un seeder con datos reales ejecutable en cualquier momento:

```bash
cd backend
npm run seed
```

El seeder usa `upsert` — es seguro ejecutarlo múltiples veces sin duplicar datos. Para añadir nuevos ejercicios o planes, edita `prisma/seed.ts` y vuelve a ejecutarlo.

**Datos incluidos:**
- 24 ejercicios organizados por grupo muscular con descripción técnica y vídeo de referencia
- Plan Upper/Lower de hipertrofia de 4 días optimizado para casa (barra + mancuernas)
- Usuario de prueba: `jaime@fittrack.com` / `123456`

## 🛠️ Instalación y uso local

### Requisitos
- Node.js 20+
- Docker Desktop

### Pasos

```bash
# Clonar el repositorio
git clone https://github.com/TU_USUARIO/fittrack-pro.git
cd fittrack-pro

# Levantar PostgreSQL
docker-compose up -d postgres

# Backend
cd backend
npm install
npx prisma migrate dev
npm run seed
npm run start:dev

# Frontend (nueva terminal)
cd frontend
npm install
npm run dev
```

### URLs
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Swagger: http://localhost:3000/api/docs
- Prisma Studio: `node_modules/.bin/prisma studio`

## 📁 Estructura del proyecto

fittrack-pro/
├── frontend/                # React + TypeScript + Tailwind
├── backend/                 # NestJS + Prisma + PostgreSQL
│   ├── src/
│   │   ├── auth/            # Autenticación JWT + Guards + Decoradores
│   │   ├── users/           # Gestión de usuarios
│   │   ├── exercises/       # CRUD ejercicios con filtros
│   │   ├── workout-plans/   # Planes de entrenamiento
│   │   ├── workouts/        # Workouts con ejercicios
│   │   ├── workout-sessions/# Sesiones, series, récords y progreso
│   │   ├── body-revisions/  # Revisiones corporales con fotos
│   │   └── prisma/          # Servicio de base de datos
│   ├── prisma/
│   │   ├── schema.prisma    # Esquema de base de datos
│   │   ├── seed.ts          # Seeder con datos reales
│   │   └── migrations/      # Historial de migraciones
│   └── public/uploads/      # Fotos de revisiones corporales
├── docker-compose.yml
└── README.md

## 👨‍💻 Autor

**Jaime Herrero Hernández** — Full Stack Developer  
[LinkedIn](https://www.linkedin.com/in/jaime-herrero-hernandez) · [GitHub](https://github.com/TU_USUARIO)