# Logistics / Distribution Tracking Module

## Overview

The Logistics/Distribution Tracking module enables comprehensive tracking of product deliveries from your warehouse to retailers. It provides real-time visibility into vehicle assignments, driver details, bill tracking, and delivery status updates.

## Features

### 1. **Create Delivery Entry**

- Select vehicle for delivery (Bike/Tempo/Truck)
- Assign delivery staff/driver with contact details
- Select destination retailer/shop
- Attach multiple bills/invoices to a single delivery
- Track total quantity and weight (optional)
- Set dispatch date/time and expected delivery date
- Add remarks/notes

### 2. **Track Deliveries**

- View all deliveries with status filtering
- Real-time status updates (Pending → In Transit → Delivered)
- Track delayed deliveries
- Search by vehicle number, driver, or bill number
- View complete delivery history

### 3. **Bill Tracking**

- One vehicle can carry multiple bills
- Each bill is individually trackable
- Automatic bill-to-delivery mapping
- View total bill amount per delivery

### 4. **Status Management**

- **Pending**: Delivery created but not yet dispatched
- **In Transit**: Vehicle is on the way
- **Delivered**: Successfully delivered to retailer
- **Cancelled**: Delivery cancelled

## Database Schema

### Delivery Model

```javascript
{
  vehicleNumber: String (required, uppercase),
  vehicleType: Enum ['Bike', 'Tempo', 'Truck'],
  driverName: String (required),
  driverMobile: String (required, 10 digits),
  driverId: ObjectId (ref: User),
  retailerId: ObjectId (ref: Retailer, required),
  retailerName: String,
  retailerAddress: String,
  bills: [{
    billId: ObjectId (ref: Bill),
    billNumber: String,
    billAmount: Number
  }],
  totalQuantity: Number,
  totalWeight: Number,
  dispatchDateTime: Date (required),
  expectedDeliveryDate: Date (required),
  actualDeliveryDateTime: Date,
  deliveryStatus: Enum ['Pending', 'In Transit', 'Delivered', 'Cancelled'],
  remarks: String,
  statusHistory: [{
    status: String,
    updatedAt: Date,
    updatedBy: ObjectId (ref: User),
    remarks: String
  }]
}
```

## API Endpoints

### Create Delivery

```
POST /api/deliveries
```

**Request Body:**

```json
{
  "vehicleNumber": "MH12AB1234",
  "vehicleType": "Tempo",
  "driverName": "John Doe",
  "driverMobile": "9876543210",
  "driverId": "user_id_optional",
  "retailerId": "retailer_id",
  "bills": [
    {
      "billId": "bill_id_1",
      "billNumber": "INV001",
      "billAmount": 5000
    }
  ],
  "totalQuantity": 100,
  "totalWeight": 50,
  "dispatchDateTime": "2026-01-19T10:00:00",
  "expectedDeliveryDate": "2026-01-20",
  "remarks": "Handle with care"
}
```

### Get All Deliveries

```
GET /api/deliveries?status=Pending&page=1&limit=50
```

**Query Parameters:**

- `status`: Filter by delivery status
- `vehicleNumber`: Filter by vehicle number
- `driverId`: Filter by driver ID
- `retailerId`: Filter by retailer ID
- `startDate`: Filter by start date
- `endDate`: Filter by end date
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 50)

### Get Single Delivery

```
GET /api/deliveries/:id
```

### Update Delivery

```
PUT /api/deliveries/:id
```

**Request Body:** (all fields optional)

```json
{
  "vehicleNumber": "MH12AB5678",
  "driverName": "Jane Smith",
  "expectedDeliveryDate": "2026-01-21"
}
```

### Update Delivery Status

```
PUT /api/deliveries/:id/status
```

**Request Body:**

```json
{
  "status": "In Transit",
  "remarks": "Left warehouse at 10:00 AM"
}
```

### Delete Delivery

```
DELETE /api/deliveries/:id
```

**Note:** Only pending deliveries can be deleted.

### Get Delivery Statistics

```
GET /api/deliveries/stats/summary?startDate=2026-01-01&endDate=2026-01-31
```

### Track by Vehicle

```
GET /api/deliveries/vehicle/:vehicleNumber
```

### Track by Bill

```
GET /api/deliveries/bill/:billNumber
```

## Frontend Usage

### Navigation

Access the Logistics module from the main app navigation:

- **Mobile App**: Tap on "Delivery" tab in bottom navigation
- **Route**: `/delivery-tracking`

### Creating a Delivery

1. **Select "Create Delivery" Tab**
2. **Enter Vehicle Information:**
   - Vehicle Number (e.g., MH12AB1234)
   - Vehicle Type (Bike/Tempo/Truck)

3. **Enter Driver/Staff Information:**
   - Select from existing staff (optional)
   - Enter driver name
   - Enter 10-digit mobile number

4. **Select Retailer:**
   - Choose retailer from dropdown
   - Address auto-fills

5. **Add Bills:**
   - Click "Add Bill" button
   - Select bills from modal
   - Multiple bills can be added
   - View total bill amount

