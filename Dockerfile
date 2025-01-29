FROM node:20-alpine3.21 AS base

FROM base AS builder
RUN apk add --no-cache gcompat
WORKDIR /app
COPY . ./
RUN --mount=type=cache,id=npm-cache,target=/root/.npm npm ci
RUN npm run build
RUN npm prune --omit=dev

FROM base AS runner
WORKDIR /app
COPY --from=builder  /app/node_modules /app/node_modules
COPY --from=builder  /app/dist /app/dist
COPY --from=builder /app/prisma /app/prisma
COPY --from=builder  /app/package.json /app/package.json
EXPOSE 8000

CMD [ "sh", "-c", "npm run migrate && npm start" ]
