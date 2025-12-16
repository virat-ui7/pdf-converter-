# FileConverter API Documentation

Complete API reference for FileConverter platform.

## Base URL

```
Production: https://api.fileconverter.com
Staging: https://staging-api.fileconverter.com
```

## Authentication

All API requests (except public endpoints) require authentication using an API key.

### API Key Authentication

Include your API key in the request header:

```
X-API-Key: your_api_key_here
```

### Getting an API Key

1. Sign up for a Professional or Enterprise plan
2. Go to Dashboard → API Settings
3. Generate a new API key
4. Store it securely (it won't be shown again)

### Rate Limits

Rate limits vary by subscription tier:

- **Free:** 10 requests/minute
- **Starter:** 50 requests/minute
- **Professional:** 200 requests/minute
- **Enterprise:** 1000 requests/minute

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 200
X-RateLimit-Remaining: 195
X-RateLimit-Reset: 1640995200
```

## Endpoints

### Public Endpoints (No Auth Required)

#### GET /api/formats

Get all supported file formats.

**Response:**
```json
{
  "documents": [...],
  "spreadsheets": [...],
  "presentations": [...],
  "images": [...]
}
```

#### GET /api/formats/:category

Get formats by category.

**Parameters:**
- `category` (path): `document`, `spreadsheet`, `presentation`, or `image`

**Response:**
```json
{
  "category": "document",
  "formats": [...]
}
```

#### GET /api/health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-15T10:30:00Z"
}
```

### Authentication Endpoints

#### POST /api/auth/register

Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "secure_password",
  "fullName": "John Doe"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "userId": "uuid"
}
```

#### POST /api/auth/login

Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "secure_password"
}
```

**Response:**
```json
{
  "token": "jwt_token",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "tier": "free"
  }
}
```

#### POST /api/auth/forgot-password

Request password reset.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "Reset link sent to email"
}
```

#### GET /api/auth/me

Get current user information.

**Headers:**
- `Authorization: Bearer {token}` or `X-API-Key: {api_key}`

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "fullName": "John Doe",
  "tier": "professional",
  "conversionsUsed": 150,
  "conversionsLimit": 1000
}
```

### Conversion Endpoints

#### POST /api/convert

Upload and convert a file.

**Headers:**
- `X-API-Key: {api_key}` (or `Authorization: Bearer {token}`)

**Request Body (FormData):**
```
file: [File]
sourceFormat: "docx"
targetFormat: "pdf"
quality: "high" (optional)
compression: "medium" (optional)
```

**Response:**
```json
{
  "conversionId": "uuid",
  "status": "pending",
  "estimatedTime": 30
}
```

**Error Responses:**
- `400 Bad Request`: Invalid format or file
- `413 Payload Too Large`: File exceeds tier limit
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

#### GET /api/conversions/:id

Get conversion status.

**Headers:**
- `X-API-Key: {api_key}`

**Response:**
```json
{
  "id": "uuid",
  "status": "completed",
  "originalFormat": "docx",
  "targetFormat": "pdf",
  "originalFileUrl": "https://...",
  "convertedFileUrl": "https://...",
  "createdAt": "2025-12-15T10:30:00Z",
  "completedAt": "2025-12-15T10:30:30Z"
}
```

**Status Values:**
- `pending`: Conversion queued
- `processing`: Conversion in progress
- `completed`: Conversion successful
- `failed`: Conversion failed

#### GET /api/conversions/history

Get conversion history.

**Headers:**
- `X-API-Key: {api_key}`

**Query Parameters:**
- `limit` (optional, default: 20): Number of results
- `offset` (optional, default: 0): Pagination offset
- `format` (optional): Filter by format

**Response:**
```json
{
  "conversions": [...],
  "total": 150,
  "hasMore": true
}
```

#### DELETE /api/conversions/:id

Delete a conversion.

**Headers:**
- `X-API-Key: {api_key}`

**Response:**
```
204 No Content
```

### User Endpoints

#### GET /api/users/profile

Get user profile.

