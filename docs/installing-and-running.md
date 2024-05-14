# Installation

---

## Table of Contents

- [Comfortable development](#comfortable-development)
- [Links](#links)

---

## Comfortable development

1. Clone repository

    ```bash
    git clone https://github.com/Flutterando/calamidade-backend.git
    ```

1. Go to folder, and copy `env-example` as `.env`.

    ```bash
    cd calamidade-backend/
    cp env-example .env
    ```

If you don't want to run API as a docker container, change `MAIL_HOST=maildev` to `MAIL_HOST=localhost` and `DATABASE_HOST=postgres` to `DATABASE_HOST=localhost`.

1. Run the containers:

- If you want to run the project entirely with docker containers
    ```bash
    docker compose up -d
    ```

- If you want to run API using NPM:

    - Install dependency
        ```bash
        npm install
        ```
    - Run sync
        ```bash
        npm run schema:sync
        ```
    - Run migrations
        ```bash
        npm run migration:run
        ```
    - Run seeds
        ```bash
        npm run seed:run
        ```
    - Run app in dev mode
        ```bash
        npm run start:dev
        ```

2. Open http://localhost:3000

---

## Links

- Swagger (API docs): http://localhost:3000/docs
- Adminer (client for DB): http://localhost:8080
- Maildev: http://localhost:1080

---

Previous: [Introduction](introduction.md)

Next: [Working with database](database.md)
