# 🔌 ChurchAfrica ChMS - API Specification

## 📋 Overview

**Base URL:** `https://api.yourchurch.com/api/v1`  
**Authentication:** Bearer Token (JWT)  
**Content-Type:** `application/json`  
**Rate Limiting:** 100 requests/minute (per user)  
**API Version:** 1.0

---

## 🔐 Authentication

### POST `/auth/register`
Register a new user account.

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+234XXXXXXXXXX",
  "password": "SecurePass123!",
  "password_confirmation": "SecurePass123!",
  "organizationId": "org-123" // Optional for multi-org
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-123",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+234XXXXXXXXXX",
      "role": "member",
      "organizationId": "org-123",
      "createdAt": "2025-11-08T10:00:00Z"
    },
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refreshToken": "refresh_token_here",
    "expiresIn": 3600
  },
  "message": "User registered successfully"
}
```

---

### POST `/auth/login`
Authenticate user and get access token.

**Request:**
```json
{
  "email": "john@example.com", // Or phone or membershipNumber
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-123",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "member",
      "organizationId": "org-123",
      "permissions": ["attendance.checkin", "profile.edit"]
    },
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refreshToken": "refresh_token_here",
    "expiresIn": 3600
  }
}
```

---

### POST `/auth/login/qr`
Login via QR code scan.

**Request:**
```json
{
  "qrData": "encrypted_qr_data_here",
  "deviceId": "device-uuid"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": { /* user object */ },
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "expiresIn": 3600
  }
}
```

---

### POST `/auth/login/biometric`
Login via fingerprint.

**Request:**
```json
{
  "biometricTemplate": "base64_encoded_template",
  "deviceId": "device-uuid"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": { /* user object */ },
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "expiresIn": 3600
  }
}
```

---

### POST `/auth/logout`
Logout and invalidate token.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### POST `/auth/refresh`
Refresh access token.

**Request:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "token": "new_access_token",
    "refreshToken": "new_refresh_token",
    "expiresIn": 3600
  }
}
```

---

### POST `/auth/forgot-password`
Request password reset.

**Request:**
```json
{
  "email": "john@example.com" // Or phone
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Password reset link sent to your email"
}
```

---

### POST `/auth/reset-password`
Reset password with token.

**Request:**
```json
{
  "token": "reset_token_from_email",
  "password": "NewSecurePass123!",
  "password_confirmation": "NewSecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

## 👥 Members

### GET `/members`
Get paginated list of members.

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `page` (int, default: 1)
- `perPage` (int, default: 20)
- `search` (string) - Search by name, email, phone, membershipNumber
- `status` (string) - active|inactive|visitor
- `group` (string) - Filter by group
- `branch` (string) - Filter by branch
- `sortBy` (string) - firstName|lastName|joinDate|lastAttendance
- `sortOrder` (string) - asc|desc

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "members": [
      {
        "id": "mem-123",
        "membershipNumber": "MEM-2024-001",
        "firstName": "John",
        "lastName": "Doe",
        "middleName": "Michael",
        "email": "john@example.com",
        "phone": "+234XXXXXXXXXX",
        "photo": "https://cdn.example.com/photos/john.jpg",
        "dateOfBirth": "1990-05-15",
        "gender": "male",
        "status": "active",
        "joinDate": "2024-01-15",
        "branch": {
          "id": "branch-1",
          "name": "Main Campus"
        },
        "groups": [
          {
            "id": "group-1",
            "name": "Youth Ministry"
          }
        ],
        "contact": {
          "address": "123 Main St",
          "city": "Lagos",
          "state": "Lagos State",
          "country": "Nigeria"
        },
        "stats": {
          "attendanceRate": 85.5,
          "totalAttendance": 42,
          "lastAttendance": "2024-11-03T11:00:00Z",
          "totalGiving": 250000
        },
        "createdAt": "2024-01-15T10:00:00Z",
        "updatedAt": "2024-11-08T10:00:00Z"
      }
    ],
    "pagination": {
      "total": 1250,
      "count": 20,
      "perPage": 20,
      "currentPage": 1,
      "totalPages": 63,
      "hasMore": true
    }
  }
}
```

