import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import Layout from "../components/Layout";
import {
  FaSearch, FaPlus, FaFilter, FaDownload, FaTh, FaList,
  FaSync, FaStore, FaCheckCircle, FaTimesCircle, FaUserPlus,
  FaSortUp, FaSortDown, FaSort,
} from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:2500/api";
const getAuthHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

const STATUS_OPTIONS = ["all", "active", "pending", "rejected"];

const RetailerList = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortField, setSortField] = useState("");
  const [sortDir, setSortDir] = useState("asc");

  const fetchRetailers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${API_BASE}/retailers`, { headers: getAuthHeaders() });
      setRecords(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError("Failed to fetch retailers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRetailers(); }, []);

  // Stats
  const stats = useMemo(() => {
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    return {
      total: records.length,
      active: records.filter((r) => r.status === "ACTIVE").length,
      pending: records.filter((r) => r.status === "PENDING").length,
      recent: records.filter((r) => {
        const d = new Date(r.createdAt);
        return !isNaN(d) && d >= oneMonthAgo;
      }).length,
    };
  }, [records]);

  const filteredRecords = useMemo(() => {
    let list = [...records];
    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      list = list.filter((r) =>
        [r.name, r.address1, r.address2, r.dayAssigned, r.assignedTo?.name]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(query))
      );
    }
    if (filterStatus !== "all") {
      list = list.filter((r) => (r.status || "ACTIVE").toLowerCase() === filterStatus.toLowerCase());
    }
    if (sortField) {
      list.sort((a, b) => {
        const av = String(a[sortField] || "").toLowerCase();
        const bv = String(b[sortField] || "").toLowerCase();
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }
    return list;
  }, [records, searchTerm, filterStatus, sortField, sortDir]);

  const handleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
  };

  const handleAddNew = () => navigate("/admin/add-retailer");

  const exportCSV = () => {
    const headers = ["Name", "Address 1", "Address 2", "Day Assigned", "Assigned To", "Status"];
    const rows = filteredRecords.map((r) => [
      r.name || "", r.address1 || "", r.address2 || "",
      r.dayAssigned || "", r.assignedTo?.name || "", r.status || "",
    ]);
    const csv = [headers, ...rows].map((row) => row.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "retailers.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  // Card view
  const RecordCard = ({ record }) => {
    const name = record.name || record._id;
    const address = [record.address1, record.address2].filter(Boolean).join(", ");
    const status = record.status || "ACTIVE";
    const initials = (name || "?").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
    const isActive = status === "ACTIVE";
    return (
      <RCard>
        <RCardAvatar>{initials}</RCardAvatar>
        <RCardName>{name}</RCardName>
        {address && <RCardSub>{address}</RCardSub>}
        {record.dayAssigned && <RCardSub>📅 {record.dayAssigned}</RCardSub>}
        {record.assignedTo?.name && <RCardSub>👤 {record.assignedTo.name}</RCardSub>}
        <RCardStatus active={isActive}>
          {isActive ? <><FaCheckCircle /> Active</> : status === "PENDING" ? <><FaTimesCircle /> Pending</> : <><FaTimesCircle /> {status}</>}
        </RCardStatus>
      </RCard>
    );
  };

  // Compact row
  const CompactRow = ({ record, idx }) => {
    const name = record.name || record._id;
    const address = [record.address1, record.address2].filter(Boolean).join(", ");
    const status = record.status || "ACTIVE";
    return (
      <CRow alt={idx % 2 === 1}>
        <CCell bold>{name}</CCell>
        <CCell>{address}</CCell>
        <CCell>{record.dayAssigned || "—"}</CCell>
        <CCell>{record.assignedTo?.name || "—"}</CCell>
        <CCell>
          <RCardStatus active={status === "ACTIVE"} compact>{status}</RCardStatus>
        </CCell>
      </CRow>
    );
  };

  return (
    <Layout>
      <PageWrapper>
        {/* Header */}
        <PageHeaderBar>
          <PageTitleGroup>
            <FaStore size={22} />
            <h1>Retailer List</h1>
          </PageTitleGroup>
          <HeaderActions>
            <RefreshBtn onClick={fetchRetailers} title="Refresh"><FaSync /></RefreshBtn>
            <ExportBtn onClick={exportCSV}><FaDownload /> Export CSV</ExportBtn>
            <AddBtn onClick={handleAddNew}><FaPlus /> Add Retailer</AddBtn>
          </HeaderActions>
        </PageHeaderBar>

        {error && <Alert>{error}</Alert>}

        {/* Stats Strip */}
        <StatsGrid>
          <StatCard accent="var(--nb-blue)"><div className="val">{stats.total}</div><div className="lbl">Total Retailers</div></StatCard>
          <StatCard accent="var(--nb-blue-medium)"><div className="val">{stats.active}</div><div className="lbl">Active</div></StatCard>
          <StatCard accent="var(--nb-orange)"><div className="val">{stats.pending}</div><div className="lbl">Pending</div></StatCard>
          <StatCard accent="var(--nb-blue)"><div className="val">{stats.recent}</div><div className="lbl">Added This Month</div></StatCard>
        </StatsGrid>

        {/* Toolbar */}
        <Toolbar>
          <SearchBox>
            <FaSearch />
            <input
              placeholder="Search retailers"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBox>
          <FilterGroup>
            <FilterLabel><FaFilter /> Status:</FilterLabel>
            <FilterSelect value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s === "all" ? "All Status" : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </FilterSelect>
          </FilterGroup>
          <ResultsInfo>{filteredRecords.length} of {records.length} retailers</ResultsInfo>
          <ViewToggle>
            <ViewBtn active={viewMode === "table"} onClick={() => setViewMode("table")} title="Table"><FaList /></ViewBtn>
            <ViewBtn active={viewMode === "cards"} onClick={() => setViewMode("cards")} title="Cards"><FaTh /></ViewBtn>
            <ViewBtn active={viewMode === "compact"} onClick={() => setViewMode("compact")} title="Compact">
              <span style={{ fontSize: "0.7rem", fontWeight: 700 }}></span>
            </ViewBtn>
          </ViewToggle>
        </Toolbar>

        {/* Content */}
        {loading ? (
          <LoadingState><div className="spinner" /><p>Loading retailers</p></LoadingState>
        ) : filteredRecords.length === 0 ? (
          <EmptyState>
            <FaStore size={40} />
            <p>{searchTerm || filterStatus !== "all" ? "No retailers match your search/filter" : "No retailers yet"}</p>
            <AddBtn onClick={handleAddNew} style={{ marginTop: "0.5rem" }}><FaUserPlus /> Add First Retailer</AddBtn>
          </EmptyState>
        ) : viewMode === "cards" ? (
          <CardsGrid>
            {filteredRecords.map((r) => <RecordCard key={r._id} record={r} />)}
          </CardsGrid>
        ) : viewMode === "compact" ? (
          <TableWrapper>
            <CompactTable>
              <CHead>
                <tr>
                  <CTh onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>
                    Name {sortField === "name" ? (sortDir === "asc" ? <FaSortUp /> : <FaSortDown />) : <FaSort style={{ opacity: 0.3 }} />}
                  </CTh>
                  <CTh>Address</CTh>
                  <CTh>Day</CTh>
                  <CTh>Assigned To</CTh>
                  <CTh>Status</CTh>
                </tr>
              </CHead>
              <tbody>
                {filteredRecords.map((r, i) => <CompactRow key={r._id} record={r} idx={i} />)}
              </tbody>
            </CompactTable>
          </TableWrapper>
        ) : (
          /* Default table view */
          <TableWrapper>
            <CompactTable>
              <CHead>
                <tr>
                  <CTh onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>
                    Name {sortField === "name" ? (sortDir === "asc" ? <FaSortUp /> : <FaSortDown />) : <FaSort style={{ opacity: 0.3 }} />}
                  </CTh>
                  <CTh>Address 1</CTh>
                  <CTh>Address 2</CTh>
                  <CTh>Collection Day</CTh>
                  <CTh>Assigned To</CTh>
                  <CTh>Status</CTh>
                </tr>
              </CHead>
              <tbody>
                {filteredRecords.map((r, i) => (
                  <CRow key={r._id} alt={i % 2 === 1}>
                    <CCell bold>{r.name || "—"}</CCell>
                    <CCell>{r.address1 || "—"}</CCell>
                    <CCell>{r.address2 || "—"}</CCell>
                    <CCell>{r.dayAssigned || "—"}</CCell>
                    <CCell>{r.assignedTo?.name || "—"}</CCell>
                    <CCell>
                      <RCardStatus active={r.status === "ACTIVE"} compact>
                        {r.status || "ACTIVE"}
                      </RCardStatus>
                    </CCell>
                  </CRow>
                ))}
              </tbody>
            </CompactTable>
          </TableWrapper>
        )}
      </PageWrapper>
    </Layout>
  );
};

/* ================================================================ STYLED COMPONENTS ================================================================ */

const PageWrapper = styled.div`
  padding: 1rem;
  min-height: 100vh;
  background: var(--nb-white);
  @media (min-width: 768px) { padding: 1.5rem 2rem; }
