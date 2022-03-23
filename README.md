# node-docker-example

## About

This app showcases a website built with NodeJS. The site has a set of
articles, each article has a separate page, all data about the article
is stored in the PostgreSQL database. Docker is used to deploy the
application.

🔗 [Deployed on Heroku](https://website-simple-blog.herokuapp.com/)

## Folder structure

```text
.
└── .
    ├── controllers - contains handlers for http requests
    ├── helpers - some string, file and database helper functions
    ├── middlewares - contains functions that will execute before the handler is executed
    ├── models - contains entities for their creation or getting
    ├── nginx - nginx web server config or certificate will place here
    ├── preloads - every file in this folder will be executed before starting the server
    ├── public - contains static files for http response
    ├── scripts - some bash scripts
    ├── sql - database ".sql" files for querying
    └── views - file for page rendering
```

## How to deploy

- 1. Clone this repository `git clone https://github.com/sergeyyarkov/node-docker-example.git .`
- 2. Configure enviroment variables in `docker-compose.yml` for `postgres` and `nodejs` serivces if you need to
- 3. Build and run application with `docker-compose up --build`

## Requirements

- Node.js >= v14.13.0
- Docker