---

### GET `/members/{id}`
Get single member details.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "member": {
      "id": "mem-123",
      "membershipNumber": "MEM-2024-001",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+234XXXXXXXXXX",
      "photo": "https://cdn.example.com/photos/john.jpg",
      "dateOfBirth": "1990-05-15",
      "gender": "male",
      "status": "active",
      "joinDate": "2024-01-15",
      "branch": { /* branch object */ },
      "groups": [ /* groups array */ ],
      "family": [ /* family members */ ],
      "emergencyContact": {
        "name": "Jane Doe",
        "phone": "+234XXXXXXXXXX",
        "relationship": "spouse"
      },
      "stats": { /* stats object */ },
      "notes": "Senior developer, leads tech team",
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-11-08T10:00:00Z"
    }
  }
}
```

---

### POST `/members`
Create a new member.

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "phone": "+234XXXXXXXXXX",
  "dateOfBirth": "1995-03-20",
  "gender": "female",
  "address": "456 Oak Ave",
  "city": "Abuja",
  "state": "FCT",
  "country": "Nigeria",
  "status": "active",
  "joinDate": "2024-11-08",
  "branchId": "branch-1",
  "groupIds": ["group-1", "group-3"],
  "emergencyContact": {
    "name": "John Smith",
    "phone": "+234XXXXXXXXXX",
    "relationship": "spouse"
  }
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "member": {
      "id": "mem-456",
      "membershipNumber": "MEM-2024-456",
      /* ... full member object */
    }
  },
  "message": "Member created successfully"
}
```

---

### PUT `/members/{id}`
Update member information.

**Headers:** `Authorization: Bearer {token}`

**Request:** (Same as POST, all fields optional)
```json
{
  "firstName": "Jane",
  "phone": "+234YYYYYYYYY"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "member": { /* updated member object */ }
  },
  "message": "Member updated successfully"
}
```

---

### DELETE `/members/{id}`
Delete (soft delete) a member.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Member deleted successfully"
}
```

---

### POST `/members/{id}/photo`
Upload member photo.

**Headers:** 
- `Authorization: Bearer {token}`
- `Content-Type: multipart/form-data`

**Request:**
```
photo: File (max 5MB, jpg/png/gif)
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "photoUrl": "https://cdn.example.com/photos/jane-456.jpg"
  },
  "message": "Photo uploaded successfully"
}
```

---

### POST `/members/bulk/import`
Bulk import members from CSV/Excel.

**Headers:** 
- `Authorization: Bearer {token}`
- `Content-Type: multipart/form-data`

**Request:**
```
file: File (CSV/XLSX)
branchId: "branch-1"
```

**Response:** `202 Accepted`
```json
{
  "success": true,
  "data": {
    "jobId": "import-job-789",
    "status": "processing",
    "totalRows": 250
  },
  "message": "Import job started. You'll receive a notification when complete."
}
```

---

### POST `/members/bulk/export`
Export members to CSV/Excel.

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "format": "csv", // or "xlsx"
  "filters": {
    "status": "active",
    "branch": "branch-1"
  },
  "fields": ["firstName", "lastName", "email", "phone", "membershipNumber"]
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "downloadUrl": "https://cdn.example.com/exports/members-2024-11-08.csv",
    "expiresAt": "2024-11-08T23:59:59Z"
  }
}
```

---

## 📋 Attendance