6. **Enter Additional Details:**
   - Total Quantity (optional)
   - Total Weight (optional)
   - Dispatch Date & Time
   - Expected Delivery Date
   - Remarks (optional)

7. **Submit:**
   - Click "Create Delivery"
   - Delivery is created with "Pending" status

### Tracking Deliveries

1. **Select "Track Deliveries" Tab**
2. **Filter by Status:**
   - All
   - Pending
   - In Transit
   - Delivered
   - Cancelled

3. **View Delivery Details:**
   - Vehicle number and type
   - Driver name and contact
   - Retailer name and address
   - Number of bills and total amount
   - Expected delivery date
   - Delayed indicator (if applicable)

4. **Update Status:**
   - Pending → Click "Mark In Transit"
   - In Transit → Click "Mark Delivered"
   - Status updates are tracked in history

## System Behavior

### Automatic Features

1. **Status History Tracking**: Every status change is automatically logged with timestamp and user
2. **Delivery Date Tracking**: Actual delivery date is auto-set when marked as "Delivered"
3. **Delayed Detection**: System automatically flags deliveries past expected date
4. **Bill Amount Calculation**: Total bill amount is calculated automatically
5. **Vehicle Number Formatting**: Vehicle numbers are auto-converted to uppercase

### Validation Rules

1. Vehicle number is required
2. Driver name and mobile (10 digits) are required
3. At least one bill must be attached
4. Retailer must be selected
5. Expected delivery date is required
6. Only pending deliveries can be deleted

### Data Integrity

1. Bills are validated to ensure they exist
2. Retailer is validated before delivery creation
3. Driver ID is optional but validated if provided
4. Status transitions are tracked in history
5. Duplicate bill assignments are prevented in UI

## Use Cases

### Use Case 1: Daily Delivery Planning

**Scenario:** Plan morning deliveries for multiple retailers

1. Create delivery for Bike with 5 bills for nearby retailers
2. Create delivery for Tempo with 15 bills for medium-distance retailers
3. Create delivery for Truck with 30 bills for far retailers
4. Assign different drivers to each vehicle
5. Set expected delivery times based on distance

### Use Case 2: Real-time Tracking

**Scenario:** Track delivery progress throughout the day

1. Driver calls when leaving warehouse → Update to "In Transit"
2. Driver calls when delivered → Update to "Delivered"
3. Check delayed deliveries dashboard
4. Contact drivers for delayed deliveries

### Use Case 3: Bill Tracking

**Scenario:** Customer calls asking about their bill delivery

1. Search delivery by bill number
2. View current delivery status
3. Check vehicle and driver details
4. Provide ETA to customer

### Use Case 4: Performance Analysis

**Scenario:** Analyze delivery performance

1. Filter deliveries by date range
2. View statistics (total, pending, delivered, cancelled)
3. Identify frequently delayed routes
4. Optimize future delivery planning

## Integration Points

### With Bills Module

- Bills are linked to deliveries
- Bill status can be updated based on delivery
- Bill tracking includes delivery information

### With Retailers Module

- Retailer information auto-populates
- Delivery history per retailer
- Route optimization based on retailer location

### With Users/Staff Module

- Staff can be assigned as drivers
- Driver performance tracking
- User activity logging

## Best Practices

1. **Create deliveries in the morning** before dispatch
2. **Update status in real-time** as deliveries progress
3. **Add remarks** for special instructions or issues
4. **Review delayed deliveries** daily
5. **Use vehicle types appropriately** based on load
6. **Verify bill selection** before creating delivery
7. **Keep driver mobile numbers updated**
8. **Set realistic expected delivery dates**

## Troubleshooting

### Issue: Bills not showing for retailer

**Solution:** Ensure bills are in "Unpaid" or "Partially Paid" status

### Issue: Cannot delete delivery

**Solution:** Only "Pending" status deliveries can be deleted

### Issue: Mobile number validation error

**Solution:** Ensure mobile number is exactly 10 digits

### Issue: Delivery not appearing in list

**Solution:** Check status filter, refresh the page

## Future Enhancements

1. GPS tracking integration
2. Route optimization
3. Delivery proof (signature/photo)
4. SMS notifications to retailers
5. Driver mobile app
6. Barcode scanning for bills
7. Delivery performance analytics
8. Automated dispatch scheduling

## Technical Notes

### Indexes

The following indexes are created for optimal performance:

- `vehicleNumber + dispatchDateTime`
- `driverId + dispatchDateTime`
- `retailerId + dispatchDateTime`
- `deliveryStatus + expectedDeliveryDate`
- `createdAt`

### Virtual Fields

- `totalBillAmount`: Calculated sum of all bill amounts
- `isDelayed`: Boolean indicating if delivery is past expected date

### Timestamps

All deliveries include:

- `createdAt`: When delivery was created
- `updatedAt`: When delivery was last modified
- `dispatchDateTime`: When vehicle left warehouse
- `expectedDeliveryDate`: When delivery should be completed
- `actualDeliveryDateTime`: When delivery was actually completed

## Support

For issues or questions, contact the development team or refer to the main application documentation.
