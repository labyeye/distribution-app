# Using Dark Theme Components - Examples

## Quick Start Example

Here's a complete example showing how to transform any page:

### Before (Light Theme):
```javascript
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background: #f8f9fc;
  padding: 2rem;
`;

const Card = styled.div`
  background: #fff;
  padding: 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
`;

const MyPage = () => {
  return (
    <Container>
      <h1>My Page</h1>
      <Card>
        <h2>Card Title</h2>
        <p>Some content</p>
        <button>Click Me</button>
      </Card>
    </Container>
  );
};
```

### After (Dark Theme):
```javascript
import React from 'react';
import Layout from '../components/Layout';
import {
  PageContainer,
  PageTitle,
  DarkCard,
  CardTitle,
  BodyText,
  PrimaryButton
} from '../components/DarkThemeComponents';

const MyPage = () => {
  return (
    <Layout>
      <PageContainer>
        <PageTitle>My Page</PageTitle>
        <DarkCard>
          <CardTitle>Card Title</CardTitle>
          <BodyText>Some content</BodyText>
          <PrimaryButton>Click Me</PrimaryButton>
        </DarkCard>
      </PageContainer>
    </Layout>
  );
};
```

## Component Usage Examples

### 1. Dashboard with Metrics

```javascript
import {
  PageContainer,
  PageTitle,
  GridContainer,
  MetricCard,
  DarkCard,
  SectionTitle
} from '../components/DarkThemeComponents';
import { FaDollarSign, FaUsers, FaBox, FaChartLine } from 'react-icons/fa';

function Dashboard() {
  return (
    <Layout>
      <PageContainer>
        <PageTitle>Dashboard Overview</PageTitle>
        
        {/* Metric Cards Grid */}
        <GridContainer columns="repeat(4, 1fr)">
          <MetricCard color="#547792">
            <div className="metric-label">Total Revenue</div>
            <div className="metric-value">₹1,24,500</div>
          </MetricCard>
          
          <MetricCard color="#FAB95B">
            <div className="metric-label">Total Orders</div>
            <div className="metric-value">847</div>
          </MetricCard>
          
          <MetricCard color="#FAB95B">
            <div className="metric-label">Pending</div>
            <div className="metric-value">23</div>
          </MetricCard>
          
          <MetricCard color="#547792">
            <div className="metric-label">Total Users</div>
            <div className="metric-value">142</div>
          </MetricCard>
        </GridContainer>

        {/* Content Section */}
        <DarkCard>
          <SectionTitle>Recent Activity</SectionTitle>
          {/* Your content here */}
        </DarkCard>
      </PageContainer>
    </Layout>
  );
}
```

### 2. Form Example

```javascript
import {
  PageContainer,
  PageTitle,
  DarkCard,
  FormGroup,
  Label,
  Input,
  TextArea,
  Select,
  FlexContainer,
  PrimaryButton,
  SecondaryButton
} from '../components/DarkThemeComponents';

function AddProduct() {
  return (
    <Layout>
      <PageContainer>
        <PageTitle>Add New Product</PageTitle>
        
        <DarkCard>
          <FormGroup>
            <Label>Product Name</Label>
            <Input 
              type="text" 
              placeholder="Enter product name"
            />
          </FormGroup>

          <FormGroup>
            <Label>Category</Label>
            <Select>
              <option value="">Select category</option>
              <option value="lubricants">Lubricants</option>
              <option value="oil">Oil</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Description</Label>
            <TextArea 
              placeholder="Enter product description"
            />
          </FormGroup>

          <FlexContainer gap="1rem">
            <PrimaryButton type="submit">
              Save Product
            </PrimaryButton>
            <SecondaryButton type="button">
              Cancel
            </SecondaryButton>
          </FlexContainer>
        </DarkCard>
      </PageContainer>
    </Layout>
  );
}
```

### 3. Table Example

```javascript
import {
  PageContainer,
  PageTitle,
  DarkCard,
  TableContainer,
  DarkTable,
  Badge,
  FlexContainer,
  PrimaryButton
} from '../components/DarkThemeComponents';

