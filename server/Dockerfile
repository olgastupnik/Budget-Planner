FROM node:16-alpine
WORKDIR /app
COPY *.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm run migration:run
RUN npm run seed:run
RUN addgroup -S nodeapp
RUN adduser -S nodeapp -G nodeapp
USER nodeapp
CMD npm run start:dev
EXPOSE 4000