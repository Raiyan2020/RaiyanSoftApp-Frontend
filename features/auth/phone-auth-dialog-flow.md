# Phone Login/Register Dialog Flow

## Goal

Replace separate login/register forms with one phone-first dialog.

The frontend starts with one phone input. After the user submits the phone number, the backend checks whether this number belongs to an existing user and sends an OTP. The frontend then shows:

- Existing user: OTP input only.
- New user: full name input and OTP input.

After OTP verification, the backend returns the user access token for both cases.

## Frontend Architecture

The implementation follows the current feature-based project structure:

- `components/ui/phone-input.tsx`
  - Shared phone input component.
  - Uses the same core package as the shadcn phone input reference: `react-phone-number-input`.
  - Keeps the existing project styling and remains compatible with existing callers.
- `features/auth/components/auth-dialog.tsx`
  - Dialog UI and local form validation.
  - Handles the phone step, existing-user OTP step, and new-user name + OTP step.
- `features/auth/hooks/use-phone-auth.ts`
  - API calls and auth session persistence.
  - Calls `authService.setUserSession(user, token)` after successful verification.
- `features/auth/components/auth-dialog-route-page.tsx`
  - Hosts the dialog for direct `/login` and `/signup` routes.
- `components/landing/Navbar.tsx`
  - Owns a shared dialog instance for landing navigation.
- `components/ui/auth-required-modal.tsx`
  - Opens the same dialog when protected actions require login.

Reference phone input: https://shadcn-phone-input.vercel.app/

## Phase 1: UI Flow

Tasks:

- Create a reusable auth dialog.
- Show phone input only on first open.
- Validate phone number before calling the backend.
- Show loading, success, and error states.
- Let the user go back from OTP step to phone step.
- Keep `/login` and `/signup` working by opening the same dialog.
- Open the dialog from the landing navbar instead of navigating to the old login page.

Flow:

1. User opens login/register dialog.
2. Dialog shows phone input only.
3. User enters phone number in E.164 format, for example `+96555555555`.
4. Frontend calls `POST /user/auth/phone/check`.
5. Backend returns whether the phone is new.
6. Dialog moves to OTP step.
7. Existing user sees OTP input only.
8. New user sees full name input plus OTP input.
9. User submits OTP.
10. Frontend calls `POST /user/auth/phone/verify`.
11. Backend returns user and access token.
12. Frontend stores session and redirects to the intended path or `/home`.

## Phase 2: API Contract

### Endpoint 1: Check Phone And Send OTP

Assumed endpoint:

```http
POST /user/auth/phone/check
```

Request:

```json
{
  "phone": "+96555555555",
  "device_id": "device_abc123",
  "device_type": "web"
}
```

Expected existing-user response:

```json
{
  "status": true,
  "message": "OTP sent successfully.",
  "data": {
    "is_new_user": false,
    "otp_sent": true,
    "expires_in_seconds": 300
  },
  "errors": []
}
```

Expected new-user response:

```json
{
  "status": true,
  "message": "OTP sent successfully.",
  "data": {
    "is_new_user": true,
    "otp_sent": true,
    "expires_in_seconds": 300
  },
  "errors": []
}
```

Expected error response:

```json
{
  "status": false,
  "message": "Invalid phone number.",
  "data": null,
  "errors": {
    "phone": ["The phone field must be a valid phone number."]
  }
}
```

### Endpoint 2: Verify OTP And Login/Register

Assumed endpoint:

```http
POST /user/auth/phone/verify
```

Existing-user request:

```json
{
  "phone": "+96555555555",
  "otp": "123456",
  "device_id": "device_abc123",
  "device_type": "web"
}
```

New-user request:

```json
{
  "phone": "+96555555555",
  "otp": "123456",
  "name": "Abdullah Mohammed",
  "device_id": "device_abc123",
  "device_type": "web"
}
```

Expected success response for both cases:

```json
{
  "status": true,
  "message": "Authenticated successfully.",
  "data": {
    "token": "ACCESS_TOKEN_HERE",
    "user": {
      "id": 101,
      "first_name": "Abdullah",
      "last_name": "Mohammed",
      "country_code": "+965",
      "phone": "55555555",
      "email": "",
      "unread_notifications_count": 0
    }
  },
  "errors": []
}
```

Expected OTP error response:

```json
{
  "status": false,
  "message": "Invalid or expired OTP.",
  "data": null,
  "errors": {
    "otp": ["The OTP is invalid or expired."]
  }
}
```

## Phase 3: Backend Prompt

Use this prompt for the backend team:

```text
Build phone-first authentication for the web app.

We need two user auth endpoints under the same API response shape currently used by the frontend:

{
  "status": boolean,
  "message": string,
  "data": object | null,
  "errors": [] | Record<string, string[]>
}

Endpoint 1:
POST /user/auth/phone/check

Request body:
- phone: required string, E.164 format, example "+96555555555"
- device_id: optional string
- device_type: optional string, example "web"

Behavior:
- Validate the phone number.
- Check whether a user already exists with this phone number.
- Generate and send OTP to the phone number.
- Return data.is_new_user = true when no user exists.
- Return data.is_new_user = false when the user exists.
- Return data.otp_sent = true when OTP delivery is queued/sent.
- Return data.expires_in_seconds with the OTP lifetime if available.

Success response:
{
  "status": true,
  "message": "OTP sent successfully.",
  "data": {
    "is_new_user": true,
    "otp_sent": true,
    "expires_in_seconds": 300
  },
  "errors": []
}

Endpoint 2:
POST /user/auth/phone/verify

Request body for existing user:
- phone: required string, E.164 format
- otp: required string
- device_id: optional string
- device_type: optional string

Request body for new user:
- phone: required string, E.164 format
- otp: required string
- name: required string only when the phone is new
- device_id: optional string
- device_type: optional string

Behavior:
- Validate phone and OTP.
- If phone belongs to an existing user, authenticate that user.
- If phone is new, create the user using name and phone, then authenticate.
- Return an access token and user object for both cases.
- Split name into first_name and last_name or store full name according to backend model.

Success response:
{
  "status": true,
  "message": "Authenticated successfully.",
  "data": {
    "token": "ACCESS_TOKEN_HERE",
    "user": {
      "id": 101,
      "first_name": "Abdullah",
      "last_name": "Mohammed",
      "country_code": "+965",
      "phone": "55555555",
      "email": "",
      "unread_notifications_count": 0
    }
  },
  "errors": []
}

Important:
- The frontend sends phone as a full E.164 value.
- The frontend stores data.token in user_token.
- The frontend stores data.user in user_profile.
- Any failure should return status false and useful field errors.
```

## Phase 4: Testing Tasks

- Test a valid existing phone number.
- Test a valid new phone number.
- Test invalid phone format.
- Test invalid OTP.
- Test expired OTP.
- Test closing and reopening the dialog resets the form.
- Test protected-route login redirects to the saved intended path.
- Test `/login` and `/signup` direct routes.
- Test Arabic and English layout directions.

## Implementation Notes

- The frontend currently assumes the endpoints are:
  - `user/auth/phone/check`
  - `user/auth/phone/verify`
- If the backend chooses different paths or response names, update `features/auth/hooks/use-phone-auth.ts`.
- The access token response must include `data.token`.
- The user response must match the shape expected by `lib/auth-service.ts`.
