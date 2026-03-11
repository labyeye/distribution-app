import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useModules } from "../contexts/ModuleContext";
import {
  FaTachometerAlt,
  FaHistory,
  FaFileInvoiceDollar,
  FaPlusCircle,
  FaUsers,
  FaSignOutAlt,
  FaChartBar,
  FaList,
  FaShoppingCart,
  FaBoxes,
  FaStore,
  FaChevronDown,
  FaChevronRight,
  FaMoneyBillWave,
  FaBook,
  FaCalendarCheck,
  FaTruck,
  FaCogs,
  FaBars,
  FaTimes,
  FaFileAlt,
  FaWallet,
  FaClipboardList,
  FaUserTie,
  FaRoute,
  FaLayerGroup,
  FaReceipt,
  FaChartLine,
  FaUsersCog,
  FaIdBadge,
} from "react-icons/fa";

const Layout = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();
  const { getModuleName } = useModules();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [openDropdowns, setOpenDropdowns] = useState({
    retailers: false,
    products: false,
    orders: false,
    collections: false,
    salary: false,
    attendance: false,
    logistics: false,
    reports: false,
    hrstaff: false,
    finance: false,
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const toggleDropdown = (category) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <Container>
      {/* Mobile top bar */}
      <MobileTopBar>
        <HamburgerBtn onClick={() => setSidebarOpen(true)}>
          <FaBars />
        </HamburgerBtn>
        <MobileTitle>DistributeX</MobileTitle>
      </MobileTopBar>

      {/* Overlay for mobile */}
      {sidebarOpen && <Overlay onClick={closeSidebar} />}

      <Sidebar $open={sidebarOpen}>
        <LogoContainer>
          <h2>DistributeX</h2>
          <CloseBtn onClick={closeSidebar}>
            <FaTimes />
          </CloseBtn>
        </LogoContainer>
        <NavMenu>

          {/* ── DASHBOARD ─────────────────────────────────── */}
          <NavItem active={location.pathname === "/admin"} onClick={closeSidebar}>
            <FaTachometerAlt />
            <span>Dashboard</span>
            <Link to="/admin" />
          </NavItem>

          {/* ── SALES ─────────────────────────────────────── */}
          <SectionLabel>Sales</SectionLabel>

          <NavCategory onClick={() => toggleDropdown("retailers")}>
            <CategoryHeader>
              <CategoryIcon><FaStore /><span>Retailers</span></CategoryIcon>
              <ChevronIcon>{openDropdowns.retailers ? <FaChevronDown /> : <FaChevronRight />}</ChevronIcon>
            </CategoryHeader>
          </NavCategory>
          <DropdownMenu $isOpen={openDropdowns.retailers}>
            <NavItem active={location.pathname === "/admin/add-retailer"} onClick={closeSidebar}>
              <FaPlusCircle /><span>Add Retailer</span><Link to="/admin/add-retailer" />
            </NavItem>
            <NavItem active={location.pathname === "/admin/view-retailer"} onClick={closeSidebar}>
              <FaList /><span>Retailer Directory</span><Link to="/admin/view-retailer" />
            </NavItem>
          </DropdownMenu>

          <NavCategory onClick={() => toggleDropdown("orders")}>
            <CategoryHeader>
              <CategoryIcon><FaShoppingCart /><span>Orders</span></CategoryIcon>
              <ChevronIcon>{openDropdowns.orders ? <FaChevronDown /> : <FaChevronRight />}</ChevronIcon>
            </CategoryHeader>
          </NavCategory>
          <DropdownMenu $isOpen={openDropdowns.orders}>
            <NavItem active={location.pathname === "/admin/order-list"} onClick={closeSidebar}>
              <FaClipboardList /><span>Order Register</span><Link to="/admin/order-list" />
            </NavItem>
          </DropdownMenu>

          <NavCategory onClick={() => toggleDropdown("collections")}>
            <CategoryHeader>
              <CategoryIcon><FaFileInvoiceDollar /><span>Billing &amp; Collections</span></CategoryIcon>
              <ChevronIcon>{openDropdowns.collections ? <FaChevronDown /> : <FaChevronRight />}</ChevronIcon>
            </CategoryHeader>
          </NavCategory>
          <DropdownMenu $isOpen={openDropdowns.collections}>
            <NavItem active={location.pathname === "/admin/bills-add"} onClick={closeSidebar}>
              <FaPlusCircle /><span>Raise Invoice</span><Link to="/admin/bills-add" />
            </NavItem>
            <NavItem active={location.pathname === "/admin/bills"} onClick={closeSidebar}>
              <FaReceipt /><span>Invoice Register</span><Link to="/admin/bills" />
            </NavItem>
            <NavItem active={location.pathname === "/admin/bill-collection-history"} onClick={closeSidebar}>
              <FaChartBar /><span>DSR Summary</span><Link to="/admin/bill-collection-history" />
            </NavItem>
          </DropdownMenu>

          {/* ── INVENTORY ─────────────────────────────────── */}
          <SectionLabel>Inventory</SectionLabel>

          <NavCategory onClick={() => toggleDropdown("products")}>
            <CategoryHeader>
              <CategoryIcon><FaBoxes /><span>Products</span></CategoryIcon>
              <ChevronIcon>{openDropdowns.products ? <FaChevronDown /> : <FaChevronRight />}</ChevronIcon>
            </CategoryHeader>
          </NavCategory>
          <DropdownMenu $isOpen={openDropdowns.products}>
            <NavItem active={location.pathname === "/admin/add-product"} onClick={closeSidebar}>
              <FaPlusCircle /><span>Add Product</span><Link to="/admin/add-product" />
            </NavItem>
            <NavItem active={location.pathname === "/admin/view-product"} onClick={closeSidebar}>
              <FaList /><span>Product Catalogue</span><Link to="/admin/view-product" />
            </NavItem>
          </DropdownMenu>

          {/* ── LOGISTICS ─────────────────────────────────── */}
          <SectionLabel>Logistics</SectionLabel>

          <NavCategory onClick={() => toggleDropdown("logistics")}>
            <CategoryHeader>
              <CategoryIcon><FaTruck /><span>Distribution</span></CategoryIcon>
              <ChevronIcon>{openDropdowns.logistics ? <FaChevronDown /> : <FaChevronRight />}</ChevronIcon>
            </CategoryHeader>
          </NavCategory>
          <DropdownMenu $isOpen={openDropdowns.logistics}>
            <NavItem active={location.pathname === "/admin/delivery-create"} onClick={closeSidebar}>
              <FaPlusCircle /><span>New Dispatch</span><Link to="/admin/delivery-create" />
            </NavItem>
            <NavItem active={location.pathname === "/admin/delivery-tracking"} onClick={closeSidebar}>
              <FaRoute /><span>Live Tracking</span><Link to="/admin/delivery-tracking" />
            </NavItem>
            <NavItem active={location.pathname === "/admin/delivery-history"} onClick={closeSidebar}>
              <FaHistory /><span>Dispatch History</span><Link to="/admin/delivery-history" />
            </NavItem>
          </DropdownMenu>

          {/* ── FINANCE ───────────────────────────────────── */}
          <SectionLabel>Finance</SectionLabel>

          <NavCategory onClick={() => toggleDropdown("finance")}>
            <CategoryHeader>
              <CategoryIcon><FaMoneyBillWave /><span>Payroll</span></CategoryIcon>
              <ChevronIcon>{openDropdowns.finance ? <FaChevronDown /> : <FaChevronRight />}</ChevronIcon>
            </CategoryHeader>
          </NavCategory>
          <DropdownMenu $isOpen={openDropdowns.finance}>
            <NavItem active={location.pathname === "/admin/salary"} onClick={closeSidebar}>
              <FaMoneyBillWave /><span>Process Salary</span><Link to="/admin/salary" />
            </NavItem>
            <NavItem active={location.pathname === "/admin/advances"} onClick={closeSidebar}>
              <FaWallet /><span>Advance Register</span><Link to="/admin/advances" />
            </NavItem>
            <NavItem active={location.pathname === "/admin/salary-ledger"} onClick={closeSidebar}>
              <FaBook /><span>Salary Ledger</span><Link to="/admin/salary-ledger" />
            </NavItem>
          </DropdownMenu>

          {/* ── HR / STAFF ────────────────────────────────── */}
          <SectionLabel>HR &amp; Staff</SectionLabel>

          <NavCategory onClick={() => toggleDropdown("hrstaff")}>
            <CategoryHeader>
              <CategoryIcon><FaUserTie /><span>Staff Management</span></CategoryIcon>
              <ChevronIcon>{openDropdowns.hrstaff ? <FaChevronDown /> : <FaChevronRight />}</ChevronIcon>
            </CategoryHeader>
          </NavCategory>
          <DropdownMenu $isOpen={openDropdowns.hrstaff}>
            <NavItem active={location.pathname === "/admin/attendance"} onClick={closeSidebar}>
              <FaCalendarCheck /><span>Attendance</span><Link to="/admin/attendance" />
            </NavItem>
            <NavItem active={location.pathname === "/admin/users"} onClick={closeSidebar}>
              <FaIdBadge /><span>Staff Directory</span><Link to="/admin/users" />
            </NavItem>
          </DropdownMenu>

          {/* ── REPORTS ───────────────────────────────────── */}
          <SectionLabel>Reports</SectionLabel>

          <NavCategory onClick={() => toggleDropdown("reports")}>
            <CategoryHeader>
              <CategoryIcon><FaChartLine /><span>Analytics &amp; Reports</span></CategoryIcon>
              <ChevronIcon>{openDropdowns.reports ? <FaChevronDown /> : <FaChevronRight />}</ChevronIcon>
            </CategoryHeader>
          </NavCategory>
          <DropdownMenu $isOpen={openDropdowns.reports}>
            <NavItem active={location.pathname === "/admin/tally-reports"} onClick={closeSidebar}>
              <FaLayerGroup /><span>Tally Reports</span><Link to="/admin/tally-reports" />
            </NavItem>
            <NavItem active={location.pathname === "/admin/reports"} onClick={closeSidebar}>
              <FaFileAlt /><span>Collection Reports</span><Link to="/admin/reports" />
            </NavItem>
          </DropdownMenu>

          {/* ── ADMINISTRATION ────────────────────────────── */}
          <SectionLabel>Administration</SectionLabel>

          <NavItem active={location.pathname === "/admin/settings"} onClick={closeSidebar}>
            <FaCogs /><span>Settings</span><Link to="/admin/settings" />
          </NavItem>

          <NavItem onClick={handleLogout}>
            <FaSignOutAlt /><span>Logout</span>
          </NavItem>

        </NavMenu>
        <UserProfile>
          <img
            src={`https://ui-avatars.com/api/?name=${
              user?.name || "Admin"
            }&background=14213d&color=ffffff`}
            alt="User"
          />
          <div>
            <UserName>{user?.name || "Admin"}</UserName>
            <UserRole>{user?.role || "Administrator"}</UserRole>
          </div>
        </UserProfile>
      </Sidebar>
      <MainContent>{children}</MainContent>
    </Container>
  );
};

