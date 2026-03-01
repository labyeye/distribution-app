# 🚀 Quick Start Guide - User Permission System

## ⚡ Get Started in 5 Minutes

### Step 1: Restart Your Servers

#### Backend
```bash
cd backend
npm start
```
Server will run on: `http://localhost:2500`

#### Frontend
```bash
cd init
npm start
```
Application will open at: `http://localhost:3000`

---

### Step 2: Login as Administrator

Use the default admin credentials:
- **Email:** `admin@llpl.com`
- **Password:** `Pankaj@2025`

---

### Step 3: Access User Management

1. Click on **"User Management"** in the navigation menu
2. You'll see a list of all users

---

### Step 4: Manage User Permissions

1. **Find the user** you want to configure
2. **Click the shield icon** (🛡️) in the Actions column
3. A permission management modal will open

---

### Step 5: Choose a Permission Template

Select one of the pre-configured templates:

| Template | Best For | Description |
|----------|----------|-------------|
| **Full Access** | Managers | Complete access to everything |
| **Field Staff (DSR)** | Sales Reps | Collection and orders only |
| **Supervisor** | Team Leads | Approve & manage operations |
| **View Only** | Auditors | Read-only access |
| **Accountant** | Finance Team | Financial management |
| **Warehouse Manager** | Warehouse | Products & deliveries |

**OR** customize permissions manually by toggling checkboxes.

---

### Step 6: Save Changes

Click **"Save Permissions"** button at the bottom.

✅ **Done!** The user's access is now updated.

---

## 🎯 Quick Examples

### Example 1: Setting Up a Field Staff Member

1. Go to User Management
2. Click shield icon next to a staff user
3. Select **"Field Staff (DSR)"** template
4. Click Save
5. **Result:** User can now:
   - View bills assigned to them
   - Record collections
   - Create orders
   - View their dashboard

### Example 2: Setting Up a Supervisor

1. Go to User Management
2. Click shield icon next to the user
3. Select **"Supervisor"** template
4. Click Save
5. **Result:** User can now:
   - Manage bills and assign them
   - Approve orders
   - View and export reports
   - Manage attendance

### Example 3: Custom Permissions

1. Open permission modal for a user
2. Start with any template (or none)
3. Click module headers to toggle all permissions for that module
4. Or toggle individual checkboxes
5. Click Save
6. **Result:** User has exactly the permissions you configured

---

## 📚 View Permission Templates

Want to see what each template includes?

1. Go to **Settings** (gear icon in navigation)
2. Click the **"Permissions"** tab
3. Browse all templates with detailed breakdowns

---

## 🔍 Check What a User Can Access

After setting permissions:

1. **Logout** from admin account
2. **Login** with the staff user's credentials
3. You'll only see the features they have access to
4. Restricted features will be hidden or disabled

---

## 🛠️ For Developers: Adding Permission Checks

### Protect a Button/Feature

```javascript
import { usePermissions } from '../hooks/usePermissions';

const MyComponent = () => {
  const { hasPermission } = usePermissions();

  return (
    <>
      {hasPermission('bills', 'create') && (
        <button>Create Bill</button>
      )}
    </>
  );
};
```

### Using Protected Component Wrapper

```javascript
import ProtectedComponent from '../components/ProtectedComponent';

<ProtectedComponent module="products" action="edit">
  <EditProductForm />
</ProtectedComponent>
```

### Protect an API Route

```javascript
const { protect, checkPermission } = require('../middleware/authMiddleware');

router.post('/products', 
  protect, 
  checkPermission('products', 'create'), 
  createProduct
);
```

---

## ⚠️ Important Notes

### Admin Users
- **Admins have ALL permissions automatically**
- You cannot restrict admin access
- This is by design for security

### Existing Users
- All existing users will have **default permissions**
- Default gives basic view access
- You need to configure each user's permissions

### Logout Required
- Users need to **logout and login** after permission changes
- This refreshes their authentication token
- Or they can clear browser cache

---

## 🆘 Troubleshooting

### Problem: Can't see shield icon
**Solution:** Make sure you're logged in as admin

### Problem: Changes not applying
**Solution:** User needs to logout and login again

### Problem: User has too much access
**Solution:** 
1. Open their permission modal
2. Select "View Only" template
3. Save changes
4. Ask user to logout/login

### Problem: Need to give temporary access
**Solution:**
1. Enable specific permissions
2. User logs out/in
3. Later, disable those permissions
4. User logs out/in again

---

## 📖 Full Documentation

For complete details, see:
- **[USER_PERMISSIONS_GUIDE.md](USER_PERMISSIONS_GUIDE.md)** - Complete documentation
- **[PERMISSION_SYSTEM_SUMMARY.md](PERMISSION_SYSTEM_SUMMARY.md)** - Implementation summary

---

## ✅ Quick Testing Checklist

- [ ] Can open permission modal for a user
- [ ] Can select a template
- [ ] Can customize individual permissions
- [ ] Can save changes
- [ ] User has correct access after logout/login
- [ ] Admin still has full access
- [ ] Settings → Permissions tab shows templates

---

## 🎉 You're All Set!

The permission system is now ready to use. Start by configuring your staff members' access levels to match their job responsibilities.

**Need help?** Check the full documentation in `USER_PERMISSIONS_GUIDE.md`

---

**Quick Reference:**

| Action | Location |
|--------|----------|
| Manage Permissions | User Management → Shield Icon |
| View Templates | Settings → Permissions Tab |
| Examples | PermissionExamplePage.js |
| Full Docs | USER_PERMISSIONS_GUIDE.md |

**Happy Permission Managing! 🚀**
