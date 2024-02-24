FROM node:18-alpine

WORKDIR /app

COPY package.json .

COPY pnpm*.yaml .

RUN npm i -g pnpm

RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 3000

RUN pnpm build

CMD [ "pnpm", "start:prod" ]
