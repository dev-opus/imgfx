#! /bin/bash

echo "starting database containers..."

docker run --rm -d -p 6380:6379 --name imgfx-redis --volume imgfx-redis:/data redis:7.2.7-alpine3.21
docker run --rm -d -p 5672:5672 -p 15672:15672 --name imgfx-rabbitmq --volume imgfx-rabbitmq:/var/lib/rabbitmq rabbitmq:management-alpine
docker run --rm -d -p 5432:5432 --name imgfx-postgres --volume imgfx-postgres:/var/lib/postgresql/data --env-file .env postgres:14.15-alpine3.21

echo "database containers started"