
---

# API Documentation

## Base URL

`http://<host>:<port>/api`

---

# Продукты

## 1. Получение всех продуктов

### **Endpoint**
`GET /products`

### **Description**
Получить список всех продуктов.

### **Request**
- **Headers**: Нет
- **Body**: Нет

### **Response**
- **Status Code**: `200 OK`
- **Body**:
  ```json
  [
    {
      "id": 1,
      "name": "Product Name",
      "price": 99.99,
      "quantity": 10,
      "variety": "Electronics",
      "characteristics": "black",
      "img_path": "/path/to/image.jpg"
    }
  ]
  ```

---

## 2. Получение продукта по ID

### **Endpoint**
`GET /products/:id`

### **Description**
Получить информацию о продукте по его ID.

### **Request**
- **Headers**: Нет
- **Path Parameters**:
  - `id` (integer): ID продукта
- **Body**: Нет

### **Response**
- **Status Code**: `200 OK`
- **Body**:
  ```json
  {
    "id": 1,
    "name": "Product Name",
    "price": 99.99,
    "quantity": 10,
    "variety": "Electronics",
    "characteristics": "black",
    "img_path": "/path/to/image.jpg"
  }
  ```
- **Status Code**: `404 Not Found`
- **Body**:
  ```json
  {
    "error": "Продукт не найден"
  }
  ```

---

## 3. Создание продукта

### **Endpoint**
`POST /products`

### **Description**
Создать новый продукт с возможностью загрузки изображения.

### **Request**
- **Headers**: Нет
- **Form Data**:
  - `product_image` (file): Изображение продукта
  - `name` (string): Название продукта
  - `price` (float): Цена продукта
  - `quantity` (integer): Количество продукта
  - `variety` (string): Вид продукта
  - `characteristics` (string): Характеристики продукта

### **Response**
- **Status Code**: `201 Created`
- **Body**:
  ```json
  {
    "id": 1,
    "name": "Product Name",
    "price": 99.99,
    "quantity": 10,
    "variety": "Electronics",
    "characteristics": "black",
    "img_path": "/path/to/image.jpg"
  }
  ```
- **Status Code**: `400 Bad Request`
- **Body**:
  ```json
  {
    "error": "Неверный формат данных"
  }
  ```

---

## 4. Обновление продукта

### **Endpoint**
`PATCH /products`

### **Description**
Обновить информацию о продукте с возможностью загрузки нового изображения.

### **Request**
- **Headers**: Нет
- **Form Data**:
  - `image` (file): Новое изображение продукта (необязательно)
  - `name` (string): Новое название продукта
  - `price` (float): Новая цена продукта
  - `quantity` (integer): Новое количество продукта
  - `variety` (string): Новый вид продукта
  - `characteristics` (json): Новые характеристики продукта
  - `image_path` (string): Старое изображение продукта

### **Response**
- **Status Code**: `200 OK`
- **Body**:
  ```json
  {
    "id": 1,
    "name": "Updated Product Name",
    "price": 199.99,
    "quantity": 5,
    "variety": "Electronics",
    "characteristics": "white",
    "img_path": "/path/to/new_image.jpg"
  }
  ```
- **Status Code**: `400 Bad Request`
- **Body**:
  ```json
  {
    "error": "Неверный формат данных"
  }
  ```

---

## 13. Удаление продукта

### **Endpoint**
`DELETE /products/:id`

### **Description**
Удалить продукт по его ID.

### **Request**
- **Headers**: Нет
- **Path Parameters**:
  - `id` (integer): ID продукта
- **Body**: Нет

### **Response**
- **Status Code**: `204 No Content`
- **Body**: Нет
- **Status Code**: `404 Not Found`
- **Body**:
  ```json
  {
    "error": "Продукт не найден"
  }
  ```

---

## 14. Обновление количества продукта

### **Endpoint**
`PATCH /products/:id/quantity`

### **Description**
Обновить количество продукта.

### **Request**
- **Headers**: `Content-Type: application/json`
- **Path Parameters**:
  - `id` (integer): ID продукта
- **Body**:
  ```json
  {
    "quantity": 15
  }
  ```

### **Response**
- **Status Code**: `200 OK`
- **Body**:
  ```json
  {
    "message": "Количество успешно обновлено"
  }
  ```
- **Status Code**: `400 Bad Request`
- **Body**:
  ```json
  {
    "error": "Неверный формат данных"
  }
  ```

---

# Авторизация и аутентификация

## 1. Вход для клиента

### **Endpoint**
`GET /login-customer`

### **Description**
Аутентификация клиента.

### **Request**
- **Headers**: Нет
- **Query Parameters**:
  - `email` (string): Логин клиента
  - `password` (string): Пароль клиента

### **Response**
- **Status Code**: `200 OK`
- **Body**:
  ```json
  {
    "token": "jwt_token_here",
    "role": "customer"
  }
  ```
