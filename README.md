
# Book Shop - Server Side (Backend)

- **Live Server**: https://book-shop-b4a4v1-server.vercel.app/

## **Project Overview**
Welcome to the Book Shop Backend! This backend system supports the online book store, handling functionalities such as managing book listings, processing user orders, and handling payments. Built with Node.js, Express, and MongoDB, it provides efficient data storage and retrieval through Mongoose. The API includes secure user authentication with JWT and role-based access control, allowing admins to manage books and users, while customers can only manage their own orders. Stripe integration ensures smooth payment processing, and data validation is handled by Zod for ensuring consistency and security.

## **Tech Stack**
- **Backend Framework:** Node.js (Express.js)
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT-based authentication
- **Payment Integration:** Stripe
- **File Storage:** Cloudinary
- **Security Enhancements:** bcrypt for password hashing & CORS for API security

## **Getting Started**
### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/mahfuzzayn/book-shop-b4a4v1-server.git
cd book-shop-b4a4v1-server
```

### **2️⃣ Install Dependencies**
```sh
npm install
```

### **3️⃣ Environment Variables**
Create a `.env` file in the root directory and add the following:
```env
NODE_ENV=your_node_env
PORT=5000
MONGO_URI=your_mongodb_connection_string
BCRYPT_SALT_ROUNDS=your_bcrypt_salt_rounds
JWT_ACCESS_SECRET=your_jwt_secret
JWT_ACCESS_EXPIRES_IN=your_jwt_access_expires_in
STRIPE_SECRET_KEY=your_stripe_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### **4️⃣ Run the Development Server**
```sh
npm run dev
```
Your backend will be running at `http://localhost:5000`.

## **API Endpoints**
- **Auth Routes:** Register, Login, Logout, Profile Management
- **Product Routes:** CRUD operations for products
- **Order Routes:** Place, Retrieve, and Manage Orders

Developed by [Mahfuz Zayn](https://mahfuzzayn.netlify.app/).
