# MyFoodStreet API 🍟

MyFoodStreet API is a comprehensive food ordering system built with Node.js, Express, and AWS DynamoDB. It provides APIs for managing users, restaurants, menus, carts, and orders.

## USP

Users can place order from multiple restaurants in one go from their favorite food street!! 🤩

## Features

- User Authentication and Authorization
- Restaurant Management
- Menu Management
- Cart Management
- Order Management

## Local Development

### Prerequisites

- Node.js (see package.json for version)
- AWS NoSQL Workbench (required for running dynamoDB locally)

### Installation

#### Clone the repository

```bash
git clone https://github.com/Gunavel/my-food-street.git
```

#### Install NPM packages

```bash
cd my-food-street
npm install
```

#### Run DynamoDB Local

Install AWS NoSQL Workbench and create a new local connection.

#### Setup environment variables

Setup your environment variables in a `.env` file in the root directory. You'll need to specify your AWS credentials and the DynamoDB table name.

```bash
NODE_ENV="development"
HOST="localhost"
DYNAMODB_URL="http://localhost:8000" #URL of dynamodb running locally
DYNAMODB_TABLE_NAME=your_dynamodb_table_name
JWT_SECRET=your_jwt_secret
PORT=3000
```

#### Run the server

```bash
npm run dev
```

#### Create DynamoDB Table

Send a GET request to `http://localhost:3000/createTable`

This creates a new dynamodb table with all required keys and indexes
See [here](https://github.com/Gunavel/my-food-street/blob/5a3346262f7775209eca93a0d87edc4c71a47485/src/api/createTable/createTableRepository.ts) for more details

## API Endpoints

### v1

- Auth: `/api/v1/auth`
- User: `/api/v1/users`
- Restaurant: `/api/v1/restaurants`
- Cart: `/api/v1/carts`

For full list of endpoints. See OpenAPISpec.yml.

## Production

### Build

```bash
npm run build
npm start
```

### Deployment

TODO

## Contact

<gunavel.bharathi@gmail.com>

<https://github.com/Gunavel/my-food-street>

## Acknowledgements

- AWS SDK for JavaScript
- Express.js
- Node.js
- Zod for schema validation
- Pino for logging
- Postman for API First development
- AWS NoSQL Workbench for DynamoDB Model design and local development
