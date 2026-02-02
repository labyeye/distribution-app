import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  FaFileInvoiceDollar,
  FaUserTie,
  FaListAlt,
  FaMoneyBillWave,
  FaChevronRight,
  FaStore,
  FaTruck,
  FaHourglassHalf,
  FaBoxes,
} from "react-icons/fa";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);
const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("week");
  const [billTimeRange, setBillTimeRange] = useState("week");
  const navigate = useNavigate();

  useEffect(() => {
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
          "http://localhost:2500/api/admin/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.data.success) {
          throw new Error(
            response.data.message || "Failed to load dashboard data"
          );
        }

        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);

        if (error.response) {
          if (error.response.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
            return;
          }
          setError(
            error.response.data.message || "Failed to load dashboard data"
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

    fetchDashboardData();
  }, [navigate]);

  // Helper function to format numbers in Indian format
  const formatIndianNumber = (num) => {
    if (!num) return "0";
    const numStr = num.toString();
    const [intPart, decPart] = numStr.split('.');
    const lastThree = intPart.substring(intPart.length - 3);
    const otherNumbers = intPart.substring(0, intPart.length - 3);
    const formatted = otherNumbers !== '' 
      ? otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree
      : lastThree;
    return decPart ? formatted + "." + decPart : formatted;
  };

  // Prepare collection chart data based on time range
  const getCollectionChartData = () => {
    if (!dashboardData?.collectionTrends) {
      return {
        labels: [],
        datasets: [],
      };
    }

    let labels = [];
    let data = [];

    switch (timeRange) {
      case "day":
        labels = dashboardData.collectionTrends.daily.labels;
        data = dashboardData.collectionTrends.daily.data;
        break;
      case "week":
        labels = dashboardData.collectionTrends.weekly.labels;
        data = dashboardData.collectionTrends.weekly.data;
        break;
      case "month":
      default:
        labels = dashboardData.collectionTrends.monthly.labels;
        data = dashboardData.collectionTrends.monthly.data;
        break;
    }

    return {
      labels,
      datasets: [
        {
          label: "Collection Amount (₹)",
          data,
          backgroundColor: "var(--nb-orange)",
          borderColor: "var(--nb-orange)",
          borderWidth: 2,
          borderRadius: 8,
          hoverBackgroundColor: "var(--nb-orange)",
          hoverBorderColor: "var(--nb-ink)",
        },
      ],
    };
  };

  // Prepare bill chart data based on time range
  const getBillChartData = () => {
    if (!dashboardData?.billTrends) {
      return {
        labels: [],
        datasets: [],
      };
    }

    let labels = [];
    let data = [];

    switch (billTimeRange) {
      case "day":
        labels = dashboardData.billTrends.daily.labels;
        data = dashboardData.billTrends.daily.data;
        break;
      case "week":
        labels = dashboardData.billTrends.weekly.labels;
        data = dashboardData.billTrends.weekly.data;
        break;
      case "month":
      default:
        labels = dashboardData.billTrends.monthly.labels;
        data = dashboardData.billTrends.monthly.data;
        break;
    }

    return {
      labels,
      datasets: [
        {
          label: "Bill Amount (₹)",
          data,
          fill: true,
          backgroundColor: "var(--nb-border)",
          borderColor: "var(--nb-blue)",
          borderWidth: 3,
          tension: 0.4,
          pointBackgroundColor: "var(--nb-blue)",
          pointBorderColor: "var(--nb-ink)",
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointHoverBackgroundColor: "var(--nb-orange)",
          pointHoverBorderColor: "var(--nb-ink)",
        },
      ],
    };
  };

  const collectionChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart',
      delay: (context) => {
        let delay = 0;
        if (context.type === 'data' && context.mode === 'default') {
          delay = context.dataIndex * 150;
        }
        return delay;
      },
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "var(--nb-ink)",
          font: {
            size: 13,
            weight: "500",
          },
          padding: 15,
        },
      },
      title: {
        display: true,
        text: `Collection Trend (${
          timeRange === "day"
            ? "Daily"
            : timeRange === "week"
            ? "Weekly"
            : "Monthly"
        })`,
        color: "var(--nb-orange)",
        font: {
          size: 16,
          weight: "600",
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      datalabels: {
        anchor: "end",
        align: "top",
        formatter: (value) => value > 0 ? "₹" + formatIndianNumber(value) : "",
        color: "var(--nb-orange)",
        font: {
          weight: "bold",
          size: 11,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return "₹" + formatIndianNumber(value);
          },
          color: "var(--nb-ink)",
          font: {
            size: 11,
          },
        },
        grid: {
          color: "var(--nb-border)",
          drawBorder: false,
        },
      },
      x: {
        ticks: {
          color: "var(--nb-ink)",
          font: {
            size: 11,
          },
        },
        grid: {
          color: "var(--nb-border)",
          drawBorder: false,
        },
      },
    },
  };

  const billChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart',
      delay: (context) => {
        let delay = 0;
        if (context.type === 'data' && context.mode === 'default') {
          delay = context.dataIndex * 150;
        }
        return delay;
      },
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "var(--nb-ink)",
          font: {
            size: 13,
            weight: "500",
          },
          padding: 15,
        },
      },
      title: {
        display: true,
        text: `Bill Trend (${
          billTimeRange === "day"
            ? "Daily"
            : billTimeRange === "week"
            ? "Weekly"
            : "Monthly"
        })`,
        color: "var(--nb-blue)",
        font: {
          size: 16,
          weight: "600",
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      datalabels: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return "₹" + formatIndianNumber(value);
          },
          color: "var(--nb-ink)",
          font: {
            size: 11,
          },
        },
        grid: {
          color: "var(--nb-border)",
          drawBorder: false,
        },
      },
      x: {
        ticks: {
          color: "var(--nb-ink)",
          font: {
            size: 11,
          },
        },
        grid: {
          color: "var(--nb-border)",
          drawBorder: false,
        },
      },
    },
  };

  return (
    <Layout>
      <MainContent>
        <Header>
          <h1>Dashboard Overview</h1>
          <UserProfile>
            <img
              src="https://ui-avatars.com/api/?name=Admin&background=667eea&color=fff"
              alt="Admin"
            />
            <span>Admin</span>
          </UserProfile>
        </Header>

        {loading ? (
          <LoadingIndicator>
            <div className="spinner"></div>
            <p>Loading dashboard data...</p>
          </LoadingIndicator>
        ) : error ? (
          <ErrorMessage>
            <FaFileInvoiceDollar size={20} />
            <p>{error}</p>
          </ErrorMessage>
        ) : (
          <>
            <MetricsGrid>
              <MetricCard color="var(--nb-blue)">
                <div className="icon-container">
                  <FaFileInvoiceDollar size={20} />
                </div>
                <div className="metric-content">
                  <h3>Total Bill Amount</h3>
                  <p>₹{formatIndianNumber(dashboardData?.totalBillAmount?.toFixed(2))}</p>
                </div>
              </MetricCard>

              <MetricCard color="var(--nb-orange)">
                <div className="icon-container">
                  <FaMoneyBillWave size={20} />
                </div>
                <div className="metric-content">
                  <h3>Total Paid Today</h3>
                  <p>₹{formatIndianNumber(dashboardData?.totalPaidAmount?.toFixed(2))}</p>
                </div>
              </MetricCard>

              <MetricCard color="var(--nb-orange)">
                <div className="icon-container">
                  <FaListAlt size={20} />
                </div>
                <div className="metric-content">
                  <h3>Remaining Today</h3>
                  <p>₹{formatIndianNumber(dashboardData?.totalRemainingAmount?.toFixed(2))}</p>
                </div>
              </MetricCard>

              <MetricCard color="var(--nb-blue)">
                <div className="icon-container">
                  <FaUserTie size={20} />
                </div>
                <div className="metric-content">
                  <h3>Total Staff</h3>
                  <p>{formatIndianNumber(dashboardData?.totalStaff)}</p>
                </div>
              </MetricCard>

              <MetricCard color="var(--nb-blue)">
                <div className="icon-container">
                  <FaStore size={20} />
                </div>
                <div className="metric-content">
                  <h3>Total Retailers</h3>
                  <p>{formatIndianNumber(dashboardData?.totalRetailers)}</p>
                </div>
              </MetricCard>

              <MetricCard color="var(--nb-blue)">
                <div className="icon-container">
                  <FaTruck size={20} />
                </div>
                <div className="metric-content">
                  <h3>Delivered Vehicles</h3>
                  <p>{formatIndianNumber(dashboardData?.deliveredVehicles)}</p>
                </div>
              </MetricCard>

              <MetricCard color="var(--nb-orange)">
                <div className="icon-container">
                  <FaHourglassHalf size={20} />
                </div>
                <div className="metric-content">
                  <h3>Pending Vehicles</h3>
                  <p>{formatIndianNumber(dashboardData?.pendingVehicles)}</p>
                </div>
              </MetricCard>

              <MetricCard color="var(--nb-orange)">
                <div className="icon-container">
                  <FaBoxes size={20} />
                </div>
                <div className="metric-content">
                  <h3>Total Products</h3>
                  <p>{formatIndianNumber(dashboardData?.totalProducts)}</p>
                </div>
              </MetricCard>
            </MetricsGrid>

            {/* Graphs Grid - Collection and Bill Trends */}
            <ChartsGrid>
              <ContentSection>
                <SectionHeader>
                  <h2>Collection Trend</h2>
                  <TimeRangeSelector>
                    <TimeRangeButton
                      active={timeRange === "day"}
                      onClick={() => setTimeRange("day")}
                    >
                      Day
                    </TimeRangeButton>
                    <TimeRangeButton
                      active={timeRange === "week"}
                      onClick={() => setTimeRange("week")}
                    >
                      Week
                    </TimeRangeButton>
                    <TimeRangeButton
                      active={timeRange === "month"}
                      onClick={() => setTimeRange("month")}
                    >
                      Month
                    </TimeRangeButton>
                  </TimeRangeSelector>
                </SectionHeader>
                <ChartContainer
                  as={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  key={`collection-${timeRange}`}
                >
                  <Bar data={getCollectionChartData()} options={collectionChartOptions} />
                </ChartContainer>
              </ContentSection>

              <ContentSection>
                <SectionHeader>
                  <h2>Bill Trend</h2>
                  <TimeRangeSelector>
                    <TimeRangeButton
                      active={billTimeRange === "day"}
                      onClick={() => setBillTimeRange("day")}
                    >
                      Day
                    </TimeRangeButton>
                    <TimeRangeButton
                      active={billTimeRange === "week"}
                      onClick={() => setBillTimeRange("week")}
                    >
                      Week
                    </TimeRangeButton>
                    <TimeRangeButton
                      active={billTimeRange === "month"}
                      onClick={() => setBillTimeRange("month")}
                    >
                      Month
                    </TimeRangeButton>
                  </TimeRangeSelector>
                </SectionHeader>
                <ChartContainer
                  as={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                  key={`bill-${billTimeRange}`}
                >
                  <Line data={getBillChartData()} options={billChartOptions} />
                </ChartContainer>
              </ContentSection>
            </ChartsGrid>
            <ContentSection>
              <SectionHeader>
                <h2>DSR Performance</h2>
              </SectionHeader>
              <DSRPerformanceGrid>
                <DSRPerformanceCard>
                  <h3>Top Collectors (This Month)</h3>
                  <DSRList>
                    {dashboardData?.dsrCollections?.map((dsr, index) => (
                      <DSRItem key={dsr._id}>
                        <span className="rank">{index + 1}</span>
                        <span className="name">{dsr.dsrName}</span>
                        <span className="amount">
                          ₹{dsr.totalCollection?.toLocaleString()}
                        </span>
                      </DSRItem>
                    ))}
                  </DSRList>
                </DSRPerformanceCard>

                <DSRPerformanceCard>
                  <h3>Outstanding DSRs (All Time)</h3>
                  <DSRList>
                    {dashboardData?.outstandingDSRs?.map((dsr, index) => (
                      <DSRItem key={dsr._id}>
                        <span className="rank">{index + 1}</span>
                        <span className="name">{dsr.dsrName}</span>
                        <span className="amount">
                          ₹{dsr.totalCollection?.toLocaleString()}
                        </span>
                      </DSRItem>
                    ))}
                  </DSRList>
                </DSRPerformanceCard>
              </DSRPerformanceGrid>
            </ContentSection>

            <ContentSection>
              <SectionHeader>
                <h2>Recent Collections</h2>
                <ViewAllLink to="/admin/bill-collection-history">
                  View All <FaChevronRight size={12} />
                </ViewAllLink>
              </SectionHeader>

              <TableContainer>
                <DataTable>
                  <thead>
                    <tr>
                      <th>Bill No.</th>
                      <th>Amount</th>
                      <th>Collected By</th>
                      <th>Payment</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData?.recentCollections?.map((collection) => (
                      <tr key={collection._id}>
                        <td data-label="Bill No.">
                          {collection.bill?.billNumber || "N/A"}
                        </td>
                        <td data-label="Amount">
                          ₹{collection.amountCollected.toLocaleString()}
                        </td>
                        <td data-label="Collected By">
                          {collection.collectedBy.name}
                        </td>
                        <td data-label="Payment">
                          <PaymentBadge mode={collection.paymentMode}>
                            {collection.paymentMode}
                          </PaymentBadge>
                        </td>
                        <td data-label="Date">
                          {new Date(collection.collectedOn).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </DataTable>
              </TableContainer>
            </ContentSection>
          </>
        )}
      </MainContent>
    </Layout>
  );
};

const MainContent = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-x: hidden;
  animation: fadeIn 0.6s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (min-width: 768px) {
    padding: 1.5rem;
  }

  @media (min-width: 1200px) {
    padding: 2rem;
  }
`;
const ChartContainer = styled.div`
  width: 100%;
  height: 400px;
  margin-top: 1rem;
  padding: 1.5rem;
  background: var(--nb-muted);
  border-radius: 1rem;
  border: 1px solid var(--nb-border);
  backdrop-filter: blur(10px);
  animation: slideUp 0.8s ease;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (min-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  > div {
    &:nth-child(1) {
      animation: slideRight 0.8s ease 0.2s backwards;
    }

    &:nth-child(2) {
      animation: slideRight 0.8s ease 0.4s backwards;
    }
  }

  @keyframes slideRight {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const TimeRangeSelector = styled.div`
  display: flex;
  gap: 0.5rem;
  animation: slideRight 0.6s ease;

  @keyframes slideRight {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const TimeRangeButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid
    ${(props) => (props.active ? "var(--nb-orange)" : "var(--nb-border)")};
  border-radius: 20px;
  background: ${(props) =>
    props.active ? "var(--nb-orange)" : "var(--nb-blue)"};
  color: var(--nb-white);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
  box-shadow: var(--nb-shadow-md);

  &:hover {
    transform: scale(1.05);
    border-color: var(--nb-orange);
    box-shadow: var(--nb-shadow-lg);
  }

  &:active {
    transform: scale(0.98);
  }
`;
const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  animation: slideUp 0.6s ease;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  h1 {
    color: var(--nb-ink);
    font-size: 1.5rem;
    margin: 0;
    font-weight: 600;
    text-shadow: none;

    @media (min-width: 768px) {
      font-size: 1.8rem;
    }
  }
`;
const DSRPerformanceGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const DSRPerformanceCard = styled.div`
  background: var(--nb-muted);
  border-radius: 0.75rem;
  padding: 1.25rem;
  box-shadow: var(--nb-shadow-md);
  border: 1px solid var(--nb-border);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--nb-shadow-md);
    border-color: var(--nb-orange);
  }

  h3 {
    color: var(--nb-orange);
    font-size: 1rem;
    margin: 0 0 1rem 0;
    font-weight: 600;
    border-bottom: 1px solid var(--nb-border);
    padding-bottom: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const DSRList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const DSRItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: var(--nb-muted);
    transform: translateX(5px);
  }

  .rank {
    background: var(--nb-var(--nb-white));
    color: var(--nb-blue);
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: 700;
    box-shadow: var(--nb-shadow-md);
  }

  .name {
    flex: 1;
    color: var(--nb-ink);
    font-weight: 500;
  }

  .amount {
    color: var(--nb-orange);
    font-weight: 700;
    font-size: 1.05rem;
  }
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--nb-muted);
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  box-shadow: var(--nb-shadow-md);
  border: 1px solid var(--nb-border);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  animation: slideRight 0.6s ease 0.2s backwards;

  @keyframes slideRight {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  &:hover {
    transform: scale(1.05);
    box-shadow: var(--nb-shadow-md);
    border-color: var(--nb-orange);
  }

  img {
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 50%;
    border: 2px solid var(--nb-orange);
    box-shadow: var(--nb-shadow-md);
  }

  span {
    color: var(--nb-ink);
    font-weight: 500;
    font-size: 0.9rem;

    @media (min-width: 768px) {
      font-size: 1rem;
    }
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

  > div:nth-child(1) {
    animation: slideUp 0.6s ease 0.1s backwards;
  }

  > div:nth-child(2) {
    animation: slideUp 0.6s ease 0.2s backwards;
  }

  > div:nth-child(3) {
    animation: slideUp 0.6s ease 0.3s backwards;
  }

  > div:nth-child(4) {
    animation: slideUp 0.6s ease 0.4s backwards;
  }

  > div:nth-child(5) {
    animation: slideUp 0.6s ease 0.5s backwards;
  }

  > div:nth-child(6) {
    animation: slideUp 0.6s ease 0.6s backwards;
  }

  > div:nth-child(7) {
    animation: slideUp 0.6s ease 0.7s backwards;
  }

  > div:nth-child(8) {
    animation: slideUp 0.6s ease 0.8s backwards;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const MetricCard = styled.div`
  background: var(--nb-muted);
  border-radius: 0.75rem;
  padding: 1.25rem;
  box-shadow: var(--nb-shadow-md);
  display: flex;
  align-items: center;
  gap: 1rem;
  border-left: 4px solid ${(props) => props.color};
  border: 1px solid var(--nb-border);
  border-left: 4px solid ${(props) => props.color};
  transition: all 0.3s ease;
  min-height: 90px;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;

  /* Glow effect on left border */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 4px;
    height: 100%;
    background: ${(props) => props.color};
    box-shadow: var(--nb-shadow-md);
  }

  &:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: var(--nb-shadow-md);
    border-color: ${(props) => props.color};
  }

  .icon-container {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: ${(props) => `${props.color}25`};
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: all 0.3s ease;

    /* Icon glow */
    &::after {
      content: '';
      position: absolute;
      inset: -5px;
      border-radius: 50%;
      background: ${(props) => props.color};
      opacity: 0;
      filter: blur(10px);
      transition: opacity 0.3s ease;
    }

    svg {
      color: ${(props) => props.color};
      position: relative;
      z-index: 1;
      transition: all 0.3s ease;
    }
  }

  &:hover .icon-container {
    transform: scale(1.1);

    &::after {
      opacity: 0.3;
      animation: pulse 2s infinite;
    }

    svg {
      transform: rotate(5deg);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 0.3;
    }
    50% {
      opacity: 0.6;
    }
  }

  .metric-content {
    h3 {
      color: var(--nb-blue);
      font-size: 0.85rem;
      margin: 0 0 0.25rem 0;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;

      @media (min-width: 768px) {
        font-size: 0.95rem;
      }
    }

    p {
      color: var(--nb-ink);
      font-size: 1.25rem;
      margin: 0;
      font-weight: 300;
      animation: countUp 1s ease;

      @media (min-width: 768px) {
        font-size: 1.5rem;
      }
    }
  }

  @keyframes countUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ContentSection = styled.section`
  background: var(--nb-muted);
  border-radius: 0.75rem;
  padding: 1.25rem;
  box-shadow: var(--nb-shadow-md);
  overflow: hidden;
  margin-bottom: 2rem;
  border: 1px solid var(--nb-border);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  animation: slideUp 0.8s ease;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &:hover {
    border-color: var(--nb-orange);
    box-shadow: var(--nb-shadow-md);
  }

  @media (min-width: 768px) {
    padding: 1.5rem;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.25rem;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  h2 {
    color: var(--nb-ink);
    font-size: 1.25rem;
    margin: 0;
    font-weight: 600;
    text-shadow: none;

    @media (min-width: 768px) {
      font-size: 1.4rem;
    }
  }
`;

const ViewAllLink = styled(Link)`
  color: var(--nb-orange);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  var(--nb-white)-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: all 0.3s ease;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background: var(--nb-muted);

  &:hover {
    color: var(--nb-ink);
    text-decoration: none;
    background: var(--nb-muted);
    transform: translateX(5px);
    box-shadow: var(--nb-shadow-md);
  }

  svg {
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: translateX(5px);
  }

  @media (min-width: 768px) {
    font-size: 0.95rem;
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-radius: 0.5rem;
  background: var(--nb-muted);
  box-shadow: var(--nb-shadow-md);
  border: 1px solid var(--nb-border);
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
    border-bottom: 1px solid var(--nb-border);
  }

  th {
    color: var(--nb-orange);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-size: 0.75rem;
    var(--nb-white)-space: nowrap;
    background: var(--nb-muted);

    @media (min-width: 768px) {
      font-size: 0.8rem;
      padding: 1rem;
    }
  }

  td {
    color: var(--nb-ink);
    var(--nb-white)-space: nowrap;
    transition: all 0.3s ease;
  }

  tr:last-child td {
    border-bottom: none;
  }

  tbody tr {
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      background: var(--nb-muted);
      transform: scale(1.01);
    }
  }

  @media (max-width: 767px) {
    min-width: 100%;

    thead {
      display: none;
    }

    tr {
      display: block;
      margin-bottom: 1rem;
      border: 1px solid var(--nb-border);
      border-radius: 0.5rem;
      padding: 0.5rem;
      position: relative;
      background: var(--nb-muted);
    }

    td {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0.75rem;
      text-align: right;
      border-bottom: 1px solid var(--nb-border);
      var(--nb-white)-space: normal;

      &:last-child {
        border-bottom: none;
      }

      &::before {
        content: attr(data-label);
        float: left;
        font-weight: 600;
        color: var(--nb-orange);
        margin-right: 1rem;
        font-size: 0.8rem;
      }
    }
  }
`;

const PaymentBadge = styled.span`
  display: inline-block;
  padding: 0.35rem 0.65rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${(props) =>
    props.mode === "Cash"
      ? "var(--nb-orange)"
      : props.mode === "Card"
      ? "var(--nb-border)"
      : "var(--nb-orange)"};
  color: ${(props) =>
    props.mode === "Cash"
      ? "var(--nb-orange)"
      : props.mode === "Card"
      ? "var(--nb-blue)"
      : "var(--nb-orange)"};
  text-transform: capitalize;
  border: 1px solid ${(props) =>
    props.mode === "Cash"
      ? "var(--nb-orange)"
      : props.mode === "Card"
      ? "var(--nb-border)"
      : "var(--nb-orange)"};
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: var(--nb-shadow-md);
  }
`;

const LoadingIndicator = styled.div`
  padding: 2rem;
  text-align: center;
  color: var(--nb-ink);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  animation: fadeIn 0.6s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .spinner {
    width: 50px;
    height: 50px;
    border: 4px solid var(--nb-border);
    border-radius: 50%;
    border-top-color: var(--nb-orange);
    animation: spin 1s ease-in-out infinite;
    box-shadow: var(--nb-shadow-md);
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  p {
    margin: 0;
    font-size: 0.95rem;
    color: var(--nb-blue);
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

const ErrorMessage = styled.div`
  padding: 1.5rem;
  background: var(--nb-muted);
  color: var(--nb-orange);
  border-radius: 0.75rem;
  margin: 1rem 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  border: 1px solid var(--nb-orange);
  backdrop-filter: blur(10px);
  animation: shake 0.5s ease;

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }

  svg {
    color: var(--nb-orange);
  }

  p {
    margin: 0;
    font-size: 0.95rem;
    color: var(--nb-ink);
  }
`;

export default AdminDashboard;