`;

const PageHeaderBar = styled.div`
  display: flex; align-items: center; flex-wrap: wrap; gap: 1rem;
  margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 2px solid var(--nb-border);
`;

const PageTitleGroup = styled.div`
  display: flex; align-items: center; gap: 0.75rem; flex: 1;
  h1 { font-size: 1.6rem; color: var(--nb-ink); margin: 0; }
  svg { color: var(--nb-ink); }
`;

const HeaderActions = styled.div`display: flex; gap: 0.5rem; align-items: center;`;

const RefreshBtn = styled.button`
  background: var(--nb-muted); border: 2px solid var(--nb-border); border-radius: var(--nb-radius-sm);
  width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: var(--nb-ink);
  &:hover { background: var(--nb-blue); color: var(--nb-white); }
`;

const ExportBtn = styled.button`
  display: flex; align-items: center; gap: 0.4rem; padding: 0.5rem 1rem;
  background: var(--nb-muted); color: var(--nb-ink); border: 2px solid var(--nb-border);
  border-radius: var(--nb-radius-sm); font-size: 0.85rem; font-weight: 600; cursor: pointer; box-shadow: var(--nb-shadow-sm);
  &:hover { transform: translate(-1px,-1px); box-shadow: var(--nb-shadow-md); }
`;

const AddBtn = styled.button`
  display: flex; align-items: center; gap: 0.4rem; padding: 0.5rem 1.1rem;
  background: var(--nb-blue); color: var(--nb-white); border: 2px solid var(--nb-border);
  border-radius: var(--nb-radius-sm); font-size: 0.85rem; font-weight: 600; cursor: pointer; box-shadow: var(--nb-shadow-sm);
  &:hover { transform: translate(-1px,-1px); box-shadow: var(--nb-shadow-md); }
