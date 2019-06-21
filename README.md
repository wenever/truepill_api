# Truepill Inventory API

Typescript Express Server API over MySQL DB

Implements web socket in order to push updated inventory detail notifications.

DDL for database, plus sample insert data in the `/ddl` folder

## Endpoints

- GET /api/products - Fetch Products

  - returns array of products
    ```
    [
      {
        product_name: string,
        product_current_count: integer,
        product_manual_count: integer
      },
      ...
    ]
    ```

- PATCH /api/products - Bulk Update

  - requires array of product names and quantities to increment (optional forceReset flag to reset current and manual counts for a product)

    ```
      {
        productUpdates: [
          {
            product_name: string,
            product_qty: integer
          },
          ...
        ],
        forceReset: boolean
      }
    ```

  - returns count of updated rows
    ```
      {
        affectedRows: integer
      }
    ```

- PATCH /api/products/:product_name - Remove Stock

  - requires product name in URL path, and product_qty to decrement stock by

    ```
      {
        product_qty: integer
      }
    ```

  - returns count of updated rows
    ```
      {
        affectedRows: integer
      }
    ```

## Environment Variables

Required Build environment variables :

- `DB_HOST` e.g. localhost
- `DB_USER` e.g. root
- `DB_PWORD` e.g. \***\*\*\*\*\*\*\***
- `DB_NAME` e.g. truepill

Required Test environment variables :

- `TEST_DB_NAME` e.g. truepill_test

## Install

`yarn install`

## Run

### Development

`yarn run dev`

### Production

Builds in to the `/build` directory

`yarn run prod`

## Test

My TDD was based around whole endpoint integration tests, using `supertest`, against a test MySQL database (see environment variables). These tests were mostly happy path tests and need extending.

I would add some unit tests but have not done so now - but the integration tests still run through Mocha and will contribute to coverage.

`yarn test`

## NOTES

Production code needs process management, potentially via a node process manager, or via docker orchestration - not implemented.

Production code should include a proper logger - not chosen, and dependent on log digestion strategies.

Production database should probably include auto-incremented ID Primary Keys - but implmemented without as specified in requirements.

Production code would require security such as authorization tokens, and HTTPS
