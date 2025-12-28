# Google OAuth Login Flow

## Component Overview
The `GoogleLoginDemo` component provides a simple OAuth-based authentication interface using Google as the provider. It handles both sign-in and sign-up automatically through Google's OAuth flow.

## Initial State
- **User**: `null` (passed as prop from server component)
- **Loading**: `false`
- **Error**: Empty string

## Component Lifecycle Flow

### 1. Component Mount
- Component receives `user` prop from parent server component
- Initializes router for navigation
- Sets up state variables for loading and error handling

### 2. Authentication Check (useEffect)
**Trigger**: Component mounts or `user`/`router` dependencies change

**Decision Point**: Is user already authenticated?
- **If `user` exists**:
  - Redirect to `/welcome` page immediately
  - User bypasses login flow
- **If `user` is `null`**:
  - Continue to render login UI
  - Wait for user interaction

## User Interface Flow

### 3. Component Render
- Display login form with header text
- Show error message if `error` state is set
- Display "Continue with Google" button
- Show alternative link to email/password login
- Button is disabled when `loading` is `true`

## Google OAuth Authentication Flow

### 4. User Initiates Login
**User Action**: Click "Continue with Google" button

**Trigger**: `handleGoogleLogin` function called

**Initial Actions**:
1. Clear previous error: `setError("")`
2. Set loading state: `setLoading(true)`
3. Disable button (via `disabled={loading}`)

### 5. Initialize Supabase Client
**Action**: Get Supabase browser client instance
```javascript
const supabase = getSupabaseBrowserClient();
```

### 6. Build Redirect URL
**Action**: Construct callback URL for OAuth redirect
```javascript
const redirectTo = `${window.location.origin}/auth/callback`;
```
- Uses current origin (e.g., `http://localhost:3000` or production URL)
- Points to `/auth/callback` route for handling OAuth response

### 7. Initiate OAuth Flow
**Action**: Call Supabase OAuth method
```javascript
await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
        redirectTo: redirectTo,
    },
});
```

**What Happens**:
- Supabase generates OAuth authorization URL
- User is automatically redirected to Google's consent screen
- User authenticates with Google
- Google redirects back to `/auth/callback` with authorization code

### 8. OAuth Response Handling
**Decision Point**: Does the OAuth initiation contain an error?

**If Error (`signInError` exists)**:
- Set error message: `setError(signInError.message)`
- Log error to console
- Set loading state: `setLoading(false)`
- Display error message in UI (red banner)
- User remains on login page
- User can retry

**If Success (no error)**:
- Log redirect initiation to console
- **User is automatically redirected to Google**
- Loading state remains `true` (user is redirected, so UI state doesn't matter)
- Component unmounts as user navigates away

### 9. Exception Handling
**Decision Point**: Did an exception occur during OAuth initiation?

**If Exception Caught**:
- Extract error message from exception
- Fallback message: "An unexpected error occurred. Please check your environment variables."
- Set error: `setError(errorMessage)`
- Log error to console
- Set loading state: `setLoading(false)`
- Display error message in UI
- User remains on login page

## OAuth Callback Flow (External Route)

### 10. OAuth Callback Route (`/auth/callback`)
**Note**: This happens in a separate route handler, not in this component

**Flow**:
1. Google redirects user to `/auth/callback?code=...`
2. Callback route extracts authorization code
3. Exchanges code for session using `supabase.auth.exchangeCodeForSession(code)`
4. Redirects user to `/welcome` page
5. User sees welcome page with authenticated session

## State Management Summary

### State Variables
1. **loading**: Prevents multiple clicks and shows loading state
2. **error**: Stores and displays error messages
3. **user**: Passed as prop, used to determine if redirect is needed

### State Transitions

**On Button Click**:
```
error: (previous value or "") → ""
loading: false → true
```

**On OAuth Error**:
```
loading: true → false
error: "" → (error message)
```

**On OAuth Success**:
```
loading: true → (component unmounts, redirect happens)
```

**On Exception**:
```
loading: true → false
error: "" → (error message)
```

## Decision Points for Flowchart

1. **User Authentication Check**: `user` exists?
2. **OAuth Error Check**: `signInError` exists?
3. **Exception Check**: Exception caught in try-catch?

## Flowchart Structure Suggestion

```
Start
  ↓
Component Mounted
  ↓
[Decision: user exists?]
  ├─ Yes → Redirect to /welcome → End
  └─ No → Continue
  ↓
Render Login UI
  ↓
Wait for User Action
  ↓
[Decision: User clicks "Continue with Google"?]
  ├─ No → Wait for user action
  └─ Yes → Clear error, Set loading=true
  ↓
Get Supabase Client
  ↓
Build Redirect URL (origin + /auth/callback)
  ↓
Call signInWithOAuth({ provider: 'google' })
  ↓
[Decision: signInError exists?]
  ├─ Yes → Set error, Set loading=false, Display error
  │   ↓
  │   User can retry
  │   ↓
  │   End (on login page)
  │
  └─ No → User redirected to Google
      ↓
      (External: User authenticates with Google)
      ↓
      (External: Google redirects to /auth/callback)
      ↓
      (External: Callback route exchanges code for session)
      ↓
      (External: Redirect to /welcome)
      ↓
      End (on welcome page)
  ↓
[Decision: Exception caught?]
  ├─ Yes → Set error, Set loading=false, Display error
  └─ No → (Already handled above)
```

## Key Features

- **OAuth-Based**: Uses OAuth 2.0 flow instead of direct credentials
- **Automatic Sign-Up**: Google OAuth handles both sign-in and sign-up automatically
- **Redirect-Based**: User is redirected to Google, then back to the app
- **Error Handling**: Multiple layers (OAuth errors and exceptions)
- **User Feedback**: Visual indicators for error states
- **Loading States**: Prevents duplicate clicks during OAuth initiation
- **Auto-Redirect**: Automatically redirects authenticated users
- **Alternative Option**: Link to email/password login

## OAuth Flow Sequence

1. **User clicks button** → OAuth initiation
2. **Browser redirects** → Google consent screen
3. **User authenticates** → Google processes authentication
4. **Google redirects** → `/auth/callback?code=...`
5. **Callback route** → Exchanges code for session
6. **Final redirect** → `/welcome` page

## Differences from Email/Password Flow

- **No form inputs**: User doesn't enter credentials
- **External redirect**: User leaves the app temporarily
- **Automatic sign-up**: No separate sign-up flow needed
- **Callback handling**: Requires separate route handler
- **No password**: Authentication handled by Google

