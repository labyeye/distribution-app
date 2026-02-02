# Logistics Module - Installation & Setup Guide

## Quick Start

### Backend Setup

1. **No additional dependencies required** - The module uses existing packages (express, mongoose, etc.)

2. **Database Migration** - The Delivery model will be automatically created when you first run the server

3. **Start the backend server:**
   ```bash
   cd backend
   npm start
   ```
   Server will run on `http://localhost:2500`

### Frontend Setup (Mobile App)

1. **Install new dependency:**

   ```bash
   cd BusinessManageApp
   npm install @react-native-picker/picker
   ```

2. **Start the app:**

   ```bash
   npm start
   ```

3. **Access the module:**
   - Open the app
   - Navigate to the "Delivery" tab in the bottom navigation

## Verification

### Test Backend API

```bash
# Get all deliveries
curl http://localhost:2500/api/deliveries

# Get delivery statistics
curl http://localhost:2500/api/deliveries/stats/summary
```

### Test Frontend

1. Open the app
2. Click on "Delivery" tab
3. Try creating a test delivery:
   - Enter vehicle number: TEST123
   - Select vehicle type: Bike
   - Enter driver name: Test Driver
   - Enter mobile: 9876543210
   - Select a retailer
   - Add at least one bill
   - Set expected delivery date
   - Submit

## Files Created/Modified

### Backend

- ✅ `backend/models/Delivery.js` - New delivery model
- ✅ `backend/routes/deliveryRoutes.js` - New API routes
- ✅ `backend/server.js` - Updated to include delivery routes

### Frontend

- ✅ `BusinessManageApp/src/pages/DeliveryTracking.tsx` - New page
- ✅ `BusinessManageApp/app/delivery-tracking.tsx` - New route
- ✅ `BusinessManageApp/app/main.tsx` - Updated navigation
- ✅ `BusinessManageApp/src/config/api.ts` - Added DELIVERIES endpoint
- ✅ `BusinessManageApp/package.json` - Added picker dependency

### Documentation

- ✅ `LOGISTICS_MODULE_README.md` - Complete module documentation
- ✅ `LOGISTICS_SETUP.md` - This setup guide

## Troubleshooting

### Issue: "Cannot find module '@react-native-picker/picker'"

**Solution:**

```bash
cd BusinessManageApp
npm install
```

### Issue: Backend routes not working

**Solution:**

1. Ensure backend server is running
2. Check `backend/server.js` includes delivery routes
3. Restart the server

### Issue: No retailers/bills showing in dropdowns

**Solution:**

1. Ensure you have retailers created in the system
2. Ensure you have unpaid bills for the selected retailer
3. Check backend API is accessible

### Issue: TypeScript errors in DeliveryTracking.tsx

**Solution:**

```bash
cd BusinessManageApp
npm install @react-native-picker/picker
```

## Next Steps

1. **Create Test Data:**
   - Add some retailers if you haven't already
   - Create some bills
   - Create test deliveries

2. **Customize:**
   - Adjust vehicle types in `backend/models/Delivery.js` if needed
   - Modify UI colors/styles in `DeliveryTracking.tsx`
   - Add custom validation rules

3. **Integrate:**
   - Link with existing bill management
   - Add to admin dashboard
   - Create reports for delivery analytics

## API Testing with Postman

### Create Delivery

```
POST http://localhost:2500/api/deliveries
Headers: Authorization: Bearer <your_token>
Body:
{
  "vehicleNumber": "MH12AB1234",
  "vehicleType": "Tempo",
  "driverName": "John Doe",
  "driverMobile": "9876543210",
  "retailerId": "<retailer_id>",
  "bills": [
    {
      "billId": "<bill_id>",
      "billNumber": "INV001",
      "billAmount": 5000
    }
  ],
  "expectedDeliveryDate": "2026-01-20",
  "dispatchDateTime": "2026-01-19T10:00:00"
}
```

### Update Status

```
PUT http://localhost:2500/api/deliveries/<delivery_id>/status
Headers: Authorization: Bearer <your_token>
Body:
{
  "status": "In Transit",
  "remarks": "Left warehouse"
}
```

## Production Deployment

### Backend

1. Ensure MongoDB indexes are created (automatic on first run)
2. Set proper environment variables
3. Enable CORS for your frontend domain
4. Add rate limiting for API endpoints

### Frontend

1. Update API_BASE_URL in `src/config/api.ts` to production URL
2. Build the app for production
3. Test all delivery flows
4. Enable error tracking (Sentry, etc.)

## Support

For questions or issues:

1. Check `LOGISTICS_MODULE_README.md` for detailed documentation
2. Review API endpoints and request/response formats
3. Check browser/app console for errors
4. Verify backend logs for API errors

## Success Checklist

- [ ] Backend server running without errors
- [ ] Delivery routes accessible via API
- [ ] Mobile app shows "Delivery" tab
- [ ] Can create a test delivery
- [ ] Can view deliveries list
- [ ] Can update delivery status
- [ ] Can filter deliveries by status
- [ ] Bills are properly linked to deliveries
- [ ] Retailer information displays correctly
- [ ] Status history is tracked

---

**Module Version:** 1.0.0  
**Last Updated:** January 19, 2026  
**Compatible With:** Laxmi Lube Management System v1.x