### POST `/attendance/checkin`
Check in a member (manual or QR).

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "memberId": "mem-123",
  "serviceId": "svc-456",
  "method": "qr", // manual|qr|biometric
  "timestamp": "2024-11-08T11:05:00Z",
  "notes": "Arrived late due to traffic"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "attendance": {
      "id": "att-789",
      "memberId": "mem-123",
      "serviceId": "svc-456",
      "status": "present",
      "checkInTime": "2024-11-08T11:05:00Z",
      "method": "qr",
      "checkInBy": "user-123", // Admin who performed check-in
      "createdAt": "2024-11-08T11:05:00Z"
    }
  },
  "message": "Member checked in successfully"
}
```

---

### POST `/attendance/checkin/service-qr`
Check in using service QR code.

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "serviceQrData": "encrypted_service_qr_data",
  "memberId": "mem-123"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "attendance": { /* attendance object */ },
    "service": {
      "id": "svc-456",
      "name": "Sunday Main Service",
      "time": "11:00 AM"
    }
  },
  "message": "Checked in to Sunday Main Service"
}
```

---

### POST `/attendance/service-qr/generate`
Generate service QR code (admin only).

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "serviceName": "Sunday Main Service",
  "serviceDate": "2024-11-10",
  "serviceTime": "11:00",
  "duration": 2, // hours
  "branchId": "branch-1"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "serviceQr": {
      "id": "sqr-123",
      "serviceId": "s-2024-11-10-1100",
      "serviceName": "Sunday Main Service",
      "serviceDate": "2024-11-10",
      "serviceTime": "11:00",
      "qrData": {
        "type": "service-checkin",
        "serviceId": "s-2024-11-10-1100",
        "serviceName": "Sunday Main Service",
        "date": "2024-11-10",
        "time": "11:00",
        "branchId": "branch-1",
        "orgId": "org-1",
        "expiresAt": "2024-11-10T13:00:00Z",
        "timestamp": 1699617600000
      },
      "qrImageUrl": "https://cdn.example.com/qr/service-sqr-123.png",
      "expiresAt": "2024-11-10T13:00:00Z",
      "totalCheckins": 0,
      "isActive": true,
      "createdAt": "2024-11-08T10:00:00Z"
    }
  }
}
```

---

### GET `/attendance/service-qr/{serviceId}/stats`
Get real-time service QR stats.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "totalCheckins": 247,
    "recentCheckins": [
      {
        "memberId": "mem-123",
        "memberName": "John Doe",
        "memberPhoto": "https://cdn.example.com/photos/john.jpg",
        "checkInTime": "2024-11-10T11:05:00Z",
        "isFirstTime": false
      }
      // ... last 10 check-ins
    ],
    "service": {
      "id": "s-2024-11-10-1100",
      "name": "Sunday Main Service",
      "date": "2024-11-10",
      "time": "11:00",
      "expiresAt": "2024-11-10T13:00:00Z",
      "isActive": true
    }
  }
}
```

---

### GET `/attendance`
Get attendance records (filtered).

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `serviceId` (string) - Filter by service
- `memberId` (string) - Filter by member
- `dateFrom` (date) - Start date
- `dateTo` (date) - End date
- `status` (string) - present|absent|late|excused
- `page` (int, default: 1)
- `perPage` (int, default: 20)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "attendance": [
      {
        "id": "att-789",
        "member": {
          "id": "mem-123",
          "name": "John Doe",
          "photo": "https://cdn.example.com/photos/john.jpg"
        },
        "service": {
          "id": "svc-456",
          "name": "Sunday Main Service",
          "date": "2024-11-10",
          "time": "11:00"
        },
        "status": "present",
        "checkInTime": "2024-11-10T11:05:00Z",
        "method": "qr",
        "createdAt": "2024-11-10T11:05:00Z"
      }
    ],
    "pagination": { /* pagination object */ }
  }
}
```

---

### GET `/attendance/member/{memberId}`
Get member's attendance history.

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `dateFrom` (date)
- `dateTo` (date)
- `page` (int)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalAttendance": 42,
      "attendanceRate": 85.5,
      "presentCount": 42,
      "absentCount": 7,
      "lateCount": 3,
      "lastAttendance": "2024-11-03T11:00:00Z"
    },
    "attendance": [ /* attendance array */ ],
    "pagination": { /* pagination object */ }
  }
}
```

---

