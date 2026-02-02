# Dark Theme Color Reference Guide
## Quick Copy-Paste Colors for All Components

### 🎨 Primary Color Palette

```css
/* Core Colors - Use these everywhere */
#1A3263  /* Primary Dark - Main backgrounds, cards */
#547792  /* Secondary Blue - Borders, icons, secondary text */
#FAB95B  /* Accent Gold - CTAs, highlights, important data */
#E8E2DB  /* Light Cream - Primary text, headings */
#0F1B3D  /* Darker BG - Sidebar, table headers */
```

### 📦 Component-Specific Colors

#### Backgrounds
```css
/* Page Background */
background: linear-gradient(135deg, #1A3263 0%, #0F1B3D 100%);

/* Card/Section Background */
background: rgba(26, 50, 99, 0.8);

/* Sidebar Background */
background: #0F1B3D;

/* Table Row Hover */
background: rgba(84, 119, 146, 0.2);

/* Input Background */
background: #0F1B3D;
```

#### Borders
```css
/* Default Border */
border: 1px solid rgba(84, 119, 146, 0.3);

/* Hover Border */
border: 1px solid rgba(250, 185, 91, 0.5);

/* Active/Focus Border */
border: 1px solid #FAB95B;

/* Left Accent Border (Cards) */
border-left: 4px solid #FAB95B;
border-left: 4px solid #547792;
```

#### Text Colors
```css
/* Primary Text */
color: #E8E2DB;

/* Secondary Text / Muted */
color: #547792;

/* Highlighted Text / Numbers */
color: #FAB95B;

/* Table Headers */
color: #FAB95B;

/* Links */
color: #FAB95B;

/* Link Hover */
color: #E8E2DB;
```

#### Buttons
```css
/* Primary Button */
background: #FAB95B;
color: #1A3263;
border: 1px solid #FAB95B;

/* Secondary Button */
background: rgba(84, 119, 146, 0.3);
color: #E8E2DB;
border: 1px solid rgba(84, 119, 146, 0.5);

/* Button Hover */
box-shadow: 0 0 20px rgba(250, 185, 91, 0.4);
transform: scale(1.05);
```

#### Shadows
```css
/* Default Card Shadow */
box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);

/* Hover Shadow */
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);

/* Glow Effect (Gold) */
box-shadow: 0 0 20px rgba(250, 185, 91, 0.3);

/* Glow Effect (Blue) */
box-shadow: 0 0 20px rgba(84, 119, 146, 0.3);
```

### 🎯 Metric Card Colors

Use these specific colors for the 4 metric cards:

```javascript
// Card 1: Total Bill Amount
<MetricCard color="#547792">

// Card 2: Total Paid Today  
<MetricCard color="#FAB95B">

// Card 3: Remaining Today
<MetricCard color="#FAB95B">

// Card 4: Total Staff
<MetricCard color="#547792">
```

### 📊 Chart Colors

```javascript
// Bar/Line Color
backgroundColor: "rgba(250, 185, 91, 0.8)",
borderColor: "#FAB95B",

// Grid Lines
color: "rgba(84, 119, 146, 0.1)",

// Labels
color: "#E8E2DB",

// Title
color: "#FAB95B",

// Data Labels
color: "#FAB95B",
```

### 🔘 Status Colors

```css
/* Success / Paid / Delivered */
background: rgba(250, 185, 91, 0.2);
color: #FAB95B;
border: 1px solid rgba(250, 185, 91, 0.4);

/* Pending / In Progress */
background: rgba(84, 119, 146, 0.2);
color: #547792;
border: 1px solid rgba(84, 119, 146, 0.4);

/* Error / Overdue */
background: rgba(220, 53, 69, 0.2);
color: #FAB95B;
border: 1px solid rgba(220, 53, 69, 0.3);
```

### 🎨 RGBA Variations

Use these for transparency effects:

```css
/* Primary Dark with transparency */
rgba(26, 50, 99, 0.3)   /* Very subtle */
rgba(26, 50, 99, 0.5)   /* Medium */
rgba(26, 50, 99, 0.8)   /* Strong - for cards */

/* Secondary Blue with transparency */
rgba(84, 119, 146, 0.1)  /* Grid lines */
rgba(84, 119, 146, 0.2)  /* Hover states */
rgba(84, 119, 146, 0.3)  /* Borders */
rgba(84, 119, 146, 0.5)  /* Stronger borders */

/* Accent Gold with transparency */
rgba(250, 185, 91, 0.1)  /* Very subtle highlight */
rgba(250, 185, 91, 0.2)  /* Background hover */
rgba(250, 185, 91, 0.3)  /* Glow effects */
rgba(250, 185, 91, 0.4)  /* Strong glow */
rgba(250, 185, 91, 0.8)  /* Chart bars */
```

