# User Permission & Access Control System

## Overview

The User Permission & Access Control System provides granular control over what users can view, create, edit, and delete across different modules of the application. This system allows administrators to configure permissions at a very detailed level, ensuring users only have access to the features they need.

## Features

- ✅ **Granular Permissions**: Control access at module and action level
- ✅ **Permission Templates**: Pre-configured permission sets for common roles
- ✅ **Easy Management**: Intuitive UI for assigning and modifying permissions
- ✅ **Frontend Integration**: React hooks and components for permission checking
- ✅ **Backend Protection**: Middleware for API route protection
- ✅ **Admin Override**: Administrators always have full access
- ✅ **Settings Integration**: Permission templates viewable in Settings

## Permission Structure

### Modules
The system supports permissions for the following modules:

- **Dashboard**: Overall system dashboard
- **Bills**: Bill management
- **Collections**: Payment collection tracking
- **Products**: Product catalog management
- **Retailers**: Retailer information management
- **Orders**: Order processing
- **Deliveries**: Delivery tracking and management
- **Users**: User account management
- **Reports**: Report viewing and generation
- **Salary**: Salary management
- **Advances**: Advance payment management
- **Attendance**: Attendance tracking
- **Settings**: System settings

### Actions
Each module can have different actions with independent permission controls:

- **view**: Read-only access
- **create**: Ability to add new records
- **edit**: Ability to modify existing records
- **delete**: Ability to remove records
- **assign**: Ability to assign tasks (Bills module)
- **approve**: Ability to approve requests (Orders module)
- **export**: Ability to export data (Reports module)

## Permission Templates

### 1. Full Access
Complete access to all features. Best for managers and supervisors.
- All modules: All actions enabled

### 2. Field Staff (DSR)
Collection and order management for distribution sales representatives.
- **Dashboard**: View
- **Bills**: View only
- **Collections**: View, Create
- **Orders**: View, Create
- **Products**: View only
- **Retailers**: View only
- Other modules: Limited or no access

### 3. Supervisor
View and approve operations. Can manage most features except user administration.
- **Dashboard**: View
- **Bills**: View, Create, Edit, Assign
- **Collections**: View, Create, Edit
- **Orders**: View, Create, Edit, Approve
- **Reports**: View, Export
- Other modules: View and limited edit access

### 4. View Only
Read-only access to most modules.
- All modules: View only
- No create, edit, or delete permissions

### 5. Accountant
Financial management access.
- **Bills**: View, Create, Edit
- **Collections**: View, Create, Edit
- **Salary**: View, Create, Edit
- **Advances**: View, Create, Edit
- **Reports**: View, Export
- Other modules: Limited access

### 6. Warehouse Manager
Product, delivery, and inventory management.
- **Products**: Full access
- **Deliveries**: Full access
- **Orders**: View, Edit, Approve
- Financial modules: Limited access

## Backend Implementation

### User Model
The User model includes a `permissions` field with nested objects:

```javascript
permissions: {
  bills: {
    view: Boolean,
    create: Boolean,
    edit: Boolean,
    delete: Boolean,
    assign: Boolean
  },
  // ... other modules
}
```

### Middleware
**checkPermission(module, action)**: Middleware function to protect routes

```javascript
const { checkPermission } = require('../middleware/authMiddleware');

router.post('/bills', protect, checkPermission('bills', 'create'), createBill);
router.put('/bills/:id', protect, checkPermission('bills', 'edit'), updateBill);
router.delete('/bills/:id', protect, checkPermission('bills', 'delete'), deleteBill);
```

### API Endpoints

**Update User Permissions**
```
PATCH /api/users/:id/permissions
Body: { permissions: {...} }
```

**Get User with Permissions**
```
GET /api/users/:id
Returns user object with permissions
```

## Frontend Implementation

### React Hooks

#### usePermissions
Main hook for accessing user permissions:

```javascript
import { usePermissions } from '../hooks/usePermissions';

const MyComponent = () => {
  const { user, hasPermission, canAccessModule, isAdmin } = usePermissions();

  if (hasPermission('bills', 'create')) {
    // Show create bill button
  }
};
```

#### useHasPermission
Quick permission check:

```javascript
import { useHasPermission } from '../hooks/usePermissions';

const MyComponent = () => {
  const canEdit = useHasPermission('bills', 'edit');
};
```

### Protected Components

#### ProtectedComponent
Conditionally render based on permission:

```javascript
import ProtectedComponent from '../components/ProtectedComponent';

<ProtectedComponent module="bills" action="create">
  <CreateBillButton />
</ProtectedComponent>
```

#### AdminOnly
Show content only to administrators:

```javascript
import { AdminOnly } from '../components/ProtectedComponent';

<AdminOnly>
  <AdminPanel />
</AdminOnly>
```

#### HasAnyPermission / HasAllPermissions
Check multiple permissions:

```javascript
import { HasAnyPermission, HasAllPermissions } from '../components/ProtectedComponent';

<HasAnyPermission permissions={[
  { module: 'bills', action: 'edit' },
  { module: 'bills', action: 'delete' }
]}>
  <EditTools />
</HasAnyPermission>
```

#### RoleBasedContent
Show different content based on role:

