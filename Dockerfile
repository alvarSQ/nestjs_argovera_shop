# Базовый образ для сборки
FROM node:22-alpine AS builder

# Рабочая директория
WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./
RUN npm install

# Копируем исходный код и собираем проект
COPY . .
RUN npm run build

# Финальный образ
FROM node:22-alpine

WORKDIR /app

# Копируем только необходимые файлы из сборки
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# Устанавливаем только продакшен-зависимости
RUN npm install --production

# Указываем порт
EXPOSE 10000

# Команда для запуска приложения
CMD ["npm", "run", "start:prod"]