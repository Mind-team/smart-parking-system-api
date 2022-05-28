FROM node:16-alpine as builder

WORKDIR /app

COPY package.json .

RUN npm i pm2 -g

RUN npm i

COPY . .

RUN npm run build

CMD ["pm2-runtime", "dist/main.js"]
