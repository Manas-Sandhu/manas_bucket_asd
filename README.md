# Products API with Caching

A simple Express application that manages products stored in a JSON file. GET endpoints are cached in memory with a 1-minute TTL, and the cache is cleared whenever the data changes.

## Features

- Layered structure: Route → Middleware → Controller → Service → Database
- Cache middleware for `GET /products` and `GET /products/:id`
- `X-Cache` response header (`HIT` or `MISS`)
- 1-minute Time to Live (TTL) for every cache entry
- Full cache invalidation after any successful POST, PUT, PATCH or DELETE
- Protection against caching stale data when a write finishes while a GET is still running

## Project Structure

```
.
├── server.js
├── db.json
├── routes/
│   └── productRoutes.js
├── middleware/
│   └── cache.js
├── controllers/
│   └── productController.js
├── services/
│   └── productService.js
└── database/
    └── db.js
```

| Folder | Responsibility |
|---|---|
| `routes` | Maps URLs and HTTP methods to middleware and controller functions |
| `middleware` | Cache check (`checkCache`) and cache invalidation (`clearCache`) |
| `controllers` | Validates input and builds HTTP responses |
| `services` | Business logic (finding, adding, updating, deleting products) |
| `database` | Reads and writes `db.json` |

## Getting Started

### Prerequisites

- Node.js 18 or newer

### Install and run

```bash
npm init -y
npm install express
```

Create a `db.json` file in the project root. It must contain a JSON array:

```json
[]
```

Or start with some data:

```json
[
  { "id": 1, "name": "Pen", "price": 10 },
  { "id": 2, "name": "Notebook", "price": 50 }
]
```

Start the server:

```bash
node server.js
```

The server runs on `http://localhost:3000`.

## API Endpoints

| Method | Endpoint | Description | Body |
|---|---|---|---|
| GET | `/products` | Get all products (cached) | - |
| GET | `/products/:id` | Get one product (cached) | - |
| POST | `/products` | Add a product | `name`, `price` |
| PUT | `/products/:id` | Replace a product | `name`, `price` |
| PATCH | `/products/:id` | Update part of a product | `name` and/or `price` |
| DELETE | `/products/:id` | Delete a product | - |

### Status codes

| Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Product created |
| 400 | Invalid id or missing fields |
| 404 | Product not found |
| 500 | Error reading or writing the file |

## How Caching Works

1. A GET request hits `checkCache` first.
2. If an entry exists for that URL and is less than 60 seconds old, it is returned with `X-Cache: HIT`. The controller, service and database are skipped.
3. If the entry is missing or expired, the expired entry is deleted, the response gets `X-Cache: MISS`, and the request continues to the controller. The fresh result is then stored with its creation time.
4. Each entry is stored under the full request URL, so `/products` and `/products/1` are cached separately.
5. Only `200` responses are cached. Errors such as 404 are never stored.
6. On POST, PUT, PATCH and DELETE, `clearCache` waits for the response to finish. If the status code is 2xx, the whole cache is emptied. Failed requests leave the cache untouched.
7. A change counter makes sure a GET that started before a write cannot save its old result into the cache afterwards.

## Try It

Check the cache headers:

```bash
curl -i http://localhost:3000/products
```

The first response shows `X-Cache: MISS`. Run it again within a minute and you get `X-Cache: HIT` (and a much faster response).

Add a product, which clears the cache:

```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Book","price":20}'
```

The next `GET /products` shows `X-Cache: MISS` again. After 60 seconds without writes, a cached entry expires and the next GET is a MISS as well.

## Notes and Limitations

- `database/db.js` includes a 2-second artificial delay in `getProducts` so that the speed difference between MISS and HIT is easy to see. Remove the `await delay()` line to disable it.
- The cache lives in memory. It is lost when the server restarts and is not shared between multiple server instances.
- Each write reads the whole file and writes it back, so two simultaneous writes could overwrite each other. This is fine for learning, but a real database is needed for production use.
