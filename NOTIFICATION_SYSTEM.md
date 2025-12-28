# Notification System Documentation

## Overview

The notification system has been implemented to notify users about property status changes:
- When a property is submitted for review
- When a property is approved by admin
- When a property is rejected by admin

## Backend Implementation

### 1. Notification Model
**File**: `backend/src/models/Notification.ts`

- Stores notifications for each user
- Fields: userId, title, message, type, read, link, metadata
- Indexed for efficient queries

### 2. Notification Utilities
**File**: `backend/src/utils/notifications.ts`

Functions:
- `createNotification()` - Generic notification creator
- `notifyPropertySubmitted()` - When property is submitted
- `notifyPropertyApproved()` - When property is approved
- `notifyPropertyRejected()` - When property is rejected

### 3. Property Routes
**File**: `backend/src/routes/properties.ts`

**Updated Routes:**
- `POST /api/properties/:id/submit` - Now creates notification when property is submitted
- `POST /api/properties/:id/approve` - **NEW** - Admin approves property and sends notification
- `POST /api/properties/:id/reject` - **NEW** - Admin rejects property and sends notification

### 4. Notification Routes
**File**: `backend/src/routes/notifications.ts`

**Endpoints:**
- `GET /api/notifications` - Get user's notifications (with pagination)
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all notifications as read
- `DELETE /api/notifications/:id` - Delete a notification

## Frontend Implementation

### 1. Updated CreateProperty Page
- Shows success message when property is submitted
- Message includes notification info

### 2. useNotifications Hook
- Updated to fetch from API endpoint
- Handles both sample data and API data

## Usage

### For Users (Property Owners):

1. **Submit Property:**
   - Create property → Submit for review
   - Notification automatically created: "Your property 'X' has been submitted for review. Please wait for admin confirmation."

2. **Property Approved:**
   - Admin approves property
   - Notification automatically created: "Great news! Your property 'X' has been approved and is now live on MyGround."

3. **Property Rejected:**
   - Admin rejects property
   - Notification automatically created: "Your property 'X' has been rejected. [Reason if provided]"

### For Admins:

**Approve Property:**
```bash
POST /api/properties/:id/approve
Headers: Authorization: Bearer <admin_token>
```

**Reject Property:**
```bash
POST /api/properties/:id/reject
Headers: Authorization: Bearer <admin_token>
Body: { "reason": "Optional rejection reason" }
```

## Notification Types

- `info` - General information (property submitted)
- `success` - Success messages (property approved)
- `error` - Error messages (property rejected)
- `warning` - Warning messages
- `property` - Property-related notifications
- `message` - Message notifications

## Next Steps

1. **Admin Dashboard** - Create UI for admins to approve/reject properties
2. **Real-time Updates** - Consider WebSocket for real-time notifications
3. **Email Notifications** - Send email when property is approved/rejected
4. **Push Notifications** - Mobile push notifications
5. **Notification Preferences** - Let users choose which notifications to receive

## Testing

1. Create a property as a regular user
2. Check notifications - should see "Property Under Review"
3. As admin, approve the property
4. Check user's notifications - should see "Property Approved"
5. Test rejection flow similarly