function ProductList() {
  const products = [
    { id: 1, name: 'Engine Oil', price: 450, status: 'active' },
    { id: 2, name: 'Gear Oil', price: 380, status: 'inactive' }
  ];

  return (
    <Layout>
      <PageContainer>
        <FlexContainer justify="space-between" align="center">
          <PageTitle>Products</PageTitle>
          <PrimaryButton>Add Product</PrimaryButton>
        </FlexContainer>
        
        <DarkCard>
          <TableContainer>
            <DarkTable>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>₹{product.price}</td>
                    <td>
                      <Badge variant={product.status === 'active' ? 'success' : 'warning'}>
                        {product.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </DarkTable>
          </TableContainer>
        </DarkCard>
      </PageContainer>
    </Layout>
  );
}
```

### 4. Loading State Example

```javascript
import {
  PageContainer,
  DarkCard,
  LoadingContainer,
  Spinner,
  BodyText
} from '../components/DarkThemeComponents';

function DataPage() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return (
      <Layout>
        <PageContainer>
          <DarkCard>
            <LoadingContainer>
              <Spinner size="60px" />
              <BodyText>Loading data...</BodyText>
            </LoadingContainer>
          </DarkCard>
        </PageContainer>
      </Layout>
    );
  }

  return (
    // ... your content
  );
}
```

### 5. Empty State Example

```javascript
import {
  PageContainer,
  DarkCard,
  EmptyState,
  PrimaryButton
} from '../components/DarkThemeComponents';
import { FaBoxOpen } from 'react-icons/fa';

