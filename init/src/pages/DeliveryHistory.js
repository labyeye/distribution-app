import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Layout from "../components/Layout";
import axios from "axios";
import { FaFileCsv, FaFilter, FaSearch, FaEye } from "react-icons/fa";
import * as XLSX from "xlsx";

const DeliveryHistory = () => {
  const [loading, setLoading] = useState(false);
  const [deliveries, setDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    status: "all",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchDeliveries();
  }, [filters, page]);

  useEffect(() => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const filtered = deliveries.filter(
        (d) =>
          d.vehicleNumber.toLowerCase().includes(term) ||
          d.driverName.toLowerCase().includes(term) ||
          d.retailerName.toLowerCase().includes(term) ||
          d.orders.some((o) => o.orderNumber.toLowerCase().includes(term)),
      );
      setFilteredDeliveries(filtered);
    } else {
      setFilteredDeliveries(deliveries);
    }
  }, [searchTerm, deliveries]);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      let query = `page=${page}&limit=50`;

      if (filters.status !== "all") query += `&status=${filters.status}`;
      if (filters.startDate) query += `&startDate=${filters.startDate}`;
      if (filters.endDate) query += `&endDate=${filters.endDate}`;

      const response = await axios.get(
        `http://localhost:2500/api/deliveries?${query}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setDeliveries(response.data.deliveries || []);
      setFilteredDeliveries(response.data.deliveries || []);
      setTotalPages(response.data.pagination?.pages || 1);
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const dataToExport = filteredDeliveries.map((d) => ({
      "Dispatch Date": new Date(d.dispatchDateTime).toLocaleDateString(),
      "Vehicle Number": d.vehicleNumber,
      "Vehicle Type": d.vehicleType,
      "Driver Name": d.driverName,
      "Driver Mobile": d.driverMobile,
      Retailer: d.retailerName,
      "Order Numbers": d.orders.map((o) => o.orderNumber).join(", "),
      "Total Amount": d.totalOrderAmount,
      "Delivery Status": d.deliveryStatus,
      "Expected Date": new Date(d.expectedDeliveryDate).toLocaleDateString(),
      "Actual Date": d.actualDeliveryDateTime
        ? new Date(d.actualDeliveryDateTime).toLocaleDateString()
        : "N/A",
      Remarks: d.remarks || "",
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Delivery History");
    XLSX.writeFile(wb, "delivery_history.xlsx");
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return <Badge color="#f6c23e">Pending</Badge>;
      case "In Transit":
        return <Badge color="#36b9cc">In Transit</Badge>;
      case "Delivered":
        return <Badge color="#1cc88a">Delivered</Badge>;
      case "Cancelled":
        return <Badge color="#e74a3b">Cancelled</Badge>;
      default:
        return <Badge color="#858796">{status}</Badge>;
    }
  };

  return (
    <Layout>
      <Container>
        <Header>
          <h1>Delivery History</h1>
          <ExportButton onClick={handleExport}>
            <FaFileCsv /> Export Excel
          </ExportButton>
        </Header>

        <FiltersContainer>
          <SearchBox>
            <FaSearch />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBox>
          <FilterGroup>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
            />
            <span>to</span>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
              }
            />
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </FilterGroup>
        </FiltersContainer>

        <TableContainer>
          <Table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Vehicle</th>
                <th>Driver</th>
                <th>Retailer</th>
                <th>Orders</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="8"
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    Loading...
                  </td>
                </tr>
              ) : filteredDeliveries.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    No records found
                  </td>
                </tr>
              ) : (
                filteredDeliveries.map((delivery) => (
                  <tr key={delivery._id}>
                    <td>
                      {new Date(delivery.dispatchDateTime).toLocaleDateString()}
                    </td>
                    <td>
                      <div>{delivery.vehicleNumber}</div>
                      <small style={{ color: "#888" }}>
                        {delivery.vehicleType}
                      </small>
                    </td>
                    <td>
                      <div>{delivery.driverName}</div>
                      <small style={{ color: "#888" }}>
                        {delivery.driverMobile}
                      </small>
                    </td>
                    <td>{delivery.retailerName}</td>
                    <td>
                      {delivery.orders.length > 0
                        ? delivery.orders[0].orderNumber +
                          (delivery.orders.length > 1
                            ? ` +${delivery.orders.length - 1} more`
                            : "")
                        : "No Orders"}
                    </td>
                    <td>₹{delivery.totalOrderAmount}</td>
                    <td>{getStatusBadge(delivery.deliveryStatus)}</td>
                    <td>
                      <ActionButton title="View Details">
                        <FaEye />
                      </ActionButton>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </TableContainer>

        <Pagination>
          <PageButton disabled={page === 1} onClick={() => setPage(page - 1)}>
            Previous
          </PageButton>
          <span>
            Page {page} of {totalPages}
          </span>
          <PageButton
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </PageButton>
        </Pagination>
      </Container>
    </Layout>
  );
};

// Styled Components
const Container = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h1 {
    color: #2e3a59;
    font-size: 1.8rem;
  }
`;

const ExportButton = styled.button`
  background: #1cc88a;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background: #17a673;
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  flex-wrap: wrap;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  background: #f8f9fa;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ddd;
  flex: 1;
  min-width: 200px;

  svg {
    color: #888;
    margin-right: 8px;
  }

  input {
    border: none;
    background: transparent;
    outline: none;
    width: 100%;
    font-size: 0.9rem;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  input[type="date"],
  select {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    outline: none;
  }
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #eee;
  }

  th {
    background: #f8f9fc;
    color: #6e707e;
    font-weight: 600;
    font-size: 0.85rem;
    text-transform: uppercase;
  }

  tr:hover {
    background: #f8f9fa;
  }
`;

const Badge = styled.span`
  background: ${(props) => props.color};
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #4e73df;
  cursor: pointer;
  font-size: 1rem;
  padding: 4px;

  &:hover {
    color: #2e59d9;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20px;
  gap: 15px;
`;

const PageButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;

  &:disabled {
    background: #eee;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: #f8f9fa;
  }
`;

export default DeliveryHistory;
