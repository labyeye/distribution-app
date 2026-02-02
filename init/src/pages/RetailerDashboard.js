import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RetailerLayout from "../components/RetailerLayout";
import {
  FaFileInvoiceDollar,
  FaMoneyBillWave,
  FaExclamationCircle,
  FaCalendarAlt,
  FaStore,
} from "react-icons/fa";

const RetailerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        "http://localhost:2500/api/retailer/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to load dashboard data",
        );
      }

      setDashboardData(response.data.dashboard);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);

      if (error.response) {
        if (error.response.status === 401 || error.response.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }
        setError(
          error.response.data.message || "Failed to load dashboard data",
        );
      } else if (error.request) {
        setError("Network error - please check your connection");
      } else {
        setError(error.message || "Failed to load dashboard data");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <RetailerLayout>
      <DashboardContainer>
        <Header>
          <h1>Retailer Dashboard</h1>
          <UserProfile>
            <img
              src={`https://ui-avatars.com/api/?name=${dashboardData?.retailerInfo?.name || "Retailer"}&background=667eea&color=fff`}
              alt="Retailer"
            />
            <span>{dashboardData?.retailerInfo?.name || "Retailer"}</span>
          </UserProfile>
        </Header>

        {loading ? (
          <LoadingIndicator>
            <div className="spinner"></div>
            <p>Loading dashboard data...</p>
          </LoadingIndicator>
        ) : error ? (
          <ErrorMessage>
            <FaExclamationCircle size={20} />
            <p>{error}</p>
          </ErrorMessage>
        ) : (
          <>
            {/* Retailer Info Card */}
            <InfoSection>
              <InfoCard>
                <InfoIcon>
                  <FaStore size={24} />
                </InfoIcon>
                <InfoContent>
                  <h3>Shop Information</h3>
                  <InfoItem>
                    <strong>Address:</strong>{" "}
                    {dashboardData?.retailerInfo?.address}
                  </InfoItem>
                  <InfoItem>
                    <strong>Assigned Staff:</strong>{" "}
                    {dashboardData?.retailerInfo?.assignedStaff}
                  </InfoItem>
                  <InfoItem>
                    <strong>Collection Days:</strong>{" "}
                    {dashboardData?.retailerInfo?.collectionDays?.join(", ") ||
                      "Not set"}
                  </InfoItem>
                </InfoContent>
              </InfoCard>
            </InfoSection>

            {/* Financial Summary Cards */}
            <MetricsGrid>
              <MetricCard color="#4e73df">
                <div className="icon-container">
                  <FaFileInvoiceDollar size={20} />
                </div>
                <div className="metric-content">
                  <h3>Total Bill Amount</h3>
                  <p>
                    ₹
                    {dashboardData?.financialSummary?.totalBillAmount || "0.00"}
                  </p>
                </div>
              </MetricCard>

              <MetricCard color="#1cc88a">
                <div className="icon-container">
                  <FaMoneyBillWave size={20} />
                </div>
                <div className="metric-content">
                  <h3>Total Paid</h3>
                  <p>
                    ₹
                    {dashboardData?.financialSummary?.totalPaidAmount || "0.00"}
                  </p>
                </div>
              </MetricCard>

              <MetricCard color="#f6c23e">
                <div className="icon-container">
                  <FaExclamationCircle size={20} />
                </div>
                <div className="metric-content">
                  <h3>Outstanding Balance</h3>
                  <p>
                    ₹
                    {dashboardData?.financialSummary?.outstandingBalance ||
                      "0.00"}
                  </p>
                </div>
              </MetricCard>

              <MetricCard color="#36b9cc">
                <div className="icon-container">
                  <FaCalendarAlt size={20} />
                </div>
                <div className="metric-content">
                  <h3>Last Payment</h3>
                  <p>
                    {dashboardData?.financialSummary?.lastPaymentDate
                      ? new Date(
                          dashboardData.financialSummary.lastPaymentDate,
                        ).toLocaleDateString("en-IN")
                      : "No payments yet"}
                  </p>
                </div>
              </MetricCard>
            </MetricsGrid>

            {/* Recent Bills Section */}
            <ContentSection>
              <SectionHeader>
                <h2>Recent Bills</h2>
              </SectionHeader>

              <TableContainer>
                <DataTable>
                  <thead>
                    <tr>
                      <th>Bill No.</th>
                      <th>Amount</th>
                      <th>Due Amount</th>
                      <th>Status</th>
                      <th>Bill Date</th>
                      <th>Collection Day</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData?.recentBills?.length > 0 ? (
                      dashboardData.recentBills.map((bill) => (
                        <tr key={bill.billNumber}>
                          <td data-label="Bill No.">{bill.billNumber}</td>
                          <td data-label="Amount">
                            ₹{bill.amount.toLocaleString()}
                          </td>
                          <td data-label="Due Amount">
                            ₹{bill.dueAmount.toLocaleString()}
                          </td>
                          <td data-label="Status">
                            <StatusBadge status={bill.status}>
                              {bill.status}
                            </StatusBadge>
                          </td>
                          <td data-label="Bill Date">
                            {new Date(bill.billDate).toLocaleDateString(
                              "en-IN",
                            )}
                          </td>
                          <td data-label="Collection Day">
                            {bill.collectionDay}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          style={{ textAlign: "center", padding: "2rem" }}
                        >
                          No bills found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </DataTable>
              </TableContainer>
            </ContentSection>
          </>
        )}
      </DashboardContainer>
    </RetailerLayout>
  );
};

// Styled Components
const DashboardContainer = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-x: hidden;
  background-color: #f8f9fc;

  @media (min-width: 768px) {
    padding: 1.5rem;
  }

  @media (min-width: 1200px) {
    padding: 2rem;
  }
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  h1 {
    color: #2e3a59;
    font-size: 1.5rem;
    margin: 0;
    font-weight: 600;

    @media (min-width: 768px) {
      font-size: 1.8rem;
    }
  }
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #fff;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  img {
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 50%;
  }

  span {
    color: #2e3a59;
    font-weight: 500;
    font-size: 0.9rem;

    @media (min-width: 768px) {
      font-size: 1rem;
    }
  }
`;

const InfoSection = styled.div`
  margin-bottom: 2rem;
`;

const InfoCard = styled.div`
  background-color: #fff;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
`;

const InfoIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: rgba(78, 115, 223, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    color: #4e73df;
  }
`;

const InfoContent = styled.div`
  flex: 1;

  h3 {
    color: #2e3a59;
    font-size: 1.1rem;
    margin: 0 0 1rem 0;
    font-weight: 600;
  }
`;

const InfoItem = styled.div`
  color: #6e707e;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;

  strong {
    color: #2e3a59;
    margin-right: 0.5rem;
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 2rem;

  @media (min-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }
`;

const MetricCard = styled.div`
  background-color: #fff;
  border-radius: 0.75rem;
  padding: 1.25rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 1rem;
  border-left: 4px solid ${(props) => props.color};
  transition: all 0.3s ease;
  min-height: 90px;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  }

  .icon-container {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: ${(props) => `${props.color}15`};
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      color: ${(props) => props.color};
    }
  }

  .metric-content {
    h3 {
      color: #6e707e;
      font-size: 0.85rem;
      margin: 0 0 0.25rem 0;
      font-weight: 600;

      @media (min-width: 768px) {
        font-size: 0.95rem;
      }
    }

    p {
      color: #2e3a59;
      font-size: 1.25rem;
      margin: 0;
      font-weight: 700;

      @media (min-width: 768px) {
        font-size: 1.5rem;
      }
    }
  }
`;

const ContentSection = styled.section`
  background-color: #fff;
  border-radius: 0.75rem;
  padding: 1.25rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  margin-bottom: 2rem;

  @media (min-width: 768px) {
    padding: 1.5rem;
  }
`;

const SectionHeader = styled.div`
  margin-bottom: 1.25rem;

  h2 {
    color: #2e3a59;
    font-size: 1.25rem;
    margin: 0;
    font-weight: 600;

    @media (min-width: 768px) {
      font-size: 1.4rem;
    }
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-radius: 0.5rem;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
  min-width: 600px;

  @media (min-width: 768px) {
    font-size: 0.9rem;
    min-width: 100%;
  }

  th,
  td {
    padding: 0.75rem 1rem;
    text-align: left;
    border-bottom: 1px solid #f0f0f0;
  }

  th {
    color: #6e707e;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-size: 0.75rem;
    white-space: nowrap;
    background-color: #f9fafc;

    @media (min-width: 768px) {
      font-size: 0.8rem;
      padding: 1rem;
    }
  }

  td {
    color: #2e3a59;
    white-space: nowrap;
  }

  tr:last-child td {
    border-bottom: none;
  }

  tr:hover {
    background-color: #f8f9fa;
  }

  @media (max-width: 767px) {
    min-width: 100%;

    thead {
      display: none;
    }

    tr {
      display: block;
      margin-bottom: 1rem;
      border: 1px solid #eee;
      border-radius: 0.5rem;
      padding: 0.5rem;
    }

    td {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0.75rem;
      text-align: right;
      border-bottom: 1px solid #f0f0f0;
      white-space: normal;

      &:last-child {
        border-bottom: none;
      }

      &::before {
        content: attr(data-label);
        float: left;
        font-weight: 600;
        color: #6e707e;
        margin-right: 1rem;
        font-size: 0.8rem;
      }
    }
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.35rem 0.65rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: ${(props) =>
    props.status === "Paid"
      ? "#e3faf0"
      : props.status === "Partially Paid"
        ? "#fff8e6"
        : "#ffe6e6"};
  color: ${(props) =>
    props.status === "Paid"
      ? "#20c997"
      : props.status === "Partially Paid"
        ? "#ffc107"
        : "#e74c3c"};
  text-transform: capitalize;
`;

const LoadingIndicator = styled.div`
  padding: 2rem;
  text-align: center;
  color: #6e707e;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(78, 115, 223, 0.1);
    border-radius: 50%;
    border-top-color: #4e73df;
    animation: spin 1s ease-in-out infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  p {
    margin: 0;
    font-size: 0.95rem;
  }
`;

const ErrorMessage = styled.div`
  padding: 2rem;
  text-align: center;
  color: #e74c3c;
  background-color: #fee;
  border-radius: 0.75rem;
  border: 1px solid #fcc;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  p {
    margin: 0;
    font-size: 0.95rem;
  }
`;

export default RetailerDashboard;
