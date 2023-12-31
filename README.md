# arithmetic-calculator-ui

This is a Single Page Application built as coding challenge made for [TrueNorth](https://www.truenorth.co/).

See the [requirement's list](./TrueNorth_LoanPro_Coding_Challenge.pdf).

`CircleCI status:`

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/web2solutions/arithmetic-calculator-ui/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/web2solutions/arithmetic-calculator-ui/tree/main) main

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/web2solutions/arithmetic-calculator-ui/tree/dev.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/web2solutions/arithmetic-calculator-ui/tree/dev) dev

## Stack

* Vue 3
* Pinia
* Bootstrap
* cypress

## Preparing the development environment using your current NodeJS installation

```bash
npm install
```

Before run the dev server, please be sure that you have the [arithmetic-calculator-api](https://github.com/web2solutions/arithmetic-calculator-api) up and running.

`Run dev server`:

```bash
npm run dev
```

## Online demo

<https://arithmetic-calculator-ui-nu.vercel.app/>

user: admin@admin.com
password 123456

## Deploy

Auto deploy with [Vercel](https://vercel.com/)

## Building the Single Page Application

Build the SPA for dev env.

```bash
npm run build:dev
```

Build the SPA for production env.

```bash
npm run build
```

Build the SPA for CI env.

```bash
npm run build:ci
```

## Run headless e2e tests

```bash
npm test
```

## Run e2e through opening Cypress

Build and serve the SPA through the 8080 port using express and your local Node.js install.

```bash
npm start
```

Or through Docker:

```bash
npm run docker:compose
```

You can check the app at: <http://localhost:8080/>

Now in another terminal session, run:

```bash
npm run cypress:open
```


## Project Tech Debits

1. Implement backend for frontend (BFF) using vercel functions.
2. Generate cookie that stores the API token via BFF.
3. Search records.
