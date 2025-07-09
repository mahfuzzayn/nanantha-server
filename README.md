# Nanantha - Server Side (Backend)

-   **Live Server**: https://nanantha-server.vercel.app/

## **Project Overview**

Nanantha Server is a robust backend built with Node.js, Express, and TypeScript, enabling seamless user management, tutor profiles, bookings, and reviews, with all data securely stored in MongoDB. It features JWT-based authentication, role-based access control, and integrates payment solution Mollie, ensuring efficient API handling and smooth interaction with the Next.js frontend.

## **Tech Stack**

-   **Backend Framework:** Node.js (Express.js) + TypeScript
-   **Langages:** MongoDB (Mongoose ODM)
-   **Database:** MongoDB (Mongoose ODM)
-   **Authentication:** Custom authentication with MongoDB
-   **File Storage:** Cloudinary

## **Getting Started**

### **1️⃣ Clone the Repository**

```sh
git clone https://github.com/mahfuzzayn/nanantha-server.git
cd nanantha-server
```

### **2️⃣ Install Dependencies**

```sh
npm install
```

### **3️⃣ Environment Variables**

Create a `.env` file in the root directory and add the following:

```env
# Environment
NODE_ENV=development

# Port
PORT=5000

# URL's
BASE_URL=http://localhost:5000/api/v1
CLIENT_URL=http://localhost:3000

# Database URL
DB_URL=your_mongodb_url

# Bcrypt Salt Rounds
BCRYPT_SALT_ROUNDS=12

# JWT Secrets and Expiry
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_ACCESS_EXPIRES_IN=10d
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_REFRESH_EXPIRES_IN=1y
JWT_OTP_SECRET=your_jwt_otp_secret
JWT_PASS_RESET_SECRET=your_jwt_pass_reset_secret
JWT_PASS_RESET_EXPIRES_IN=15m

# Cloudinary Credentials
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Mollie Payment Info
MOLLIE_CLIENT_API=your_mollie_client_api
```

### **4️⃣ Run the Development Server**

```sh
npm run dev
```

Your backend will be running at `http://localhost:5000`.

## **API Endpoints**

-   **Auth Routes:** Login & Register user
-   **User Routes:** CRUD operations for users
-   **Products Routes:** CRUD operations for products
-   **Orders Routes:** CRUD operations for orders
-   **Reviews Routes:** CRUD operations for reviews
-   **Carts Routes:** CRUD operations for carts
-   **News Routes:** Read operations for news

Developed by [Mahfuz Zayn](https://mzayn.vercel.app/).
