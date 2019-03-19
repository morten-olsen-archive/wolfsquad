FROM node:alpine as build-env
WORKDIR /workspace
COPY package.json /workspace/package.json
RUN npm install
COPY . /workspace
RUN NODE_ENV=production npm run build


FROM pierrezemb/gostatic
COPY --from=build-env /workspace/dist /srv/http