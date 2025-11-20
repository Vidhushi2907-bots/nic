# FROM node:18 as node
FROM node@sha256:c6ae79e38498325db67193d391e6ec1d224d96c693a8a4d943498556716d3783 as node
# set working directory
WORKDIR /app
# install and cache app dependencies
COPY . .
# FROM nginx:alpine
FROM nginx@sha256:d67ea0d64d518b1bb04acde3b00f722ac3e9764b3209a9b0a98924ba35e4b779

RUN rm -rf /usr/share/nginx/html/* && rm -rf /etc/nginx/nginx.conf
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=node /app/dist/frontend /usr/share/nginx/html