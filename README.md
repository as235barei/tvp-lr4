# TechShop — Лабораторна робота №4

Тема роботи — реєстрація та авторизація користувачів сайту TechShop.
До React-клієнта доданий бекенд: REST API на Node.js та Express, база даних MySQL,
автентифікація через JWT, хешування паролів і ролі користувача й адміністратора.

## Технології

- React + Vite (`client/`)
- Node.js + Express (`server/`)
- MySQL (`database/`)
- JWT

## Як запустити

1. База даних у Docker:

```bash
docker compose -p techshop up -d db
```

2. Сервер:

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

3. Клієнт:

```bash
cd client
npm install
npm run dev
```

## Тестові акаунти

- Адміністратор: `admin@techshop.local` / `admin1234`
- Користувач: `user@techshop.local` / `user1234`
