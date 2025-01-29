# IMGFX 🖼️

## Overview

**imgfx** is a POC RESTful image processing service with Node.js. Features of the service include:

- image upload
- image transformation (crop, resize, watermark, etc)
- cloud-based storage (Cloudfare R2)
- image size and type validation
- rate-limiting for transformation route
- asychronous image uploads and transformation
- JWT Auth

## Tech Stack

This service was built using the following technologies:

- **Node.js:** Runtime
- **Sharp:** Image transformation module
- **Hono:** Web framework
- **Hono-Openapi:** Openapi documentation
- **Scalar-Openapi:** Openapi document visualiser
- **Redis:** Caching
- **Postgres:** Database
- **PrismaORM:** Database ORM
- **Winston:** Logger
- **Docker/Docker-Compose:** Containerization

## Prerequisites

- Node.js (>=v20.18)
- Docker and Docker-Compse (optional, but recommended)

## Installation

- Clone this repository to your machine.
- Install dependencies by running `npm install` inside the project's directory in a terminal.
- Provide a `.env` in the root of the service and populate it using the `.env.sample` env file as refernce.

## Running the service

The recommended way to run the service is by using docker. All you need to do to run the service using docker is to simply run `docker compose up` in the project's directory inside terminal.

For local setup, follow the steps listed:

- run `npm run migrate` to apply database migrations
- run `npm run dev` to start up the service (in development mode)

**PS:** for local setup, you have to make sure you have an instances of the following running:

- rabbitmq server
- postgresql database server
- redis server

In both cases, you can view the **openapi** specs for the service in your browser at `http://localhost/<port>/ui`

## Authentication and Authorization

The service makes use of JWT access tokens for authenticating and authorising requests on protected endpoints.
the access token should be provided in the **Authorization** header for every request to protected endpoints.

## Endpoints

Endpoints in the service fall under two categories: **authentication** and **images**

### Authentication

| Name   | Path        | Method |
| ------ | ----------- | :----- |
| signup | /api/signup | POST   |
| signin | /api/signin | POST   |

### Images

| Name                       | Path                   | Method |   Query    | Params | Requires Authentication | Description                                                                  |
| :------------------------- | :--------------------- | :----- | :--------: | :----: | :---------------------: | ---------------------------------------------------------------------------- |
| upload                     | /api/images            | POST   |     -      |   -    |           yes           | upload an image                                                              |
| upload status              | /api/images/status     | GET    |     -      |  key   |           yes           | check an image upload status(key was provided during upload and is required) |
| image records              | /api/images            | GET    | skip, take |   -    |           yes           | get a list of image records (skip and take are paginators)                   |
| transform images           | /api/images/transforms | POST   |     -      |   -    |           yes           | transform an already uploaded image                                          |
| transformed images records | /api/images/transforms | GET    | skip, take |   -    |           yes           | get a list of transformed image records (skip and take are paginators)       |

To get more details about the endpoints structure, auth requirements, request/response and error formats, start up the service and visit `http://localhost:<port>/ui` to view the **openapi** specs in your browser.

## Contributions

Spotted a bug or thought of a nice feature to add? Please fork the repo and open a Pull Request!