**Headers:**
- `X-API-Key: {api_key}`

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "fullName": "John Doe",
  "tier": "professional",
  "conversionsUsed": 150,
  "conversionsLimit": 1000
}
```

#### PUT /api/users/profile

Update user profile.

**Headers:**
- `X-API-Key: {api_key}`

**Request Body:**
```json
{
  "fullName": "John Doe Updated"
}
```

**Response:**
```json
{
  "message": "Profile updated",
  "user": {...}
}
```

### API Key Management

#### GET /api/api-keys

List API keys.

**Headers:**
- `X-API-Key: {api_key}`

**Response:**
```json
{
  "keys": [
    {
      "id": "uuid",
      "name": "Production Key",
      "createdAt": "2025-12-15T10:30:00Z",
      "lastUsedAt": "2025-12-15T11:00:00Z"
    }
  ]
}
```

#### POST /api/api-keys

Create new API key.

**Headers:**
- `X-API-Key: {api_key}`

**Request Body:**
```json
{
  "name": "New API Key"
}
```

**Response:**
```json
{
  "id": "uuid",
  "key": "fc_live_...", // Only shown once
  "name": "New API Key",
  "createdAt": "2025-12-15T10:30:00Z"
}
```

#### DELETE /api/api-keys/:id

Delete API key.

**Headers:**
- `X-API-Key: {api_key}`

**Response:**
```
204 No Content
```

### Webhook Endpoints

#### GET /api/webhooks

List webhooks.

**Headers:**
- `X-API-Key: {api_key}`

**Response:**
```json
{
  "webhooks": [
    {
      "id": "uuid",
      "url": "https://example.com/webhook",
      "events": ["conversion.completed"],
      "status": "active",
      "lastTriggered": "2025-12-15T10:30:00Z"
    }
  ]
}
```

#### POST /api/webhooks

Create webhook.

**Headers:**
- `X-API-Key: {api_key}`

**Request Body:**
```json
{
  "url": "https://example.com/webhook",
  "events": ["conversion.completed", "conversion.failed"],
  "description": "Production webhook"
}
```

**Response:**
```json
{
  "id": "uuid",
  "url": "https://example.com/webhook",
  "events": ["conversion.completed", "conversion.failed"],
  "status": "active"
}
```

#### DELETE /api/webhooks/:id

Delete webhook.

**Headers:**
- `X-API-Key: {api_key}`

**Response:**
```
204 No Content
```

## Error Codes

### 400 Bad Request
Invalid request format or parameters.

```json
{
  "error": "Invalid format",
  "details": "Source format 'xyz' is not supported"
}
```

### 401 Unauthorized
Missing or invalid API key.

```json
{
  "error": "Unauthorized",
  "message": "Invalid API key"
}
```

### 402 Payment Required
Quota exceeded or subscription required.

```json
{
  "error": "Quota exceeded",
  "message": "You have reached your monthly conversion limit"
}
```

### 404 Not Found
Resource not found.

```json
{
  "error": "Not found",
  "message": "Conversion with ID 'xyz' not found"
}
```

### 413 Payload Too Large
File exceeds tier limit.

```json
{
  "error": "File size exceeds limit",
  "fileSize": 150000000,
  "maxSize": 100000000,
  "tier": "free"
}
```

### 429 Too Many Requests
Rate limit exceeded.

```json
{
  "error": "Rate limit exceeded",
  "message": "Too many requests. Please try again later.",
  "retryAfter": 60
}
```

### 500 Internal Server Error
Server error.

```json
{
  "error": "Internal server error",
  "message": "An error occurred processing your request"
}
```

## Webhooks

Webhooks allow you to receive real-time notifications about conversion events.

### Webhook Events

- `conversion.started`: Conversion job started
- `conversion.completed`: Conversion completed successfully
- `conversion.failed`: Conversion failed

### Webhook Payload

```json
{
  "event": "conversion.completed",
  "timestamp": "2025-12-15T10:30:00Z",
  "data": {
    "conversionId": "uuid",
    "status": "completed",
    "originalFormat": "docx",
    "targetFormat": "pdf",
    "convertedFileUrl": "https://..."
  }
}
```

### Webhook Security

Webhooks include a signature header for verification:

```
X-Webhook-Signature: sha256=...
```

Verify the signature using your webhook secret.

### Retry Logic

Failed webhook deliveries are retried:
- 1st retry: 1 minute
- 2nd retry: 5 minutes
- 3rd retry: 15 minutes
- 4th retry: 1 hour

After 4 retries, the webhook is marked as failed.

## Code Examples

### cURL

```bash
# Convert file
curl -X POST https://api.fileconverter.com/api/convert \
  -H "X-API-Key: your_api_key" \
  -F "file=@document.docx" \
  -F "sourceFormat=docx" \
  -F "targetFormat=pdf"

# Get conversion status
curl https://api.fileconverter.com/api/conversions/{id} \
  -H "X-API-Key: your_api_key"
```

### JavaScript (fetch)

```javascript
// Convert file
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('sourceFormat', 'docx');
formData.append('targetFormat', 'pdf');

const response = await fetch('https://api.fileconverter.com/api/convert', {
  method: 'POST',
  headers: {
    'X-API-Key': 'your_api_key'
  },
  body: formData
});

const result = await response.json();
```

### Python (requests)

```python
import requests

# Convert file
url = 'https://api.fileconverter.com/api/convert'
headers = {'X-API-Key': 'your_api_key'}
files = {'file': open('document.docx', 'rb')}
data = {
    'sourceFormat': 'docx',
    'targetFormat': 'pdf'
}

response = requests.post(url, headers=headers, files=files, data=data)
result = response.json()
```

## Support

For API support:
- **Documentation:** [docs.fileconverter.com/api](/docs/api)
- **Support:** [support.fileconverter.com](/support/contact)
- **Email:** api-support@fileconverter.com

---

**Last Updated:** 2025-12-15  
**API Version:** 1.0

