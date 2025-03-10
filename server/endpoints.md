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

-   **Headers**: Нет
-   **Body**: Нет

### **Response**

-   **Status Code**: `200 OK`
-   **Body**:

    ```json
    [
      {
        "ID": 1,  // тут не объебитесь, ID КАПСОМ
        "CreatedAt": "2023-08-20T12:34:56.789Z",
        "UpdatedAt": "2023-08-20T12:34:56.789Z",
        "DeletedAt": null,
        "name": "Product Name",
        "price": 99.99,
        "quantity": 10,
        "variety": "Electronics",
        "characteristics": "black",
        "img_path": "../client/public/uploads/image.jpg" // да, тут тоже прикол
        // мне просто впадлу менять на сервере путь для фронта
      },
      {
        ...
      }
    ]
    ```

-   **Status Code**: `500 Internal Server Error`

-   **Body**:

    ```json
    {
        "error": "Не удалось получить все продукты"
    }
    ```

---

## 2. Получение продукта по ID

### **Endpoint**

`GET /products/:id`

### **Description**

Получить информацию о продукте по его ID.

### **Request**

-   **Headers**: Нет
-   **Path Parameters**:
    -   `ID` (integer): ID продукта
-   **Body**: Нет

### **Response**

-   **Status Code**: `200 OK`
-   **Body**:
    ```json
    {
        "ID": 1,
        "CreatedAt": "2023-08-20T12:34:56.789Z",
        "UpdatedAt": "2023-08-20T12:34:56.789Z",
        "DeletedAt": null,
        "name": "Product Name",
        "price": 99.99,
        "quantity": 10,
        "variety": "Electronics",
        "characteristics": "black",
        "img_path": "../client/public/uploads/image.jpg"
    }
    ```
-   **Status Code**: `400 Bad Request`
-   **Body**:

    ```json
    {
        "error": "Неверный формат ID"
    }
    ```

-   **Status Code**: `404 Not Found`
-   **Body**:
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

-   **Headers**: Нет
-   **Form Data**:
    -   `product_image` (file): Изображение продукта
    -   `name` (string): Название продукта
    -   `price` (float): Цена продукта
    -   `quantity` (integer): Количество продукта
    -   `variety` (string): Вид продукта
    -   `characteristics` (string): Характеристики продукта

### **Response**

-   **Status Code**: `201 Created`
-   **Body**:
    ```json
    {
        "ID": 1,
        "name": "Product Name",
        "price": 99.99,
        "quantity": 10,
        "variety": "Electronics",
        "characteristics": "black",
        "img_path": "/path/to/image.jpg"
    }
    ```
-   **Status Code**: `400 Bad Request`
-   **Body**:

    ```json
    {
        "error": "Неверный формат продукта"
    }
    ```

-   **Status Code**: `500 Internal Server Error`
-   **Body**:

    ```json
    {
        "error": "Файл не найден"
    }
    ```

-   **Status Code**: `500 Internal Server Error`
-   **Body**:
    ```json
    {
        "error": "Не удалось создать продукт: " + err.Error()
    }
    ```

---

## 4. Обновление продукта

### **Endpoint**

`PATCH /products`

### **Description**

Обновить информацию о продукте с возможностью загрузки нового изображения.

### **Request**

-   **Headers**: Нет
-   **Form Data**:
    -   `product_image` (file): Новое изображение продукта (необязательно)
    -   `ID` (uint): ID продукта
    -   `name` (string): Новое название продукта
    -   `price` (float): Новая цена продукта
    -   `quantity` (integer): Новое количество продукта
    -   `variety` (string): Новый вид продукта
    -   `characteristics` (json): Новые характеристики продукта
    -   `ImgPath` (string): Старое изображение продукта

### **Response**

-   **Status Code**: `200 OK`
-   **Body**:

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

-   **Status Code**: `400 Bad Request`
-   **Body**:

    ```json
    {
        "error": "ID продукта не указан"
    }
    ```

-   **Status Code**: `400 Bad Request`
-   **Body**:
    ```json
    {
        "error": "Неверный формат данных"
    }
    ```
-   **Status Code**: `500 Internal Server Error`
-   **Body**:
    ```json
    {
        "error": "Не удалось обновить продукт: " + err.Error()
    }
    ```

---

## 13. Удаление продукта

### **Endpoint**

`DELETE /products/:id`

### **Description**

Удалить продукт по его ID.

### **Request**

-   **Headers**: Нет
-   **Path Parameters**:
    -   `ID` (integer): ID продукта
-   **Body**: Нет

### **Response**

-   **Status Code**: `204 No Content`
-   **Body**: Нет
-   **Status Code**: `404 Not Found`
-   **Body**:
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

-   **Headers**: `Content-Type: application/json`
-   **Path Parameters**:
    -   `ID` (integer): ID продукта
-   **Body**:
    ```json
    {
        "quantity": 15
    }
    ```

### **Response**

-   **Status Code**: `200 OK`
-   **Body**:
    ```json
    {
        "message": "Количество успешно обновлено"
    }
    ```