### POST `/attendance/biometric/enroll`
Enroll member's fingerprint.

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "memberId": "mem-123",
  "biometricTemplate": "base64_encoded_fingerprint_template",
  "deviceInfo": {
    "manufacturer": "ZKTeco",
    "model": "ZK4500",
    "serialNumber": "ZK-12345"
  }
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "biometric": {
      "id": "bio-456",
      "memberId": "mem-123",
      "biometricType": "fingerprint",
      "enrolledAt": "2024-11-08T10:00:00Z",
      "deviceInfo": { /* device object */ },
      "isActive": true
    }
  },
  "message": "Biometric enrolled successfully"
}
```

---

## 📅 Events

### GET `/events`
Get list of events.

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `dateFrom` (date) - Start date
- `dateTo` (date) - End date
- `category` (string) - Filter by category
- `status` (string) - upcoming|past|cancelled
- `page` (int)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "id": "evt-123",
        "title": "Youth Conference 2024",
        "description": "Annual youth gathering with guest speakers",
        "category": "conference",
        "startDate": "2024-12-15T09:00:00Z",
        "endDate": "2024-12-17T18:00:00Z",
        "location": "Main Auditorium",
        "organizer": {
          "id": "user-456",
          "name": "Pastor David"
        },
        "maxAttendees": 500,
        "registeredCount": 247,
        "image": "https://cdn.example.com/events/youth-conf-2024.jpg",
        "requiresRsvp": true,
        "status": "upcoming",
        "createdAt": "2024-10-01T10:00:00Z"
      }
    ],
    "pagination": { /* pagination object */ }
  }
}
```

---

### POST `/events`
Create new event.

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "title": "Prayer Night",
  "description": "Mid-week prayer and worship",
  "category": "prayer",
  "startDate": "2024-11-13T19:00:00Z",
  "endDate": "2024-11-13T21:00:00Z",
  "location": "Prayer Hall",
  "maxAttendees": 200,
  "requiresRsvp": true,
  "isRecurring": true,
  "recurrenceRule": "FREQ=WEEKLY;BYDAY=WE",
  "branchId": "branch-1"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "event": { /* event object */ }
  },
  "message": "Event created successfully"
}
```

---

### POST `/events/{id}/rsvp`
RSVP to an event.

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "status": "attending", // attending|not_attending|maybe
  "numberOfGuests": 2
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "rsvp": {
      "id": "rsvp-789",
      "eventId": "evt-123",
      "memberId": "mem-123",
      "status": "attending",
      "numberOfGuests": 2,
      "createdAt": "2024-11-08T10:00:00Z"
    }
  },
  "message": "RSVP updated successfully"
}
```

---

## 💬 Chat (WebSocket)

### Connection
```javascript
// Connect to WebSocket server
const socket = io('wss://api.yourchurch.com', {
  auth: {
    token: 'bearer_token_here'
  }
});
```

---

### Events

#### `chat:join`
Join a conversation.

**Emit:**
```json
{
  "conversationId": "conv-123"
}
```

#### `chat:message`
Send a message.

**Emit:**
```json
{
  "conversationId": "conv-123",
  "content": "Hello everyone!",
  "type": "text", // text|image|file|voice
  "metadata": {}
}
```

**Listen:**
```json
{
  "id": "msg-456",
  "conversationId": "conv-123",
  "senderId": "user-789",
  "senderName": "John Doe",
  "senderPhoto": "https://cdn.example.com/photos/john.jpg",
  "content": "Hello everyone!",
  "type": "text",
  "timestamp": "2024-11-08T10:15:00Z",
  "readBy": []
}
```

#### `chat:typing`
Indicate typing status.

**Emit:**
```json
{
  "conversationId": "conv-123",
  "isTyping": true
}
```

**Listen:**
```json
{
  "userId": "user-789",
  "userName": "John Doe",
  "conversationId": "conv-123",
  "isTyping": true
}
```

#### `chat:read`
Mark messages as read.

**Emit:**
```json
{
  "messageIds": ["msg-456", "msg-457"]
}
```

---

