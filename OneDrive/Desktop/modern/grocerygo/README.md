# Tasks done in Phase 5-
1## Features Implemented

### 1. Protected Routes
- Identified all backend routes that require protection.
- Public routes remain accessible without authentication.
- Protected routes require a valid JWT token.
- Role-restricted routes validate user roles before granting access.

### 2. User Roles
- Defined the following roles in the system:
  - `admin` — full access to all routes and data.
  - `customer` — limited access based on group membership.
- Roles are assigned during user registration or by the admin.

### 3. Token-Based Authentication with Email MFA
- Backend login route accepts **email** and **password**.
- On successful credential validation:
  - A **one-time password (OTP)** is generated.
  - OTP is emailed to the user.
  - OTP is temporarily stored in the backend (MongoDB) for verification.
- Backend OTP verification route validates the OTP.
- After successful OTP verification, a **JWT/access token** is generated and returned.

### 4. Role-Based Access Control (RBAC)
- Middleware checks the provided JWT token in the request.
- Decodes the token to identify the authenticated user.
- Validates the user’s role against the roles allowed for that route.
- Applied to all protected and role-restricted routes.