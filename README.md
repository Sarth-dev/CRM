# CRM Platform

A full-stack CRM application with multi-tenant organisation management, admin/customer CRUD, authentication, and containerized deployment.

---

## 1. Features

- JWT-based authentication (superadmin/admin)
- Organisation, admin, and customer management (CRUD)
- Role-based access control
- Protected API routes
- Dockerized backend, frontend, and database services
- Ready for deployment with Docker Compose
- API documentation (Swagger/Postman)
- Sample super-admin credentials

---

## 2. Deliverables

- Complete source code (frontend and backend)
- Dockerfile and docker-compose.yml for all services
- `.env.example` files listing environment variables
- API documentation (`docs/` or exported Postman collection)
- Tests for all CRUD and authentication routes
- Video demonstration of features (screen recording)

---

## 3. Setup & Running Instructions

### Prerequisites

- Docker and Docker Compose installed

### Clone the repository

```
git clone https://github.com/Sarth-dev/CRM.git
cd CRM
```

### Environment Variable Setup

- Copy `.env.example` to `.env` in both `/backend` and `/frontend` directories
- Set environment variables as needed

### Build and Run (Docker Compose)

```
docker-compose up --build
```

- Backend: [http://localhost:5000](http://localhost:5000)
- Frontend: [http://localhost:3000](http://localhost:3000)

---

## 4. Default Super-Admin Credentials

- Email: superadmin@example.com
- Password: password123

---

## 5. API Endpoints Overview

### Auth

- **POST `/api/v1/auth/login`**  
  Login, get JWT token.  
  Request: `{ email, password }`  
  Response: `{ token, user }`

### Organisations

- **GET `/api/v1/orgs`**  
  List all orgs (superadmin only).
- **POST `/api/v1/orgs`**  
  Create org (superadmin only).
- **GET `/api/v1/orgs/:orgId`**
- **PATCH `/api/v1/orgs/:orgId`**
- **DELETE `/api/v1/orgs/:orgId`**

### Admins

- **GET `/api/v1/orgs/:orgId/admins`**
- **POST `/api/v1/orgs/:orgId/admins`**
- **PATCH `/api/v1/orgs/:orgId/admins/:adminId`**
- **DELETE `/api/v1/orgs/:orgId/admins/:adminId`**

### Customers

- **GET `/api/v1/orgs/:orgId/customers`**
- **POST `/api/v1/orgs/:orgId/customers`**
- **PATCH `/api/v1/orgs/:orgId/customers/:id`**
- **DELETE `/api/v1/orgs/:orgId/customers/:id`**

---

## 6. Testing

- Backend: use Jest / supertest (`npm run test` in `/backend`)
- Frontend: use Jest / Testing Library (`npm run test` in `/frontend`)
- At least one test for each CRUD API and authentication route is included.

---

## 7. Scripts

- **Build & Start via Docker Compose:**  
  `docker-compose up --build`
- **Run Backend Locally:**  
  ```
  cd backend
  npm install
  npm run dev
  ```
- **Run Frontend Locally:**  
  ```
  cd frontend
  npm install
  npm run dev
  ```
- **Run Tests:**  
  In `/backend` or `/frontend`, `npm test`

---

## 8. Folder Structure

```
/backend    # Express.js API
/frontend   # Next.js app
/docker-compose.yml
```

---

## 9. Screen Recording

A link or attachment to a screen recording demonstrating:
- Authentication and login
- Organisation CRUD
- Admin/customer CRUD
- Protected API and error handling
- Live video link - [https://drive.google.com/file/d/1ocPkyyhpWOQrwiPJgy50zuG2JoBGyXBP/view?usp=sharing]
---

## 10. Example Environment Variables

`.env.example` for backend:
```
PORT=5000
JWT_SECRET=your_jwt_secret
DATABASE_URL=postgres://user:password@host:5432/dbname
```

`.env.example` for frontend:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

---

**For further details, see code comments and API docs.**
```
***