### 💡 Animation Colors

```css
/* Loading Spinner */
border: 4px solid rgba(84, 119, 146, 0.2);
border-top-color: #FAB95B;
box-shadow: 0 0 20px rgba(250, 185, 91, 0.3);

/* Shimmer/Skeleton Loading */
background: linear-gradient(
  90deg,
  rgba(84, 119, 146, 0.1) 25%,
  rgba(84, 119, 146, 0.2) 50%,
  rgba(84, 119, 146, 0.1) 75%
);
```

### 🔍 Input & Form Colors

```css
/* Input Default */
background: #0F1B3D;
color: #E8E2DB;
border: 1px solid rgba(84, 119, 146, 0.3);

/* Input Focus */
border-color: #FAB95B;
box-shadow: 0 0 0 3px rgba(250, 185, 91, 0.1);

/* Input Placeholder */
color: #547792;

/* Select Dropdown */
background: #0F1B3D;
color: #E8E2DB;
border: 1px solid rgba(84, 119, 146, 0.3);

/* Checkbox/Radio (when checked) */
background: #FAB95B;
border-color: #FAB95B;
```

### 📋 Quick Reference by Component Type

| Component | Background | Text | Border | Hover BG | Hover Border |
|-----------|-----------|------|--------|----------|--------------|
| **Page** | `linear-gradient(135deg, #1A3263 0%, #0F1B3D 100%)` | #E8E2DB | - | - | - |
| **Card** | `rgba(26, 50, 99, 0.8)` | #E8E2DB | `rgba(84, 119, 146, 0.3)` | Same | `rgba(250, 185, 91, 0.5)` |
| **Sidebar** | #0F1B3D | #547792 | `rgba(84, 119, 146, 0.2)` | `rgba(26, 50, 99, 0.6)` | - |
| **Nav Item** | transparent | #547792 | - | `rgba(26, 50, 99, 0.6)` | - |
| **Nav Active** | `rgba(26, 50, 99, 0.8)` | #FAB95B | `4px solid #FAB95B` (left) | - | - |
| **Button Primary** | #FAB95B | #1A3263 | `1px solid #FAB95B` | Same (brighter) | Same |
| **Button Secondary** | `rgba(84, 119, 146, 0.3)` | #E8E2DB | `rgba(84, 119, 146, 0.5)` | `rgba(84, 119, 146, 0.4)` | #FAB95B |
| **Table Header** | `rgba(26, 50, 99, 0.6)` | #FAB95B | - | - | - |
| **Table Row** | transparent | #E8E2DB | `1px solid rgba(84, 119, 146, 0.2)` | `rgba(84, 119, 146, 0.2)` | - |
| **Input** | #0F1B3D | #E8E2DB | `rgba(84, 119, 146, 0.3)` | Same | #FAB95B (focus) |

### 🎯 Copy-Paste Styled Component Template

```javascript
const StyledComponent = styled.div`
  /* Background */
  background: rgba(26, 50, 99, 0.8);
  
  /* Border */
  border: 1px solid rgba(84, 119, 146, 0.3);
  border-radius: 0.75rem;
  
  /* Shadow & Effects */
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  
  /* Text */
  color: #E8E2DB;
  
  /* Transitions */
  transition: all 0.3s ease;
  
  /* Hover */
  &:hover {
    transform: translateY(-5px);
    border-color: rgba(250, 185, 91, 0.5);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  }
  
  /* Headings */
  h1, h2, h3 {
    color: #E8E2DB;
    text-shadow: 0 2px 10px rgba(250, 185, 91, 0.2);
  }
  
  /* Links */
  a {
    color: #FAB95B;
    
    &:hover {
      color: #E8E2DB;
    }
  }
`;
```

---

## 🚀 Usage Tips

1. **Always use RGBA** for overlays and transparency
2. **Gold (#FAB95B)** for anything important or interactive
3. **Blue (#547792)** for secondary elements and info
4. **Cream (#E8E2DB)** for all readable text
5. **Dark Blue (#1A3263/#0F1B3D)** for all backgrounds

**Pro Tip:** Keep this file open while coding for quick color reference!