### REST Endpoints

#### GET `/chat/conversations`
Get user's conversations.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "id": "conv-123",
        "type": "group", // direct|group
        "name": "Youth Ministry Team",
        "photo": "https://cdn.example.com/groups/youth.jpg",
        "participants": [
          {
            "id": "user-456",
            "name": "Jane Smith",
            "photo": "https://cdn.example.com/photos/jane.jpg",
            "isOnline": true,
            "lastSeen": "2024-11-08T10:15:00Z"
          }
        ],
        "lastMessage": {
          "content": "See you Sunday!",
          "timestamp": "2024-11-08T10:15:00Z",
          "senderId": "user-456"
        },
        "unreadCount": 3,
        "updatedAt": "2024-11-08T10:15:00Z"
      }
    ]
  }
}
```

---

#### GET `/chat/conversations/{id}/messages`
Get conversation messages.

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `page` (int)
- `perPage` (int, default: 50)
- `before` (timestamp) - Messages before this time

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "msg-456",
        "conversationId": "conv-123",
        "sender": {
          "id": "user-789",
          "name": "John Doe",
          "photo": "https://cdn.example.com/photos/john.jpg"
        },
        "content": "Hello everyone!",
        "type": "text",
        "timestamp": "2024-11-08T10:15:00Z",
        "readBy": ["user-456", "user-789"],
        "reactions": [
          {
            "emoji": "👍",
            "userId": "user-456",
            "userName": "Jane Smith"
          }
        ]
      }
    ],
    "pagination": { /* pagination object */ }
  }
}
```

---

## 💰 Giving/Donations

### POST `/giving/donate`
Process a donation.

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "amount": 5000,
  "currency": "NGN",
  "paymentMethod": "paystack", // paystack|flutterwave|cash|bank_transfer
  "donorId": "mem-123",
  "campaignId": "camp-456", // Optional
  "category": "tithe", // tithe|offering|seed|building|special
  "isRecurring": false,
  "recurrenceRule": null, // "monthly"|"weekly"|"yearly"
  "isAnonymous": false,
  "notes": "Building fund contribution",
  "paymentData": {
    "email": "john@example.com",
    "reference": "TXN-123456" // From payment gateway
  }
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "donation": {
      "id": "don-789",
      "amount": 5000,
      "currency": "NGN",
      "donorId": "mem-123",
      "campaignId": "camp-456",
      "category": "tithe",
      "paymentMethod": "paystack",
      "paymentStatus": "completed",
      "transactionRef": "TXN-123456",
      "receiptNumber": "RCP-2024-001234",
      "receiptUrl": "https://cdn.example.com/receipts/RCP-2024-001234.pdf",
      "isAnonymous": false,
      "donatedAt": "2024-11-08T10:00:00Z",
      "createdAt": "2024-11-08T10:00:00Z"
    }
  },
  "message": "Donation processed successfully"
}
```

---

### GET `/giving/donations`
Get donations list.

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `donorId` (string) - Filter by donor
- `campaignId` (string) - Filter by campaign
- `category` (string) - Filter by category
- `dateFrom` (date)
- `dateTo` (date)
- `paymentMethod` (string)
- `page` (int)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "donations": [ /* donations array */ ],
    "stats": {
      "totalAmount": 1250000,
      "totalCount": 247,
      "averageAmount": 5060.73
    },
    "pagination": { /* pagination object */ }
  }
}
```

---