-   **Status Code**: `400 Bad Request`
-   **Body**:
    ```json
    {
        "error": "Неверный формат данных"
    }
    ```

---

## 15. Обновление цены продукта

### **Endpoint**

`PATCH /products/:id/price`

### **Description**

Обновить цену продукта.

### **Request**

-   **Headers**: `Content-Type: application/json`
-   **Path Parameters**:
    -   `ID` (integer): ID продукта
-   **Body**:
    ```json
    {
        "price": 15.0
    }
    ```

### **Response**

-   **Status Code**: `200 OK`
-   **Body**:
    ```json
    {
        "message": "Цена продукта успешно обновлена"
    }
    ```
-   **Status Code**: `400 Bad Request`
-   **Body**:
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

-   **Headers**: Нет
-   **Query Parameters**:
    -   `email` (string): Логин клиента
    -   `password` (string): Пароль клиента

### **Response**

-   **Status Code**: `200 OK`
-   **Body**:
    ```json
    {
        "token": "jwt_token_here",
        "role": "customer"
    }
    ```
-   **Status Code**: `401 Unauthorized`
-   **Body**:
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

-   **Headers**: `Content-Type: application/json`
-   **Body**:
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

-   **Status Code**: `201 Created`
-   **Body**:
    ```json
    {
        "token": "jwt_token_here",
        "role": "customer"
    }
    ```
-   **Status Code**: `400 Bad Request`
-   **Body**:
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

-   **Headers**: `Content-Type: application/json`
-   **Body**:
    ```json
    {
        "login": "worker_login",
        "password": "worker_password"
    }
    ```

### **Response**

-   **Status Code**: `200 OK`
-   **Body**:
    ```json
    {
      "token": "jwt_token_here",
      "role": "worker_role (admin, storage, intern (сейчас пока так, интерн это низший лох если че))
    }
    ```
-   **Status Code**: `401 Unauthorized`
-   **Body**:
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

-   **Headers**: Нет
-   **Body**: Нет

### **Response**

-   **Status Code**: `200 OK`
-   **Body**:
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

-   **Headers**: Нет
-   **Path Parameters**:
    -   `id` (integer): ID работника
-   **Body**: Нет

### **Response**

-   **Status Code**: `200 OK`
-   **Body**:
    ```json
    {
        "id": 1,
        "name": "Worker Name",
        "role": "admin",
        "login": "worker_login",
        "password": "passwd"
    }
    ```
-   **Status Code**: `404 Not Found`
-   **Body**:
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

-   **Headers**: `Content-Type: application/json`
-   **Body**:
    ```json
    {
        "name": "Worker Name",
        "role": "admin",
        "login": "worker_login",
        "password": "worker_password"
    }
    ```

### **Response**

-   **Status Code**: `201 Created`
-   **Body**:
    ```json
    {
        "message": "Работник успешно создан"
    }
    ```
-   **Status Code**: `400 Bad Request`
-   **Body**:
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

-   **Headers**: `Content-Type: application/json`
-   **Body**:
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

-   **Status Code**: `200 OK`
-   **Body**:
    ```json
    {
        "message": "Работник успешно обновлен"
    }
    ```
-   **Status Code**: `400 Bad Request`
-   **Body**:
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

-   **Headers**: Нет
-   **Path Parameters**:
    -   `id` (integer): ID работника
-   **Body**: Нет

### **Response**

-   **Status Code**: `204 No Content`
-   **Body**: Нет
-   **Status Code**: `404 Not Found`
-   **Body**:
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

-   **Headers**:
    -   `Authorization: Bearer <JWT_TOKEN>`

### **Response**

-   **Status Code**: `200 OK`
-   **Body**:
    ```
    world
    ```
-   **Status Code**: `401 Unauthorized`
-   **Body**:
    ```json
    {
        "error": "Неавторизованный доступ"
    }
    ```
-   **Status Code**: `403 Forbidden`
-   **Body**:
    ```json
    {
        "error": "Недостаточно прав"
    }
    ```

# Заказы

## 1. Получение всех заказов

### **Endpoint**

`GET /orders`

### **Description**

Получить список всех заказов.

### **Request**

-   **Headers**: Нет
-   **Body**: Нет

### **Response**

-   **Status Code**: `200 OK`
-   **Body**:

    ```json
    [
        {
            "ID": 1,
            "order_id_unique": 1741265386758508500,
            "address": "address",
            "delivery_date": "2023-10-25T17:30:00+03:00",
            "payment_terms": "prepayment",
            "status": "in_processing",
            "payment_time": "0001-01-01T00:00:00Z",
            "customer_id": 1,
            "total_price": 3000,
            "order_content": [
                {
                    "ID": 7,
                    "product_id": 1,
                    "order_id": 4,
                    "quantity": 1,
                    "price": 69.69,
                    "total_product_price": 1000,
                    "product": {
                        "ID": 1,
                        "name": "доска",
                        "price": 123,
                        "quantity": 123,
                        "variety": "доска",
                        "characteristics": "доска",
                        "img_path": "..\\client\\public\\uploads\\1741186597689753400.jpg"
                    }
                },
                {
                    "ID": 8,
                    "product_id": 2,
                    "order_id": 4,
                    "quantity": 1,
                    "price": 13.37,
                    "total_product_price": 2000,
                    "product": {
                        "ID": 2,
                        "name": "гвоздь",
                        "price": 123,
                        "quantity": 123,
                        "variety": "гвоздь",
                        "characteristics": "гвоздь",
                        "img_path": "..\\client\\public\\uploads\\1741186617066215000.gif"
                    }
                }
            ]
        }
    ]
    ```