- **Status Code**: `401 Unauthorized`
- **Body**:
  ```json
  {
    "error": "Неверный логин или пароль"
  }
  ```

---

## 4. Регистрация клиента

### **Endpoint**
`POST /register`

### **Description**
Регистрация нового клиента.

### **Request**
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "name": "Customer Name",
    "email": "customer_login",
    "password": "customer_password",
    "inn": "123456789012",
    "main_booker": "Booker Name",
    "director": "Director Name",
    "bik": "BIK",
    "payment_number": "payment number",
    "bank": "bank"
  }
  ```

### **Response**
- **Status Code**: `201 Created`
- **Body**:
  ```json
  {
    "token": "jwt_token_here",
    "role": "customer"
  }
  ```
- **Status Code**: `400 Bad Request`
- **Body**:
  ```json
  {
    "error": "Неверный формат данных"
  }
  ```

---

## 5. Вход для работника

### **Endpoint**
`POST /login-worker`

### **Description**
Аутентификация работника.

### **Request**
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "login": "worker_login",
    "password": "worker_password"
  }
  ```

### **Response**
- **Status Code**: `200 OK`
- **Body**:
  ```json
  {
    "token": "jwt_token_here",
    "role": "worker_role (admin, storage, intern (сейчас пока так, интерн это низший лох если че))
  }
  ```
- **Status Code**: `401 Unauthorized`
- **Body**:
  ```json
  {
    "error": "Неверный логин или пароль"
  }
  ```

---

## 6. Получение всех работников

### **Endpoint**
`GET /workers`

### **Description**
Получить список всех работников.

### **Request**
- **Headers**: Нет
- **Body**: Нет

### **Response**
- **Status Code**: `200 OK`
- **Body**:
  ```json
  [
    {
      "id": 1,
      "name": "Worker Name",
      "role": "admin",
      "login": "worker_login",
      "password": "passwd"
    }
  ]
  ```

---

## 7. Получение работника по ID

### **Endpoint**
`GET /workers/:id`

### **Description**
Получить информацию о работнике по его ID.

### **Request**
- **Headers**: Нет
- **Path Parameters**:
  - `id` (integer): ID работника
- **Body**: Нет

### **Response**
- **Status Code**: `200 OK`
- **Body**:
  ```json
  {
    "id": 1,
    "name": "Worker Name",
    "role": "admin",
    "login": "worker_login",
    "password": "passwd"
  }
  ```
- **Status Code**: `404 Not Found`
- **Body**:
  ```json
  {
    "error": "Работник не найден"
  }
  ```

---

## 8. Создание работника

### **Endpoint**
`POST /workers`

### **Description**
Создать нового работника.

### **Request**
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "name": "Worker Name",
    "role": "admin",
    "login": "worker_login",
    "password": "worker_password"
  }
  ```

### **Response**
- **Status Code**: `201 Created`
- **Body**:
  ```json
  {
    "message": "Работник успешно создан"
  }
  ```
- **Status Code**: `400 Bad Request`
- **Body**:
  ```json
  {
    "error": "Неверный формат данных"
  }
  ```

---

## 9. Обновление работника

### **Endpoint**
`PATCH /workers`

### **Description**
Обновить информацию о работнике.

### **Request**
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "id": 1,
    "name": "Updated Worker Name",
    "role": "storage",
    "login": "updated_worker_login",
    "password": "updated_worker_password"
  }
  ```

### **Response**
- **Status Code**: `200 OK`
- **Body**:
  ```json
  {
    "message": "Работник успешно обновлен"
  }
  ```
- **Status Code**: `400 Bad Request`
- **Body**:
  ```json
  {
    "error": "Неверный формат данных"
  }
  ```

---

## 10. Удаление работника

### **Endpoint**
`DELETE /workers/:id`

### **Description**
Удалить работника по его ID.

### **Request**
- **Headers**: Нет
- **Path Parameters**:
  - `id` (integer): ID работника
- **Body**: Нет

### **Response**
- **Status Code**: `204 No Content`
- **Body**: Нет
- **Status Code**: `404 Not Found`
- **Body**:
  ```json
  {
    "error": "Работник не найден"
  }
  ```

---


## 15. Защищенный маршрут (Только для администраторов)

### **Endpoint**
`GET /hello`

### **Description**
Пример защищенного маршрута, доступного только для администраторов.

### **Request**
- **Headers**:
  - `Authorization: Bearer <JWT_TOKEN>`

### **Response**
- **Status Code**: `200 OK`
- **Body**:
  ```
  world
  ```
- **Status Code**: `401 Unauthorized`
- **Body**:
  ```json
  {
    "error": "Неавторизованный доступ"
  }
  ```
- **Status Code**: `403 Forbidden`
- **Body**:
  ```json
  {
    "error": "Недостаточно прав"
  }
  ```
