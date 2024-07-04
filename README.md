# Access Key Management and Token Information Retrieval System

check Task.md for requirments details


## Requirments

- Node.js
- Postgres (or run docke-compose file provided in the project)


## Installation

### setup user-key-management microservice
- install dependencies
```bash
cd user-key-management
npm install
```

- create .env file in user-key-management directory and set up values
```bash
cp .env.example .env
```

- run tests
```bash
npm run test
```

- start the dev server
```bash
npm run start:dev
```

### setup web3-token-info microservice
- install dependencies
```bash
cd web3-token-info
npm install
```
- create .env file in web3-token-info directory and set up values
```bash
cp .env.example .env
```

- run tests
```bash
npm run test
```

- start the dev server
```bash
npm run start:dev
```

## API Documentation
### user-key-management microservice

generate JWT token using the secret key set in the .env file

  - POST /user-key
    - request header
        - Authorization: Bearer {token}
    - request body
    ```json
    {
        "userId":1,
        "rateLimit":5,
        "expiration":"2025-07-02T10:39:15.124Z"
    }
    ```
    - response
    ```json
    {
        "userId": 1,
        "key": "....",
        "rateLimit": 5,
        "expiration": "2025-07-02T10:39:15.124Z",
        "id": 2
    }
    ```
 - GET /user-key
    - request header
        - Authorization: Bearer {token}
    - response
    ```json
    [
        {
            "userId": 1,
            "key": "....",
            "rateLimit": 5,
            "expiration": "2025-07-02T10:39:15.124Z",
            "id": 2
        }
    ]
    ```
 - DELETE /user-key/:id
    - request header
        - Authorization: Bearer {token}
    - response code: 200

### web3-token-info microservice
generate key using the create user-key api

- GET /token
    - request header
     - X-App-Key: {token}
    - response
    ```json
    {
        "id": "123",
        "symbol": "BTC",
        "name": "Bitcoin",
        "platform": {
            "ethereum": "0x123",
            "polygon": "0x456"
        }
    }
    ```
- DELETE /token/:id
    - request header
     - X-App-Key: {token}
    - response code: 200

## Issues
- Delete user-key doesn't work if Api rate limit is reached
