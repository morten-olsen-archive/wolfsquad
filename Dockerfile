FROM node:alpine as build-env
WORKDIR /workspace
COPY package.json /workspace/package.json
RUN npm install
COPY . /workspace
RUN NODE_ENV=production npm run build


FROM httpd:alpine
COPY --from=build-env /workspace/dist /usr/local/apache2/htdocs/