// ── Styled Components ──────────────────────────────────────────────────────────

const MobileTopBar = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  background: var(--nb-white);
  border-bottom: 2px solid var(--nb-border);
  box-shadow: var(--nb-shadow-sm);
  align-items: center;
  padding: 0 16px;
  gap: 12px;
  z-index: 100;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const MobileTitle = styled.span`
  font-weight: 700;
  font-size: 1rem;
  color: var(--nb-ink);
`;

const HamburgerBtn = styled.button`
  background: none;
  border: 2px solid var(--nb-border);
  border-radius: 6px;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--nb-ink);
  font-size: 1.1rem;
  flex-shrink: 0;

  &:hover {
    background: var(--nb-blue);
    color: var(--nb-white);
    border-color: var(--nb-blue);
  }
`;

const Overlay = styled.div`
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 150;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background: var(--nb-white);

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.div`
  width: 280px;
  background: var(--nb-white);
  border-right: 2px solid var(--nb-border);
  box-shadow: var(--nb-shadow-md);
  display: flex;
  flex-direction: column;
  z-index: 10;
  flex-shrink: 0;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 280px;
    z-index: 200;
    transform: translateX(${(p) => (p.$open ? "0" : "-100%")});
    transition: transform 0.3s ease;
    overflow-y: auto;
  }