-   **Status Code**: `500 Internal Server Error`

-   **Body**:

    ```json
    {
        "error": "Не удалось получить все заказы"
    }
    ```

---

## 2. Получение заказа по ID

### **Endpoint**

`GET /orders/:id`

### **Description**

Получить заказ по ID.

### **Request**

-   **Path Parameters**:
    -   `id` (integer): ID заказа
-   **Headers**: Нет
-   **Body**: Нет

### **Response**

-   **Status Code**: `200 OK`
-   **Body**:

    ```json
    {
        "ID": 1,
        "order_id_unique": 1741265386758508500,
        "address": "address",
        "delivery_date": "2023-10-25T17:30:00+03:00",
        "payment_terms": "prepayment",
        "status": "in_processing",
        "payment_time": "0001-01-01T00:00:00Z",
        "customer_id": 1,
        "total_price": 3000,
        "order_content": [
            {
                "ID": 7,
                "product_id": 1,
                "order_id": 4,
                "quantity": 1,
                "price": 69.69,
                "total_product_price": 1000,
                "product": {
                    "ID": 1,
                    "name": "доска",
                    "price": 123,
                    "quantity": 123,
                    "variety": "доска",
                    "characteristics": "доска",
                    "img_path": "..\\client\\public\\uploads\\1741186597689753400.jpg"
                }
            },
            {
                "ID": 8,
                "product_id": 2,
                "order_id": 4,
                "quantity": 1,
                "price": 13.37,
                "total_product_price": 2000,
                "product": {
                    "ID": 2,
                    "name": "гвоздь",
                    "price": 123,
                    "quantity": 123,
                    "variety": "гвоздь",
                    "characteristics": "гвоздь",
                    "img_path": "..\\client\\public\\uploads\\1741186617066215000.gif"
                }
            }
        ]
    }
    ```

-   **Status Code**: `500 Internal Server Error`

-   **Body**:

    ```json
    {
        "error": "Не удалось получить заказ"
    }
    ```

---

## 3. Создание заказа

### **Endpoint**

`POST /orders`

### **Description**

Создать заказ авторизованным клиентом

### **Request**

-   **Headers**:
    -   `Authorization`: Токен авторизации (Bearer <token>).
-   **Body**:

```json
{
    "address": "string (обязательно)",
    "delivery_date": "date-time (обязательно) (формат ISO 8601)",
    "payment_terms": "string (обязательно, допустимые значения: prepayment, postpayment, full_payment)",
    "total_price": "число",
    "order_content": [
        {
            "product_id": "integer (обязательно, >=1)",
            "quantity": "integer (обязательно, >=1)",
            "price": "число",
            "total_product_price": "число"
        }
    ]
}
```

### **Response**

-   **Status Code**: `201 Created`
-   **Body**:

    ```json
    { "ID": 123 }
    ```

-   **Status Code**: `500 Internal Server Error`

-   **Body**:

    ```json
    {
        "error": "Не удалось создать"
    }
    ```

---

## 4. Обновление цен в заказе

### **Endpoint**

`PATCH /orders/:id/change-price`

### **Description**

Обновить цены в заказе

### **Request**

-   **Path Parameters**:
    -   `id` (integer): ID заказа
-   **Headers**:
-   **Body**:

```json
{
    "products": [
        {
            "product_id": "integer (обязательно, >=1)",
            "price": "число (обязательно, >=0)",
            "total_product_price": "число (обязательно, >=0)"
        }
    ],
    "total_order_price": "число (обязательно, >=0)"
}
```

### **Response**

-   **Status Code**: `200 OK`
-   **Body**:

    ```json
    { "message": "Цены успешно обновлены" }
    ```

-   **Status Code**: `500 Internal Server Error`

-   **Body**:

    ```json
    {
        "error": "Не удалось обновить"
    }
    ```

---

## 5. Обновление статуса заказа

### **Endpoint**

`PATCH /orders/:id/status`

### **Description**

Изменение статуса заказа

### **Request**

-   **Path Parameters**:
    -   `id` (integer): ID заказа
-   **Headers**:
-   **Body**:

```json
{
    "status": "string (обязательно, допустимые значения: in_processing, awaiting_payment, in_assembly, awaiting_shipment, in_transit, received)"
}
```

### **Response**

-   **Status Code**: `200 OK`
-   **Body**:

    ```json
    { "message": "Статус успешно обновлен" }
    ```

-   **Status Code**: `500 Internal Server Error`

-   **Body**:

    ```json
    {
        "error": "Не удалось обновить"
    }
    ```

---
