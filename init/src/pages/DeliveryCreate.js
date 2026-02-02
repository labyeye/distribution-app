import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Layout from "../components/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaTruck, FaUser, FaStore, FaBoxOpen, FaSave } from "react-icons/fa";

const DeliveryCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [retailers, setRetailers] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [availableOrders, setAvailableOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);

  const [formData, setFormData] = useState({
    vehicleNumber: "",
    vehicleType: "Bike",
    driverName: "",
    driverMobile: "",
    driverId: "",
    retailerId: "",
    totalQuantity: "",
    totalWeight: "",
    dispatchDateTime: new Date().toISOString().slice(0, 16),
    expectedDeliveryDate: "",
    remarks: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchRetailers();
    fetchStaff();
  }, []);

  useEffect(() => {
    if (formData.retailerId) {
      fetchOrdersForRetailer(formData.retailerId);
    } else {
      setAvailableOrders([]);
      setSelectedOrders([]);
    }
  }, [formData.retailerId]);

  const fetchRetailers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:2500/api/retailers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRetailers(response.data.data || response.data || []);
    } catch (err) {
      console.error("Error fetching retailers:", err);
    }
  };

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:2500/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const staff = response.data.filter((u) => u.role === "staff");
      setStaffList(staff);
    } catch (err) {
      console.error("Error fetching staff:", err);
    }
  };

  const fetchOrdersForRetailer = async (retailerId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:2500/api/orders?retailerId=${retailerId}&status=Pending`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setAvailableOrders(response.data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOrderSelection = (order) => {
    if (selectedOrders.find((o) => o.orderId === order._id)) {
      setSelectedOrders(selectedOrders.filter((o) => o.orderId !== order._id));
    } else {
      setSelectedOrders([
        ...selectedOrders,
        {
          orderId: order._id,
          orderNumber: order._id.slice(-6), // Display logic
          orderAmount: order.totalOrderValue,
        },
      ]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("token");

      if (selectedOrders.length === 0) {
        throw new Error("Please select at least one order");
      }

      const payload = {
        ...formData,
        vehicleNumber: formData.vehicleNumber.toUpperCase(),
        orders: selectedOrders,
      };

      await axios.post("http://localhost:2500/api/deliveries", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess("Delivery created successfully!");
      setTimeout(() => navigate("/admin/delivery-tracking"), 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Error creating delivery",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Container>
        <Header>
          <h1>Create New Delivery</h1>
        </Header>

        {error && <Alert type="error">{error}</Alert>}
        {success && <Alert type="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Section>
            <h3>
              <FaTruck /> Vehicle Information
            </h3>
            <Row>
              <FormGroup>
                <Label>Vehicle Number *</Label>
                <Input
                  type="text"
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleInputChange}
                  placeholder="MH-12-AB-1234"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Vehicle Type *</Label>
                <Select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleInputChange}
                >
                  <option value="Bike">Bike</option>
                  <option value="Tempo">Tempo</option>
                  <option value="Truck">Truck</option>
                </Select>
              </FormGroup>
            </Row>
          </Section>

          <Section>
            <h3>
              <FaUser /> Driver Information
            </h3>
            <Row>
              <FormGroup>
                <Label>Select Staff (Optional)</Label>
                <Select
                  name="driverId"
                  value={formData.driverId}
                  onChange={(e) => {
                    const staff = staffList.find(
                      (s) => s._id === e.target.value,
                    );
                    setFormData({
                      ...formData,
                      driverId: e.target.value,
                      driverName: staff ? staff.name : formData.driverName,
                      driverMobile: "", // Reset mobile as backend doesn't send it usually, user fills manually
                    });
                  }}
                >
                  <option value="">-- Select Staff --</option>
                  {staffList.map((staff) => (
                    <option key={staff._id} value={staff._id}>
                      {staff.name}
                    </option>
                  ))}
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Driver Name *</Label>
                <Input
                  type="text"
                  name="driverName"
                  value={formData.driverName}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Driver Mobile *</Label>
                <Input
                  type="text"
                  name="driverMobile"
                  value={formData.driverMobile}
                  onChange={handleInputChange}
                  pattern="[0-9]{10}"
                  placeholder="10 digit number"
                  required
                />
              </FormGroup>
            </Row>
          </Section>

          <Section>
            <h3>
              <FaStore /> Delivery Details
            </h3>
            <Row>
              <FormGroup>
                <Label>Select Retailer *</Label>
                <Select
                  name="retailerId"
                  value={formData.retailerId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-- Select Retailer --</option>
                  {retailers.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.name} - {r.address1}
                    </option>
                  ))}
                </Select>
              </FormGroup>
            </Row>

            {formData.retailerId && (
              <OrderSelectionContainer>
                <h4>Select Orders *</h4>
                {availableOrders.length === 0 ? (
                  <p>No pending orders found for this retailer.</p>
                ) : (
                  <OrdersGrid>
                    {availableOrders.map((order) => {
                      const isSelected = selectedOrders.find(
                        (o) => o.orderId === order._id,
                      );
                      return (
                        <OrderCard
                          key={order._id}
                          selected={isSelected}
                          onClick={() => handleOrderSelection(order)}
                        >
                          <div className="order-num">
                            #{order._id.slice(-6)}
                          </div>
                          <div className="order-amount">
                            ₹{order.totalOrderValue}
                          </div>
                          <div className="order-date">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                        </OrderCard>
                      );
                    })}
                  </OrdersGrid>
                )}
              </OrderSelectionContainer>
            )}

            <Row>
              <FormGroup>
                <Label>Dispatch Date & Time *</Label>
                <Input
                  type="datetime-local"
                  name="dispatchDateTime"
                  value={formData.dispatchDateTime}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Expected Delivery Date *</Label>
                <Input
                  type="date"
                  name="expectedDeliveryDate"
                  value={formData.expectedDeliveryDate}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
            </Row>

            <Row>
              <FormGroup>
                <Label>Total Quantity</Label>
                <Input
                  type="number"
                  name="totalQuantity"
                  value={formData.totalQuantity}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup>
                <Label>Total Weight (kg)</Label>
                <Input
                  type="number"
                  name="totalWeight"
                  value={formData.totalWeight}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Row>

            <FormGroup style={{ width: "100%" }}>
              <Label>Remarks</Label>
              <TextArea
                name="remarks"
                value={formData.remarks}
                onChange={handleInputChange}
                rows="3"
              />
            </FormGroup>
          </Section>

          <SubmitButton type="submit" disabled={loading}>
            {loading ? (
              "Creating..."
            ) : (
              <>
                <FaSave /> Create Delivery
              </>
            )}
          </SubmitButton>
        </Form>
      </Container>
    </Layout>
  );
};

// Styled Components
const Container = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  margin-bottom: 2rem;
  h1 {
    color: #2e3a59;
    font-size: 1.8rem;
  }
`;

const Section = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  h3 {
    margin-bottom: 15px;
    color: #4e73df;
    display: flex;
    align-items: center;
    gap: 10px;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
  }
`;

const Form = styled.form`
  max-width: 1000px;
  margin: 0 auto;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 15px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 500;
  color: #555;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  &:focus {
    border-color: #4e73df;
    outline: none;
  }
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background: white;
`;

const TextArea = styled.textarea`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
`;

const OrderSelectionContainer = styled.div`
  border: 1px solid #eee;
  padding: 15px;
  border-radius: 6px;
  background: #f8f9fc;
  margin-bottom: 15px;
`;

const OrdersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 10px;
  margin-top: 10px;
`;

const OrderCard = styled.div`
  border: 1px solid ${(props) => (props.selected ? "#4e73df" : "#ddd")};
  background-color: ${(props) => (props.selected ? "#e8f0fe" : "white")};
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  .order-num {
    font-weight: bold;
    color: #2e3a59;
  }
  .order-amount {
    color: #1cc88a;
    font-weight: 600;
  }
  .order-date {
    font-size: 0.8rem;
    color: #888;
  }
`;

const SubmitButton = styled.button`
  background-color: #4e73df;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  justify-content: center;
  transition: background 0.3s;

  &:hover {
    background-color: #2e59d9;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const Alert = styled.div`
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 4px;
  background-color: ${(props) =>
    props.type === "error" ? "#f8d7da" : "#d4edda"};
  color: ${(props) => (props.type === "error" ? "#721c24" : "#155724")};
  border: 1px solid
    ${(props) => (props.type === "error" ? "#f5c6cb" : "#c3e6cb")};
`;

export default DeliveryCreate;
