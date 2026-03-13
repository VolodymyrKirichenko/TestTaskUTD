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
- **BullMQ** + **Redis** — черга задач для фонової обробки реєстрацій
- **Swagger (swagger-jsdoc + swagger-ui-express)** — документація API

### Інфраструктура та DevOps

- **GitHub Actions** — CI/CD для фронтенду (GitHub Pages)
- **Vercel** — деплой серверної частини
- **Husky** + **lint-staged** — pre-commit хуки
- **ESLint** + **Prettier** — лінтинг та форматування

## Redis (для Bull queue)

Для роботи черги задач (BullMQ) потрібен запущений Redis.

### Встановлення (macOS)

```bash
brew install redis
```

### Запуск

Фоновий сервіс (працює після перезавантаження):

```bash
brew services start redis
```

Або вручну (тільки поки відкритий термінал):

```bash
redis-server
```

Перевірка що Redis працює:

```bash
redis-cli ping
# → PONG
```

> Якщо Redis недоступний — сервер працює як звичайно, просто без фонової обробки.

## Запуск проєкту

```bash
npm run dev
```

Запускає одночасно frontend (Next.js) та backend (Express). Redis має бути запущений заздалегідь (див. вище).

Або окремо:

```bash
npm run web      # тільки frontend
npm run server   # тільки backend
```

### Структура монорепо

```
packages/
├── web/       — Next.js фронтенд
├── server/    — Express бекенд
└── shared/    — спільні TypeScript типи
```
