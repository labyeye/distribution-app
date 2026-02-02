import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RetailerLayout from "../components/RetailerLayout";

const RetailerBilling = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        "http://localhost:2500/api/retailer/bills",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to load bills");
      }

      setBills(response.data.bills);
    } catch (error) {
      console.error("Error fetching bills:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate("/login");
        return;
      }
      setError(error.response?.data?.message || "Failed to load bills");
    } finally {
      setLoading(false);
    }
  };

  const filteredBills = bills.filter((bill) => {
    if (filter === "all") return true;
    return bill.status === filter;
  });

  const totalBillAmount = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const totalPaid = bills.reduce((sum, bill) => sum + bill.paidAmount, 0);
  const totalDue = bills.reduce((sum, bill) => sum + bill.dueAmount, 0);

  return (
    <RetailerLayout>
      <PageContainer>
        <Header>
          <h1>Billing & Payments</h1>
        </Header>

        {/* Summary Cards */}
        <SummaryGrid>
          <SummaryCard color="#4e73df">
            <h3>Total Bills</h3>
            <p>₹{totalBillAmount.toFixed(2)}</p>
          </SummaryCard>
          <SummaryCard color="#1cc88a">
            <h3>Total Paid</h3>
            <p>₹{totalPaid.toFixed(2)}</p>
          </SummaryCard>
          <SummaryCard color="#f6c23e">
            <h3>Total Due</h3>
            <p>₹{totalDue.toFixed(2)}</p>
          </SummaryCard>
        </SummaryGrid>

        {/* Filter Buttons */}
        <FilterSection>
          <FilterButton
            active={filter === "all"}
            onClick={() => setFilter("all")}
          >
            All Bills
          </FilterButton>
          <FilterButton
            active={filter === "Paid"}
            onClick={() => setFilter("Paid")}
          >
            Paid
          </FilterButton>
          <FilterButton
            active={filter === "Partially Paid"}
            onClick={() => setFilter("Partially Paid")}
          >
            Partially Paid
          </FilterButton>
          <FilterButton
            active={filter === "Unpaid"}
            onClick={() => setFilter("Unpaid")}
          >
            Unpaid
          </FilterButton>
        </FilterSection>

        {/* Bills Table */}
        <ContentSection>
          {loading ? (
            <LoadingIndicator>
              <div className="spinner"></div>
              <p>Loading bills...</p>
            </LoadingIndicator>
          ) : error ? (
            <ErrorMessage>{error}</ErrorMessage>
          ) : (
            <TableContainer>
              <DataTable>
                <thead>
                  <tr>
                    <th>Bill No.</th>
                    <th>Bill Date</th>
                    <th>Amount</th>
                    <th>Paid</th>
                    <th>Due</th>
                    <th>Status</th>
                    <th>Collection Day</th>
                    <th>Payment Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBills.length > 0 ? (
                    filteredBills.map((bill) => (
                      <tr key={bill.id}>
                        <td data-label="Bill No.">{bill.billNumber}</td>
                        <td data-label="Bill Date">
                          {new Date(bill.billDate).toLocaleDateString("en-IN")}
                        </td>
                        <td data-label="Amount">
                          ₹{bill.amount.toLocaleString()}
                        </td>
                        <td data-label="Paid">
                          ₹{bill.paidAmount.toLocaleString()}
                        </td>
                        <td data-label="Due">
                          ₹{bill.dueAmount.toLocaleString()}
                        </td>
                        <td data-label="Status">
                          <StatusBadge status={bill.status}>
                            {bill.status}
                          </StatusBadge>
                        </td>
                        <td data-label="Collection Day">
                          {bill.collectionDay}
                        </td>
                        <td data-label="Payment Date">
                          {bill.paymentDate
                            ? new Date(bill.paymentDate).toLocaleDateString(
                                "en-IN",
                              )
                            : "-"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        style={{ textAlign: "center", padding: "2rem" }}
                      >
                        No bills found
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
    margin: 0;
    font-weight: 600;

    @media (min-width: 768px) {
      font-size: 1.8rem;
    }
  }
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 2rem;

  @media (min-width: 480px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const SummaryCard = styled.div`
  background-color: #fff;
  border-radius: 0.75rem;
  padding: 1.25rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-left: 4px solid ${(props) => props.color};

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
`;

export default RetailerBilling;
