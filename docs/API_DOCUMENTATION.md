# ReviewFlow AI — API Documentation

Base URL: `http://localhost:8000/api/v1`

## Authentication Endpoints

### 1. Sign Up
- **POST** `/auth/signup`
- **Body**:
  ```json
  {
    "name": "User Name",
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```

### 2. Login
- **POST** `/auth/login`
- **Body**:
  ```json
  {
    "email": "demo@reviewflow.ai",
    "password": "demo123"
  }
  ```

---

## Product Endpoints

### 1. Extract Product URL
- **POST** `/products/extract`
- **Body**:
  ```json
  {
    "url": "https://example.com/product/wireless-headphones"
  }
  ```

### 2. Update Product Profile
- **PUT** `/products/{product_id}`

---

## Job & Generation Endpoints

### 1. Create Job
- **POST** `/jobs`

### 2. Configure Languages & Distribution
- **POST** `/jobs/{job_id}/languages`
- **Body**:
  ```json
  {
    "job_id": "job-101",
    "languages": [
      { "language": "English", "language_code": "en", "script": "Standard", "quantity": 50 },
      { "language": "Hindi", "language_code": "hi", "script": "Devanagari", "quantity": 30 },
      { "language": "Hinglish", "language_code": "hi-en", "script": "Hinglish", "quantity": 20 }
    ]
  }
  ```

---

## CSV & ZIP Export Endpoints

### 1. Generate Export
- **POST** `/exports/generate`
- **Body**:
  ```json
  {
    "job_id": "job-101",
    "export_mode": "both"
  }
  ```
