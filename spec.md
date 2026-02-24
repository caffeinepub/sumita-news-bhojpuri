# Sumita News Bhojpuri

## Current State

The application has an admin authentication system with the following characteristics:
- Admin login uses Internet Identity authentication
- Authorization logic requires the first user to provide a special admin token
- Only pre-authorized admins can access admin features
- Login page displays message "केवल अधिकृत एडमिन ही लॉगिन कर सकते हैं" (Only authorized admin can login)
- After successful login, user is redirected to `/admin` dashboard
- Backend access control requires admin permission to create/edit/delete articles

## Requested Changes (Diff)

### Add
- Simplified admin assignment: first logged-in user automatically becomes admin
- Email-based user profile collection during admin login
- Auto-promotion logic to make the currently logged-in user an admin

### Modify
- Remove admin token requirement from access control initialization
- Update AdminLoginPage to remove "only authorized admin" restriction message
- Change login flow to always redirect to admin dashboard after authentication
- Backend authorization to auto-assign admin role to first caller
- Update access control logic to automatically assign admin to first authenticated user

### Remove
- Admin token validation requirement
- "Only authorized admin" restriction message from login page
- Admin token parameter from initialization function

## Implementation Plan

1. **Backend Changes:**
   - Modify `access-control.mo` to remove admin token parameter
   - Update initialization logic to assign first caller as admin automatically
   - Simplify admin assignment in MixinAuthorization
   - Ensure authorization functions automatically grant admin to first user

2. **Frontend Changes:**
   - Update AdminLoginPage to remove "केवल अधिकृत एडमिन ही लॉगिन कर सकते हैं" message
   - Simplify login flow to redirect directly to `/admin` after authentication
   - Ensure user profile is collected (name/email) during admin setup
   - Update any hooks that check admin status

## UX Notes

- First user to log in automatically becomes admin
- No special tokens or pre-authorization needed
- Login page should be welcoming, not restrictive
- After login, immediate redirect to admin dashboard
- Email collection happens seamlessly as part of user profile
