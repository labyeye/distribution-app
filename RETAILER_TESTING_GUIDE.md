# Retailer Role - Quick Testing Guide (Simplified Version)

## 🧪 Testing the Simplified Retailer System

---

## Prerequisites

Both servers should be running:

```bash
# Backend: http://localhost:2500 ✓
# Frontend: http://localhost:3000 ✓
```

---

## Test 1: Create Retailer with Login Credentials

### Steps:

1. **Login as Admin**
   - Go to `http://localhost:3000/login`
   - Enter admin credentials
   - Click "Login"

2. **Navigate to Add Retailer**
   - Click "Retailers" in sidebar
   - Click "Add Retailer"

3. **Fill the Form**
   - **Retailer Name**: "Test Shop ABC"
   - **Address Line 1**: "123 Main Street"
   - **Address Line 2**: "Suite 100" (optional)
   - **Day Assigned**: Select "Monday"
   - **Assign To Staff**: Select any staff member
   - **Email (for login)**: "testshop@example.com"
   - **Password (for login)**: "password123"

4. **Submit**
   - Click "Add Retailer" button

### Expected Result:

- ✅ Success message: "Retailer added successfully!"
- ✅ Retailer created in database
- ✅ User account auto-created with:
  - Email: testshop@example.com
  - Role: retailer
  - isActive: true
- ✅ User linked to retailer

### Verify in Database (Optional):

```javascript
// Check retailer
db.retailers.findOne({ name: "Test Shop ABC" });
// Should show: status: "ACTIVE", userId: <user_id>

// Check user
db.users.findOne({ email: "testshop@example.com" });
// Should show: role: "retailer", isActive: true, retailerId: <retailer_id>
```

---

## Test 2: Retailer Login

### Steps:

1. **Logout from Admin**
   - Click "Logout" in sidebar

2. **Login as Retailer**
   - Email: "testshop@example.com"
   - Password: "password123"
   - Click "Login"

### Expected Result:

- ✅ Login successful
- ✅ Redirected to `/retailer` (Retailer Dashboard)
- ✅ See custom retailer sidebar with:
  - Dashboard
  - Billing & Payments
  - Payment History
  - My Orders
  - Profile
  - Logout
- ✅ Dashboard shows:
  - Shop information card
  - Financial summary cards
  - Recent bills table (if any bills exist)

---

## Test 3: Duplicate Email Prevention

### Steps:

1. **Login as Admin** (if not already)

2. **Try to Create Another Retailer**
   - Go to "Add Retailer"
   - Fill form with:
     - Name: "Another Shop"
     - Address: "456 Other St"
     - Email: "testshop@example.com" (same as before)
     - Password: "anypassword"
   - Click "Add Retailer"

### Expected Result:

- ✅ Error message: "Email already registered"
- ✅ Retailer NOT created
- ✅ No duplicate user account

---

## Test 4: Create Retailer WITHOUT Login Credentials

### Steps:

1. **Login as Admin**

2. **Add Retailer Without Email/Password**
   - Go to "Add Retailer"
   - Fill form:
     - Name: "Shop Without Login"
     - Address: "789 No Login St"
     - Day Assigned: "Tuesday"
     - Assign To Staff: Select staff
     - **Email**: Leave empty
     - **Password**: Leave empty
   - Click "Add Retailer"

### Expected Result:

- ✅ Retailer created successfully
- ✅ NO user account created
- ✅ Retailer cannot login (no credentials)
- ✅ Useful for retailers who don't need system access

---

## Test 5: Retailer Dashboard Functionality

### Steps:

1. **Login as Retailer** (testshop@example.com)

2. **Explore Dashboard**
   - View shop information
   - Check financial summary cards
   - View recent bills

3. **Navigate to Billing**
   - Click "Billing & Payments" in sidebar
   - Should see `/retailer/billing` page
   - View all bills
   - Test filter buttons (All, Paid, Partially Paid, Unpaid)

### Expected Result:

- ✅ Dashboard loads without errors
- ✅ Data displays correctly
- ✅ Navigation works
- ✅ Filters work
- ✅ Only sees own retailer's data

---

## Test 6: Role-Based Access Control

### Test Retailer Cannot Access Admin Routes:

1. **Login as Retailer**
2. **Try to navigate to:**
   - `http://localhost:3000/admin`
   - `http://localhost:3000/admin/users`
   - `http://localhost:3000/admin/add-retailer`

### Expected Result:

- ✅ All redirect to `/login`
- ✅ No unauthorized access

### Test Admin Cannot Access Retailer Routes:

1. **Login as Admin**
2. **Try to navigate to:**
   - `http://localhost:3000/retailer`
   - `http://localhost:3000/retailer/billing`

### Expected Result:

- ✅ All redirect to `/login`
- ✅ No unauthorized access

---

## Test 7: Responsive Design

### Steps:

1. **Login as Retailer**
2. **Open DevTools** (F12)
3. **Toggle Device Toolbar** (Ctrl+Shift+M / Cmd+Shift+M)
4. **Test Different Sizes:**
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1200px)

### Expected Result:

- ✅ Sidebar collapses on mobile
- ✅ Tables convert to cards on mobile
- ✅ All content accessible
- ✅ No horizontal scrolling
- ✅ Buttons remain clickable

---

## Test 8: Edit Retailer (Add Login Later)

### Scenario:

Retailer was created without login, now admin wants to add login credentials.

### Steps:

1. **Login as Admin**
2. **Go to Retailer List**
3. **Edit "Shop Without Login"**
4. **Add Email/Password**
   - Email: "nologin@shop.com"
   - Password: "newpass123"
5. **Save**

### Expected Result:

- ✅ User account created
- ✅ Retailer can now login
- ✅ Linked properly

**Note:** This requires implementing an edit endpoint that handles user creation. Currently, you may need to add this functionality.

---

## Common Issues & Solutions

### Issue 1: "Email already registered"

**Cause:** Trying to use an email that exists  
**Solution:** Use a different email or delete the existing user

### Issue 2: Cannot login after creating retailer

**Cause:** Email/password not provided during creation  
**Solution:** Ensure email and password fields are filled

### Issue 3: Retailer dashboard shows no data

**Cause:** No bills created for this retailer  
**Solution:** Create some bills for the retailer via admin panel

### Issue 4: 401 Unauthorized errors

**Cause:** Token expired or invalid  
**Solution:** Logout and login again

---

## Quick Verification Checklist

After testing, verify:

- ✅ Admin can create retailers with login
- ✅ User accounts auto-created
- ✅ Retailers can login immediately
- ✅ Duplicate emails prevented
- ✅ Role-based access works
- ✅ Retailer dashboard displays correctly
- ✅ Billing page works
- ✅ No console errors
- ✅ Responsive on all devices

---

## Success Criteria

All tests should pass with:

- ✅ No errors in browser console
- ✅ No errors in backend terminal
- ✅ Smooth user experience
- ✅ Data displays correctly
- ✅ Navigation works properly
- ✅ Security enforced (role-based access)

---

## Next Steps

If all tests pass:

1. ✅ System is ready for production
2. ✅ Create more retailers for testing
3. ✅ Add bills for retailers
4. ✅ Test payment tracking
5. ✅ Test order placement (if implemented)

---

**Happy Testing! 🚀**

**Simplified Version Benefits:**

- ✅ No signup page to test
- ✅ No approval workflow to test
- ✅ Faster testing process
- ✅ Simpler user flow
- ✅ Less potential for bugs
