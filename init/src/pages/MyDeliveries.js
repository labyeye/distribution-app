import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Layout from "../components/Layout";
import axios from "axios";
import {
  FaTruck,
  FaMapMarkerAlt,
  FaPhone,
  FaBoxes,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaShippingFast,
} from "react-icons/fa";

const MyDeliveries = () => {
  const [loading, setLoading] = useState(false);
  const [deliveries, setDeliveries] = useState([]);
  const [error, setError] = useState(null);
  const [expandedDelivery, setExpandedDelivery] = useState(null);
  const [updatingOrder, setUpdatingOrder] = useState(null);

  useEffect(() => {
    fetchMyDeliveries();
  }, []);

  const fetchMyDeliveries = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:2500/api/deliveries/my-deliveries",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setDeliveries(response.data.deliveries || []);
    } catch (err) {
      setError("Failed to fetch your deliveries");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (deliveryId, orderId, newStatus) => {
    try {
      setUpdatingOrder(orderId);
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:2500/api/deliveries/${deliveryId}/order/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Refresh deliveries after update
      await fetchMyDeliveries();
      alert("Order status updated successfully!");
    } catch (err) {
      alert("Failed to update order status");
      console.error(err);
    } finally {
      setUpdatingOrder(null);
    }
  };

  const updateDeliveryStatus = async (deliveryId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:2500/api/deliveries/${deliveryId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Refresh deliveries after update
      await fetchMyDeliveries();
      alert("Delivery status updated successfully!");
    } catch (err) {
      alert("Failed to update delivery status");
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "var(--nb-orange)";
      case "In Transit":
        return "var(--nb-blue)";
      case "Delivered":
        return "var(--nb-blue)";
      case "Completed":
        return "var(--nb-blue)";
      case "Cancelled":
        return "var(--nb-orange)";
      default:
        return "var(--nb-ink)";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <FaClock />;
      case "In Transit":
        return <FaShippingFast />;
      case "Delivered":
      case "Completed":
        return <FaCheckCircle />;
      case "Cancelled":
        return <FaTimesCircle />;
      default:
        return <FaClock />;
    }
  };

  const toggleDeliveryExpand = (deliveryId) => {
    setExpandedDelivery(expandedDelivery === deliveryId ? null : deliveryId);
  };

  return (
    <Layout>
      <Container>
        <Header>
          <h1>
            <FaTruck /> My Deliveries
          </h1>
          <RefreshButton onClick={fetchMyDeliveries}>Refresh</RefreshButton>
        </Header>

        {loading ? (
          <LoadingMessage>Loading your deliveries...</LoadingMessage>
        ) : error ? (
          <ErrorMessage>{error}</ErrorMessage>
        ) : deliveries.length === 0 ? (
          <EmptyMessage>
            <FaTruck size={50} />
            <p>No deliveries assigned to you yet.</p>
          </EmptyMessage>
        ) : (
          <DeliveriesList>
            {deliveries.map((delivery) => (
              <DeliveryCard key={delivery._id}>
                <DeliveryHeader
                  onClick={() => toggleDeliveryExpand(delivery._id)}
                >
                  <VehicleInfo>
                    <VehicleNumber>{delivery.vehicleNumber}</VehicleNumber>
                    <VehicleType>{delivery.vehicleType}</VehicleType>
                  </VehicleInfo>
                  <StatusBadge color={getStatusColor(delivery.deliveryStatus)}>
                    {getStatusIcon(delivery.deliveryStatus)}
                    {delivery.deliveryStatus}
                  </StatusBadge>
                </DeliveryHeader>

                <DeliveryInfo>
                  <InfoRow>
                    <FaMapMarkerAlt />
                    <strong>Destination:</strong>
                    <span>{delivery.retailerName}</span>
                  </InfoRow>
                  <InfoRow>
                    <FaPhone />
                    <strong>Contact:</strong>
                    <span>
                      {delivery.retailerId?.mobile || "Not available"}
                    </span>
                  </InfoRow>
                  <InfoRow>
                    <FaBoxes />
                    <strong>Total Orders:</strong>
                    <span>{delivery.orders.length}</span>
                  </InfoRow>
                  <InfoRow>
                    <FaClock />
                    <strong>Expected Delivery:</strong>
                    <span>
                      {new Date(
                        delivery.expectedDeliveryDate,
                      ).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </InfoRow>
                </DeliveryInfo>

                {/* Delivery Status Actions */}
                {delivery.deliveryStatus !== "Delivered" &&
                  delivery.deliveryStatus !== "Cancelled" && (
                    <DeliveryActions>
                      {delivery.deliveryStatus === "Pending" && (
                        <ActionButton
                          color="var(--nb-blue)"
                          onClick={() =>
                            updateDeliveryStatus(delivery._id, "In Transit")
                          }
                        >
                          <FaShippingFast /> Start Trip
                        </ActionButton>
                      )}
                      {delivery.deliveryStatus === "In Transit" && (
                        <ActionButton
                          color="var(--nb-blue)"
                          onClick={() =>
                            updateDeliveryStatus(delivery._id, "Delivered")
                          }
                        >
                          <FaCheckCircle /> Mark as Delivered
                        </ActionButton>
                      )}
                    </DeliveryActions>
                  )}

                {/* Expandable Orders Section */}
                {expandedDelivery === delivery._id && (
                  <OrdersSection>
                    <OrdersHeader>
                      <h3>Orders in this Delivery</h3>
                    </OrdersHeader>
                    {delivery.orders.map((order) => {
                      const orderDetails = order.orderId;
                      return (
                        <OrderCard key={order._id}>
                          <OrderHeader>
                            <OrderNumber>
                              Order #{order.orderNumber}
                            </OrderNumber>
                            <StatusBadge
                              color={getStatusColor(
                                orderDetails?.status || "Pending",
                              )}
                              small
                            >
                              {getStatusIcon(orderDetails?.status || "Pending")}
                              {orderDetails?.status || "Pending"}
                            </StatusBadge>
                          </OrderHeader>

                          <OrderDetails>
                            <DetailRow>
                              <strong>Retailer:</strong>
                              <span>{orderDetails?.retailerName}</span>
                            </DetailRow>
                            <DetailRow>
                              <strong>Order Value:</strong>
                              <span>
                                ₹{order.orderAmount?.toLocaleString()}
                              </span>
                            </DetailRow>
                            <DetailRow>
                              <strong>Total Items:</strong>
                              <span>{orderDetails?.items?.length || 0}</span>
                            </DetailRow>
                            <DetailRow>
                              <strong>Total Litres:</strong>
                              <span>{orderDetails?.totalLitres || 0}L</span>
                            </DetailRow>
                          </OrderDetails>

                          {/* Order Status Update Buttons */}
                          {orderDetails?.status !== "Completed" &&
                            orderDetails?.status !== "Cancelled" && (
                              <OrderActions>
                                <OrderActionButton
                                  color="var(--nb-blue)"
                                  onClick={() =>
                                    updateOrderStatus(
                                      delivery._id,
                                      orderDetails._id,
                                      "Completed",
                                    )
                                  }
                                  disabled={updatingOrder === orderDetails._id}
                                >
                                  {updatingOrder === orderDetails._id ? (
                                    "Updating..."
                                  ) : (
                                    <>
                                      <FaCheckCircle /> Mark Completed
                                    </>
                                  )}
                                </OrderActionButton>
                                <OrderActionButton
                                  color="var(--nb-orange)"
                                  onClick={() =>
                                    updateOrderStatus(
                                      delivery._id,
                                      orderDetails._id,
                                      "Cancelled",
                                    )
                                  }
                                  disabled={updatingOrder === orderDetails._id}
                                >
                                  {updatingOrder === orderDetails._id ? (
                                    "Updating..."
                                  ) : (
                                    <>
                                      <FaTimesCircle /> Cancel Order
                                    </>
                                  )}
                                </OrderActionButton>
                              </OrderActions>
                            )}

                          {/* Show items if available */}
                          {orderDetails?.items &&
                            orderDetails.items.length > 0 && (
                              <ItemsList>
                                <h4>Items:</h4>
                                {orderDetails.items.map((item, idx) => (
                                  <ItemRow key={idx}>
                                    <span className="item-name">
                                      {item.name} ({item.code})
                                    </span>
                                    <span className="item-qty">
                                      Qty: {item.quantity}
                                    </span>
                                    <span className="item-price">
                                      ₹{item.totalSale?.toLocaleString()}
                                    </span>
                                  </ItemRow>
                                ))}
                              </ItemsList>
                            )}
                        </OrderCard>
                      );
                    })}
                  </OrdersSection>
                )}

                <ExpandButton
                  onClick={() => toggleDeliveryExpand(delivery._id)}
                >
                  {expandedDelivery === delivery._id
                    ? "Hide Orders ▲"
                    : "View Orders ▼"}
                </ExpandButton>
              </DeliveryCard>
            ))}
          </DeliveriesList>
        )}
      </Container>
    </Layout>
  );
};

// Styled Components
const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h1 {
    color: var(--nb-ink);
    font-size: 1.8rem;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

const RefreshButton = styled.button`
  background: var(--nb-blue);
  color: var(--nb-white);
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;

  &:hover {
    background: var(--nb-blue);
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 1.1rem;
  color: var(--nb-ink);
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 1.1rem;
  color: var(--nb-orange);
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: var(--nb-ink);

  svg {
    color: var(--nb-border);
    margin-bottom: 20px;
  }

  p {
    font-size: 1.2rem;
  }
`;

const DeliveriesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const DeliveryCard = styled.div`
  background: var(--nb-white);
  border-radius: 8px;
  box-shadow: var(--nb-shadow-md);
  overflow: hidden;
`;

const DeliveryHeader = styled.div`
  background: var(--nb-var(--nb-white));
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: var(--nb-var(--nb-white));
  }
`;

const VehicleInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const VehicleNumber = styled.div`
  font-size: 1.4rem;
  font-weight: bold;
  color: var(--nb-white);
`;

const VehicleType = styled.div`
  background: var(--nb-muted);
  color: var(--nb-white);
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
`;

const StatusBadge = styled.div`
  background: ${(props) => props.color};
  color: var(--nb-white);
  padding: ${(props) => (props.small ? "4px 10px" : "8px 15px")};
  border-radius: 20px;
  font-weight: bold;
  font-size: ${(props) => (props.small ? "0.8rem" : "0.9rem")};
  display: flex;
  align-items: center;
  gap: 5px;
`;

const DeliveryInfo = styled.div`
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  color: var(--nb-ink);

  svg {
    color: var(--nb-blue);
  }

  strong {
    color: var(--nb-ink);
  }

  span {
    color: var(--nb-ink);
  }
`;

const DeliveryActions = styled.div`
  padding: 15px 20px;
  border-top: 1px solid var(--nb-border);
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

const ActionButton = styled.button`
  background: ${(props) => props.color};
  color: var(--nb-white);
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const OrdersSection = styled.div`
  background: var(--nb-muted);
  padding: 20px;
  border-top: 1px solid var(--nb-border);
`;

const OrdersHeader = styled.div`
  margin-bottom: 15px;

  h3 {
    color: var(--nb-ink);
    font-size: 1.1rem;
    margin: 0;
  }
`;

const OrderCard = styled.div`
  background: var(--nb-white);
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 15px;
  border-left: 4px solid var(--nb-blue);
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const OrderNumber = styled.div`
  font-weight: bold;
  color: var(--nb-ink);
  font-size: 1rem;
`;

const OrderDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
  margin-bottom: 15px;
`;

const DetailRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  font-size: 0.9rem;

  strong {
    color: var(--nb-ink);
    font-size: 0.8rem;
  }

  span {
    color: var(--nb-ink);
    font-weight: 500;
  }
`;

const OrderActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid var(--nb-border);
`;

const OrderActionButton = styled.button`
  background: ${(props) => props.color};
  color: var(--nb-white);
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: opacity 0.2s;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ItemsList = styled.div`
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid var(--nb-border);

  h4 {
    color: var(--nb-ink);
    font-size: 0.9rem;
    margin-bottom: 10px;
  }
`;

const ItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px;
  background: var(--nb-muted);
  border-radius: 4px;
  margin-bottom: 5px;
  font-size: 0.85rem;

  .item-name {
    flex: 2;
    color: var(--nb-ink);
  }

  .item-qty {
    flex: 1;
    color: var(--nb-ink);
    text-align: center;
  }

  .item-price {
    flex: 1;
    color: var(--nb-blue);
    font-weight: bold;
    text-align: right;
  }
`;

const ExpandButton = styled.button`
  width: 100%;
  padding: 12px;
  background: var(--nb-muted);
  border: none;
  border-top: 1px solid var(--nb-border);
  cursor: pointer;
  color: var(--nb-blue);
  font-weight: 500;
  transition: background 0.2s;

  &:hover {
    background: var(--nb-muted);
  }
`;

export default MyDeliveries;
