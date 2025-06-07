# Faktur API - Postman cURL Import Commands

Below are cURL commands for all endpoints in the Faktur API. You can import these into Postman by:
1. Copy a cURL command
2. In Postman, click "Import" > "Raw text" > Paste the cURL command > "Continue" > "Import"

## Authentication

### Register User
```bash
curl -X POST \
  'https://stechno.up.railway.app/api/auth/register' \
  -H 'Content-Type: application/json' \
  -d '{
    "id": "USR001",
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "role": "staff"
}'
```

### Login
```bash
curl -X POST \
  'https://stechno.up.railway.app/api/auth/login' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "test@example.com",
    "password": "password123"
}'
```

## Products

### Get All Products
```bash
curl -X GET \
  'https://stechno.up.railway.app/api/product' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE'
```

### Get Product by ID
```bash
curl -X GET \
  'https://stechno.up.railway.app/api/product/PRODUCT_ID_HERE' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE'
```

### Get Products by Category
```bash
curl -X GET \
  'https://stechno.up.railway.app/api/product/category/CATEGORY_ID_HERE' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE'
```

### Get Products by Supplier
```bash
curl -X GET \
  'https://stechno.up.railway.app/api/product/supplier/SUPPLIER_ID_HERE' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE'
```

### Get Product by Product Code
```bash
curl -X GET \
  'https://stechno.up.railway.app/api/product/product_code/PRODUCT_CODE_HERE' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE'
```

### Create Product
```bash
curl -X POST \
  'https://stechno.up.railway.app/api/product' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE' \
  -d '{
    "produk_kode": "PRD001",
    "nama": "Product Name",
    "deskripsi": "Product Description",
    "harga": 100000,
    "stock": 50,
    "category_id": "CAT001",
    "supplier_id": "SUP00000001"
}'
```

### Update Product
```bash
curl -X PUT \
  'https://stechno.up.railway.app/api/product/PRODUCT_ID_HERE' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE' \
  -d '{
    "produk_kode": "PRD001",
    "nama": "Updated Product Name",
    "deskripsi": "Updated Product Description",
    "harga": 120000,
    "stock": 45,
    "category_id": "CAT001",
    "supplier_id": "SUP00000001"
}'
```

### Delete Product
```bash
curl -X DELETE \
  'https://stechno.up.railway.app/api/product/PRODUCT_ID_HERE' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE'
```

## Categories

### Get All Categories
```bash
curl -X GET \
  'https://stechno.up.railway.app/api/categories' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE'
```

### Get Category by ID
```bash
curl -X GET \
  'https://stechno.up.railway.app/api/categories/CATEGORY_ID_HERE' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE'
```

### Create Category
```bash
curl -X POST \
  'https://stechno.up.railway.app/api/categories' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE' \
  -d '{
    "id": "CAT003",
    "nama": "New Category"
}'
```

### Update Category
```bash
curl -X PUT \
  'https://stechno.up.railway.app/api/categories/CATEGORY_ID_HERE' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE' \
  -d '{
    "nama": "Updated Category Name"
}'
```

### Delete Category
```bash
curl -X DELETE \
  'https://stechno.up.railway.app/api/categories/CATEGORY_ID_HERE' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE'
```

## Suppliers

### Get All Suppliers
```bash
curl -X GET \
  'https://stechno.up.railway.app/api/suppliers' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE'
```

### Get Supplier by ID
```bash
curl -X GET \
  'https://stechno.up.railway.app/api/suppliers/SUPPLIER_ID_HERE' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE'
```

### Create Supplier
```bash
curl -X POST \
  'https://stechno.up.railway.app/api/suppliers' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE' \
  -d '{
    "nama": "Supplier Name",
    "contact_info": "contact@supplier.com",
    "address": "Supplier Address"
}'
```

### Update Supplier
```bash
curl -X PUT \
  'https://stechno.up.railway.app/api/suppliers/SUPPLIER_ID_HERE' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE' \
  -d '{
    "nama": "Updated Supplier Name",
    "contact_info": "updated@supplier.com",
    "address": "Updated Supplier Address"
}'
```

### Delete Supplier
```bash
curl -X DELETE \
  'https://stechno.up.railway.app/api/suppliers/SUPPLIER_ID_HERE' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE'
```

## Transactions

### Get All Transactions
```bash
curl -X GET \
  'https://stechno.up.railway.app/api/transaksi' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE'
```

### Get Transaction by ID
```bash
curl -X GET \
  'https://stechno.up.railway.app/api/transaksi/TRANSACTION_ID_HERE' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE'
```

### Create Transaction
```bash
curl -X POST \
  'https://stechno.up.railway.app/api/transaksi' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE' \
  -d '{
    "tanggal": "2023-11-15",
    "total_amount": 500000,
    "status": "completed",
    "user_id": "USR001"
}'
```

### Update Transaction
```bash
curl -X PUT \
  'https://stechno.up.railway.app/api/transaksi/TRANSACTION_ID_HERE' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE' \
  -d '{
    "tanggal": "2023-11-16",
    "total_amount": 550000,
    "status": "completed",
    "user_id": "USR001"
}'
```

### Delete Transaction
```bash
curl -X DELETE \
  'https://stechno.up.railway.app/api/transaksi/TRANSACTION_ID_HERE' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE'
```

## Transaction Details

### Get All Transaction Details
```bash
curl -X GET \
  'https://stechno.up.railway.app/api/detail_transaksi' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE'
```

### Get Transaction Detail by ID
```bash
curl -X GET \
  'https://stechno.up.railway.app/api/detail_transaksi/DETAIL_ID_HERE' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE'
```

### Create Transaction Detail
```bash
curl -X POST \
  'https://stechno.up.railway.app/api/detail_transaksi' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE' \
  -d '{
    "transaction_id": "TRX00000001",
    "product_id": "PRODUCT_ID_HERE",
    "quantity": 5,
    "price": 100000
}'
```

### Update Transaction Detail
```bash
curl -X PUT \
  'https://stechno.up.railway.app/api/detail_transaksi/DETAIL_ID_HERE' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE' \
  -d '{
    "transaction_id": "TRX00000001",
    "product_id": "PRODUCT_ID_HERE",
    "quantity": 7,
    "price": 100000
}'
```

### Delete Transaction Detail
```bash
curl -X DELETE \
  'https://stechno.up.railway.app/api/detail_transaksi/DETAIL_ID_HERE' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE'
```

## Users

### Get All Users
```bash
curl -X GET \
  'https://stechno.up.railway.app/api/users' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE'
```

### Get User by ID
```bash
curl -X GET \
  'https://stechno.up.railway.app/api/users/USER_ID_HERE' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE'
```

## Notes for Postman Import

1. After importing these cURL commands, you'll need to replace placeholders like `YOUR_TOKEN_HERE`, `PRODUCT_ID_HERE`, etc. with actual values.

2. For authentication endpoints, after successful login, copy the token from the response and use it to replace `YOUR_TOKEN_HERE` in other requests.

3. You can organize these endpoints into folders in Postman for better management:
   - Authentication
   - Products
   - Categories
   - Suppliers
   - Transactions
   - Transaction Details
   - Users

4. Consider creating environment variables in Postman to store values like:
   - `base_url`: https://stechno.up.railway.app
   - `token`: Your authentication token
   - Various IDs for resources

5. You can then reference these variables in your requests using `{{variable_name}}` syntax.