### GET `/giving/donor/{donorId}/statement`
Get donor giving statement.

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `year` (int) - Tax year
- `dateFrom` (date)
- `dateTo` (date)
- `format` (string) - pdf|excel

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "statement": {
      "donorId": "mem-123",
      "donorName": "John Doe",
      "period": {
        "from": "2024-01-01",
        "to": "2024-12-31"
      },
      "donations": [ /* donations array */ ],
      "summary": {
        "totalAmount": 120000,
        "totalCount": 24,
        "byCategory": {
          "tithe": 96000,
          "offering": 18000,
          "building": 6000
        }
      },
      "downloadUrl": "https://cdn.example.com/statements/john-doe-2024.pdf"
    }
  }
}
```

---

### POST `/giving/campaigns`
Create donation campaign.

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "name": "New Church Building",
  "description": "Fundraising for our new worship center",
  "goalAmount": 50000000,
  "currency": "NGN",
  "startDate": "2024-11-01",
  "endDate": "2025-12-31",
  "image": "https://cdn.example.com/campaigns/building.jpg",
  "isActive": true
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "campaign": {
      "id": "camp-789",
      "name": "New Church Building",
      /* ... campaign object */
      "stats": {
        "totalRaised": 0,
        "donorCount": 0,
        "percentageReached": 0
      }
    }
  }
}
```

---

## 📊 Reports

### POST `/reports/generate`
Generate a report.

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "reportType": "giving_summary", // attendance_summary|member_demographics|etc
  "format": "pdf", // pdf|excel|csv
  "filters": {
    "dateFrom": "2024-01-01",
    "dateTo": "2024-12-31",
    "branchId": "branch-1"
  },
  "options": {
    "includeCharts": true,
    "groupBy": "month"
  }
}
```

**Response:** `202 Accepted`
```json
{
  "success": true,
  "data": {
    "jobId": "report-job-123",
    "status": "processing",
    "estimatedTime": 30 // seconds
  },
  "message": "Report generation started. You'll receive a notification when ready."
}
```

---

### GET `/reports/job/{jobId}`
Check report generation status.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "jobId": "report-job-123",
    "status": "completed", // processing|completed|failed
    "progress": 100,
    "downloadUrl": "https://cdn.example.com/reports/giving-summary-2024.pdf",
    "expiresAt": "2024-11-15T10:00:00Z",
    "completedAt": "2024-11-08T10:05:00Z"
  }
}
```

---

## 📈 Analytics

### GET `/analytics/dashboard`
Get dashboard analytics.

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `period` (string) - week|month|quarter|year
- `dateFrom` (date)
- `dateTo` (date)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "kpis": {
      "totalMembers": 1250,
      "activeMembers": 1087,
      "newMembersThisMonth": 42,
      "averageAttendance": 847,
      "attendanceRate": 67.8,
      "totalGivingThisMonth": 3250000,
      "totalGivingYTD": 28500000
    },
    "trends": {
      "membership": [
        { "date": "2024-11", "count": 1250, "change": 3.4 }
      ],
      "attendance": [
        { "date": "2024-11-03", "count": 847, "rate": 67.8 }
      ],
      "giving": [
        { "date": "2024-11", "amount": 3250000, "change": 12.5 }
      ]
    },
    "demographics": {
      "byGender": {
        "male": 567,
        "female": 683
      },
      "byAgeGroup": {
        "0-17": 234,
        "18-35": 456,
        "36-50": 378,
        "51+": 182
      }
    }
  }
}
```

---

### GET `/analytics/attendance`
Get attendance analytics.

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `period` (string)
- `groupBy` (string) - service|day|week|month

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalAttendance": 3388,
      "averagePerService": 847,
      "attendanceRate": 67.8,
      "trendPercentage": 5.2
    },
    "byService": [
      {
        "serviceId": "svc-sunday-main",
        "serviceName": "Sunday Main Service",
        "totalAttendance": 2540,
        "averageAttendance": 847,
        "attendanceRate": 67.8
      }
    ],
    "trends": [ /* time series data */ ]
  }
}
```

---

## 🧠 AI Insights

