# fmydfeedb

## Run locally

```bash
npm install
npm run dev
```

App runs on `http://localhost:3000`.

## Admin auth (JWT)

### Login to get a token

`POST /api/admin/login` returns:

```json
{ "token": "...", "user": { "id": "...", "email": "...", "role": "admin" } }
```

Example (PowerShell):

```powershell
$body = @{ email="admin@example.com"; password="password123" } | ConvertTo-Json
$login = Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/admin/login -ContentType application/json -Body $body
$token = $login.token
```

### Use the token in the `Authorization` header

For protected admin routes (example `GET /api/admin/dashboard`):

```powershell
Invoke-RestMethod -Method Get -Uri http://localhost:3000/api/admin/dashboard -Headers @{ Authorization = "Bearer $token" }
```

### Admin UI behavior

- Successful login stores the JWT in `localStorage` as `admin_token`.
- Visiting `/admin/dashboard` without a valid `admin_token` sends you to `/admin/login`.

## API smoke testing

Start the dev server, then in another terminal:

```powershell
node fmydfeedb/scripts/test-api-routes.mjs
```

To also test admin-protected routes, set credentials:

```powershell
$env:ADMIN_EMAIL="admin@example.com"
$env:ADMIN_PASSWORD="password123"
node fmydfeedb/scripts/test-api-routes.mjs
```

