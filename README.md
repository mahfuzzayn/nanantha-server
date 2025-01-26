
# Book Shop API
   - **Live Server**: [book-shop-mahfuzzayn (vercel)](https://book-shop-mahfuzzayn.vercel.app/)

Welcome to the **Book Shop API**! This is a backend application designed for managing a book shop. It allows you to perform essential operations such as managing books, processing orders, and calculating total revenue. Built using **Node.js**, **Express**, **TypeScript**, and **MongoDB**, this API offers a simple yet powerful solution for any book shop system.

## Features

### 1. **Product (Book) Management**
   - **Create Books**: Add new books with details like title, author, price, category, description, quantity & inStock.
   - **Update Books**: Modify book details like price, stock quantity, and description.
   - **View All Books**: Retrieve a list of all books in the shop. Books can be searched or filtered through title, author & category wise.
   - **Get Single Book**: Get information of a specific book by its ID.
   - **Delete Books**: Remove a book that is no longer available for sale.

### 2. **Order Management**
   - **Place Order**: Customers can place an order by selecting product and specifying quantities.

### 3. **Revenue Calculation**
   - **Automatic Revenue Calculation**: The API system can calculate total revenue by multiplying product prices with quantities ordered.

### 4. **Data Validation & Error Handling**
   - **Schema Validation**: All product and order data is validated using Mongoose to ensure consistency and data integrity.
   - **Helpful Error Messages**: If something goes wrong (e.g., insufficient stock or mismatched prices), the API responds with clear and specific error messages.

## Tech Stack

The API is built using the following technologies:

- **Node.js**: JavaScript runtime for building server-side applications.
- **Express**: A web framework for Node.js that makes it easier to create APIs.
- **TypeScript**: A statically typed superset of JavaScript that provides better tooling and error checking.
- **MongoDB**: A NoSQL database for storing data on books, orders, and users.
- **Mongoose**: An ODM (Object Data Modeling) library for MongoDB, used to define schemas and perform database operations.
- **ESLint**: A linting tool to enforce coding standards and catch potential issues early.
- **Prettier**: Code formatter to maintain consistent style throughout the project.

## Getting Started

Follow the instructions below to set up the Book Shop API project locally.

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/en/download/)
- [MongoDB](https://www.mongodb.com/try/download/community) (either locally or using a cloud provider like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/mahfuzzayn/book-shop-b4a2v1-server.git
   cd book-shop-b4a2v1-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables for your MongoDB connection. You can create a `.env` file in the root directory with the following:

   ```env
   NODE_ENV=development
   DATABASE_URL=mongodb://localhost:27017/book-shop-b4a2v1-server (must be modified) 
   PORT=5000
   ```

4. Start the server:
   ```bash
   npm run start:dev
   ```

   The API will now be running on [http://localhost:5000](http://localhost:5000).

## API Endpoints

Here are the available routes for interacting with the Book Shop API:

- **GET /api/products**: Retrieve all products.
- **GET /api/products/:productId**: Get a single product by its product ID.
- **POST /api/products**: Create a new product.
- **PUT /api/products/:productId**: Update a product by its product ID.
- **DELETE /api//products/:productId**: Delete a product by its product ID.

- **POST /api/orders**: Create a new order.
- **GET /api/orders/revenue**: Get the total revenue from all orders.

## Error Handling

The API returns appropriate HTTP status codes and error messages when something goes wrong. Error responses includes:

- **500 Internal Server Error**: Something went wrong on the server.
- **404 Not Found**: The requested resource doesn’t exist (e.g., a product or order with the specified ID).

Developed by [Mahfuz Zayn](https://mahfuzzayn.netlify.app/).
