# Complete Notification System Documentation

## Overview

The notification system now supports **two types of notifications**:

1. **Owner-Specific Notifications** - Only sent to the property owner/creator
2. **Public Notifications** - Visible to all users (activity feed)

## Notification Types

### 1. Owner-Specific Notifications (Private)

These notifications are **ONLY** sent to the person who created/uploaded the property:

- ✅ **Property Created** - "Your property 'X' has been successfully created and is now live on MyGround."
- ✅ **Property Deleted** - "Your property 'X' has been deleted successfully."
- ✅ **Property Paused** - "Your property 'X' has been paused and is now hidden from public view."
- ✅ **Property Resumed** - "Your property 'X' has been resumed and is now visible to the public."

**Access**: Only the property owner can see these in their notifications.

### 2. Public Notifications (Activity Feed)

These notifications are visible to **ALL users** (USER, OWNER, BROKER, DEVELOPER):

- ✅ **Property Added** - "New RESIDENTIAL property 'X' for Sale in Bandra, Mumbai"
- ✅ **Property Deleted** - "RESIDENTIAL property 'X' has been removed from Bandra, Mumbai"
- ✅ **Property Sold** - "RESIDENTIAL property 'X' in Bandra, Mumbai has been sold"
- ✅ **Property Rented** - "RESIDENTIAL property 'X' in Bandra, Mumbai has been rented"

**Access**: All users can see these in the "Activity Feed" tab.

## Backend Implementation

### Models

1. **Notification Model** (`backend/src/models/Notification.ts`)
   - User-specific notifications
   - Fields: `userId`, `title`, `message`, `type`, `read`, `link`, `metadata`

2. **PublicNotification Model** (`backend/src/models/PublicNotification.ts`)
   - Public activity feed notifications
   - Fields: `type`, `propertyId`, `propertyTitle`, `propertyCategory`, `transactionType`, `location`

### Routes

1. **User Notifications** (`/api/notifications`)
   - `GET /api/notifications` - Get user's own notifications
   - `PUT /api/notifications/:id/read` - Mark as read
   - `PUT /api/notifications/read-all` - Mark all as read
   - `DELETE /api/notifications/:id` - Delete notification

2. **Public Notifications** (`/api/public-notifications`)
   - `GET /api/public-notifications` - Get public activity feed

### Notification Triggers

**When Property is Created:**
- ✅ Owner notification: "Property Created Successfully"
- ✅ Public notification: "New Property Added"

**When Property is Deleted:**
- ✅ Owner notification: "Property Deleted"
- ✅ Public notification: "Property Removed"

**When Property is Paused:**
- ✅ Owner notification: "Property Paused"
- ❌ No public notification (property is hidden)

**When Property is Resumed:**
- ✅ Owner notification: "Property Resumed"
- ❌ No public notification (property was already public before)

**When Property Status Changes to SOLD/RENTED:**
- ✅ Public notification: "Property Sold" or "Property Rented"

## Frontend Implementation

### Notifications Page

**Three Filter Tabs:**
1. **All** - Shows both owner and public notifications
2. **My Notifications** - Shows only owner-specific notifications
3. **Activity Feed** - Shows only public notifications

**Visual Indicators:**
- Owner notifications: Blue left border, can be marked as read/deleted
- Public notifications: Blue left border with "Public" badge, cannot be deleted

### Hooks

1. **useNotifications** - Fetches user's own notifications
2. **usePublicNotifications** - Fetches public activity feed

## Security & Access Control

### Owner-Only Actions
- ✅ Only property creator can delete their property
- ✅ Only property creator can pause/resume their property
- ✅ Only property creator receives owner-specific notifications

### Public Access
- ✅ All users can see public notifications (property added, deleted, sold, rented)
- ✅ Public notifications are read-only (cannot be deleted by users)

## Example Flow

### Scenario 1: User Creates Property

1. User creates property → Status: `APPROVED`
2. **Owner Notification Created**: "Your property 'Luxury Apartment' has been successfully created..."
3. **Public Notification Created**: "New RESIDENTIAL property 'Luxury Apartment' for Sale in Bandra, Mumbai"
4. All users see the public notification in Activity Feed
5. Only the owner sees the owner notification

### Scenario 2: User Deletes Property

1. User deletes their property
2. **Owner Notification Created**: "Your property 'Luxury Apartment' has been deleted successfully"
3. **Public Notification Created**: "RESIDENTIAL property 'Luxury Apartment' has been removed from Bandra, Mumbai"
4. All users see the deletion in Activity Feed
5. Only the owner sees the owner notification

### Scenario 3: Property is Sold/Rented

1. Property status changes to `SOLD` or `RENTED`
2. **Public Notification Created**: "RESIDENTIAL property 'X' in Bandra, Mumbai has been sold"
3. All users see this in Activity Feed

## API Endpoints

### User Notifications
```
GET    /api/notifications              - Get user's notifications
PUT    /api/notifications/:id/read     - Mark as read
PUT    /api/notifications/read-all     - Mark all as read
DELETE /api/notifications/:id          - Delete notification
```

### Public Notifications
```
GET    /api/public-notifications       - Get public activity feed
```

## Summary

✅ **Owner notifications** - Only property creator receives (create, delete, pause, resume)
✅ **Public notifications** - All users see (property added, deleted, sold, rented)
✅ **Strict ownership** - Only creator can delete/pause their property
✅ **Activity feed** - All users can see property activities
✅ **Separate tabs** - Users can filter between their notifications and public feed

The system ensures privacy for owner actions while providing transparency through public activity feed!

