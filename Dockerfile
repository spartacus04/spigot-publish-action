# Typescript
FROM node:20-alpine as build
WORKDIR /usr/src/app

RUN apk add --no-cache --virtual .gyp python3 make gcc g++
RUN npm i -g pnpm

COPY package*.json .

RUN pnpm i

RUN apk del .gyp

COPY . .

RUN npm run build

# Run prod
FROM node:20-alpine as prod

ENV NODE_ENV="prod"
ENV TZ="Europe/Rome"

WORKDIR /usr/src/app

RUN apk add --no-cache --virtual .gyp python3 make gcc g++
RUN npm i -g pnpm

COPY package*.json .

RUN pnpm i --prod

RUN apk del .gyp

COPY --from=build /usr/src/app/dist ./dist
COPY resources ./resources

CMD ["node", "dist/index.js"]