```javascript
import { RoleBasedContent } from '../components/ProtectedComponent';

<RoleBasedContent
  admin={<AdminDashboard />}
  staff={<StaffDashboard />}
  retailer={<RetailerDashboard />}
/>
```

### Utility Functions

```javascript
import { 
  hasPermission,
  canAccessModule,
  getModulePermissions,
  getAccessibleModules,
  filterNavigation
} from '../utils/permissions';

// Check specific permission
const canCreate = hasPermission(user, 'bills', 'create');

// Check module access
const canViewBills = canAccessModule(user, 'bills');

// Get all permissions for a module
const billPermissions = getModulePermissions(user, 'bills');
// Returns: { view: true, create: false, edit: false, ... }

// Get list of accessible modules
const modules = getAccessibleModules(user);
// Returns: ['dashboard', 'bills', 'collections', ...]

// Filter navigation based on permissions
const filteredNav = filterNavigation(navItems, user);
```

## Usage Guide

### For Administrators

#### 1. Access User Management
Navigate to **User Management** page from the main menu.

#### 2. Manage User Permissions
- Click the **shield icon** (🛡️) next to any user
- A permission management modal will open

#### 3. Apply Permission Template
- Select a pre-configured template from the Quick Templates section
- Templates include: Full Access, Field Staff, Supervisor, View Only, Accountant, Warehouse Manager

#### 4. Customize Permissions
- Toggle individual permissions by clicking checkboxes
- Click module headers to toggle all permissions for that module
- Selection changes to "Custom" when manually adjusting

#### 5. Save Changes
- Click **Save Permissions** to apply changes
- User's access will be updated immediately

#### 6. View Permission Templates
- Navigate to **Settings** → **Permissions** tab
- View detailed information about each template
- See permission breakdowns and usage instructions

### For Developers

#### Protecting a New Route
```javascript
// Backend
const { protect, checkPermission } = require('../middleware/authMiddleware');

router.post('/new-feature', 
  protect, 
  checkPermission('moduleName', 'create'), 
  controller
);
```

#### Adding Permission Check to Component
```javascript
import { usePermissions } from '../hooks/usePermissions';

const MyComponent = () => {
  const { hasPermission } = usePermissions();

  return (
    <div>
      {hasPermission('bills', 'create') && (
        <button>Create Bill</button>
      )}
    </div>
  );
};
```

#### Protecting an Entire Page
```javascript
import { withPermission } from '../components/ProtectedComponent';

const BillCreatePage = () => {
  // Page content
};

export default withPermission(BillCreatePage, 'bills', 'create');
```

## Security Considerations

1. **Admin Override**: Administrators (`role: 'admin'`) always have full access regardless of permissions
2. **Token-based Auth**: All API calls require valid JWT token
3. **Double Protection**: Both frontend and backend check permissions
4. **Default Deny**: Users without explicit permissions are denied access
5. **Audit Trail**: Consider adding logging for permission changes (future enhancement)

## Future Enhancements

- [ ] Permission change audit log
- [ ] Bulk permission updates
- [ ] Custom permission templates
- [ ] Permission inheritance
- [ ] Time-based permissions
- [ ] IP-based restrictions
- [ ] Two-factor authentication for sensitive actions

## Troubleshooting

### User can't access a feature
1. Check user's role (Admin, Staff, Retailer)
2. Verify permissions in User Management
3. Check if module exists in permissions object
4. Verify API middleware is applied correctly

### Permissions not updating
1. Clear browser cache and localStorage
2. Logout and login again
3. Check backend response includes updated permissions
4. Verify database was updated

### Template not applying
1. Ensure you clicked the template card
2. Check if "Custom" is selected (means manual changes made)
3. Click Save Permissions after selecting template

## API Reference

### Get All Users with Permissions
```
GET /api/users
Authorization: Bearer {token}
Admin only
```

### Update User Permissions
```
PATCH /api/users/:id/permissions
Authorization: Bearer {token}
Admin only
Body: {
  permissions: {
    bills: { view: true, create: false, ... },
    ...
  }
}
```

### Get Current User with Permissions
```
GET /api/users/me
Authorization: Bearer {token}
```

## Files Modified/Created

### Backend
- `backend/models/User.js` - Added permissions field
- `backend/middleware/authMiddleware.js` - Added checkPermission middleware
- `backend/routes/userRoutes.js` - Added permissions endpoints

### Frontend Components
- `init/src/components/PermissionManager.js` - Permission management UI
- `init/src/components/PermissionTemplates.js` - Template display component
- `init/src/components/ProtectedComponent.js` - Permission-based rendering

### Frontend Pages
- `init/src/pages/Users.js` - Added permission management modal
- `init/src/pages/Settings.js` - Added Permissions tab

### Frontend Utilities
- `init/src/utils/permissions.js` - Permission checking functions
- `init/src/hooks/usePermissions.js` - React hooks for permissions

## Support

For questions or issues with the permission system:
1. Check this documentation
2. Review permission templates in Settings
3. Contact system administrator
4. Check console for error messages

---

**Version**: 1.0.0  
**Last Updated**: February 2026  
**Author**: Distribution App Development Team