function OrdersList() {
  const orders = [];

  return (
    <Layout>
      <PageContainer>
        <DarkCard>
          {orders.length === 0 ? (
            <EmptyState>
              <FaBoxOpen />
              <h3>No Orders Found</h3>
              <p>There are no orders to display at the moment</p>
              <PrimaryButton>Create First Order</PrimaryButton>
            </EmptyState>
          ) : (
            // ... orders list
          )}
        </DarkCard>
      </PageContainer>
    </Layout>
  );
}
```

### 6. Error/Success Messages

```javascript
import {
  PageContainer,
  DarkCard,
  ErrorMessage,
  SuccessMessage
} from '../components/DarkThemeComponents';
import { FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

function FormPage() {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  return (
    <Layout>
      <PageContainer>
        <DarkCard>
          {error && (
            <ErrorMessage>
              <FaExclamationTriangle />
              <span>{error}</span>
            </ErrorMessage>
          )}

          {success && (
            <SuccessMessage>
              <FaCheckCircle />
              <span>{success}</span>
            </SuccessMessage>
          )}

          {/* Your form here */}
        </DarkCard>
      </PageContainer>
    </Layout>
  );
}
```

### 7. Multi-Card Layout

```javascript
import {
  PageContainer,
  PageTitle,
  GridContainer,
  DarkCard,
  GlassCard,
  CardTitle,
  BodyText,
  StyledLink,
  Divider
} from '../components/DarkThemeComponents';
import { FaChevronRight } from 'react-icons/fa';

function Dashboard() {
  return (
    <Layout>
      <PageContainer>
        <PageTitle>Dashboard</PageTitle>
        
        {/* 2-column grid */}
        <GridContainer columns="repeat(2, 1fr)" gap="2rem">
          <DarkCard>
            <CardTitle>Sales Overview</CardTitle>
            <BodyText>Total sales this month</BodyText>
            <BodyText size="1.5rem" margin="0.5rem 0">
              ₹1,24,500
            </BodyText>
            <Divider />
            <StyledLink to="/reports">
              View Full Report <FaChevronRight />
            </StyledLink>
          </DarkCard>

          <GlassCard>
            <CardTitle>Pending Tasks</CardTitle>
            <BodyText muted>You have 5 pending tasks</BodyText>
            <StyledLink to="/tasks">
              View All Tasks <FaChevronRight />
            </StyledLink>
          </GlassCard>
        </GridContainer>
      </PageContainer>
    </Layout>
  );
}
```

### 8. Button Variations

```javascript
import {
  FlexContainer,
  PrimaryButton,
  SecondaryButton,
  OutlineButton,
  IconButton
} from '../components/DarkThemeComponents';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

function ButtonExamples() {
  return (
    <FlexContainer gap="1rem" wrap>
      <PrimaryButton>Primary Action</PrimaryButton>
      
      <PrimaryButton size="large" rounded>
        Large Rounded
      </PrimaryButton>
      
      <SecondaryButton>Secondary Action</SecondaryButton>
      
      <OutlineButton>Outline Button</OutlineButton>
      
      <IconButton>
        <FaPlus />
      </IconButton>
      
      <IconButton>
        <FaEdit />
      </IconButton>
      
      <IconButton>
        <FaTrash />
      </IconButton>
    </FlexContainer>
  );
}
```

### 9. Badge Examples

```javascript
import { Badge, FlexContainer } from '../components/DarkThemeComponents';

function StatusBadges() {
  return (
    <FlexContainer gap="1rem">
      <Badge variant="success">Completed</Badge>
      <Badge variant="warning">Pending</Badge>
      <Badge variant="error">Failed</Badge>
      <Badge>Default</Badge>
      <Badge variant="success" rounded>Active</Badge>
    </FlexContainer>
  );
}
```

## Complete Page Template

Copy this as a starting point for any new page:

```javascript
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import {
  PageContainer,
  PageTitle,
  DarkCard,
  CardTitle,
  LoadingContainer,
  Spinner,
  ErrorMessage,
  PrimaryButton,
  FlexContainer
} from '../components/DarkThemeComponents';
import { FaExclamationTriangle } from 'react-icons/fa';

const MyNewPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Your API call here
      // const response = await axios.get('...');
      // setData(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <PageContainer>
          <DarkCard>
            <LoadingContainer>
              <Spinner />
              <p>Loading...</p>
            </LoadingContainer>
          </DarkCard>
        </PageContainer>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <PageContainer>
          <DarkCard>
            <ErrorMessage>
              <FaExclamationTriangle />
              <span>{error}</span>
            </ErrorMessage>
          </DarkCard>
        </PageContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageContainer>
        <FlexContainer justify="space-between" align="center">
          <PageTitle>My New Page</PageTitle>
          <PrimaryButton>Add New</PrimaryButton>
        </FlexContainer>

        <DarkCard>
          <CardTitle>Section Title</CardTitle>
          {/* Your content here */}
        </DarkCard>
      </PageContainer>
    </Layout>
  );
};

export default MyNewPage;
```

## Tips & Best Practices

1. **Always wrap pages with Layout component** for consistent sidebar
2. **Use PageContainer as the outermost wrapper** for animations
3. **DarkCard for major sections**, GlassCard for subtle emphasis
4. **PrimaryButton for main actions**, SecondaryButton for alternatives
5. **Use GridContainer for responsive layouts** instead of manual CSS Grid
6. **FlexContainer for simple flexbox layouts** with automatic gap
7. **Consistent spacing**: Use the gap and margin props
8. **Loading states**: Always show Spinner during data fetch
9. **Error handling**: Use ErrorMessage component for consistency
10. **Mobile responsive**: All components are pre-optimized

## Quick Migration Checklist

When converting a page to dark theme:

- [ ] Import DarkThemeComponents
- [ ] Replace Container with PageContainer
- [ ] Replace h1 with PageTitle
- [ ] Replace h2 with SectionTitle
- [ ] Replace divs with DarkCard
- [ ] Replace buttons with PrimaryButton/SecondaryButton
- [ ] Replace inputs with Input component
- [ ] Replace tables with DarkTable
- [ ] Add loading states with Spinner
- [ ] Add error handling with ErrorMessage
- [ ] Test on mobile devices

That's it! Your page is now dark-themed! 🎉
