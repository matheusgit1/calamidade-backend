# Installation

---

## Table of Contents

- [Setup Cockroach Labs to run database remotely](#setup-cockroach-labs-to-run-database-remotely)
- [Setup local environment](#setup-local-environment)
- [Links](#links)

---

## Setup Cockroach Labs to run database remotely

If you want quick run your app, you can use following commands:

1. Create a cluster

   - Select serverless free
   - Select AWS as Cloud Provider (us-east-1)

2. Configure credentials

   - User: postgres
   - Password: get generated password from console
   - Download CA Cert using the curl
   - Use the General Coonection String to connect to your cluster
     - postgresql://postgres:YOUR-PASS@YOUR_DATABASE_URL:26257/defaultdb?sslmode=verify-full

3. Connect to database (DBeaver) and create a database:

```bash
CREATE DATABASE api;
```

## Setup local environment

1. Copy `env-example` as `.env`.

   ```bash
   cp env-example .env
   ```

2. Now, you have to configure your .env file with the credentials generated from previous step

   Change `MAIL_HOST=maildev` to `MAIL_HOST=localhost`
   Change `DATABASE_HOST=postgres` to `DATABASE_HOST=YOUR_DATABASE_URL`
   Change `DATABASE_PORT=5432` to `DATABASE_PORT=26257`
   Change `DATABASE_USERNAME=root` to `DATABASE_USERNAME=postgres`
   Change `DATABASE_PASSWORD=secret` to `DATABASE_PASSWORD=YOUR-PASS`
   Change `DATABASE_SSL_ENABLED=false` to `DATABASE_SSL_ENABLED=true`
   Change `DATABASE_CA=` to `DATABASE_CA=$HOME/.postgres/root.crt` (or your .crt path)

3. Run additional containers:

   ```bash
   docker compose up -d adminer maildev
   ```

4. Install dependency

   ```bash
   npm install
   ```

5. Run sync

   ```bash
   npm run schema:sync
   ```

6. Run migrations

   ```bash
   npm run migration:run
   ```

7. Run seeds

   ```bash
   npm run seed:run
   ```

8. Run app in dev mode

   ```bash
   npm run start:dev
   ```

9. Open http://localhost:3000

---

## Simulation (Serverless) AWS Lambda

1. Running invoke function

```bash

npm run build

npm run start:off


```

2. Build package deploy

```bash

npm run build

npm run build:sls


```

---

## Links

- Swagger (API docs): http://localhost:3000/docs
- Adminer (client for DB): http://localhost:8080
- Maildev: http://localhost:1080

---

Previous: [Introduction](introduction.md)

Next: [Working with database](database.md)