`;

const Alert = styled.div`
  padding: 0.75rem 1rem; margin-bottom: 1rem; border-radius: var(--nb-radius-sm);
  background: var(--nb-muted); border-left: 4px solid var(--nb-orange); color: var(--nb-orange); font-weight: 500;
`;

const StatsGrid = styled.div`
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem;
  @media (max-width: 768px) { grid-template-columns: repeat(2, 1fr); }
`;

const StatCard = styled.div`
  background: var(--nb-cream); border: 2px solid var(--nb-border);
  border-left: 5px solid ${(p) => p.accent || "var(--nb-blue)"}; border-radius: var(--nb-radius);
  padding: 1rem 1.25rem; box-shadow: var(--nb-shadow-sm);
  .val { font-size: 1.8rem; font-weight: 700; color: var(--nb-ink); }
  .lbl { font-size: 0.78rem; font-weight: 600; text-transform: uppercase; color: var(--nb-blue-medium); letter-spacing: 0.5px; margin-top: 0.25rem; }
`;

const Toolbar = styled.div`
  display: flex; flex-wrap: wrap; align-items: center; gap: 0.75rem;
  margin-bottom: 1rem; padding: 0.75rem 1rem;
  background: var(--nb-cream); border: 2px solid var(--nb-border); border-radius: var(--nb-radius);
`;

const SearchBox = styled.div`
  display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 200px;
  background: var(--nb-white); border: 2px solid var(--nb-border); border-radius: var(--nb-radius-sm); padding: 0.4rem 0.75rem;
  svg { color: var(--nb-ink); flex-shrink: 0; }
  input { border: none; outline: none; background: transparent; width: 100%; font-size: 0.9rem; color: var(--nb-ink); }
`;

const FilterGroup = styled.div`display: flex; align-items: center; gap: 0.4rem;`;

const FilterLabel = styled.span`
  font-size: 0.8rem; font-weight: 600; color: var(--nb-ink);
  display: flex; align-items: center; gap: 0.3rem; white-space: nowrap;
