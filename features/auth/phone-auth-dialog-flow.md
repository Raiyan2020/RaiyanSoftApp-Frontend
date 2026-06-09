# Phone Login/Register Dialog Flow

## Source Of Truth

The current backend contract comes from `Raiyan.postman_collection (2).json`.

Relevant endpoints:

- `POST /user/auth/check-phone-found`
- `POST /user/auth/login`
- `POST /user/auth/register`
- `POST /user/auth/verify-otp`

The collection uses `form-data` payloads for these requests, so the frontend sends `FormData`.

## User Flow

1. User enters a phone number.
2. Frontend splits it into `country_code` and local `phone`.
3. Frontend calls `POST /user/auth/check-phone-found`.
4. If the backend says the phone is available, the user is new.
5. New user sees full name and OTP inputs on the same screen.
6. New user enters full name and continues.
7. Frontend calls `POST /user/auth/register`, which sends OTP.
8. New user enters OTP on the same screen.
8. If the backend says the phone is already registered, the user is existing.
9. Frontend calls `POST /user/auth/login`, which sends OTP.
10. Existing user enters OTP only.
11. Frontend calls `POST /user/auth/verify-otp`.
12. Backend returns user and token.
13. Frontend stores the user session and redirects to the intended path or `/home`.

## Endpoint Contracts

### Check Phone

```http
POST /user/auth/check-phone-found
```

Request form-data:

- `country_code`: required, example `+20`
- `phone`: required local number, example `1001234564`

Collection responses:

- `200`: phone is available, new user.
- `422`: phone is already registered, existing user.

### Existing User Login OTP

```http
POST /user/auth/login
```

Request form-data:

- `country_code`: required, example `+20`
- `phone`: required local number, example `1001234561`

Collection success response sends OTP and returns an empty `data` array.

### New User Register OTP

```http
POST /user/auth/register
```

Request form-data:

- `full_name`: required
- `country_code`: required, example `+20`
- `phone`: required local number
- `password`: required by backend validation
- `password_confirmation`: required by backend validation

The UI does not ask the user for a password because the active product flow is OTP-first. The frontend generates a one-time backend password value only to satisfy the current register endpoint validation.

### Verify OTP

```http
POST /user/auth/verify-otp
```

Request form-data:

- `country_code`: required
- `phone`: required local number
- `otp`: required 4-digit string
- `device_id`: optional
- `device_type`: optional, one of `android`, `ios`, `web`

Expected frontend success shape:

```json
{
  "status": true,
  "message": "Authenticated successfully.",
  "data": {
    "token": "ACCESS_TOKEN",
    "user": {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "country_code": "+20",
      "phone": "1001234561",
      "email": ""
    }
  },
  "errors": []
}
```

The frontend also accepts `data.access_token` as a token alias.

## Frontend Files

- `features/auth/hooks/use-phone-auth.ts`
  - Owns endpoint calls, step state, and session persistence.
- `features/auth/components/auth-dialog.tsx`
  - Dialog used for login/register from public UI. New users see full name and OTP inputs together after the phone step.
- `features/auth/components/auth-dialog-route-page.tsx`
  - Shared route page for `/login` and `/signup`.
- `features/auth/components/login-page.tsx`
  - Delegates to the phone auth route page.
- `features/auth/components/signup-page.tsx`
  - Delegates to the phone auth route page.
- `features/lead-project/components/lead-project-auth-gate.tsx`
  - Uses the same hook for project submission auth gates.