### GET `/ai/insights`
Get AI-generated insights.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "insights": [
      {
        "id": "insight-123",
        "type": "membership_growth",
        "priority": "high",
        "title": "Strong Membership Growth",
        "description": "Your church has grown by 15% in the last quarter, outpacing the national average of 8%.",
        "recommendations": [
          "Consider starting a second service to accommodate growth",
          "Expand parking facilities"
        ],
        "metrics": {
          "growth": 15,
          "benchmark": 8
        },
        "generatedAt": "2024-11-08T10:00:00Z"
      }
    ]
  }
}
```

---

### GET `/ai/predictions/churn`
Get member churn predictions.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "predictions": [
      {
        "memberId": "mem-123",
        "memberName": "John Doe",
        "churnRisk": "high", // low|medium|high
        "churnProbability": 0.78,
        "factors": [
          {
            "factor": "declining_attendance",
            "impact": 0.45,
            "description": "Attendance dropped from 90% to 40% in last 3 months"
          },
          {
            "factor": "no_giving",
            "impact": 0.25,
            "description": "No donations in last 2 months"
          }
        ],
        "recommendations": [
          "Schedule pastoral visit",
          "Invite to small group"
        ],
        "predictedChurnDate": "2024-12-15"
      }
    ],
    "summary": {
      "totalAtRisk": 23,
      "highRisk": 8,
      "mediumRisk": 15
    }
  }
}
```

---

## 🏢 Organizations & Branches

### GET `/organizations`
Get user's organizations.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "organizations": [
      {
        "id": "org-123",
        "name": "Grace Chapel International",
        "logo": "https://cdn.example.com/logos/grace-chapel.png",
        "role": "admin",
        "branches": [
          {
            "id": "branch-1",
            "name": "Main Campus",
            "city": "Lagos"
          },
          {
            "id": "branch-2",
            "name": "Lekki Branch",
            "city": "Lagos"
          }
        ],
        "stats": {
          "totalMembers": 1250,
          "totalBranches": 2
        }
      }
    ]
  }
}
```

---

### POST `/organizations`
Create new organization.

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "name": "New Life Church",
  "denomination": "Pentecostal",
  "country": "Nigeria",
  "timezone": "Africa/Lagos",
  "currency": "NGN",
  "logo": "https://cdn.example.com/logos/new-life.png",
  "contact": {
    "email": "info@newlifechurch.com",
    "phone": "+234XXXXXXXXXX",
    "address": "123 Church St, Lagos"
  }
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "organization": { /* organization object */ }
  }
}
```

---

## 🔔 Notifications

### GET `/notifications`
Get user notifications.

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `unreadOnly` (boolean)
- `page` (int)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "notif-123",
        "type": "event_reminder",
        "title": "Event Reminder",
        "message": "Youth Conference starts tomorrow at 9:00 AM",
        "data": {
          "eventId": "evt-456"
        },
        "isRead": false,
        "createdAt": "2024-11-08T10:00:00Z"
      }
    ],
    "unreadCount": 5,
    "pagination": { /* pagination object */ }
  }
}
```

---

### PUT `/notifications/{id}/read`
Mark notification as read.

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

## 📱 SMS (Africa's Talking Integration)

### POST `/sms/send`
Send SMS (admin only).

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "to": ["+234XXXXXXXXXX", "+234YYYYYYYYYY"],
  "message": "Reminder: Sunday Service at 11:00 AM",
  "sender": "ChurchAfrica"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "messageId": "sms-123",
    "recipients": 2,
    "cost": 2.50, // NGN
    "status": "sent"
  }
}
```

---

## 🗄️ Database Schema (PostgreSQL)

### Tables