`;

const FilterSelect = styled.select`
  padding: 0.4rem 0.75rem; border: 2px solid var(--nb-border); border-radius: var(--nb-radius-sm);
  background: var(--nb-white); color: var(--nb-ink); font-size: 0.85rem; cursor: pointer;
  &:focus { outline: none; border-color: var(--nb-blue); }
`;

const ResultsInfo = styled.div`font-size: 0.8rem; color: var(--nb-blue-medium); margin-left: auto;`;

const ViewToggle = styled.div`
  display: flex; border: 2px solid var(--nb-border); border-radius: var(--nb-radius-sm); overflow: hidden;
`;

const ViewBtn = styled.button`
  display: flex; align-items: center; justify-content: center; gap: 0.3rem;
  padding: 0.35rem 0.7rem; border: none; cursor: pointer; min-width: 36px;
  font-size: 0.85rem; font-weight: 600;
  background: ${(p) => (p.active ? "var(--nb-blue)" : "var(--nb-white)")};
  color: ${(p) => (p.active ? "var(--nb-white)" : "var(--nb-ink)")};
  transition: all var(--nb-transition);
`;

/* Cards */
const CardsGrid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem;
`;

const RCard = styled.div`
  background: var(--nb-white); border: 2px solid var(--nb-border); border-radius: var(--nb-radius);
  padding: 1.25rem; box-shadow: var(--nb-shadow-md); cursor: pointer;
  display: flex; flex-direction: column; align-items: center; gap: 0.4rem; text-align: center;
  transition: transform var(--nb-transition), box-shadow var(--nb-transition);
  &:hover { transform: translate(-2px,-2px); box-shadow: var(--nb-shadow-lg); }
`;

const RCardAvatar = styled.div`
  width: 48px; height: 48px; border-radius: 50%;
  background: var(--nb-blue); color: var(--nb-white);
  border: 2px solid var(--nb-border);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.9rem; font-weight: 700; box-shadow: var(--nb-shadow-sm);
`;

const RCardName = styled.div`font-weight: 700; font-size: 0.95rem; color: var(--nb-ink);`;
const RCardSub = styled.div`font-size: 0.75rem; color: var(--nb-blue-medium);`;

const RCardStatus = styled.span`
  display: inline-flex; align-items: center; gap: 0.25rem; margin-top: 0.25rem;
  padding: ${(p) => p.compact ? "0.15rem 0.4rem" : "0.2rem 0.6rem"}; border-radius: 999px;
  font-size: 0.72rem; font-weight: 700; border: 2px solid var(--nb-border);
  background: ${(p) => (p.active ? "var(--nb-blue-light)" : "var(--nb-muted)")};
  color: ${(p) => (p.active ? "var(--nb-ink)" : "var(--nb-border)")};
`;

/* Compact table */
const TableWrapper = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border: 2px solid var(--nb-border);
  border-radius: var(--nb-radius);
  box-shadow: var(--nb-shadow-md);
`;

const CompactTable = styled.table`
  width: 100%;
  min-width: 600px;
  border-collapse: collapse;
  background: var(--nb-white);
  overflow: hidden;
`;

const CHead = styled.thead``;

const CTh = styled.th`
  background: var(--nb-muted); color: var(--nb-ink); font-weight: 700;
  font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.5px;
  padding: 0.7rem 1rem; border-bottom: 2px solid var(--nb-border); text-align: left;
  svg { font-size: 0.65rem; margin-left: 0.3rem; vertical-align: middle; }
`;

const CRow = styled.tr`
  background: ${(p) => (p.alt ? "var(--nb-muted)" : "var(--nb-white)")};
  cursor: pointer;
  td { padding: 0.6rem 1rem; border-bottom: 1px solid var(--nb-border); }
  &:hover td { background: var(--nb-cream); }
`;

const CCell = styled.td`
  font-size: 0.875rem; color: var(--nb-ink);
  font-weight: ${(p) => (p.bold ? "600" : "400")};
`;

const LoadingState = styled.div`
  padding: 3rem; text-align: center; color: var(--nb-ink);
  .spinner { width: 36px; height: 36px; border: 4px solid var(--nb-muted); border-top: 4px solid var(--nb-blue); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1rem; }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

const EmptyState = styled.div`
  padding: 3rem; text-align: center; color: var(--nb-ink);
  display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
  svg { color: var(--nb-blue); }
`;

export default RetailerList;
