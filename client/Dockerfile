FROM node:lts-alpine AS builder
RUN mkdir /src
COPY ./package.json /src/
RUN npm install
COPY . /src
WORKDIR /src
RUN npm run build

FROM nginx
COPY --from=builder /src/build /usr/share/nginx/html