```sql
-- Users & Authentication
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'member',
  is_active BOOLEAN DEFAULT true,
  email_verified_at TIMESTAMP,
  phone_verified_at TIMESTAMP,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Members
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
  membership_number VARCHAR(50) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(50),
  photo_url TEXT,
  date_of_birth DATE,
  gender VARCHAR(20),
  status VARCHAR(50) DEFAULT 'active',
  join_date DATE NOT NULL,
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Emergency Contacts
CREATE TABLE emergency_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  relationship VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Organizations
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  denomination VARCHAR(100),
  logo_url TEXT,
  country VARCHAR(100),
  timezone VARCHAR(50),
  currency VARCHAR(10),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  address TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Branches
CREATE TABLE branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  city VARCHAR(100),
  address TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Attendance
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'present',
  check_in_time TIMESTAMP NOT NULL,
  check_in_method VARCHAR(50),
  checked_in_by UUID REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Services
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  service_date DATE NOT NULL,
  service_time TIME NOT NULL,
  end_time TIME,
  location VARCHAR(255),
  expected_attendance INTEGER,
  actual_attendance INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Service QR Codes
CREATE TABLE service_qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id VARCHAR(100) UNIQUE NOT NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  service_name VARCHAR(255) NOT NULL,
  service_date DATE NOT NULL,
  service_time TIME NOT NULL,
  qr_data JSONB NOT NULL,
  qr_image_url TEXT,
  expires_at TIMESTAMP NOT NULL,
  total_checkins INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Member Biometrics
CREATE TABLE member_biometrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  biometric_type VARCHAR(50) DEFAULT 'fingerprint',
  template_data BYTEA NOT NULL,
  device_info JSONB,
  enrolled_at TIMESTAMP DEFAULT NOW(),
  enrolled_by UUID REFERENCES users(id),
  is_active BOOLEAN DEFAULT true
);

-- Events
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP,
  location VARCHAR(255),
  image_url TEXT,
  organizer_id UUID REFERENCES users(id),
  max_attendees INTEGER,
  requires_rsvp BOOLEAN DEFAULT false,
  is_recurring BOOLEAN DEFAULT false,
  recurrence_rule VARCHAR(255),
  status VARCHAR(50) DEFAULT 'upcoming',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Event RSVPs
CREATE TABLE event_rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  number_of_guests INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(event_id, member_id)
);

-- Donations
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  donor_id UUID REFERENCES members(id) ON DELETE SET NULL,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(10) NOT NULL,
  category VARCHAR(50) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'pending',
  transaction_ref VARCHAR(255),
  receipt_number VARCHAR(100),
  receipt_url TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  is_recurring BOOLEAN DEFAULT false,
  recurrence_rule VARCHAR(50),
  notes TEXT,
  donated_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Campaigns
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  goal_amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(10) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Chat Conversations
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL,
  name VARCHAR(255),
  photo_url TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Chat Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'text',
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Groups
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  leader_id UUID REFERENCES members(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Member Groups (Junction Table)
CREATE TABLE member_groups (
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (member_id, group_id)
);

-- Family Relationships
CREATE TABLE family_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  family_member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  relationship VARCHAR(50) NOT NULL,
  is_primary_contact BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_members_organization ON members(organization_id);
CREATE INDEX idx_members_branch ON members(branch_id);
CREATE INDEX idx_members_status ON members(status);
CREATE INDEX idx_attendance_member ON attendance(member_id);
CREATE INDEX idx_attendance_service ON attendance(service_id);
CREATE INDEX idx_attendance_date ON attendance(check_in_time);
CREATE INDEX idx_donations_donor ON donations(donor_id);
CREATE INDEX idx_donations_campaign ON donations(campaign_id);
CREATE INDEX idx_donations_date ON donations(donated_at);
CREATE INDEX idx_events_date ON events(start_date);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
```

---

## ⚡ Rate Limiting

**Default Limits:**
- **Authenticated users:** 100 requests/minute
- **Authentication endpoints:** 10 requests/minute
- **Report generation:** 5 requests/hour
- **Bulk operations:** 10 requests/hour

**Response (429 Too Many Requests):**
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again in 45 seconds.",
    "retryAfter": 45
  }
}
```

---

## 🔐 Error Responses

### Standard Error Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "Specific error details"
    }
  }
}
```

### Common Error Codes

- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `429` - Rate Limit Exceeded
- `500` - Internal Server Error
- `503` - Service Unavailable

---

## 📝 Changelog

**Version 1.0 (2025-11-08)**
- Initial API specification
- All 15 phases documented
- Complete CRUD operations
- WebSocket support
- Biometric integration
- AI/ML endpoints

---

**Document Version:** 1.0  
**Last Updated:** November 8, 2025  
**Status:** ✅ Production Ready
