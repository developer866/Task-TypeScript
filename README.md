# 🛍️ VOGUE - Premium Clothing Store

A modern, full-stack e-commerce platform for fashion enthusiasts. Built with the MERN stack (MongoDB, Express, React, Node.js) featuring user authentication, product management, and a stunning UI.

![VOGUE Store](https://img.shields.io/badge/Status-Active-success)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-blue)
![React](https://img.shields.io/badge/React-18+-61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Environment Variables](#-environment-variables)
- [Scripts](#-scripts)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🎨 User Interface
- **Stunning Landing Page** with auto-sliding hero carousel
- **Responsive Design** - Works seamlessly on mobile, tablet, and desktop
- **Modern UI** - Black, white, green, and yellow color scheme
- **Smooth Animations** - Hover effects and transitions throughout
- **Product Collections** - Browse curated fashion collections

### 🔐 Authentication & Authorization
- **JWT-based Authentication** with access & refresh tokens
- **User Registration** with password hashing (bcrypt)
- **Secure Login** with token-based sessions
- **Role-based Access** (User, Seller, Admin)
- **Redux State Management** for global auth state
- **Redux Persist** - Stay logged in across sessions

### 🛒 Product Management (CRUD)
- **Create Products** - Add new items with details
- **Read Products** - Browse all available products
- **Update Products** - Edit existing product information
- **Delete Products** - Remove products from inventory
- **Product Fields:**
  - Name, Description, Price
  - Category (Electronics, Clothing, Food, Furniture, Other)
  - Stock Quantity
  - Availability Toggle

### 📊 Additional Features
- **Product Table** with sortable columns
- **Real-time Updates** after CRUD operations
- **Form Validation** on client and server
- **Error Handling** with toast notifications
- **Newsletter Subscription**
- **Testimonials Section**

---

## 🛠️ Tech Stack

### Frontend
- **React** 18+ with TypeScript
- **React Router DOM** for navigation
- **Redux Toolkit** for state management
- **Redux Persist** for persistent storage
- **Tailwind CSS** for styling
- **React Toastify** for notifications

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcrypt** for password hashing
- **CORS** enabled
- **dotenv** for environment variables

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local or Atlas)

### Installation

#### 1. Clone the repository
```bash
git clone https://github.com/yourusername/vogue-store.git
cd vogue-store
```

#### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

#### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

#### 4. Set up Environment Variables

**Backend** - Create `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/vogue-store
TOKEN_SECRET=your_jwt_secret_key_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
NODE_ENV=development
```

**Frontend** - Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

#### 5. Start MongoDB
```bash
# If using local MongoDB
mongod
```

#### 6. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The app will be running at:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000

---

## 📁 Project Structure
```
vogue-store/
│
├── frontend/                 # React TypeScript Frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── Navbar.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── pages/            # Page components
│   │   │   ├── Homepage.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── RegisterUser.tsx
│   │   │   ├── Product.tsx
│   │   │   └── Taskpage.tsx
│   │   ├── store/            # Redux setup
│   │   │   ├── store.ts
│   │   │   ├── hooks.ts
│   │   │   └── slices/
│   │   │       └── authSlice.ts
│   │   ├── Api/              # API functions
│   │   │   ├── LoginApi.ts
│   │   │   ├── RegisterApi.ts
│   │   │   └── ProductApi.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                  # Node.js Express Backend
│   ├── models/               # Mongoose models
│   │   ├── user.js
│   │   └── product.js
│   ├── controllers/          # Route controllers
│   │   ├── userController.js
│   │   └── productController.js
│   ├── routes/               # API routes
│   │   ├── userRoutes.js
│   │   └── productRoutes.js
│   ├── middleware/           # Custom middleware
│   │   └── auth.js
│   ├── config/               # Configuration files
│   │   └── db.js
│   ├── server.js             # Entry point
│   ├── package.json
│   └── .env
│
└── README.md
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "user"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Login
```http
POST /users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Get All Users (Protected)
```http
GET /users
Authorization: Bearer <token>
```

---

### Product Endpoints

#### Get All Products
```http
GET /product
```

**Response:**
```json
{
  "success": true,
  "products": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Classic T-Shirt",
      "description": "Premium cotton t-shirt",
      "price": 29.99,
      "category": "clothing",
      "stock": 100,
      "available": true,
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T10:30:00.000Z"
    }
  ]
}
```

#### Add Product
```http
POST /product/addproduct
Content-Type: application/json

{
  "name": "Classic T-Shirt",
  "description": "Premium cotton t-shirt",
  "price": 29.99,
  "category": "clothing",
  "stock": 100,
  "available": true
}
```

#### Update Product
```http
PUT /product/:id
Content-Type: application/json

{
  "name": "Updated T-Shirt",
  "price": 24.99,
  "stock": 150
}
```

#### Delete Product
```http
DELETE /product/:id
```

---

## 🔐 Environment Variables

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/vogue-store` |
| `TOKEN_SECRET` | JWT access token secret | `your_secret_key` |
| `REFRESH_TOKEN_SECRET` | JWT refresh token secret | `your_refresh_secret` |
| `NODE_ENV` | Environment | `development` or `production` |

### Frontend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |

---

## 📜 Scripts

### Backend
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
```

### Frontend
```bash
npm run dev        # Start Vite dev server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

---

## 🖼️ Screenshots

### Homepage
![Homepage](screenshots/homepage.png)

### Product Management
![Products](screenshots/products.png)

### Login
![Login](screenshots/login.png)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

---

## 📝 Development Roadmap

- [ ] Add shopping cart functionality
- [ ] Implement payment gateway (Stripe/PayPal)
- [ ] Add order management system
- [ ] Implement product reviews and ratings
- [ ] Add wishlist feature
- [ ] Implement advanced search and filters
- [ ] Add admin dashboard
- [ ] Email verification for new users
- [ ] Password reset functionality
- [ ] Add image upload for products

---

## 🐛 Known Issues

- None currently reported

---

## 📧 Contact

**Developer:** Your Name  
**Email:** your.email@example.com  
**GitHub:** [@yourusername](https://github.com/yourusername)  
**LinkedIn:** [Your LinkedIn](https://linkedin.com/in/yourprofile)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- Icons from [Unsplash](https://unsplash.com/)

---

<div align="center">

**Made with ❤️ by [Your Name]**

⭐ Star this repo if you found it helpful!

</div>
```

---

## 🎁 Bonus: Add a LICENSE file

Create `LICENSE` file in root:
```
MIT License

Copyright (c) 2025 Your Name

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.