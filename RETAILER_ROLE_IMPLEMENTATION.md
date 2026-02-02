# Retailer Role Implementation Plan

## Overview

This document outlines the implementation of a new **Retailer** role in the Distribution CRM, transforming it from an Admin + Staff system into a scalable, role-based distribution management platform.

## Implementation Phases

### Phase 1: Backend - User Model & Authentication Enhancement

- [x] Update User model to support 'retailer' role
- [x] Enhance authentication middleware for retailer access
- [x] Create retailer-specific authentication routes

### Phase 2: Backend - Retailer Model Enhancement

- [x] Update Retailer model to include user credentials
- [x] Add approval status field (PENDING, ACTIVE, REJECTED)
- [x] Add collection days (multi-select support)
- [x] Link retailer to staff assignment

### Phase 3: Backend - Retailer Signup & Approval APIs

- [ ] Create retailer signup endpoint
- [ ] Create admin approval/rejection endpoints
- [ ] Create retailer approval queue endpoint

### Phase 4: Backend - Retailer-Specific APIs

- [ ] Dashboard API (financial summary)
- [ ] Billing history API
- [ ] Payment history API
- [ ] Order placement API
- [ ] Order status tracking API

### Phase 5: Frontend - Retailer Signup Page

- [ ] Create RetailerSignup component
- [ ] Form validation
- [ ] Staff dropdown integration
- [ ] Collection days multi-select

### Phase 6: Frontend - Admin Approval Interface

- [ ] Add Retailer Approval section to Admin Dashboard
- [ ] Create approval queue table
- [ ] Implement approve/reject actions

### Phase 7: Frontend - Retailer Dashboard

- [ ] Create RetailerDashboard component
- [ ] Financial summary cards
- [ ] Billing overview
- [ ] Payment history

### Phase 8: Frontend - Retailer Sidebar & Navigation

- [ ] Create RetailerLayout component
- [ ] Implement retailer-specific sidebar
- [ ] Add routing for retailer pages

### Phase 9: Frontend - Retailer Features

- [ ] Billing & Payment Management page
- [ ] Order Placement page
- [ ] Order Tracking page
- [ ] Profile/Settings page

### Phase 10: Authorization & Security

- [ ] Implement role-based route guards
- [ ] Add API authorization checks
- [ ] Ensure data isolation (retailers see only their data)

### Phase 11: Testing & Refinement

- [ ] Test all user flows
- [ ] Verify role-based access control
- [ ] UI/UX consistency check

## Technical Details

### Database Schema Changes

#### User Model

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: ['admin', 'staff', 'retailer'],
  retailerId: ObjectId (ref: Retailer) // For retailer users
}
```

#### Retailer Model

```javascript
{
  name: String,
  address1: String,
  address2: String,
  assignedTo: ObjectId (ref: User),
  collectionDays: [String], // Array of days
  userId: ObjectId (ref: User), // Link to user account
  status: ['PENDING', 'ACTIVE', 'REJECTED'],
  createdAt: Date,
  updatedAt: Date
}
```

### API Endpoints

#### Authentication

- POST `/api/auth/retailer/signup` - Retailer registration
- POST `/api/auth/login` - Unified login (existing, enhanced)

#### Admin - Retailer Management

- GET `/api/admin/retailers/pending` - Get pending approvals
- PUT `/api/admin/retailers/:id/approve` - Approve retailer
- PUT `/api/admin/retailers/:id/reject` - Reject retailer

#### Retailer - Dashboard & Data

- GET `/api/retailer/dashboard` - Financial summary
- GET `/api/retailer/bills` - Billing history
- GET `/api/retailer/payments` - Payment history
- POST `/api/retailer/orders` - Place order
- GET `/api/retailer/orders` - View orders
- GET `/api/retailer/profile` - Get profile

### Frontend Routes

#### Public

- `/login` - Unified login
- `/retailer/signup` - Retailer registration

#### Retailer Routes (Protected)

- `/retailer` - Dashboard
- `/retailer/billing` - Billing & Payments
- `/retailer/orders` - Order Management
- `/retailer/orders/new` - Place New Order
- `/retailer/profile` - Profile Settings

#### Admin Routes (Enhanced)

- `/admin/retailers/approval` - Retailer Approval Queue

## Design Consistency

- Maintain existing color scheme (#4e73df primary, #1cc88a success, #f6c23e warning)
- Use existing card layouts and spacing
- Follow current typography and icon usage
- Ensure responsive design across all new components

## Security Considerations

1. Password hashing for retailer accounts
2. JWT token-based authentication
3. Role-based middleware on all protected routes
4. Data isolation - retailers can only access their own data
5. Staff can only access assigned retailers
6. Admin has unrestricted access

## Status Workflow

### Retailer Signup Flow

1. Retailer fills signup form
2. Account created with status = PENDING
3. Login disabled until approval
4. Admin receives notification (in approval queue)
5. Admin approves → status = ACTIVE, login enabled
6. Admin rejects → status = REJECTED, account inactive

### Order Approval Flow

1. Retailer places order
2. Order status = PENDING
3. Admin reviews order
4. Admin approves/rejects
5. Retailer sees updated status

## Next Steps

Execute phases sequentially, starting with Phase 1.