`;

const LogoContainer = styled.div`
  padding: 20px 20px;
  border-bottom: 2px solid var(--nb-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--nb-white);

  h2 {
    color: var(--nb-ink);
    margin: 0;
    font-size: 1.3rem;
    font-weight: 700;
  }
`;

const CloseBtn = styled.button`
  display: none;
  background: none;
  border: 2px solid var(--nb-border);
  border-radius: 6px;
  width: 34px;
  height: 34px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--nb-ink);
  font-size: 1rem;
  flex-shrink: 0;

  &:hover {
    background: var(--nb-orange);
    color: var(--nb-white);
    border-color: var(--nb-orange);
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

const SectionLabel = styled.li`
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1.6px;
  text-transform: uppercase;
  color: var(--nb-ink, #8b949e);
  padding: 18px 20px 5px 20px;
  margin-top: 4px;
  opacity: 0.55;
  list-style: none;
  pointer-events: none;
  user-select: none;

  &:first-child {
    padding-top: 8px;
    margin-top: 0;
  }
`;

const NavMenu = styled.ul`
  list-style: none;
  padding: 20px 0;
  margin: 0;
  flex-grow: 1;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--nb-ink);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: var(--nb-blue);
  }
`;

const NavCategory = styled.div`
  cursor: pointer;
  user-select: none;
`;

const CategoryHeader = styled.div`
  padding: 12px 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--nb-ink);
  font-weight: 600;
  font-size: 0.95rem;
  transition: background-color var(--nb-transition), color var(--nb-transition);
  border-radius: var(--nb-radius);
  margin: 0 3px;

  &:hover {
    background: var(--nb-blue);
    color: var(--nb-white);

    svg {
      color: var(--nb-white);
    }
  }
`;

const CategoryIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;

  svg {
    font-size: 1rem;
    color: var(--nb-ink);
    flex-shrink: 0;
    transition: color var(--nb-transition);
  }
`;

const ChevronIcon = styled.div`
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;

  svg {
    font-size: 0.75rem;
    color: var(--nb-ink);
    transition: color var(--nb-transition);
  }
`;

const DropdownMenu = styled.div`
  max-height: ${(props) => (props.$isOpen ? "500px" : "0")};
  overflow: hidden;
  transition: max-height var(--nb-transition);
  padding-left: 15px;
`;

const NavItem = styled.li`
  position: relative;
  padding: 12px 25px;
  display: flex;
  align-items: center;
  color: ${(props) => (props.active ? "var(--nb-white)" : "var(--nb-ink)")};
  cursor: pointer;
  transition: background-color var(--nb-transition), color var(--nb-transition);
  border-left: 4px solid
    ${(props) => (props.active ? "var(--nb-blue)" : "transparent")};
  background: ${(props) => (props.active ? "var(--nb-blue)" : "transparent")};
  margin: 2px 0;

  svg {
    margin-right: 15px;
    font-size: 1rem;
    color: ${(props) => (props.active ? "var(--nb-white)" : "var(--nb-ink)")};
    flex-shrink: 0;
    transition: color var(--nb-transition);
  }

  span {
    font-size: 0.95rem;
    font-weight: 600;
    transition: color var(--nb-transition);
  }

  a {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
  }

  &:hover {
    background: var(--nb-cream);
    color: var(--nb-ink);

    svg {
      color: var(--nb-ink);
    }

    span {
      color: var(--nb-ink);
    }
  }
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-top: 2px solid var(--nb-border);
  margin-top: auto;
  background: var(--nb-cream);

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 12px;
    border: 2px solid var(--nb-border);
    flex-shrink: 0;
  }
`;

const UserName = styled.div`
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--nb-ink);
`;

const UserRole = styled.div`
  font-size: 0.75rem;
  color: var(--nb-blue);
  margin-top: 2px;
  text-transform: capitalize;
`;

const MainContent = styled.div`
  flex: 1;
  background: var(--nb-white);
  padding: 30px;
  overflow-x: hidden;
  position: relative;
  min-width: 0;

  @media (max-width: 768px) {
    padding: 72px 16px 24px;
  }

  @media (min-width: 1200px) {
    padding: 40px;
  }
`;

export default Layout;
