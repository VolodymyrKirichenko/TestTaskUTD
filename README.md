# TestTaskUTD — Event Management Platform

Fullstack-застосунок для управління подіями (івентами): перегляд, підписка та відписка. Серверна частина побудована на Node.js (Express), фронтенд — на Next.js. Як базу даних використано Supabase (PostgreSQL).

Додатковий функціонал — система логіну та реєстрації, яка дозволяє підписуватись на івенти в 1 клік без повторного введення даних.

## Посилання

- **Frontend:** https://volodymyrkirichenko.github.io/TestTaskUTD/events
- **Swagger (API docs):** https://test-task-utd.vercel.app/api/docs/

## Стек технологій

### Frontend

- **Next.js** 14 (React 18, TypeScript)
- **Tailwind CSS** — стилізація
- **Zustand** — стейт-менеджмент
- **TanStack React Query** — серверний стейт, кешування запитів
- **React Hook Form** + **Zod** — форми та валідація
- **Axios** — HTTP-клієнт

### Backend

- **Node.js** + **Express** (TypeScript)
- **Supabase** — PostgreSQL база даних, автентифікація
- **Swagger (swagger-jsdoc + swagger-ui-express)** — документація API

### Інфраструктура та DevOps

- **GitHub Actions** — CI/CD для фронтенду (GitHub Pages)
- **Vercel** — деплой серверної частини
- **Husky** + **lint-staged** — pre-commit хуки
- **ESLint** + **Prettier** — лінтинг та форматування

### Структура монорепо

```
packages/
├── web/       — Next.js фронтенд
├── server/    — Express бекенд
└── shared/    — спільні TypeScript типи
```
