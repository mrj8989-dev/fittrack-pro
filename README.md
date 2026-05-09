# FitTrack Pro 🏋️

> Plataforma SaaS fullstack de gestión de entrenamientos personales

![Estado](https://img.shields.io/badge/estado-en%20desarrollo-yellow)
![Stack](https://img.shields.io/badge/stack-React%20%7C%20NestJS%20%7C%20PostgreSQL-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 📋 Descripción

FitTrack Pro es una plataforma SaaS que permite a entrenadores personales gestionar sus clientes, crear planes de entrenamiento personalizados y hacer seguimiento del progreso. Los clientes pueden registrar sus sesiones, ver su evolución y gestionar su suscripción.

## 🚀 Stack Tecnológico

**Frontend**
- React 19 + TypeScript
- Tailwind CSS
- React Query (TanStack)
- React Hook Form + Zod
- Recharts

**Backend**
- NestJS + TypeScript
- PostgreSQL + Prisma ORM
- JWT Authentication
- Swagger / OpenAPI

**DevOps**
- Docker + docker-compose
- GitHub Actions CI/CD
- Deploy en Railway (próximamente)

## ✅ Features implementadas

- [x] Estructura monorepo (frontend + backend)
- [x] Base de datos PostgreSQL en Docker
- [x] Esquema de datos completo (usuarios, ejercicios, planes, sesiones)
- [x] Autenticación completa: registro, login, JWT
- [x] Roles de usuario: ADMIN, TRAINER, CLIENT
- [x] Planes de suscripción: FREE, PRO, PREMIUM
- [x] Validación automática de DTOs
- [x] Documentación Swagger en `/api/docs`

## 🔜 Próximamente

- [ ] CRUD de ejercicios con filtros por músculo y equipamiento
- [ ] Gestión de planes de entrenamiento
- [ ] Dashboard con métricas y gráficas
- [ ] Historial de sesiones
- [ ] Frontend completo en React
- [ ] CI/CD con GitHub Actions
- [ ] Deploy en producción

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
- Prisma Studio: http://localhost:5555

## 📁 Estructura del proyecto

fittrack-pro/
├── frontend/          # React + TypeScript + Tailwind
├── backend/           # NestJS + Prisma + PostgreSQL
│   ├── src/
│   │   ├── auth/      # Autenticación JWT
│   │   ├── users/     # Gestión de usuarios
│   │   └── prisma/    # Servicio de base de datos
│   └── prisma/        # Schema y migraciones
├── docker-compose.yml
└── README.md

## 👨‍💻 Autor

**Jaime Herrero Hernández** — Full Stack Developer  
[LinkedIn](https://www.linkedin.com/in/jaime-herrero-hernandez) · [GitHub](https://github.com/TU_USUARIO)