
# Kullanıcı Endpointleri
POST /users
Body:
{
  "firstname": "John",
  "lastname": "Doe",
  "username": "johndoe",
  "password": "securepassword"
}

GET /users/:id
Params:
- id: number (Kullanıcı ID'si)

GET /users
(No params, tüm kullanıcıları getirir)

GET /users/:id/accounts 
Params:
- userId: number (Belirli bir kullanıcının hesaplarını getirir)


PUT /users/:id
Params:
- id: number (Kullanıcı ID'si)
Body:
{
  "firstname": "John",
  "lastname": "Doe",
  "username": "johndoe"
}

DELETE /users/:id
Params:
- id: number (Kullanıcı ID'si)

GET /users/:userId/transactions //yap
Params:
- userId: number (Belirli bir kullanıcının yaptığı işlemleri getirir)


# Hesap (Account) Endpointleri
POST /accounts
Body:
{
  "name": "My Account",
  "ownerId": 1,
  "balance": 1000.50
}

POST /accounts/:id/deposit
Body:{
  "amount": 500.00
}

POST /accounts/:id/withdraw
Body:{
  "amount": 500.00
}

GET /accounts/:id
Params:
- id: number (Hesap ID'si)


PUT /accounts/:id
Params:
- id: number (Hesap ID'si)
Body:
{
  "name": "Updated Account Name"
}

DELETE /accounts/:id
Params:
- id: number (Hesap ID'si)

GET /accounts/:accountId/transactions //yap endpointi
Params:
- accountId: number (Belirli bir hesabın işlemlerini getirir)


# İşlem (Transaction) Endpointleri
POST /transactions
Body:
Params:
- id: number (İşlem ID'si)

{
  "fromAccountId": 1,
  "toAccountId": 2,
  "amount": 250.75,
}

GET /transactions/:id
Params:
- id: number (İşlem ID'si)




```