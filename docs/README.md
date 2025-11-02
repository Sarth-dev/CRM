
---

### 📘 **File path:**

`api-docs/README.md`

---

```markdown
# 🧩 CRM API Documentation

This document provides an overview of all available API endpoints, authentication details, and sample requests for the CRM application.

---

## 🔐 Authentication

All protected routes require authentication using a valid JWT token.

**Login Endpoint:**
```

POST /api/v1/auth/login

````

**Request Body:**
```json
{
  "email": "superadmin@example.com",
  "password": "password123"
}
````

**Response:**

```json
{
  "success": true,
  "token": "<JWT_TOKEN>",
  "user": {
    "id": "1",
    "name": "Super Admin",
    "email": "superadmin@example.com",
    "role": "admin"
  }
}
```

---

## 👤 Users

### 1. Create User

```
POST /api/v1/users
```

**Protected:** Yes (Admin only)

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

### 2. Get All Users

```
GET /api/v1/users
```

**Protected:** Yes
**Response:** Returns a list of all users.

### 3. Get User by ID

```
GET /api/v1/users/:id
```

### 4. Update User

```
PUT /api/v1/users/:id
```

### 5. Delete User

```
DELETE /api/v1/users/:id
```

---

## 🧾 Customers

### 1. Create Customer

```
POST /api/v1/customers
```

### 2. Get All Customers

```
GET /api/v1/customers
```

### 3. Update Customer

```
PUT /api/v1/customers/:id
```

### 4. Delete Customer

```
DELETE /api/v1/customers/:id
```

---

## 📦 Projects

### 1. Create Project

```
POST /api/v1/projects
```

### 2. Get All Projects

```
GET /api/v1/projects
```

### 3. Update Project

```
PUT /api/v1/projects/:id
```

### 4. Delete Project

```
DELETE /api/v1/projects/:id
```

---

## ⚙️ Error Responses

**Example:**

```json
{
  "success": false,
  "message": "Unauthorized access"
}
```

---

## 🧰 Default Credentials

| Role        | Email                                                   | Password    |
| ----------- | ------------------------------------------------------- | ----------- |
| Super Admin | [superadmin@example.com](mailto:superadmin@example.com) | password123 |

---

## 📄 Postman Collection

You can find the Postman collection in this folder:
`CRM_API_Collection.postman_collection.json`

---

## 🐳 Docker Setup

All services (backend, frontend, and database) can be run via:

```bash
docker-compose up --build
```

---

## 👨‍💻 Author

**Sarthak Kale**
[GitHub Profile](https://github.com/Sarth-dev)

```

---

Would you like me to also give you a **matching Postman collection JSON** (with the same routes) to upload alongside this file? That would make your API docs folder fully complete for submission.
```
