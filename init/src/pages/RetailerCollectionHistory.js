import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RetailerLayout from "../components/RetailerLayout";
import { FaMoneyBillWave, FaCalendarAlt, FaUser } from "react-icons/fa";

const RetailerCollectionHistory = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        "http://localhost:2500/api/retailer/collections",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to load collections");
      }

      setCollections(response.data.collections);
    } catch (error) {
      console.error("Error fetching collections:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate("/login");
        return;
      }
      setError(
        error.response?.data?.message || "Failed to load collection history",
      );
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals
  const totalCollected = collections.reduce(
    (sum, col) => sum + col.amountCollected,
    0,
  );
  const totalCollections = collections.length;

  // Filter collections by month
  const filteredCollections = collections.filter((col) => {
    if (filter === "all") return true;

    const collectionDate = new Date(col.collectionDate);
    const now = new Date();

    if (filter === "thisMonth") {
      return (
        collectionDate.getMonth() === now.getMonth() &&
        collectionDate.getFullYear() === now.getFullYear()
      );
    }
    if (filter === "lastMonth") {
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
      return (
        collectionDate.getMonth() === lastMonth.getMonth() &&
        collectionDate.getFullYear() === lastMonth.getFullYear()
      );
    }
    return true;
  });

  return (
    <RetailerLayout>
      <PageContainer>
        <Header>
          <h1>Collection History</h1>
          <SubTitle>
            Track when staff collected payments from your shop
          </SubTitle>
        </Header>

        {/* Summary Cards */}
        <SummaryGrid>
          <SummaryCard color="#1cc88a">
            <div className="icon">
              <FaMoneyBillWave size={24} />
            </div>
            <div className="content">
              <h3>Total Collected</h3>
              <p>₹{totalCollected.toFixed(2)}</p>
            </div>
          </SummaryCard>
          <SummaryCard color="#4e73df">
            <div className="icon">
              <FaCalendarAlt size={24} />
            </div>
            <div className="content">
              <h3>Total Collections</h3>
              <p>{totalCollections}</p>
            </div>
          </SummaryCard>
        </SummaryGrid>

        {/* Filter Buttons */}
        <FilterSection>
          <FilterButton
            active={filter === "all"}
            onClick={() => setFilter("all")}
          >
            All Time
          </FilterButton>
          <FilterButton
            active={filter === "thisMonth"}
            onClick={() => setFilter("thisMonth")}
          >
            This Month
          </FilterButton>
          <FilterButton
            active={filter === "lastMonth"}
            onClick={() => setFilter("lastMonth")}
          >
            Last Month
          </FilterButton>
        </FilterSection>

        {/* Collections Table */}
        <ContentSection>
          {loading ? (
            <LoadingIndicator>
              <div className="spinner"></div>
              <p>Loading collection history...</p>
            </LoadingIndicator>
          ) : error ? (
            <ErrorMessage>{error}</ErrorMessage>
          ) : (
            <TableContainer>
              <DataTable>
                <thead>
                  <tr>
                    <th>Collection Date</th>
                    <th>Collected By</th>
                    <th>Amount Collected</th>
                    <th>Bill Number</th>
                    <th>Collection Day</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCollections.length > 0 ? (
                    filteredCollections.map((collection, index) => (
                      <tr key={collection._id || index}>
                        <td data-label="Collection Date">
                          {new Date(
                            collection.collectionDate,
                          ).toLocaleDateString("en-IN")}
                          <TimeText>
                            {new Date(
                              collection.collectionDate,
                            ).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </TimeText>
                        </td>
                        <td data-label="Collected By">
                          <StaffBadge>
                            <FaUser size={12} />
                            {collection.collectedBy}
                          </StaffBadge>
                        </td>
                        <td data-label="Amount Collected">
                          <AmountText>
                            ₹{collection.amountCollected.toLocaleString()}
                          </AmountText>
                        </td>
                        <td data-label="Bill Number">
                          {collection.billNumber}
                        </td>
                        <td data-label="Collection Day">
                          {collection.collectionDay}
                        </td>
                        <td data-label="Remarks">
                          {collection.remarks || "-"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        style={{ textAlign: "center", padding: "2rem" }}
                      >
                        No collections found for the selected period
                      </td>
                    </tr>
                  )}
                </tbody>
              </DataTable>
            </TableContainer>
          )}
        </ContentSection>
      </PageContainer>
    </RetailerLayout>
  );
};

// Styled Components
const PageContainer = styled.div`
  width: 100%;
`;

const Header = styled.header`
  margin-bottom: 1.5rem;

  h1 {
    color: #2e3a59;
    font-size: 1.5rem;
    margin: 0 0 0.5rem 0;
    font-weight: 600;

    @media (min-width: 768px) {
      font-size: 1.8rem;
    }
  }
`;

const SubTitle = styled.p`
  color: #6e707e;
  font-size: 0.95rem;
  margin: 0;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 2rem;

  @media (min-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const SummaryCard = styled.div`
  background-color: #fff;
  border-radius: 0.75rem;
  padding: 1.25rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 1rem;
  border-left: 4px solid ${(props) => props.color};

  .icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background-color: ${(props) => `${props.color}15`};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    svg {
      color: ${(props) => props.color};
    }
  }

  .content {
    h3 {
      color: #6e707e;
      font-size: 0.85rem;
      margin: 0 0 0.5rem 0;
      font-weight: 600;
    }

    p {
      color: #2e3a59;
      font-size: 1.5rem;
      margin: 0;
      font-weight: 700;
    }
  }
`;

const FilterSection = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 0.5rem;
  background-color: ${(props) => (props.active ? "#4e73df" : "#f8f9fa")};
  color: ${(props) => (props.active ? "#fff" : "#6e707e")};
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => (props.active ? "#3a5ab6" : "#e9ecef")};
  }
`;

const ContentSection = styled.section`
  background-color: #fff;
  border-radius: 0.75rem;
  padding: 1.25rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;

  @media (min-width: 768px) {
    padding: 1.5rem;
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-radius: 0.5rem;
`;

const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
  min-width: 800px;

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

const TimeText = styled.div`
  font-size: 0.75rem;
  color: #6e707e;
  margin-top: 0.25rem;
`;

const StaffBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #e3f2fd;
  color: #1976d2;
  padding: 0.35rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.85rem;
  font-weight: 500;
`;

const AmountText = styled.div`
  color: #1cc88a;
  font-weight: 600;
  font-size: 1rem;
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
`;

export default RetailerCollectionHistory;
