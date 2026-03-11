# DistributeX
## Complete User Manual

---

**Product:** DistributeX — Distribution Management Platform  
**Tagline:** *Manage Your Distribution Business, End to End.*  
**Version:** v1.0  
**Date:** March 2026  
**Audience:** Administrators, Staff (DSR), and Retailers  
**Document Status:** Official Release

---

> *This document is the official user manual for DistributeX v1.0. It is intended for use by all platform users including business administrators, field sales staff, and retailer partners. For technical support, refer to the Support section at the end of this document.*

---

---

# Table of Contents

1. [Introduction](#1-introduction)
   - 1.1 [About DistributeX](#11-about-distributex)
   - 1.2 [Who This Manual Is For](#12-who-this-manual-is-for)
   - 1.3 [How to Use This Manual](#13-how-to-use-this-manual)
   - 1.4 [Key Conventions & Icons](#14-key-conventions--icons)

2. [Getting Started](#2-getting-started)
   - 2.1 [System Requirements](#21-system-requirements)
   - 2.2 [Accessing the Web Application](#22-accessing-the-web-application)
   - 2.3 [Accessing the Mobile App](#23-accessing-the-mobile-app)
   - 2.4 [First-Time Login](#24-first-time-login)
   - 2.5 [Understanding the Interface](#25-understanding-the-interface)

3. [Role-Based Quick Start Guides](#3-role-based-quick-start-guides)
   - 3.1 [Admin Quick Start](#31-admin-quick-start)
   - 3.2 [Staff (DSR) Quick Start](#32-staff-dsr-quick-start)
   - 3.3 [Retailer Quick Start](#33-retailer-quick-start)

4. [Module 1 — Authentication & Onboarding](#4-module-1--authentication--onboarding)
   - 4.1 [Logging In](#41-logging-in)
   - 4.2 [Role-Based Redirection After Login](#42-role-based-redirection-after-login)
   - 4.3 [Session Management & Auto-Logout](#43-session-management--auto-logout)
   - 4.4 [Retailer Self-Registration](#44-retailer-self-registration)

5. [Module 2 — Admin Dashboard](#5-module-2--admin-dashboard)
   - 5.1 [KPI Summary Cards](#51-kpi-summary-cards)
   - 5.2 [Financial Overview Panel](#52-financial-overview-panel)
   - 5.3 [Interactive Charts](#53-interactive-charts)
   - 5.4 [DSR-Wise Collection Breakdown](#54-dsr-wise-collection-breakdown)
   - 5.5 [Outstanding DSR Summary](#55-outstanding-dsr-summary)
   - 5.6 [Recent Collections List](#56-recent-collections-list)
   - 5.7 [Quick Navigation Links](#57-quick-navigation-links)

6. [Module 3 — Staff Dashboard](#6-module-3--staff-dashboard)
   - 6.1 [Overview](#61-overview)
   - 6.2 [Today's Assigned Bills](#62-todays-assigned-bills)
   - 6.3 [Quick Action Links](#63-quick-action-links)

7. [Module 4 — Retailer Dashboard](#7-module-4--retailer-dashboard)
   - 7.1 [Overview](#71-overview)
   - 7.2 [Bills & Outstanding Summary](#72-bills--outstanding-summary)
   - 7.3 [Navigation Cards](#73-navigation-cards)

8. [Module 5 — Bills Management](#8-module-5--bills-management)
   - 8.1 [Adding a New Bill](#81-adding-a-new-bill)
   - 8.2 [Bill Statuses](#82-bill-statuses)
   - 8.3 [Assigning a Bill to Staff](#83-assigning-a-bill-to-staff)
   - 8.4 [Viewing and Filtering Bills](#84-viewing-and-filtering-bills)
   - 8.5 [Editing a Bill](#85-editing-a-bill)
   - 8.6 [Deleting a Bill](#86-deleting-a-bill)
   - 8.7 [Bill History & Audit Log](#87-bill-history--audit-log)
   - 8.8 [Bills Assigned Today View](#88-bills-assigned-today-view)
   - 8.9 [Bills History View](#89-bills-history-view)

9. [Module 6 — Collections Management](#9-module-6--collections-management)
   - 9.1 [Recording a Payment / Collection](#91-recording-a-payment--collection)
   - 9.2 [Viewing Collection History](#92-viewing-collection-history)
   - 9.3 [DSR Collection Summary](#93-dsr-collection-summary)
   - 9.4 [Exporting Collection Reports](#94-exporting-collection-reports)

10. [Module 7 — Retailer Management](#10-module-7--retailer-management)
    - 10.1 [Adding a New Retailer](#101-adding-a-new-retailer)
    - 10.2 [Viewing and Editing the Retailer List](#102-viewing-and-editing-the-retailer-list)
    - 10.3 [Retailer Approval Workflow](#103-retailer-approval-workflow)
    - 10.4 [Retailer Statuses](#104-retailer-statuses)

11. [Module 8 — Product Management](#11-module-8--product-management)
    - 11.1 [Adding a New Product](#111-adding-a-new-product)
    - 11.2 [Viewing and Editing the Product Catalogue](#112-viewing-and-editing-the-product-catalogue)
    - 11.3 [Stock Tracking](#113-stock-tracking)

12. [Module 9 — Order Management](#12-module-9--order-management)
    - 12.1 [Creating an Order (Staff)](#121-creating-an-order-staff)
    - 12.2 [Order Item Details & Auto-Calculations](#122-order-item-details--auto-calculations)
    - 12.3 [Order Statuses & Lifecycle](#123-order-statuses--lifecycle)
    - 12.4 [Admin Order Review: Approve or Reject](#124-admin-order-review-approve-or-reject)
    - 12.5 [Generating a Bill from an Order](#125-generating-a-bill-from-an-order)
    - 12.6 [Order List View & Filters](#126-order-list-view--filters)

13. [Module 10 — Delivery & Logistics](#13-module-10--delivery--logistics)
    - 13.1 [Creating a Delivery Record (Admin)](#131-creating-a-delivery-record-admin)
    - 13.2 [Delivery Statuses & Lifecycle](#132-delivery-statuses--lifecycle)
    - 13.3 [Delivery Tracking View](#133-delivery-tracking-view)
    - 13.4 [Staff "My Deliveries" View](#134-staff-my-deliveries-view)

14. [Module 11 — Salary Management](#14-module-11--salary-management)
    - 14.1 [Adding a Salary Record](#141-adding-a-salary-record)
    - 14.2 [Advance Auto-Deduction](#142-advance-auto-deduction)
    - 14.3 [Viewing Salary Records](#143-viewing-salary-records)
    - 14.4 [Updating Payment Status](#144-updating-payment-status)

15. [Module 12 — Advance Management](#15-module-12--advance-management)
    - 15.1 [Recording an Advance](#151-recording-an-advance)
    - 15.2 [Advance Statuses](#152-advance-statuses)
    - 15.3 [How Advances Affect Salary](#153-how-advances-affect-salary)

16. [Module 13 — Attendance Management](#16-module-13--attendance-management)
    - 16.1 [Recording Daily Attendance](#161-recording-daily-attendance)
    - 16.2 [Attendance Field Descriptions](#162-attendance-field-descriptions)
    - 16.3 [Working Hours Auto-Calculation](#163-working-hours-auto-calculation)
    - 16.4 [Monthly Attendance Summary](#164-monthly-attendance-summary)
    - 16.5 [Duplicate Prevention & Record Locking](#165-duplicate-prevention--record-locking)
    - 16.6 [Exporting Attendance Data](#166-exporting-attendance-data)

17. [Module 14 — Reports](#17-module-14--reports)
    - 17.1 [Collection Reports](#171-collection-reports)
    - 17.2 [DSR-Wise Summary Report](#172-dsr-wise-summary-report)
    - 17.3 [Bill Trend Reports](#173-bill-trend-reports)
    - 17.4 [Payment Mode Breakdown](#174-payment-mode-breakdown)
    - 17.5 [Exporting Reports](#175-exporting-reports)

18. [Module 15 — User Management](#18-module-15--user-management)
    - 18.1 [Creating a New User](#181-creating-a-new-user)
    - 18.2 [Managing Roles & Status](#182-managing-roles--status)
    - 18.3 [Granular Permission Control](#183-granular-permission-control)
    - 18.4 [Applying Permission Templates](#184-applying-permission-templates)

19. [Module 16 — Settings](#19-module-16--settings)
    - 19.1 [Module Field Customization](#191-module-field-customization)
    - 19.2 [Module Name Customization](#192-module-name-customization)
    - 19.3 [Permission Templates](#193-permission-templates)

20. [Frequently Asked Questions (FAQ)](#20-frequently-asked-questions-faq)

21. [Troubleshooting Guide](#21-troubleshooting-guide)

22. [Glossary](#22-glossary)

23. [Appendix](#23-appendix)
    - 23.1 [Permission Matrix](#231-permission-matrix)
    - 23.2 [Keyboard Shortcuts](#232-keyboard-shortcuts)
    - 23.3 [Contact & Support](#233-contact--support)

---

---

# 1. Introduction

## 1.1 About DistributeX

**DistributeX** is an end-to-end distribution business management platform designed specifically for FMCG (Fast-Moving Consumer Goods) and goods distribution companies. Whether you manage a team of five field sales representatives or fifty, DistributeX brings your entire distribution operation into a single, unified platform — accessible from the office or the field.

DistributeX helps your business:

- **Manage bills and collections** from retailers with real-time visibility into outstanding amounts and payment status.
- **Track orders** from creation through approval to delivery, with automated bill generation.
- **Monitor your field workforce** — attendance, advances, salary processing, and daily activity — without spreadsheets or manual entry.
- **Empower retailers** with a self-service portal to view their bills, track orders, and manage their own account.
- **Analyze business performance** through live dashboards, trend charts, and exportable reports.

DistributeX is available as a **web application** (for use on desktop and laptop browsers) and a **companion mobile app** (for field staff on the go — available on Android and iOS).

---

## 1.2 Who This Manual Is For

This manual is written for three audiences:

| Audience | Description |
|---|---|
| **Administrators** | Business owners, managers, or operations supervisors who have full access to DistributeX and are responsible for setup, configuration, and oversight. |
| **Staff (DSR)** | Daily Sales Representatives and field staff who use DistributeX to manage their daily assignments, create orders, record collections, and track deliveries. |
| **Retailers** | Business partners who use the Retailer Portal to view their bills, outstanding amounts, and order history. |

---

## 1.3 How to Use This Manual

This manual is organized as follows:

- **Chapters 1–3** cover platform-wide topics: introduction, getting started, and role-specific quick start guides.
- **Chapters 4–19** document each module in detail. You can navigate directly to any module using the Table of Contents.
- **Chapters 20–23** provide reference material: FAQ, troubleshooting, glossary, and appendix.

> 🔵 **Note:** If you are new to DistributeX, we recommend starting with Chapter 2 (Getting Started) and the Quick Start Guide for your role (Chapter 3) before diving into individual modules.

---

## 1.4 Key Conventions & Icons

Throughout this manual, the following callout styles are used to highlight important information:

| Icon | Type | Meaning |
|---|---|---|
| 🔵 **Note** | Informational | Important context or clarification you should be aware of. |
| 🟢 **Tip** | Best Practice | A recommended approach or shortcut to improve your workflow. |
| 🟡 **Warning** | Caution | An action that may have significant consequences or cannot be easily undone. |
| 🔴 **Admin Only** | Access Restricted | This feature or action is only available to users with the Admin role. |

**Step-by-step instructions** are written as numbered lists. **Field descriptions** are presented in tables. **Placeholder screenshots** are indicated like this:

`[SCREENSHOT: description of what the screenshot shows]`

---

---

# 2. Getting Started

## 2.1 System Requirements

### Web Application

| Requirement | Minimum |
|---|---|
| **Browser** | Google Chrome 110+, Mozilla Firefox 110+, Microsoft Edge 110+, Safari 16+ |
| **Internet Connection** | Broadband (5 Mbps or higher recommended) |
| **Screen Resolution** | 1280 × 768 or higher |
| **JavaScript** | Must be enabled |

> 🔵 **Note:** DistributeX is not officially supported on Internet Explorer. For the best experience, use Google Chrome or Microsoft Edge.

### Mobile App

| Requirement | Minimum |
|---|---|
| **Android** | Android 10 (API Level 29) or higher |
| **iOS** | iOS 14 or higher |
| **Storage** | 80 MB free space |
| **Internet Connection** | 4G/LTE or Wi-Fi recommended |

---

## 2.2 Accessing the Web Application

1. Open your preferred web browser.
2. Navigate to your organization's DistributeX web address (provided by your administrator, e.g., `https://app.distributex.io` or a custom domain).
3. You will be directed to the **Login page**.

> 🟢 **Tip:** Bookmark the DistributeX URL for quick access. You can also add it to your browser's home screen on mobile devices.

`[SCREENSHOT: DistributeX login page in a desktop browser]`

---

## 2.3 Accessing the Mobile App

1. Open the **Google Play Store** (Android) or **Apple App Store** (iOS) on your device.
2. Search for **"DistributeX"**.
3. Tap **Install** / **Get**.
4. Once installed, open the app and log in with your DistributeX credentials.

> 🔵 **Note:** The mobile app is designed primarily for **Staff (DSR)** users. Admin features are best accessed through the web application. Retailers can use either the mobile app or the web portal.

---

## 2.4 First-Time Login

If you are logging in for the first time:

1. Obtain your **login credentials** (email address and temporary password) from your DistributeX administrator.
2. Navigate to the DistributeX login page.
3. Enter your **Email Address** and **Password**.
4. Click **Log In**.
5. Upon successful login, you will be automatically redirected to the dashboard for your role.

> 🟡 **Warning:** If you have not received login credentials, contact your administrator. Do not share your password with anyone. DistributeX does not store or send plain-text passwords.

> 🟢 **Tip:** If you are a Retailer, you may be able to self-register through the **Sign Up** link on the login page. Your account will be in a **Pending** status until approved by the administrator. See [Section 4.4](#44-retailer-self-registration) for details.

---

## 2.5 Understanding the Interface

### Web Application Layout

`[SCREENSHOT: Annotated screenshot of the main web application interface]`

The DistributeX web interface consists of the following key areas:

| Area | Description |
|---|---|
| **Sidebar (Left Navigation)** | Contains links to all modules you have access to, organized by category. Collapsible on smaller screens. |
| **Header (Top Bar)** | Displays the DistributeX logo, the current module name, notifications, and your user account menu (profile, logout). |
| **Main Content Area** | The central workspace where module content, forms, tables, and charts are displayed. |
| **Action Buttons** | Typically located at the top-right of each module page (e.g., "+ Add New", "Export"). |
| **Filter/Search Bar** | Available on list views to filter and search records. |

### Mobile App Layout

`[SCREENSHOT: Annotated screenshot of the mobile app home screen]`

| Area | Description |
|---|---|
| **Home Screen** | Shows the dashboard relevant to your role (Staff or Retailer). |
| **Bottom Navigation Bar** | Quick access to the most-used sections: Home, Bills/Orders, Collections, Profile. |
| **Hamburger Menu (≡)** | Access to all available modules. |
| **Floating Action Button (+)** | Shortcut to create a new record (order, collection, etc.) in context. |

---

---

# 3. Role-Based Quick Start Guides

## 3.1 Admin Quick Start

Welcome, Administrator. Follow this five-step checklist to get your DistributeX account fully operational.

---

### ✅ Step 1: Configure Your Products

Add the products your business distributes to the DistributeX catalogue.

1. Go to **Sidebar → Products**.
2. Click **+ Add Product**.
3. Enter the product details (Product Code, Name, MRP, Selling Price, Stock Quantity, etc.).
4. Click **Save**.

Repeat for all products. *(See [Module 8 — Product Management](#11-module-8--product-management) for full details.)*

---

### ✅ Step 2: Add Your Retailers

Create retailer profiles for all the shops and businesses your team services.

1. Go to **Sidebar → Retailers**.
2. Click **+ Add Retailer**.
3. Enter the retailer's Name, Address, and Collection Days.
4. Click **Save**.

*(See [Module 7 — Retailer Management](#10-module-7--retailer-management) for full details.)*

---

### ✅ Step 3: Create Staff User Accounts

Add your field sales staff (DSRs) to the platform.

1. Go to **Sidebar → Users**.
2. Click **+ Add User**.
3. Set the Role to **Staff**, enter the staff member's name, email, and a temporary password.
4. Click **Save**.

The staff member can now log in and access their Staff Dashboard. *(See [Module 15 — User Management](#18-module-15--user-management).)*

---

### ✅ Step 4: Add Bills and Assign to Staff

Begin tracking your receivables by adding bills and assigning them to your DSRs.

1. Go to **Sidebar → Bills**.
2. Click **+ Add Bill**.
3. Enter the Bill Number, Retailer, Amount, and Collection Day.
4. Assign the bill to a staff member.
5. Click **Save**.

*(See [Module 5 — Bills Management](#8-module-5--bills-management).)*

---

### ✅ Step 5: Review Your Dashboard

With data in the system, your Admin Dashboard will now populate with live KPIs, financial overviews, and collection trends.

1. Go to **Sidebar → Dashboard**.
2. Review the KPI cards, financial overview, and DSR summaries.
3. Explore the daily/weekly/monthly charts for collections and bill trends.

*(See [Module 2 — Admin Dashboard](#5-module-2--admin-dashboard).)*

> 🟢 **Tip:** Once you have completed these five steps, explore **Settings** to customize module names, add custom fields, and configure permission templates to match your business workflow.

---

## 3.2 Staff (DSR) Quick Start

Welcome, Field Representative. Here's how to get started with your daily workflow on DistributeX.

---

### Step 1: Log In and Check Your Dashboard

1. Open the DistributeX mobile app or web application.
2. Log in with your email and password provided by your administrator.
3. You will land on your **Staff Dashboard**, which shows your assigned bills for today and quick action buttons.

---

### Step 2: View Your Bills for Today

1. On the Staff Dashboard, tap/click **Bill Assigned Today**.
2. You will see a list of all bills assigned to you for today's collection.
3. Review the retailer name, bill amount, and due amount for each bill.

---

### Step 3: Record a Collection (Payment)

When a retailer makes a payment:

1. Go to **Collections → Record Collection** (or tap **+ Collect** on a bill).
2. Select the bill, enter the amount collected, payment mode, and any reference details.
3. Tap **Submit**.

The bill's outstanding balance is automatically updated.

---

### Step 4: Create an Order

When a retailer places an order:

1. Go to **Orders → Create Order**.
2. Select the Retailer, add products and quantities.
3. Review the auto-calculated totals.
4. Submit the order for admin approval.

---

### Step 5: Track Your Deliveries

1. Go to **My Deliveries** from the dashboard or sidebar.
2. View all deliveries assigned to you, sorted by status.

---

## 3.3 Retailer Quick Start

Welcome to the DistributeX Retailer Portal. Here's how to get the most out of your account.

---

### Step 1: Register or Log In

- **New retailer?** Use the **Sign Up** link on the login page to register. Your account will require admin approval before you can access the portal.
- **Existing retailer?** Log in with your email and password.

---

### Step 2: Check Your Outstanding Bills

1. From your **Retailer Dashboard**, review the **Outstanding Amount** card.
2. Click **My Bills** to see a full list of your bills, their statuses, and due amounts.

---

### Step 3: View Your Payment History

1. Go to **Payment History** from the dashboard or sidebar.
2. Filter by date range to see collections recorded against your account.

---

### Step 4: Track Your Orders

1. Go to **My Orders**.
2. View the status of all your orders — from Pending through Approved to Delivered.

---

### Step 5: Update Your Profile

1. Go to **Profile Settings**.
2. Keep your contact information and business details up to date.

---

---

# 4. Module 1 — Authentication & Onboarding

## 4.1 Logging In

The DistributeX login page is the entry point for all users — Admins, Staff, and Retailers.

`[SCREENSHOT: DistributeX login page with email and password fields]`

### How to Log In

1. Open your browser and navigate to your DistributeX URL, or open the mobile app.
2. On the **Login** page, enter your registered **Email Address**.
3. Enter your **Password**.
4. Click (or tap) the **Log In** button.
5. Upon successful authentication, you will be automatically redirected to your role-specific dashboard.

### Login Field Descriptions

| Field | Description |
|---|---|
| **Email Address** | The email address associated with your DistributeX account. Case-insensitive. |
| **Password** | Your account password. Case-sensitive. Masked by default. |

> 🟡 **Warning:** After several consecutive failed login attempts, your account may be temporarily locked for security purposes. Contact your administrator to unlock your account.

> 🔵 **Note:** DistributeX does not currently offer social login (Google/Facebook). All accounts are created and managed by your administrator or through the retailer self-registration flow.

---

## 4.2 Role-Based Redirection After Login

After a successful login, DistributeX automatically determines your role and redirects you to the appropriate dashboard:

| Role | Redirected To |
|---|---|
| **Admin** | Admin Dashboard (`/admin-dashboard`) |
| **Staff (DSR)** | Staff Dashboard (`/staff-dashboard`) |
| **Retailer** | Retailer Dashboard (`/retailer-dashboard`) |

> 🔵 **Note:** If your account has been set to **Inactive** by an administrator, you will see an error message upon login and will not be able to access the platform. Contact your administrator to reactivate your account.

---

## 4.3 Session Management & Auto-Logout

DistributeX uses secure session tokens to keep you logged in. Sessions are managed automatically with the following behavior:

- **Active Session:** As long as you are actively using the platform, your session remains valid.
- **Session Expiry:** If your session is inactive for an extended period (typically 24 hours, or as configured by your administrator), your session will expire automatically.
- **Auto-Logout:** When your session expires, DistributeX will redirect you to the login page with a message: *"Your session has expired. Please log in again."*
- **Manual Logout:** To log out manually at any time, click your **User Avatar** or name in the top-right header, then select **Log Out**.

> 🟢 **Tip:** If you are working on a shared or public device, always log out manually when you are finished to protect your account and business data.

> 🟡 **Warning:** Unsaved form data will be lost if your session expires while you are filling out a form. Save your work frequently.

---

## 4.4 Retailer Self-Registration

Retailers can request access to the DistributeX Retailer Portal by self-registering, without needing the administrator to create their account manually.

`[SCREENSHOT: Retailer self-registration form]`

### Retailer Registration Steps

1. On the DistributeX login page, click **Sign Up** or **Register as Retailer**.
2. Fill in the registration form with the required details:

| Field | Description |
|---|---|
| **Business Name** | The name of the retailer's shop or business. |
| **Owner Name** | Full name of the business owner or primary contact. |
| **Email Address** | A valid email address (used for login). |
| **Password** | Choose a secure password for the account. |
| **Phone Number** | Primary contact number. |
| **Address** | Shop / business address. |

3. Click **Submit Registration**.
4. A confirmation message will appear: *"Your registration has been submitted. Please wait for administrator approval."*

### Registration Approval Workflow

After submission, the registration goes through the following workflow:

| Step | Who Acts | Action |
|---|---|---|
| **1. Submitted** | Retailer | Fills out and submits the registration form. Status: **PENDING**. |
| **2. Admin Review** | Admin | Receives a notification and reviews the pending registration in **Retailer Management → Pending Approvals**. |
| **3a. Approved** | Admin | Clicks **Approve**. The retailer's account is activated. Status changes to **ACTIVE**. The retailer can now log in. |
| **3b. Rejected** | Admin | Clicks **Reject** (with optional reason). Status changes to **REJECTED**. |

> 🔵 **Note:** Retailers in **PENDING** status cannot log in to the platform. Once approved, the retailer will receive access using the credentials they registered with.

> 🔴 **Admin Only:** Approving or rejecting retailer registrations is an Admin-only action. Go to **Sidebar → Retailers → Pending Approvals** to manage submissions.

`[SCREENSHOT: Admin view of pending retailer registrations list]`

---

---

# 5. Module 2 — Admin Dashboard

> 🔴 **Admin Only:** The Admin Dashboard is accessible only to users with the Administrator role.

The Admin Dashboard is the command center of your DistributeX account. It provides a real-time snapshot of your entire distribution business — financials, team performance, outstanding collections, and operational trends — all in one view.

`[SCREENSHOT: Full Admin Dashboard showing KPI cards, charts, and DSR summary]`

---

## 5.1 KPI Summary Cards

The top section of the Admin Dashboard displays a row of **KPI (Key Performance Indicator) cards**. Each card shows a critical business metric at a glance.

| Card | Description |
|---|---|
| **Total Bills** | The total number of bills currently in the system (across all statuses). |
| **Pending Bills** | The number of bills with a status of Unpaid or Partially Paid — bills where money is still outstanding. |
| **Total Retailers** | The total number of active retailers in your account. |
| **Total Products** | The total number of products in your product catalogue. |
| **Total Staff** | The total number of active staff (DSR) users. |
| **Vehicles Delivered** | The number of delivery records with a status of **Delivered** (for the current day or period). |
| **Vehicles Pending** | The number of delivery records with a status of **Pending** or **In Transit**. |

> 🔵 **Note:** Clicking on any KPI card will navigate you directly to the relevant module with the appropriate filter pre-applied. For example, clicking **Pending Bills** will open the Bills module filtered to show only Pending/Unpaid bills.

`[SCREENSHOT: KPI cards row on the Admin Dashboard]`

---

## 5.2 Financial Overview Panel

Below the KPI cards, the **Financial Overview Panel** provides a monetary summary of your business activity.

| Metric | Description |
|---|---|
| **Total Bill Amount** | The cumulative face value of all bills in the system. |
| **Total Amount Paid Today** | The total amount collected (across all staff) for the current calendar day. |
| **Total Remaining Amount** | The outstanding amount yet to be collected across all unpaid and partially paid bills. |

> 🟢 **Tip:** Monitor **Total Amount Paid Today** during the day to track your team's collection performance in real time. This metric updates as each collection is recorded.

`[SCREENSHOT: Financial overview panel with three metric boxes]`

---

## 5.3 Interactive Charts

DistributeX provides two interactive charts on the Admin Dashboard for visualizing trends over time.

### Collection Trends (Line Chart)

This chart displays the total collections recorded over time, helping you identify peaks, troughs, and seasonal patterns in your collection activity.

- **X-Axis:** Time (Day / Week / Month)
- **Y-Axis:** Total Amount Collected (₹)
- **Toggle:** Switch between **Daily**, **Weekly**, and **Monthly** views using the buttons above the chart.

`[SCREENSHOT: Collection trends line chart in monthly view]`

### Bill Trends (Bar Chart)

This chart displays the number of bills created over time, helping you track billing activity and workload.

- **X-Axis:** Time (Day / Week / Month)
- **Y-Axis:** Number of Bills Created
- **Toggle:** Switch between **Daily**, **Weekly**, and **Monthly** views.

`[SCREENSHOT: Bill trends bar chart in weekly view]`

> 🟢 **Tip:** Use the **Monthly** view to identify your highest-performing months and plan staffing or collection drives accordingly.

---

## 5.4 DSR-Wise Collection Breakdown

This section provides a tabular breakdown of collections recorded by each DSR (Daily Sales Representative) for the current day or selected period.

| Column | Description |
|---|---|
| **Staff Name** | The name of the DSR. |
| **No. of Collections** | The number of individual collection transactions recorded by this DSR. |
| **Total Amount Collected** | The sum of all amounts collected by this DSR. |

`[SCREENSHOT: DSR-wise collection breakdown table]`

---

## 5.5 Outstanding DSR Summary

This table highlights which DSRs have significant outstanding bills assigned to them, helping administrators prioritize follow-ups and field visits.

| Column | Description |
|---|---|
| **Staff Name** | The name of the DSR. |
| **Total Bills Assigned** | Number of bills currently assigned to this DSR. |
| **Total Outstanding** | The total unpaid amount across all bills assigned to this DSR. |

---

## 5.6 Recent Collections List

The **Recent Collections** section displays the most recent payment transactions recorded in the system, across all staff.

| Column | Description |
|---|---|
| **Date & Time** | When the collection was recorded. |
| **Retailer Name** | The retailer who made the payment. |
| **Staff (DSR)** | The staff member who recorded the collection. |
| **Amount** | The amount collected. |
| **Payment Mode** | Cash, Cheque, Bank Transfer, or UPI. |

> 🔵 **Note:** This list shows the most recent 10–20 transactions. For a full collection history, navigate to **Collections → History** or run a report from the **Reports** module.

---

## 5.7 Quick Navigation Links

At the bottom of the Admin Dashboard (or in a prominent section depending on your layout), **Quick Navigation** tiles provide one-click access to every major module:

- Bills
- Collections
- Retailers
- Products
- Orders
- Deliveries
- Salary
- Advances
- Attendance
- Reports
- Users
- Settings

> 🟢 **Tip:** Use the sidebar for navigation during normal use. The Quick Navigation tiles are best for an initial orientation or for showing others around the platform.

---

---

# 6. Module 3 — Staff Dashboard

## 6.1 Overview

The **Staff Dashboard** is the home screen for DSR users. It is designed for speed and simplicity — giving field staff exactly what they need for their day's work, without the complexity of administrative features.

`[SCREENSHOT: Staff Dashboard on the mobile app home screen]`

> 🔵 **Note:** Staff users do not have access to financial KPIs, HR modules, or system settings. Their view is scoped to their own assigned work.

---

## 6.2 Today's Assigned Bills

The central element of the Staff Dashboard is the **Today's Bills** list, which shows all bills assigned to the logged-in staff member for the current date.

| Column | Description |
|---|---|
| **Retailer Name** | The retailer associated with the bill. |
| **Bill Number** | The unique identifier for the bill. |
| **Total Amount** | The original face value of the bill. |
| **Due Amount** | The remaining outstanding amount to collect. |
| **Bill Status** | Current payment status (Unpaid / Partially Paid / Paid). |

> 🟢 **Tip:** Tap on any bill in the list to open its detail view, where you can quickly record a collection against it.

---

## 6.3 Quick Action Links

The Staff Dashboard includes Quick Action buttons for the most common daily tasks:

| Action | Description |
|---|---|
| **Bill Assigned Today** | View the complete list of bills assigned to you today (same as the main list above). |
| **Create Order** | Navigate to the Order Creation form to place a new retailer order. |
| **My Deliveries** | View all deliveries assigned to you, sorted by status. |
| **Collection History** | View a history of all collections you have recorded (filterable by date range). |

---

---

# 7. Module 4 — Retailer Dashboard

## 7.1 Overview

The **Retailer Dashboard** is the home screen for Retailer Portal users. It provides a clear summary of the retailer's account — what they owe, what they've paid, and recent activity.

`[SCREENSHOT: Retailer Dashboard with summary cards and recent activity]`

> 🔵 **Note:** The Retailer Dashboard shows data specific to the logged-in retailer's account only. Retailers cannot view any other retailer's information.

---

## 7.2 Bills & Outstanding Summary

At the top of the Retailer Dashboard, three summary cards are displayed:

| Card | Description |
|---|---|
| **Total Bills** | The total number of bills raised against this retailer's account. |
| **Outstanding Amount** | The total amount still owed across all unpaid and partially paid bills. |
| **Total Paid** | The cumulative amount paid to date. |

Below the summary cards, a **Recent Bill Activity** list shows the latest 5–10 bill updates and collections on the account.

---

## 7.3 Navigation Cards

The Retailer Dashboard provides navigation tiles for the retailer to explore their account:

| Navigation Card | Description |
|---|---|
| **My Bills** | Full list of all bills on the retailer's account, with status filters. |
| **My Orders** | Order history with current status of each order. |
| **Payment History** | Full history of payments/collections recorded against their account. |
| **Profile Settings** | Manage contact information and account preferences. |

---

---

# 8. Module 5 — Bills Management

Bills are the financial heart of DistributeX. A **Bill** represents a receivable — money owed by a retailer to your distribution business. The Bills module lets you create, track, assign, and manage all bills in your system.

`[SCREENSHOT: Bills list view with filter options]`

> 🔴 **Admin Only:** Creating, editing, assigning, and deleting bills are Admin-only actions. Staff users can view bills assigned to them and record collections against them. Retailers can view bills raised against their account.

---

## 8.1 Adding a New Bill

1. Navigate to **Sidebar → Bills**.
2. Click **+ Add Bill** (top-right corner).
3. The **Add Bill** form will open.
4. Fill in all required fields (marked with `*`).
5. Click **Save Bill**.

`[SCREENSHOT: Add Bill form with all fields visible]`

### Bill Form Field Descriptions

| Field | Type | Required | Description |
|---|---|---|---|
| **Bill Number** | Text | ✅ Yes | A unique identifier for the bill (e.g., INV-2024-001). Must be unique across the system. |
| **Retailer Name** | Dropdown | ✅ Yes | Select the retailer from the list of active retailers. |
| **Amount** | Number | ✅ Yes | The full face value of the bill (total amount billed). |
| **Due Amount** | Number | ✅ Yes | The amount currently outstanding (initially equal to Amount, reduced as collections are recorded). |
| **Bill Date** | Date | ✅ Yes | The date the bill was issued. |
| **Collection Day** | Dropdown | ✅ Yes | The day of the week designated for collecting payment on this bill (Monday through Sunday). |
| **Payment Method** | Dropdown | No | The agreed or preferred payment method (Cash, Cheque, Bank Transfer, UPI). |
| **Assign to Staff** | Dropdown | No | Assign this bill to a specific DSR for collection responsibility. |
| **Assigned Date** | Date | No | The date from which the assigned staff member is responsible for this bill. |
| **Notes** | Text Area | No | Any additional notes or remarks about this bill. |

> 🔵 **Note:** The **Bill Number** must be unique. If you enter a bill number that already exists in the system, you will see a validation error before the record is saved.

> 🟢 **Tip:** Set the **Collection Day** to match the retailer's preferred payment schedule. This helps DSRs plan their route and collection visits efficiently.

---

## 8.2 Bill Statuses

Every bill in DistributeX has one of the following statuses, which is updated automatically based on collection activity:

| Status | Description |
|---|---|
| **Unpaid** | No payment has been received. The due amount equals the full bill amount. |
| **Partially Paid** | One or more payments have been recorded, but the bill is not yet fully settled. |
| **Paid** | The bill has been fully settled. Due amount is zero. |

> 🔵 **Note:** Bill statuses are updated automatically when collections are recorded. You do not need to manually change a bill's status.

---

## 8.3 Assigning a Bill to Staff

Assigning a bill to a DSR makes that bill visible on the staff member's dashboard and designates them as responsible for collection.

### To Assign a Bill

**During creation:** Fill in the **Assign to Staff** and **Assigned Date** fields on the Add Bill form.

**After creation:**
1. Navigate to **Sidebar → Bills**.
2. Find the bill you want to assign (use search or filters).
3. Click the **Edit** icon (✏️) on the bill row.
4. Update the **Assign to Staff** and **Assigned Date** fields.
5. Click **Save**.

> 🟢 **Tip:** You can bulk-assign bills by using the filter to show all unassigned bills, then editing each one. Future versions of DistributeX will support bulk assignment directly from the list view.

> 🔵 **Note:** A bill can only be assigned to one staff member at a time. Reassigning a bill to a new staff member will replace the previous assignment.

---

## 8.4 Viewing and Filtering Bills

The **Bills List** view displays all bills in the system (Admin view) or bills assigned to the logged-in staff (Staff view).

`[SCREENSHOT: Bills list view with active filters applied]`

### Available Filters

| Filter | Options |
|---|---|
| **Status** | All / Unpaid / Partially Paid / Paid |
| **Assigned Staff** | All Staff / Specific staff member name |
| **Retailer** | All Retailers / Specific retailer name |
| **Date Range** | Bill Date from / to |
| **Collection Day** | All Days / Monday – Sunday |

### Search

Use the **Search bar** at the top of the Bills list to search by:
- Bill Number
- Retailer Name

---

## 8.5 Editing a Bill

1. Navigate to **Sidebar → Bills**.
2. Find the bill you want to edit.
3. Click the **Edit** icon (✏️) on the bill row, or open the bill and click **Edit**.
4. Update the desired fields.
5. Click **Save Changes**.

> 🟡 **Warning:** Editing the **Amount** or **Due Amount** on a bill that already has collections recorded against it may cause discrepancies in your financial records. Exercise caution when modifying bill amounts after collections have been made.

---

## 8.6 Deleting a Bill

DistributeX uses **soft deletion** for bills. When a bill is deleted:
- It is removed from all active views and lists.
- It is retained in the database for audit and record-keeping purposes.
- It can be recovered by contacting support if deleted in error.

### To Delete a Bill

1. Navigate to **Sidebar → Bills**.
2. Find the bill.
3. Click the **Delete** icon (🗑️) on the bill row.
4. A confirmation dialog will appear: *"Are you sure you want to delete this bill? This action cannot be undone from the UI."*
5. Click **Confirm Delete**.

> 🟡 **Warning:** Deleting a bill that has collections recorded against it is not recommended. The collection records will remain in the system but will be orphaned (not linked to an active bill). Always resolve outstanding collections before deleting a bill.

---

## 8.7 Bill History & Audit Log

Every bill has an **Audit Log** that tracks all changes made to it — who made the change, what was changed, and when.

### Viewing the Audit Log

1. Navigate to **Sidebar → Bills**.
2. Click on any bill to open its **Detail View**.
3. Scroll down to the **History / Audit Log** section.

### Audit Log Columns

| Column | Description |
|---|---|
| **Date & Time** | When the change occurred. |
| **Changed By** | The name of the user who made the change. |
| **Field Changed** | Which field was modified (e.g., "Due Amount", "Assigned Staff"). |
| **Previous Value** | The value before the change. |
| **New Value** | The value after the change. |

> 🔵 **Note:** The audit log is read-only. It cannot be edited or deleted by any user, including administrators. This ensures a complete, tamper-proof record of bill activity.

---

## 8.8 Bills Assigned Today View

The **Bills Assigned Today** view is primarily used by Staff (DSR) users but is also available to Admins.

This view shows all bills whose **Assigned Date** matches today's date.

1. Navigate to **Sidebar → Bills → Bills Assigned Today** (or click the corresponding quick action on the Staff Dashboard).
2. The list will show all bills assigned for collection today, along with the assigned staff member (Admin view) or just your own bills (Staff view).

> 🟢 **Tip:** Staff users should check this view first thing each morning to plan their collection route for the day.

---

## 8.9 Bills History View

The **Bills History** view allows you to review historical bill activity over a specific date range.

1. Navigate to **Sidebar → Bills → Bills History**.
2. Set the **Date Range** (From Date and To Date).
3. Optionally filter by Staff, Retailer, or Status.
4. Click **Apply Filters**.
5. The history view will display all bills matching your criteria.

> 🔵 **Note:** The Bills History view is useful for monthly reconciliation and auditing past billing activity.

---

---

# 9. Module 6 — Collections Management

A **Collection** in DistributeX represents a payment received from a retailer against one or more bills. The Collections module is used to record payments, view collection history, and generate summaries for admin review.

---

## 9.1 Recording a Payment / Collection

Staff members record collections in the field when retailers make payments. Administrators can also record collections.

`[SCREENSHOT: Record Collection form]`

### Steps to Record a Collection

1. Navigate to **Sidebar → Collections** (or from a Bill's detail page, click **Record Collection**).
2. Click **+ New Collection**.
3. Fill in the collection form.
4. Click **Submit Collection**.

### Collection Form Field Descriptions

| Field | Type | Required | Description |
|---|---|---|---|
| **Bill** | Dropdown / Search | ✅ Yes | Select the bill against which the payment is being recorded. Search by bill number or retailer name. |
| **Amount Collected** | Number | ✅ Yes | The amount received from the retailer in this transaction. Cannot exceed the current due amount. |
| **Payment Mode** | Dropdown | ✅ Yes | How the payment was made. Options: **Cash**, **Cheque**, **Bank Transfer**, **UPI**. |
| **Payment Details** | Text | Conditional | Additional reference information based on payment mode (see table below). |
| **Remarks** | Text Area | No | Any notes about this collection (e.g., "Retailer paid partial, balance promised for Friday"). |
| **Collection Date** | Date | ✅ Yes | The date the payment was received. Defaults to today's date. |

### Payment Details by Mode

| Payment Mode | Payment Details Field Label | What to Enter |
|---|---|---|
| **Cash** | N/A | No additional details required. |
| **Cheque** | Cheque Number | The cheque number from the physical cheque. |
| **Bank Transfer** | Transaction ID | The bank transfer reference or NEFT/RTGS transaction ID. |
| **UPI** | UPI Transaction ID | The UPI reference number from the payment confirmation. |

> 🟡 **Warning:** Once a collection is submitted, the bill's **Due Amount** is automatically reduced by the amount collected. Double-check the amount before submitting, as editing a submitted collection requires administrator action.

> 🟢 **Tip:** Always enter **Payment Details** for non-cash payments. This creates an audit trail that helps in reconciliation and dispute resolution.

---

## 9.2 Viewing Collection History

### Staff View

Staff users can view the history of all collections they have personally recorded.

1. Navigate to **Sidebar → Collections → My History** (or from the Staff Dashboard, tap **Collection History**).
2. Use the **Date Range** filter to narrow down results.
3. The list shows all collections recorded by the logged-in staff member.

### Admin View

Administrators can view all collections across all staff members.

1. Navigate to **Sidebar → Collections → History**.
2. Apply filters as needed:
   - **Date Range** (From / To)
   - **Staff Member**
   - **Retailer**
   - **Payment Mode**
3. Click **Apply** to filter the results.

`[SCREENSHOT: Collections history view with filters applied]`

### Collection History Columns

| Column | Description |
|---|---|
| **Date** | The date the collection was recorded. |
| **Bill Number** | The bill the payment was applied to. |
| **Retailer** | The retailer who made the payment. |
| **Staff (DSR)** | Who recorded the collection. |
| **Amount Collected** | The payment amount. |
| **Payment Mode** | Cash / Cheque / Bank Transfer / UPI. |
| **Payment Details** | Reference number (if applicable). |
| **Remarks** | Any notes entered at the time of recording. |

---

## 9.3 DSR Collection Summary

The **DSR Collection Summary** is an aggregate report that shows each DSR's total collection performance for a given period.

> 🔴 **Admin Only:** The DSR Collection Summary is only accessible to Admin users.

1. Navigate to **Sidebar → Collections → DSR Summary**.
2. Set the **Date Range**.
3. Click **Generate Summary**.

### Summary Columns

| Column | Description |
|---|---|
| **Staff Name** | The DSR's name. |
| **No. of Collections** | How many collection transactions they recorded in the period. |
| **Total Amount Collected** | The total rupee amount collected in the period. |
| **Payment Mode Breakdown** | Split of the total by Cash / Cheque / Bank Transfer / UPI. |

`[SCREENSHOT: DSR Collection Summary report table]`

---

## 9.4 Exporting Collection Reports

From the DSR Collection Summary (or any collection view), you can export data to Excel.

1. Open the **DSR Collection Summary** or **Collection History** view.
2. Apply the desired filters.
3. Click **Export to Excel** (top-right).
4. The file will be downloaded automatically to your device.

> 🔵 **Note:** Excel exports include all columns visible in the on-screen table. Filter your data before exporting to ensure you get the relevant records.

---

---

# 10. Module 7 — Retailer Management

The **Retailer Management** module allows administrators to maintain the master list of retail partners. Retailers in DistributeX are the businesses your DSRs service — shops, supermarkets, and other trade partners.

---

## 10.1 Adding a New Retailer

> 🔴 **Admin Only:** Adding retailers is an Admin action.

1. Navigate to **Sidebar → Retailers**.
2. Click **+ Add Retailer**.
3. Fill in the form.
4. Click **Save Retailer**.

`[SCREENSHOT: Add Retailer form]`

### Retailer Form Field Descriptions

| Field | Type | Required | Description |
|---|---|---|---|
| **Name** | Text | ✅ Yes | The full business/shop name of the retailer. |
| **Address Line 1** | Text | ✅ Yes | The primary address (street number and name). |
| **Address Line 2** | Text | No | Additional address details (area, landmark, etc.). |
| **Collection Days** | Multi-select | ✅ Yes | The days of the week on which this retailer typically makes payments. Select one or more days (Monday – Sunday). |
| **Assign to Staff** | Dropdown | No | The DSR responsible for servicing this retailer. |
| **Phone Number** | Text | No | Retailer's primary contact number. |
| **Email** | Text | No | Retailer's email address (used if they self-register). |

> 🟢 **Tip:** Setting accurate **Collection Days** is important — it drives the **Bills Assigned Today** logic. If a retailer pays on Tuesdays and Fridays, set both days so bills are surfaced on the correct days for your DSR.

---

## 10.2 Viewing and Editing the Retailer List

`[SCREENSHOT: Retailer list view with search and filter bar]`

1. Navigate to **Sidebar → Retailers**.
2. The list shows all **Active** retailers by default.
3. Use the **Search bar** to find a retailer by name, or use the **Status filter** to see Pending / Rejected retailers.
4. Click a retailer's name to view their full profile.
5. Click **Edit** (✏️) to update a retailer's details.
6. Click **Save** to confirm changes.

### Retailer List Columns

| Column | Description |
|---|---|
| **Retailer Name** | The shop/business name. |
| **Address** | The combined address. |
| **Assigned Staff** | The DSR assigned to this retailer. |
| **Collection Days** | The retailer's collection schedule. |
| **Status** | PENDING / ACTIVE / REJECTED. |
| **Actions** | Edit / View / Approve / Reject buttons. |

---

## 10.3 Retailer Approval Workflow

When a retailer self-registers (see [Section 4.4](#44-retailer-self-registration)), their account lands in a **PENDING** state and must be reviewed by an administrator.

### Approving a Retailer

1. Navigate to **Sidebar → Retailers**.
2. Use the **Status filter** to show **Pending** retailers.
3. Click on the pending retailer's name or the **Review** button.
4. Review the submitted details.
5. Click **Approve**.
6. The retailer's status changes to **ACTIVE**, and they can now log in to the portal.

`[SCREENSHOT: Pending retailer profile with Approve and Reject buttons]`

### Rejecting a Retailer

1. Follow steps 1–4 above.
2. Click **Reject**.
3. Optionally enter a **Rejection Reason** (this may be communicated to the retailer).
4. Click **Confirm Rejection**.
5. The retailer's status changes to **REJECTED**.

> 🔵 **Note:** Rejected retailers cannot log in to the platform. If you reject a retailer in error, you can return to their profile and change their status to **Active** manually via the Edit form.

---

## 10.4 Retailer Statuses

| Status | Description |
|---|---|
| **PENDING** | The retailer has self-registered and is awaiting admin review. Cannot log in. |
| **ACTIVE** | The retailer is approved and active. Can log in to the Retailer Portal. |
| **REJECTED** | The registration was rejected by an admin. Cannot log in. |

---

---

# 11. Module 8 — Product Management

The **Product Management** module is your digital product catalogue. Every product your distribution business carries — with its pricing, stock levels, and schemes — is managed here.

> 🔴 **Admin Only:** Adding, editing, and deleting products are Admin-only actions. Staff users can view the product catalogue when creating orders.

---

## 11.1 Adding a New Product

1. Navigate to **Sidebar → Products**.
2. Click **+ Add Product**.
3. Fill in the product form.
4. Click **Save Product**.

`[SCREENSHOT: Add Product form]`

### Product Form Field Descriptions

| Field | Type | Required | Description |
|---|---|---|---|
| **Product Code** | Text | ✅ Yes | A unique identifier or SKU for the product (e.g., "SKU-001" or "PROD-SOAP-200G"). |
| **Product Name** | Text | ✅ Yes | The full display name of the product. |
| **MRP** | Number | ✅ Yes | Maximum Retail Price — the printed consumer price of the product. |
| **Selling Price** | Number | ✅ Yes | The price at which your business sells the product to retailers. |
| **Weight** | Number / Text | No | The weight or volume of the product unit (e.g., "200g", "1 Litre"). |
| **Scheme / Discount** | Text / Number | No | Any promotional scheme or discount applied to this product (e.g., "Buy 10 Get 1 Free" or "5% Discount"). |
| **Stock Quantity** | Number | ✅ Yes | The current available stock of this product in your warehouse. |
| **Company** | Text | No | The brand or manufacturer of the product. |

> 🟢 **Tip:** Maintain accurate **Stock Quantity** values so that the system can flag potential out-of-stock situations when orders are placed.

---

## 11.2 Viewing and Editing the Product Catalogue

1. Navigate to **Sidebar → Products**.
2. The product list displays all products in your catalogue.
3. Use the **Search bar** to find a product by name or product code.
4. Click on a product name to view its full details.
5. Click **Edit** (✏️) to modify product details.
6. Click **Save** to confirm updates.

`[SCREENSHOT: Product catalogue list view]`

### Product List Columns

| Column | Description |
|---|---|
| **Product Code** | The unique SKU or identifier. |
| **Product Name** | The product's display name. |
| **Company** | The manufacturer/brand. |
| **MRP** | Maximum Retail Price. |
| **Selling Price** | Price to retailers. |
| **Stock Quantity** | Current available stock. |
| **Actions** | Edit / Delete. |

---

## 11.3 Stock Tracking

DistributeX tracks stock levels at the product level. When an order is approved and fulfilled, the system can be configured to automatically deduct the ordered quantity from the product's stock.

- **Stock Count** is visible in the product list and on individual product detail pages.
- When stock drops below a configurable threshold (set in Settings), a visual indicator will highlight low-stock products.
- Stock can be manually updated at any time by editing the product record.

> 🔵 **Note:** DistributeX currently tracks stock at the product level (not by batch or lot number). If your business requires batch-level stock tracking, contact support to discuss future roadmap options.

> 🟡 **Warning:** Manually editing stock quantities does not create a stock audit trail in the current version. Future updates will add stock movement logging.

---

---

# 12. Module 9 — Order Management

The **Order Management** module handles the full lifecycle of a sales order — from a DSR creating an order in the field, through admin approval, to generating a bill and fulfilling delivery.

---

## 12.1 Creating an Order (Staff)

Staff users create orders on behalf of retailers when they visit them in the field.

`[SCREENSHOT: Create Order form on the mobile app]`

### Steps to Create an Order

1. Navigate to **Sidebar → Orders → Create Order** (or tap **Create Order** on the Staff Dashboard).
2. Select the **Retailer** for whom the order is being placed.
3. Add order items (see next section).
4. Review the auto-calculated totals.
5. Tap/click **Submit Order**.

---

## 12.2 Order Item Details & Auto-Calculations

Each order consists of one or more **line items**, where you select a product and specify the quantity.

### Adding an Order Item

1. In the order form, click/tap **+ Add Item**.
2. From the **Product** dropdown, select the desired product.
3. Enter the **Quantity**.
4. The following fields are calculated automatically:

| Calculated Field | How It's Calculated |
|---|---|
| **Net Price** | Selling Price after applying any Scheme/Discount. |
| **Total Litres** | Quantity × Product Weight (for liquid products sold by litre). |
| **Total Sale Value** | Quantity × Net Price. |
| **Scheme Applied** | The scheme/discount from the product catalogue, displayed for reference. |

5. Repeat for additional items.
6. The **Order Total** at the bottom of the form is the sum of all line items' Total Sale Values.

> 🔵 **Note:** You can add multiple products to a single order. Remove a line item by clicking the ✕ icon next to it.

> 🟢 **Tip:** Review the auto-calculated **Net Price** and **Scheme Applied** before submitting to verify that the correct pricing and discounts are being applied.

---

## 12.3 Order Statuses & Lifecycle

| Status | Description |
|---|---|
| **Pending** | Order has been submitted by staff and is awaiting admin review. |
| **Approved** | Admin has reviewed and approved the order. Ready for fulfillment. |
| **Completed** | Order has been fulfilled/delivered. |
| **Rejected** | Admin rejected the order. A rejection reason may be provided. |
| **Cancelled** | Order was cancelled before approval or fulfillment. |

### Order Lifecycle Flow

```
Staff Creates Order
        ↓
   [PENDING]
        ↓
Admin Reviews Order
   ↙         ↘
[APPROVED]  [REJECTED]
   ↓
[COMPLETED / generate bill]
```

---

## 12.4 Admin Order Review: Approve or Reject

> 🔴 **Admin Only:** Only administrators can approve or reject orders.

1. Navigate to **Sidebar → Orders**.
2. Filter by **Status: Pending** to see orders awaiting review.
3. Click on an order to open the **Order Detail** view.
4. Review the items, quantities, retailer, and calculated totals.

**To Approve:**
5. Click **Approve Order**.
6. Confirm in the dialog. The order status changes to **Approved**.

**To Reject:**
5. Click **Reject Order**.
6. Enter a **Rejection Reason** (optional but recommended — this will be visible to the staff member who created the order).
7. Click **Confirm Rejection**. The order status changes to **Rejected**.

`[SCREENSHOT: Order detail view with Approve and Reject buttons]`

> 🟢 **Tip:** Always provide a **Rejection Reason** when rejecting an order. This gives your staff clear feedback to relay to the retailer and helps prevent duplicate resubmissions.

---

## 12.5 Generating a Bill from an Order

Once an order is **Approved**, the administrator can generate a bill directly from the order.

1. Open the **Approved** order's detail view.
2. Click **Generate Bill**.
3. The system will pre-fill a new Bill form with:
   - Retailer Name (from the order)
   - Amount (from the order total)
   - Bill Date (today's date, editable)
4. Review and adjust the pre-filled fields if needed.
5. Click **Save Bill**.

The new bill is created and linked to the originating order. The order status moves toward **Completed**.

> 🔵 **Note:** Bills generated from orders are linked to the source order for traceability. You can view the linked order from the Bill's detail page, and vice versa.

---

## 12.6 Order List View & Filters

1. Navigate to **Sidebar → Orders**.
2. The default view shows all orders (Admin) or orders created by the logged-in staff member (Staff view).

### Available Filters

| Filter | Options |
|---|---|
| **Status** | All / Pending / Approved / Completed / Rejected / Cancelled |
| **Retailer** | All Retailers / specific retailer |
| **Created By** | All Staff / specific staff member (Admin view) |
| **Date Range** | Order creation date from / to |

---

---

# 13. Module 10 — Delivery & Logistics

The **Delivery & Logistics** module tracks the physical dispatch and delivery of goods to retailers. It connects vehicles, drivers, orders, and retailers into a single delivery record with status tracking.

> 🔴 **Admin Only:** Creating and managing delivery records are Admin-only actions. Staff users can view deliveries assigned to them through the "My Deliveries" view.

---

## 13.1 Creating a Delivery Record (Admin)

1. Navigate to **Sidebar → Deliveries**.
2. Click **+ Create Delivery**.
3. Fill in the delivery form.
4. Click **Save Delivery**.

`[SCREENSHOT: Create Delivery form]`

### Delivery Form Field Descriptions

| Field | Type | Required | Description |
|---|---|---|---|
| **Vehicle Number** | Text | ✅ Yes | The vehicle registration number (e.g., "MH12AB1234"). |
| **Vehicle Type** | Dropdown | ✅ Yes | The type of vehicle: **Bike**, **Tempo**, or **Truck**. |
| **Driver Name** | Text | ✅ Yes | The name of the driver making the delivery. |
| **Driver Mobile** | Text | ✅ Yes | The driver's contact number for real-time coordination. |
| **Retailer** | Dropdown | ✅ Yes | The retailer to whom the goods are being delivered. |
| **Linked Orders** | Multi-select | No | Select one or more approved orders being fulfilled by this delivery. |
| **Assigned Staff** | Dropdown | No | Link this delivery to a specific DSR (this makes it visible in their "My Deliveries" view). |
| **Notes** | Text Area | No | Any additional delivery instructions or notes. |

> 🟢 **Tip:** Link a delivery to its corresponding **Approved Orders** when creating the record. This keeps your order fulfillment tracking complete and allows you to generate bills from orders after delivery confirmation.

---

## 13.2 Delivery Statuses & Lifecycle

| Status | Description |
|---|---|
| **Pending** | The delivery record has been created but dispatch has not yet begun. |
| **In Transit** | The vehicle is currently en route to the retailer. |
| **Delivered** | The goods have been successfully delivered to the retailer. |

### Updating Delivery Status

1. Open a delivery record from the **Deliveries** list.
2. Click **Update Status**.
3. Select the new status from the dropdown.
4. Click **Save**.

> 🔵 **Note:** Delivery statuses are updated manually in the current version of DistributeX. The system does not integrate with GPS tracking, but vehicle number and driver mobile number are recorded to allow manual coordination.

---

## 13.3 Delivery Tracking View

The Delivery Tracking view gives administrators a real-time overview of all active deliveries.

1. Navigate to **Sidebar → Deliveries → Tracking**.
2. Use the available filters to narrow down the view:

| Filter | Description |
|---|---|
| **Status** | All / Pending / In Transit / Delivered |
| **Vehicle Number** | Search by vehicle registration number. |
| **Driver Name** | Filter by driver. |
| **Retailer** | Filter by destination retailer. |
| **Order Number** | Filter by linked order. |

`[SCREENSHOT: Delivery tracking view with status filters and search]`

---

## 13.4 Staff "My Deliveries" View

Staff (DSR) users can see deliveries that have been assigned to them.

1. Navigate to **Sidebar → My Deliveries** (or tap **My Deliveries** on the Staff Dashboard).
2. The list shows all deliveries linked to the logged-in staff member.
3. Deliveries are sorted by status (Pending → In Transit → Delivered).

> 🔵 **Note:** Staff users can view delivery details but cannot create, edit, or delete delivery records. These actions are reserved for administrators.

---

---

# 14. Module 11 — Salary Management

> 🔴 **Admin Only:** The Salary Management module is accessible only to administrators.

The **Salary Management** module allows you to record, process, and track salary payments for all staff members. DistributeX automatically accounts for any outstanding advances when calculating net salary.

---

## 14.1 Adding a Salary Record

1. Navigate to **Sidebar → Salary**.
2. Click **+ Add Salary Record**.
3. Fill in the salary form.
4. Click **Save**.

`[SCREENSHOT: Add Salary Record form]`

### Salary Form Field Descriptions

| Field | Type | Required | Description |
|---|---|---|---|
| **Staff** | Dropdown | ✅ Yes | Select the staff member for whom the salary is being processed. |
| **Month** | Dropdown | ✅ Yes | The month for which this salary is being paid (January – December). |
| **Year** | Number | ✅ Yes | The year for which this salary is being paid (e.g., 2026). |
| **Basic Salary** | Number | ✅ Yes | The gross salary amount for the month, before any deductions. |
| **Payment Mode** | Dropdown | ✅ Yes | How the salary will be paid: **Cash**, **Bank Transfer**, or **UPI**. |
| **Payment Status** | Dropdown | ✅ Yes | Current payment status: **Pending**, **Partially Paid**, or **Paid**. |
| **Paid Amount** | Number | Conditional | The amount actually paid so far (required if Payment Status is Partially Paid or Paid). |
| **Paid Date** | Date | Conditional | The date on which payment was made (required if Paid Amount is entered). |
| **Remarks** | Text Area | No | Any notes about this salary record (e.g., "Includes performance bonus"). |

---

## 14.2 Advance Auto-Deduction

If a staff member has **Open** advance records in the system (see [Module 12 — Advance Management](#15-module-12--advance-management)), DistributeX will automatically calculate the net salary after advance deduction.

When you open the **Add Salary Record** form for a staff member with open advances:

- A notification banner will appear: *"This staff member has ₹[amount] in open advances that will be deducted from net salary."*
- The **Net Salary** field (read-only) will show: `Basic Salary − Total Open Advances`.
- Once the salary is saved with a **Paid** status, the linked advances are automatically marked as **Adjusted**.

> 🟡 **Warning:** Advance deduction is automatic and based on all **Open** advances for that staff member, regardless of the **Adjusted Month/Year** set on the advance. Review the staff member's open advances before processing salary to ensure the correct deductions are being made.

> 🔵 **Note:** If a staff member's total open advances exceed their basic salary, the net salary will show as zero or negative. In this case, the excess advance amount remains **Open** and will carry forward to the next salary period.

---

## 14.3 Viewing Salary Records

1. Navigate to **Sidebar → Salary**.
2. The salary list displays all records.
3. Use filters to narrow down:

| Filter | Options |
|---|---|
| **Staff Member** | All Staff / Specific employee |
| **Month** | January – December |
| **Year** | Specific year |
| **Payment Status** | All / Pending / Partially Paid / Paid |

---

## 14.4 Updating Payment Status

To update the payment status of an existing salary record (e.g., from Pending to Paid):

1. Navigate to **Sidebar → Salary**.
2. Find the salary record and click **Edit** (✏️).
3. Update the **Payment Status**, **Paid Amount**, and **Paid Date**.
4. Click **Save Changes**.

---

---

# 15. Module 12 — Advance Management

> 🔴 **Admin Only:** The Advance Management module is accessible only to administrators.

The **Advance Management** module tracks salary advances given to staff members outside of the regular salary cycle. Open advances are automatically considered when processing monthly salary.

---

## 15.1 Recording an Advance

1. Navigate to **Sidebar → Advances**.
2. Click **+ Record Advance**.
3. Fill in the advance form.
4. Click **Save Advance**.

`[SCREENSHOT: Record Advance form]`

### Advance Form Field Descriptions

| Field | Type | Required | Description |
|---|---|---|---|
| **Staff** | Dropdown | ✅ Yes | The staff member receiving the advance. |
| **Advance Amount** | Number | ✅ Yes | The amount of cash/transfer given as advance. |
| **Date** | Date | ✅ Yes | The date the advance was given. |
| **Reason** | Text | ✅ Yes | The reason for the advance (e.g., "Medical emergency", "Festival advance"). |
| **Notes** | Text Area | No | Additional context or notes. |
| **Adjusted Month** | Dropdown | No | The intended month in which this advance will be deducted from salary. |
| **Adjusted Year** | Number | No | The year corresponding to the Adjusted Month. |

> 🔵 **Note:** The **Adjusted Month/Year** is for planning purposes and does not automatically trigger deduction. Deduction occurs when a salary record is processed for that staff member, and all **Open** advances are deducted at that time.

---

## 15.2 Advance Statuses

| Status | Description |
|---|---|
| **Open** | The advance has been given but not yet deducted from salary. |
| **Adjusted** | The advance has been deducted from a processed salary payment. |

> 🔵 **Note:** An advance status changes from **Open** to **Adjusted** automatically when a salary record is saved with a **Paid** status and the advance has been included in the deduction calculation.

---

## 15.3 How Advances Affect Salary

The relationship between advances and salary works as follows:

1. You record an advance for a staff member (status: **Open**).
2. At month-end, you process the staff member's salary.
3. The Salary form shows all **Open** advances for that employee and calculates the **Net Salary** (Basic Salary − Open Advances).
4. When the salary is marked as **Paid**, all included advances are marked as **Adjusted**.

> 🟢 **Tip:** Use the **Advances** list view (filtered by Status: Open) to get a quick summary of total outstanding advances across your team before running salary processing.

---

---

# 16. Module 13 — Attendance Management

> 🔴 **Admin Only:** Attendance Management is an Admin-only module.

The **Attendance Management** module enables daily tracking of staff attendance with automatic working hours calculation. It supports monthly summaries, export functionality, and record locking for payroll integrity.

---

## 16.1 Recording Daily Attendance

1. Navigate to **Sidebar → Attendance**.
2. Click **+ Mark Attendance**.
3. Fill in the attendance form.
4. Click **Save**.

`[SCREENSHOT: Mark Attendance form]`

---

## 16.2 Attendance Field Descriptions

| Field | Type | Required | Description |
|---|---|---|---|
| **Staff** | Dropdown | ✅ Yes | Select the staff member. |
| **Date** | Date | ✅ Yes | The date for which attendance is being recorded. Defaults to today. |
| **Status** | Dropdown | ✅ Yes | Attendance status: **Present**, **Absent**, **Half Day**, or **Leave**. |
| **In Time** | Time | Conditional | The time the staff member started work. Required if Status is Present or Half Day. |
| **Out Time** | Time | Conditional | The time the staff member ended work. Required if Status is Present or Half Day. |
| **Remarks** | Text Area | No | Additional notes (e.g., "Left early due to field emergency", "Sick Leave"). |

---

## 16.3 Working Hours Auto-Calculation

When **In Time** and **Out Time** are entered, DistributeX automatically calculates **Working Hours**:

`Working Hours = Out Time − In Time`

This calculated value is displayed on the attendance record and is used in the monthly summary.

> 🔵 **Note:** Working hours are calculated in hours and minutes. If a staff member works across midnight (e.g., In Time: 22:00, Out Time: 02:00), manually verify the calculated value for accuracy.

---

## 16.4 Monthly Attendance Summary

The Monthly Attendance Summary provides a per-staff breakdown of attendance for any given month.

1. Navigate to **Sidebar → Attendance → Monthly Summary**.
2. Select the **Staff Member** (or choose "All Staff" for a consolidated view).
3. Select the **Month** and **Year**.
4. Click **View Summary**.

### Summary Columns

| Column | Description |
|---|---|
| **Date** | Each working day of the month. |
| **Status** | Present / Absent / Half Day / Leave. |
| **In Time** | Time of arrival. |
| **Out Time** | Time of departure. |
| **Working Hours** | Auto-calculated hours worked. |
| **Remarks** | Any notes entered for that day. |
| **Total Present Days** | Sum of Present + Half Day (counted as 0.5) records. |
| **Total Working Hours** | Sum of all Working Hours in the month. |

`[SCREENSHOT: Monthly attendance summary table for one staff member]`

---

## 16.5 Duplicate Prevention & Record Locking

### Duplicate Prevention

DistributeX enforces a rule of **one attendance record per staff member per day**. If you attempt to save a record for a staff member on a date that already has an entry, you will see a validation error:

> *"An attendance record for [Staff Name] on [Date] already exists. Edit the existing record to make changes."*

To update an existing attendance record, find it in the list and click **Edit** (✏️).

### Record Locking

Once an attendance record is **locked**, it cannot be edited or deleted.

- Locking is performed by an Admin to prevent post-payroll modifications.
- To lock records, go to the attendance list, select the records you want to lock, and click **Lock Selected**.
- Locked records are indicated by a 🔒 icon.

> 🟡 **Warning:** Locked attendance records cannot be unlocked through the standard interface. Contact support if you need to make a correction to a locked record.

---

## 16.6 Exporting Attendance Data

1. Navigate to **Sidebar → Attendance**.
2. Apply any desired filters (staff member, month/year, status).
3. Click **Export to Excel**.
4. The file is downloaded to your device with all visible columns included.

> 🟢 **Tip:** Export monthly attendance data at the end of each month before locking records, to keep an offline backup for your payroll records.

---

---

# 17. Module 14 — Reports

> 🔴 **Admin Only:** The Reports module is accessible only to administrators.

The **Reports** module provides business intelligence and data export capabilities. All reports can be filtered by date range and exported to Excel or PDF formats.

`[SCREENSHOT: Reports module main page showing available report types]`

---

## 17.1 Collection Reports

The **Collection Report** provides a detailed record of all payment collections within a selected date range.

1. Navigate to **Sidebar → Reports → Collection Report**.
2. Set the **Date Range** (From and To dates).
3. Optionally filter by:
   - **Staff Member (DSR)**
   - **Retailer**
   - **Payment Mode**
4. Click **Generate Report**.

### Collection Report Columns

| Column | Description |
|---|---|
| **Date** | Collection date. |
| **Bill Number** | The bill the payment was applied to. |
| **Retailer** | The retailer who paid. |
| **Staff (DSR)** | Who recorded the collection. |
| **Amount Collected** | Payment amount. |
| **Payment Mode** | Cash / Cheque / Bank Transfer / UPI. |
| **Payment Reference** | Cheque number / Transaction ID / UPI ID. |

---

## 17.2 DSR-Wise Summary Report

The **DSR-Wise Summary Report** aggregates collection data by staff member for a given period.

1. Navigate to **Sidebar → Reports → DSR Summary**.
2. Set the **Date Range**.
3. Click **Generate Report**.

| Column | Description |
|---|---|
| **Staff Name** | DSR name. |
| **No. of Collections** | Count of transactions. |
| **Total Collected** | Sum of all amounts. |
| **Cash** | Amount collected via Cash. |
| **Cheque** | Amount collected via Cheque. |
| **Bank Transfer** | Amount collected via Bank Transfer. |
| **UPI** | Amount collected via UPI. |

---

## 17.3 Bill Trend Reports

The **Bill Trend Report** shows bills created over time, helping you visualize billing volume patterns.

1. Navigate to **Sidebar → Reports → Bill Trends**.
2. Set the **Date Range**.
3. Select the **Grouping**: Daily, Weekly, or Monthly.
4. Click **Generate Report**.

The report displays both a chart (bar/line) and a data table showing:
- Period label (day/week/month)
- Number of bills created
- Total bill amount for the period
- Number of bills paid in the period

---

## 17.4 Payment Mode Breakdown

The **Payment Mode Breakdown** report shows what proportion of collections were made in each payment mode.

1. Navigate to **Sidebar → Reports → Payment Mode Breakdown**.
2. Set the **Date Range**.
3. Click **Generate Report**.

The report displays:
- A **Pie chart** or **Bar chart** showing the split by mode.
- A data table with: Payment Mode, No. of Transactions, Total Amount, Percentage of Total.

> 🟢 **Tip:** This report is useful for understanding your cash vs. digital payment mix — important for planning cash handling and banking requirements.

---

## 17.5 Exporting Reports

All reports in DistributeX support export in two formats:

| Format | How to Export |
|---|---|
| **Excel (.xlsx)** | Click **Export to Excel** after generating the report. |
| **PDF** | Click **Export to PDF** after generating the report. |

> 🔵 **Note:** PDF exports include charts (if applicable) as embedded images. Excel exports include only tabular data. For sharing with stakeholders who need to review numbers, use Excel. For formal reports, use PDF.

> 🟡 **Warning:** Very large date ranges (e.g., an entire year of daily transactions) may result in large file sizes and longer export times. For large exports, consider breaking the report into smaller date ranges.

---

---

# 18. Module 15 — User Management

> 🔴 **Admin Only:** User Management is an Admin-only module.

The **User Management** module allows administrators to create user accounts, assign roles, manage account status, and configure granular permissions for each user.

`[SCREENSHOT: User Management list view showing all users with roles and status]`

---

## 18.1 Creating a New User

1. Navigate to **Sidebar → Users**.
2. Click **+ Add User**.
3. Fill in the user creation form.
4. Click **Save User**.

`[SCREENSHOT: Add User form]`

### User Creation Form Fields

| Field | Type | Required | Description |
|---|---|---|---|
| **Full Name** | Text | ✅ Yes | The user's full name. |
| **Email Address** | Text | ✅ Yes | Used as the login identifier. Must be unique. |
| **Password** | Text | ✅ Yes | Set a temporary password for the new user. The user should change this upon first login. |
| **Role** | Dropdown | ✅ Yes | Select the user's role: **Admin**, **Staff**, or **Retailer**. |
| **Phone Number** | Text | No | Contact number for the user. |
| **Status** | Toggle | ✅ Yes | Set to **Active** to allow login, or **Inactive** to prevent access. |

> 🟢 **Tip:** Inform the new user of their login credentials through a secure channel (phone call or encrypted message). Do not share passwords via unencrypted email.

> 🔵 **Note:** When you set the Role to **Retailer** and create the account directly (rather than approving a self-registration), the account is created as **Active** immediately — it does not go through the pending approval workflow.

---

## 18.2 Managing Roles & Status

### Changing a User's Role

1. Find the user in the **Users** list.
2. Click **Edit** (✏️).
3. Update the **Role** dropdown.
4. Click **Save**.

> 🟡 **Warning:** Changing a user's role will immediately change what they can see and do in DistributeX. A staff member promoted to Admin will gain full access to all modules immediately upon next login.

### Toggling Active / Inactive Status

1. Find the user in the **Users** list.
2. Click the **Active/Inactive toggle** on the user row, or click **Edit** and change the Status field.
3. Confirm the action.

- **Inactive users** cannot log in to DistributeX.
- **Active users** can log in normally.

> 🔵 **Note:** Setting a user to **Inactive** does not delete their data. All records created by or assigned to an inactive user remain intact. This is useful when a staff member is temporarily unavailable (e.g., on extended leave).

---

## 18.3 Granular Permission Control

DistributeX provides a powerful **per-user permission system** that goes beyond simple role-based access. You can configure exactly which modules a user can access and what actions they can perform within each module.

`[SCREENSHOT: Permission configuration panel for a user, showing module toggles and action checkboxes]`

### How to Configure User Permissions

1. Navigate to **Sidebar → Users**.
2. Click on a user's name to open their profile.
3. Scroll to the **Permissions** section.
4. Configure permissions for each module.

### Modules Available for Permission Configuration

| Module | Available Actions |
|---|---|
| **Dashboard** | View |
| **Bills** | View, Create, Edit, Delete, Assign Bills |
| **Collections** | View, Create, Edit, Delete |
| **Products** | View, Create, Edit, Delete |
| **Retailers** | View, Create, Edit, Delete |
| **Orders** | View, Create, Edit, Delete, Approve Orders |
| **Deliveries** | View, Create, Edit, Delete |
| **Users** | View, Create, Edit, Delete |
| **Reports** | View, Export Reports |
| **Salary** | View, Create, Edit, Delete |
| **Advances** | View, Create, Edit, Delete |
| **Attendance** | View, Create, Edit, Delete |
| **Settings** | View, Edit |

### How Permissions Work

- **Module Toggle (On/Off):** If a module is toggled off for a user, they cannot see or access that module at all — it will not appear in their sidebar.
- **Action Checkboxes:** Even if a module is enabled, you can restrict specific actions. For example, a staff member can have the **Bills** module enabled with only **View** access — they can see their bills but cannot create or edit them.
- **Override:** Granular permissions override the default role-based permissions. You can give a Staff user more restricted access than typical, or grant a specific staff member additional capabilities.

> 🟡 **Warning:** Granting a non-admin user the **Users** module permission with Create/Edit access effectively gives them the ability to manage other users. Grant this permission only to trusted senior staff.

---

## 18.4 Applying Permission Templates

Permission Templates allow you to save a set of permissions as a reusable preset and apply it to multiple users quickly.

### Applying an Existing Template

1. Open a user's profile.
2. In the **Permissions** section, click **Apply Template**.
3. Select the desired template from the dropdown.
4. Click **Apply**.
5. The user's permissions will be updated to match the template.
6. Click **Save**.

> 🔵 **Note:** Applying a template overwrites the user's current permission configuration. Any custom permissions set previously will be replaced by the template values.

### Creating and Managing Templates

Templates are managed in the **Settings** module. See [Section 19.3 — Permission Templates](#193-permission-templates) for details.

---

---

# 19. Module 16 — Settings

> 🔴 **Admin Only:** The Settings module is accessible only to administrators.

The **Settings** module allows you to customize DistributeX to match your business's specific terminology, workflows, and requirements — without needing technical assistance.

`[SCREENSHOT: Settings module main page with three configuration sections]`

---

## 19.1 Module Field Customization

DistributeX allows you to customize the fields displayed in each module's forms and list views — adding fields your business uses, removing fields that don't apply, or changing field labels.

`[SCREENSHOT: Module Fields configuration screen for the Bills module]`

### Accessing Module Fields

1. Navigate to **Sidebar → Settings → Module Fields**.
2. Select the **Module** you want to customize from the dropdown (e.g., Bills, Retailers, Products).
3. The current field configuration for that module will be displayed.

### Adding a New Field

1. Click **+ Add Field**.
2. Fill in the field configuration:

| Option | Description |
|---|---|
| **Field Name / Label** | The display name for the field (as it will appear in forms and lists). |
| **Field Type** | The type of input: **Text**, **Number**, **Date**, **Select (Dropdown)**, **Multi-Select**, **Toggle (Yes/No)**, **Textarea**. |
| **Visibility** | Where the field appears: **Form only**, **List only**, or **Both Form and List**. |
| **Required** | Whether this field must be filled before a record can be saved (Yes / No). |
| **Roles That See This Field** | Which user roles can see and interact with this field: Admin, Staff, Retailer (select one or more). |

3. Click **Save Field**.

### Editing an Existing Field

1. Find the field in the field list for the selected module.
2. Click the **Edit** icon (✏️).
3. Modify the desired options.
4. Click **Save**.

### Removing a Field

1. Find the field in the list.
2. Click the **Delete** icon (🗑️).
3. Confirm deletion.

> 🟡 **Warning:** Removing a field from a module will hide it from all forms and lists going forward. Data previously entered in that field is not deleted from the database, but it will no longer be visible in the UI. Only remove fields you are certain are no longer needed.

> 🔵 **Note:** Certain core system fields (e.g., Bill Number, Amount, Status) are protected and cannot be removed or significantly modified, as they are required for core platform functionality.

---

## 19.2 Module Name Customization

Every module in DistributeX can be renamed to match the terminology your business uses. For example, if your business calls "Bills" as "Invoices" or "Collections" as "Receipts," you can configure this in Settings.

`[SCREENSHOT: Module Names configuration screen]`

### Renaming a Module

1. Navigate to **Sidebar → Settings → Module Names**.
2. You will see a list of all modules with their current display names.
3. Click the **Edit** icon (✏️) next to the module you want to rename.
4. Enter the new **Display Name** for the module.
5. Click **Save**.

The module name will be updated throughout the platform:
- In the sidebar navigation.
- In page headers and titles.
- In notification messages and report headings.
- Everywhere the module name appears in the UI.

> 🔵 **Note:** Renaming modules changes only the display label in the user interface. All underlying data and functionality remain the same. Internal system references are not affected.

> 🟢 **Tip:** If you customize module names, update your team and any printed documentation to use the new terminology to avoid confusion.

### Reverting to Default Names

1. Navigate to **Sidebar → Settings → Module Names**.
2. Click the **Edit** icon (✏️) next to the renamed module.
3. Click **Reset to Default**.
4. Confirm.

---

## 19.3 Permission Templates

Permission Templates allow administrators to save a standard set of user permissions as a reusable preset, making it easy to onboard new users with consistent access configurations.

`[SCREENSHOT: Permission Templates management screen]`

### Creating a New Permission Template

1. Navigate to **Sidebar → Settings → Permission Templates**.
2. Click **+ Create Template**.
3. Enter a **Template Name** (e.g., "Standard DSR", "Senior Staff", "Read-Only Viewer").
4. Configure permissions for each module (same interface as individual user permissions — see [Section 18.3](#183-granular-permission-control)).
5. Click **Save Template**.

### Editing a Template

1. Navigate to **Sidebar → Settings → Permission Templates**.
2. Click **Edit** (✏️) on the desired template.
3. Update the permission configuration.
4. Click **Save**.

> 🔵 **Note:** Editing a template does **not** automatically update the permissions of users who have previously had that template applied. To propagate changes, you must re-apply the template to each affected user in the User Management module.

### Deleting a Template

1. Navigate to **Sidebar → Settings → Permission Templates**.
2. Click **Delete** (🗑️) on the template.
3. Confirm deletion.

> 🔵 **Note:** Deleting a template does not affect users who have already had that template applied. Their permissions remain as-configured.

### Applying a Template to a User

See [Section 18.4 — Applying Permission Templates](#184-applying-permission-templates).

---

---

# 20. Frequently Asked Questions (FAQ)

### General

**Q1. How do I reset my password if I forget it?**

Currently, password resets must be performed by your administrator. Contact your DistributeX administrator and ask them to reset your password in **User Management**. The administrator will set a new temporary password for you.

> 🔵 **Note:** A self-service password reset feature is on the DistributeX product roadmap and will be available in an upcoming release.

---

**Q2. Can I use DistributeX on my phone?**

Yes. DistributeX is available as a mobile app on **Android** (Google Play Store) and **iOS** (Apple App Store). The mobile app is optimized for field staff use. Administrators may prefer the web application for complex tasks like reporting and configuration.

---

**Q3. Can multiple users be logged in at the same time?**

Yes. DistributeX supports concurrent sessions. Multiple staff members, the admin, and retailers can all be logged in simultaneously without conflict.

---

### Bills & Collections

**Q4. A bill shows as "Partially Paid" but the retailer says they've paid in full. What should I check?**

1. Go to **Bills** and open the bill in question.
2. Check the **Due Amount** — it should be zero if fully paid.
3. Click on the **Collections** tab or scroll to the collections section on the bill detail page to see all payments recorded against this bill.
4. If a payment is missing, record the outstanding collection. If a payment was recorded with an incorrect amount, contact your administrator to make a correction.

---

**Q5. I accidentally recorded a wrong collection amount. Can I edit it?**

Staff users cannot directly edit submitted collections. Contact your administrator. The admin can edit or void the incorrect collection and create a corrected one. All such changes are logged in the audit trail.

---

**Q6. How do I assign a bill to a different staff member mid-month?**

1. Go to **Sidebar → Bills**.
2. Find the bill and click **Edit** (✏️).
3. Update the **Assign to Staff** field with the new staff member.
4. Update the **Assigned Date** if needed.
5. Click **Save**.
The bill will now appear on the new staff member's dashboard.

---

**Q7. Can a retailer see how much they owe?**

Yes. When a retailer logs into the **Retailer Portal**, their **Dashboard** displays their current **Outstanding Amount**, as well as a detailed list of all their bills and their statuses under **My Bills**.

---

### Orders & Deliveries

**Q8. I submitted an order but it hasn't been approved yet. Who should I contact?**

Orders must be approved by your administrator. The order will appear in the **Admin → Orders (Pending)** list. Contact your administrator and ask them to review and approve your submitted order.

---

**Q9. Can I create multiple deliveries for a single order?**

In the current version, each delivery record can be linked to one or more orders. However, a single order is typically fulfilled by one delivery. If goods for one order are being sent in multiple shipments, create separate delivery records and link the same order to each — or ask your administrator to split the order before dispatch.

---

**Q10. Why can't I see the order I just created in the Order List?**

The Order List for staff shows only orders you have created. Check that you are looking at the correct filter (your own orders). If you still cannot find it, verify that the order was submitted successfully (you should have seen a success confirmation message). If in doubt, check with your administrator.

---

### HR (Salary, Advances, Attendance)

**Q11. How are advances deducted from salary?**

When processing a staff member's monthly salary, DistributeX automatically identifies all **Open** advances for that employee and calculates the **Net Salary** (Basic Salary − Open Advances). When the salary is marked as Paid, the advances are automatically marked as **Adjusted**. See [Module 11](#14-module-11--salary-management) and [Module 12](#15-module-12--advance-management) for full details.

---

**Q12. Can I record attendance for multiple staff members at once?**

The current version requires attendance to be recorded individually for each staff member, one at a time. Bulk attendance entry is on the product roadmap for future releases.

---

**Q13. What happens if I try to mark attendance for a staff member on a day that already has a record?**

DistributeX will prevent you from creating a duplicate entry and display an error: *"An attendance record for [Staff Name] on [Date] already exists."* Use the **Edit** function to update the existing record if needed.

---

### Permissions & Settings

**Q14. I want to give one of my staff members access to the Reports module for viewing only. How do I do this?**

1. Go to **Sidebar → Users**.
2. Open the staff member's profile.
3. In the **Permissions** section, find the **Reports** module and toggle it **On**.
4. Check only the **View** action (and **Export Reports** if you want them to be able to download). Leave **Create/Edit/Delete** unchecked.
5. Click **Save**.

The staff member will now see the Reports module in their sidebar with view-only access.

---

**Q15. Can I rename "Bills" to "Invoices" throughout the platform?**

Yes. Go to **Sidebar → Settings → Module Names**, find "Bills" in the list, click **Edit**, enter "Invoices" as the new name, and click **Save**. The change will take effect immediately across the entire platform.

---

---

# 21. Troubleshooting Guide

This section covers the most common issues users encounter and their resolutions.

---

## Login Issues

### Problem: "Invalid email or password" error

**Possible Causes & Solutions:**

| Cause | Solution |
|---|---|
| Incorrect email address entered | Double-check the email you are using. Ensure there are no typos or extra spaces. |
| Incorrect password | Passwords are case-sensitive. Check that Caps Lock is not on. |
| Account does not exist | Contact your administrator to verify that your account has been created. |
| Account is Inactive | Your administrator may have deactivated your account. Contact them to re-enable it. |

---

### Problem: Retailer registration approved but cannot log in

**Possible Causes & Solutions:**
- Verify the email and password entered match what you used during registration.
- Confirm with your administrator that your account has been **Approved** (Status: ACTIVE), not just submitted.
- Try clearing your browser cache and cookies, then attempt login again.

---

### Problem: Account locked after multiple failed attempts

**Solution:**
Contact your DistributeX administrator to unlock your account. The admin can reset your password and reactivate your account from the **User Management** module.

---

## Session Expiry

### Problem: Suddenly redirected to login page with "Session Expired" message

**This is expected behavior.** Your session expired due to inactivity.

**Solution:**
1. Log in again with your email and password.
2. To avoid losing unsaved data in the future, save your work regularly using the **Save** button.

> 🟢 **Tip:** If you are performing a long, uninterrupted task (e.g., filling out a large batch of salary records), complete sections progressively and save each record before moving on to the next.

---

## Data Not Loading

### Problem: Dashboard or module pages show "No data" or are blank

**Possible Causes & Solutions:**

| Cause | Solution |
|---|---|
| Slow internet connection | Check your internet connectivity. Reload the page after restoring a stable connection. |
| Filters hiding all records | Check that filters are not over-restricted. Reset/clear all filters and try again. |
| Data not yet entered | If you are a new user, the system will have no data until records are created. Complete the Admin Quick Start Guide steps to populate the system. |
| Browser cache issue | Hard-refresh the page (Ctrl+Shift+R on Windows/Linux, Cmd+Shift+R on Mac) to force a fresh load. |

---

### Problem: Chart on Admin Dashboard is not displaying

**Solutions:**
- Ensure you have collection data in the system for the selected time period.
- Try switching the chart period (Daily/Weekly/Monthly) to another option.
- Reload the page.
- Try a different browser to rule out a browser-specific rendering issue.

---

## Permission Denied Errors

### Problem: "You don't have permission to access this page" error

**Cause:** Your user account does not have the required permission for the module or action you are trying to access.

**Solution:**
1. Contact your administrator.
2. Ask them to review your permission settings in **User Management → [Your Profile] → Permissions**.
3. The administrator can grant the necessary module/action permissions.

---

### Problem: I can see a module but some buttons (Create/Edit/Delete) are missing

**Cause:** You have **View** permission for the module but not the specific action permissions (Create, Edit, Delete).

**Solution:** Contact your administrator to request the additional action permissions for that module.

---

## Export Failures

### Problem: Excel or PDF export shows an error or produces an empty file

**Possible Causes & Solutions:**

| Cause | Solution |
|---|---|
| No data matches the filters | Verify that your filter criteria returns results on-screen before exporting. |
| Very large data range causing timeout | Narrow your date range and export in smaller batches. |
| Browser blocking the file download | Check your browser's download settings and ensure pop-ups / downloads are allowed for the DistributeX domain. |
| Slow internet during large export | Retry the export with a stable internet connection. |

---

### Problem: PDF export cuts off content or charts are missing

**Solutions:**
- For complex reports with charts, allow a few extra seconds after clicking Export to PDF for charts to fully render before downloading.
- If the issue persists, try the Excel export as an alternative.
- Contact support with details of the report you were trying to export.

---

---

# 22. Glossary

| Term | Definition |
|---|---|
| **Advance** | A partial payment made to a staff member against their future salary, typically in response to an urgent financial need. Tracked separately and automatically deducted when the salary for the relevant month is processed. |
| **Audit Log** | A system-maintained, read-only chronological record of all changes made to a specific data record (e.g., who changed a bill amount and when). Ensures accountability and traceability. |
| **Bill** | A financial receivable representing money owed by a retailer to the distribution business. A bill is raised after goods are supplied and is tracked until fully collected. Equivalent to an invoice in some business terminologies. |
| **Bill Trend** | A chart or report showing how the number or total value of bills changes over time (daily, weekly, or monthly). Used to visualize billing activity patterns. |
| **Collection** | A payment received from a retailer against one or more bills. Collections reduce a bill's "Due Amount" and update its status. Each collection transaction is recorded individually with payment mode and reference details. |
| **Collection Day** | The designated day(s) of the week on which a retailer typically makes bill payments. Used to surface bills for collection on the correct days for DSRs. |
| **DSR (Daily Sales Representative)** | A field-level staff member who visits retailers daily to collect payments, take orders, and manage deliveries. The primary field-level user role in DistributeX. |
| **Due Amount** | The portion of a bill's total amount that remains unpaid. Starts equal to the full bill amount; reduced with each collection recorded. When Due Amount reaches zero, the bill status becomes Paid. |
| **FMCG (Fast-Moving Consumer Goods)** | A category of products that sell quickly at relatively low cost — such as packaged foods, beverages, toiletries, and household products. DistributeX is designed for distributors in this industry. |
| **KPI (Key Performance Indicator)** | A quantifiable metric used to evaluate the performance of a business process. On the DistributeX Admin Dashboard, KPIs include Total Bills, Pending Bills, Total Retailers, etc. |
| **MRP (Maximum Retail Price)** | The maximum price at which a product can be sold to end consumers, as printed on the product packaging. Used in DistributeX for reference; actual selling price to retailers may be lower. |
| **Net Salary** | The actual amount payable to a staff member after deducting any open advances from their Basic Salary. Calculated automatically by DistributeX during salary processing. |
| **Order** | A formal request from a retailer (created by a DSR) to purchase one or more products. Orders go through a Pending → Approved → Completed lifecycle. Approved orders can generate bills. |
| **Outstanding** | The total amount of money owed and not yet collected. Tracked at both the bill level (individual Due Amount) and in aggregate across all bills (Total Outstanding). |
| **Permission Template** | A saved, reusable preset of user permission configurations that can be quickly applied to new or existing users to standardize access control across similar roles. |
| **Retailer** | A business partner (shop owner, supermarket, etc.) who purchases goods from the distribution company. Retailers receive bills, make payments (collections), and can access the DistributeX Retailer Portal. |
| **Scheme / Discount** | A promotional pricing arrangement applied to a product, such as a percentage discount, a volume bonus ("Buy 10 Get 1 Free"), or a flat price reduction. Configured at the product level in DistributeX. |
| **Selling Price** | The price at which the distribution business sells a product to retailers (as distinguished from MRP, which is the consumer price). |
| **Session** | A period of authenticated use of DistributeX, beginning at login and ending at logout or auto-logout due to inactivity. |
| **SKU (Stock Keeping Unit)** | A unique identifier assigned to a product for inventory management purposes. Equivalent to the "Product Code" field in DistributeX. |
| **Soft Delete** | A deletion method where a record is marked as deleted (hidden from views) but not permanently removed from the database. Allows for potential recovery and maintains audit trails. |
| **Staff** | A DistributeX user with the Staff/DSR role. Field employees who manage bill collections, orders, and deliveries in the field. |
| **Stock Quantity** | The number of product units currently available in the distribution company's warehouse. Tracked in the DistributeX Product Management module. |
| **Vehicle Type** | The classification of the delivery vehicle used to fulfill an order: Bike, Tempo, or Truck. Selected when creating a delivery record. |
| **Working Hours** | The duration of a staff member's work on a given day, automatically calculated from the In Time and Out Time entered in the Attendance Management module. |

---

---

# 23. Appendix

## 23.1 Permission Matrix

The following table shows the default access level for each role across all modules and actions. Note that administrators can customize permissions per user (see [Module 15](#18-module-15--user-management)).

| Module | Action | Admin | Staff (DSR) | Retailer |
|---|---|:---:|:---:|:---:|
| **Dashboard** | View | ✅ | ✅ (Staff Dashboard) | ✅ (Retailer Dashboard) |
| **Bills** | View | ✅ | ✅ (Assigned only) | ✅ (Own bills only) |
| **Bills** | Create | ✅ | ❌ | ❌ |
| **Bills** | Edit | ✅ | ❌ | ❌ |
| **Bills** | Delete | ✅ | ❌ | ❌ |
| **Bills** | Assign Bills | ✅ | ❌ | ❌ |
| **Collections** | View | ✅ | ✅ (Own only) | ✅ (Own payments only) |
| **Collections** | Create | ✅ | ✅ | ❌ |
| **Collections** | Edit | ✅ | ❌ | ❌ |
| **Collections** | Delete | ✅ | ❌ | ❌ |
| **Products** | View | ✅ | ✅ (Order creation) | ❌ |
| **Products** | Create | ✅ | ❌ | ❌ |
| **Products** | Edit | ✅ | ❌ | ❌ |
| **Products** | Delete | ✅ | ❌ | ❌ |
| **Retailers** | View | ✅ | ✅ (Limited) | ✅ (Own profile) |
| **Retailers** | Create | ✅ | ❌ | ❌ |
| **Retailers** | Edit | ✅ | ❌ | ✅ (Own profile) |
| **Retailers** | Delete | ✅ | ❌ | ❌ |
| **Retailers** | Approve/Reject | ✅ | ❌ | ❌ |
| **Orders** | View | ✅ | ✅ (Own orders) | ✅ (Own orders) |
| **Orders** | Create | ✅ | ✅ | ❌ |
| **Orders** | Edit | ✅ | ✅ (Pending only) | ❌ |
| **Orders** | Delete / Cancel | ✅ | ✅ (Pending only) | ❌ |
| **Orders** | Approve Orders | ✅ | ❌ | ❌ |
| **Deliveries** | View | ✅ | ✅ (Assigned deliveries) | ❌ |
| **Deliveries** | Create | ✅ | ❌ | ❌ |
| **Deliveries** | Edit | ✅ | ❌ | ❌ |
| **Deliveries** | Delete | ✅ | ❌ | ❌ |
| **Users** | View | ✅ | ❌ | ❌ |
| **Users** | Create | ✅ | ❌ | ❌ |
| **Users** | Edit | ✅ | ❌ | ❌ |
| **Users** | Delete | ✅ | ❌ | ❌ |
| **Reports** | View | ✅ | ❌ | ❌ |
| **Reports** | Export | ✅ | ❌ | ❌ |
| **Salary** | View | ✅ | ❌ | ❌ |
| **Salary** | Create | ✅ | ❌ | ❌ |
| **Salary** | Edit | ✅ | ❌ | ❌ |
| **Salary** | Delete | ✅ | ❌ | ❌ |
| **Advances** | View | ✅ | ❌ | ❌ |
| **Advances** | Create | ✅ | ❌ | ❌ |
| **Advances** | Edit | ✅ | ❌ | ❌ |
| **Advances** | Delete | ✅ | ❌ | ❌ |
| **Attendance** | View | ✅ | ❌ | ❌ |
| **Attendance** | Create | ✅ | ❌ | ❌ |
| **Attendance** | Edit | ✅ | ❌ | ❌ |
| **Attendance** | Delete | ✅ | ❌ | ❌ |
| **Attendance** | Lock Records | ✅ | ❌ | ❌ |
| **Attendance** | Export | ✅ | ❌ | ❌ |
| **Settings** | View | ✅ | ❌ | ❌ |
| **Settings** | Edit | ✅ | ❌ | ❌ |

> 🔵 **Note:** The ✅ / ❌ values above reflect **default** permissions. Administrators can override any of these for individual users using the Granular Permission Control feature in [Module 15](#18-module-15--user-management).

---

## 23.2 Keyboard Shortcuts

The following keyboard shortcuts are available in the DistributeX web application to improve productivity:

| Shortcut | Action |
|---|---|
| `Ctrl + /` (Windows/Linux) / `Cmd + /` (Mac) | Toggle sidebar (expand/collapse) |
| `Ctrl + K` / `Cmd + K` | Open global search |
| `Escape` | Close modal dialog / cancel current action |
| `Ctrl + S` / `Cmd + S` | Save current form (where applicable) |
| `Alt + Left Arrow` | Navigate to previous page |
| `Alt + Right Arrow` | Navigate to next page |
| `Tab` | Move focus to the next form field |
| `Shift + Tab` | Move focus to the previous form field |
| `Enter` | Submit focused form or confirm dialog |

> 🔵 **Note:** Keyboard shortcuts are available in the web application only. The mobile app uses touch gestures for navigation.

> 🟢 **Tip:** Power users — particularly administrators who spend significant time in DistributeX — will find keyboard shortcuts especially useful for navigating between modules and quickly saving forms.

---

## 23.3 Contact & Support

### Getting Help

If you encounter an issue not covered in this manual or the FAQ, DistributeX offers the following support channels:

| Channel | Details |
|---|---|
| **In-App Help** | Click the **?** (Help) icon in the top-right header to access contextual help articles for the current page. |
| **Email Support** | `support@distributex.io` — For non-urgent issues. Typical response time: 1 business day. |
| **Live Chat** | Available on the DistributeX website and in-app during business hours (9 AM – 6 PM, Monday – Saturday). |
| **Knowledge Base** | `help.distributex.io` — A searchable online library of guides, FAQs, and video tutorials. |
| **Training Webinars** | Monthly live webinars for new administrators and DSR onboarding. Register at `distributex.io/webinars`. |

---

### Before Contacting Support

To help our support team resolve your issue quickly, please have the following information ready:

1. Your **Organization / Business Name** and **DistributeX account email**.
2. Your **user role** (Admin / Staff / Retailer).
3. The **module or page** where the issue occurred.
4. A **description of the problem** — what you were trying to do, what happened, and what you expected to happen.
5. Any **error messages** displayed on screen (screenshot if possible).
6. The **browser/device** you were using (e.g., Chrome on macOS, Android mobile app).

---

### Feedback

We are constantly improving DistributeX based on user feedback.

- To submit product feedback, click the **Feedback** button (💬) in the bottom-left of the web application.
- For feature requests, email `feedback@distributex.io` or submit through the Knowledge Base.

---

*© 2026 DistributeX. All rights reserved. This documentation is provided for informational purposes and is subject to change without notice. DistributeX is a registered trademark.*

*Document Version: 1.0 | Last Updated: March 2026*
