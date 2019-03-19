FROM node:alpine as build-env
WORKDIR /workspace
COPY package.json package-lock.json /workspace/
RUN npm install
COPY ./webpack.config.ts ./tsconfig.json /workspace/
COPY ./src /workspace/src
RUN NODE_ENV=production npm run build


FROM pierrezemb/gostatic
COPY --from=build-env /workspace/dist /srv/http
CMD ["-port", "80", "-append-header", "content-security-policy:default-src 'self' ;  script-src 'self' blob: ; style-src 'unsafe-inline' https://api.tiles.mapbox.com https://fonts.googleapis.com ; img-src 'self' data: blob: ; font-src https://fonts.gstatic.com ; connect-src https://api.mapbox.com https://events.mapbox.com; frame-ancestors 'none'; form-action 'none'; base-uri 'self'; require-sri-for script"]