import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
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
} from "react-icons/fa";

const Layout = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();

  // State for dropdown toggles
  const [openDropdowns, setOpenDropdowns] = useState({
    retailers: false,
    products: false,
    orders: false,
    collections: false,
    salary: false,
    attendance: false,
    logistics: false,
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

  return (
    <Container>
      <Sidebar>
        <LogoContainer>
          <h2>Distribution CRM</h2>
        </LogoContainer>
        <NavMenu>
          {/* Dashboard */}
          <NavItem active={location.pathname === "/admin"}>
            <FaTachometerAlt />
            <span>Dashboard</span>
            <Link to="/admin" />
          </NavItem>

          {/* Retailers Category */}
          <NavCategory onClick={() => toggleDropdown("retailers")}>
            <CategoryHeader>
              <CategoryIcon>
                <FaStore />
                <span>Retailers</span>
              </CategoryIcon>
              <ChevronIcon>
                {openDropdowns.retailers ? (
                  <FaChevronDown />
                ) : (
                  <FaChevronRight />
                )}
              </ChevronIcon>
            </CategoryHeader>
          </NavCategory>
          <DropdownMenu isOpen={openDropdowns.retailers}>
            <NavItem active={location.pathname === "/admin/add-retailer"}>
              <FaPlusCircle />
              <span>Add Retailer</span>
              <Link to="/admin/add-retailer" />
            </NavItem>
            <NavItem active={location.pathname === "/admin/view-retailer"}>
              <FaList />
              <span>Retailer Details</span>
              <Link to="/admin/view-retailer" />
            </NavItem>
          </DropdownMenu>

          {/* Products Category */}
          <NavCategory onClick={() => toggleDropdown("products")}>
            <CategoryHeader>
              <CategoryIcon>
                <FaBoxes />
                <span>Products</span>
              </CategoryIcon>
              <ChevronIcon>
                {openDropdowns.products ? (
                  <FaChevronDown />
                ) : (
                  <FaChevronRight />
                )}
              </ChevronIcon>
            </CategoryHeader>
          </NavCategory>
          <DropdownMenu isOpen={openDropdowns.products}>
            <NavItem active={location.pathname === "/admin/add-product"}>
              <FaPlusCircle />
              <span>Add Product</span>
              <Link to="/admin/add-product" />
            </NavItem>
            <NavItem active={location.pathname === "/admin/view-product"}>
              <FaList />
              <span>Product Details</span>
              <Link to="/admin/view-product" />
            </NavItem>
          </DropdownMenu>

          {/* Orders Category */}
          <NavCategory onClick={() => toggleDropdown("orders")}>
            <CategoryHeader>
              <CategoryIcon>
                <FaShoppingCart />
                <span>Orders</span>
              </CategoryIcon>
              <ChevronIcon>
                {openDropdowns.orders ? <FaChevronDown /> : <FaChevronRight />}
              </ChevronIcon>
            </CategoryHeader>
          </NavCategory>
          <DropdownMenu isOpen={openDropdowns.orders}>
            <NavItem active={location.pathname === "/admin/order-list"}>
              <FaList />
              <span>Order Details</span>
              <Link to="/admin/order-list" />
            </NavItem>
          </DropdownMenu>

          {/* Collections Category */}
          <NavCategory onClick={() => toggleDropdown("collections")}>
            <CategoryHeader>
              <CategoryIcon>
                <FaFileInvoiceDollar />
                <span>Collections</span>
              </CategoryIcon>
              <ChevronIcon>
                {openDropdowns.collections ? (
                  <FaChevronDown />
                ) : (
                  <FaChevronRight />
                )}
              </ChevronIcon>
            </CategoryHeader>
          </NavCategory>
          <DropdownMenu isOpen={openDropdowns.collections}>
            <NavItem
              active={location.pathname === "/admin/bill-collection-history"}
            >
              <FaHistory />
              <span>DSR Summary</span>
              <Link to="/admin/bill-collection-history" />
            </NavItem>
            <NavItem active={location.pathname === "/admin/bills-add"}>
              <FaPlusCircle />
              <span>Add Bills</span>
              <Link to="/admin/bills-add" />
            </NavItem>
            <NavItem active={location.pathname === "/admin/bills"}>
              <FaFileInvoiceDollar />
              <span>Bills</span>
              <Link to="/admin/bills" />
            </NavItem>
            <NavItem active={location.pathname === "/admin/reports"}>
              <FaChartBar />
              <span>Reports</span>
              <Link to="/admin/reports" />
            </NavItem>
          </DropdownMenu>

          {/* Salary & Advance Category */}
          <NavCategory onClick={() => toggleDropdown("salary")}>
            <CategoryHeader>
              <CategoryIcon>
                <FaMoneyBillWave />
                <span>Salary & Advance</span>
              </CategoryIcon>
              <ChevronIcon>
                {openDropdowns.salary ? <FaChevronDown /> : <FaChevronRight />}
              </ChevronIcon>
            </CategoryHeader>
          </NavCategory>
          <DropdownMenu isOpen={openDropdowns.salary}>
            <NavItem active={location.pathname === "/admin/salary"}>
              <FaMoneyBillWave />
              <span>Salary</span>
              <Link to="/admin/salary" />
            </NavItem>
            <NavItem active={location.pathname === "/admin/advances"}>
              <FaPlusCircle />
              <span>Advances</span>
              <Link to="/admin/advances" />
            </NavItem>
            <NavItem active={location.pathname === "/admin/salary-ledger"}>
              <FaBook />
              <span>Salary Ledger</span>
              <Link to="/admin/salary-ledger" />
            </NavItem>
          </DropdownMenu>

          {/* Attendance */}
          <NavItem active={location.pathname === "/admin/attendance"}>
            <FaCalendarCheck />
            <span>Attendance</span>
            <Link to="/admin/attendance" />
          </NavItem>

          {/* Logistics & Distribution */}
          <NavCategory onClick={() => toggleDropdown("logistics")}>
            <CategoryHeader>
              <CategoryIcon>
                <FaTruck />
                <span>Logistics & Distribution</span>
              </CategoryIcon>
              <ChevronIcon>
                {openDropdowns.logistics ? (
                  <FaChevronDown />
                ) : (
                  <FaChevronRight />
                )}
              </ChevronIcon>
            </CategoryHeader>
          </NavCategory>
          <DropdownMenu isOpen={openDropdowns.logistics}>
            <NavItem active={location.pathname === "/admin/delivery-tracking"}>
              <FaTruck />
              <span>Delivery Tracking</span>
              <Link to="/admin/delivery-tracking" />
            </NavItem>
            <NavItem active={location.pathname === "/admin/delivery-create"}>
              <FaPlusCircle />
              <span>Create Delivery</span>
              <Link to="/admin/delivery-create" />
            </NavItem>
            <NavItem active={location.pathname === "/admin/delivery-history"}>
              <FaHistory />
              <span>Delivery History</span>
              <Link to="/admin/delivery-history" />
            </NavItem>
          </DropdownMenu>

          {/* Users */}
          <NavItem active={location.pathname === "/admin/users"}>
            <FaUsers />
            <span>Users</span>
            <Link to="/admin/users" />
          </NavItem>

          {/* Settings */}
          <NavItem
            active={location.pathname === "/admin/settings/modules"}
          >
            <FaCogs />
            <span>Settings</span>
            <Link to="/admin/settings/modules" />
          </NavItem>

          {/* Logout */}
          <NavItem onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Logout</span>
          </NavItem>
        </NavMenu>
        <UserProfile>
          <img
            src={`https://ui-avatars.com/api/?name=${
              user?.name || "Admin"
            }&background=1f5eff&color=ffffff`}
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

// Styled Components for Dropdowns
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

  @media (max-width: 768px) {
    justify-content: center;

    span {
      display: none;
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

  @media (max-width: 768px) {
    display: none;
  }
`;

const DropdownMenu = styled.div`
  max-height: ${(props) => (props.isOpen ? "500px" : "0")};
  overflow: hidden;
  transition: max-height var(--nb-transition);
  padding-left: 15px;

  @media (max-width: 768px) {
    padding-left: 0;
  }
`;

// Styled Components
const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background: var(--nb-white);
`;

const Sidebar = styled.div`
  width: 280px;
  background: var(--nb-white);
  border-right: 2px solid var(--nb-border);
  box-shadow: var(--nb-shadow-md);
  display: flex;
  flex-direction: column;
  z-index: 10;
  transition: width var(--nb-transition);

  @media (max-width: 768px) {
    width: 80px;

    span {
      display: none;
    }
  }
`;

const LogoContainer = styled.div`
  padding: 25px 20px;
  border-bottom: 2px solid var(--nb-border);
  text-align: center;
  background: var(--nb-white);

  h2 {
    color: var(--nb-ink);
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
  }

  @media (max-width: 768px) {
    h2 {
      display: none;
    }
  }
`;

const NavMenu = styled.ul`
  list-style: none;
  padding: 20px 0;
  margin: 0;
  flex-grow: 1;
  overflow-y: auto;

  /* Custom scrollbar */
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

const NavItem = styled.li`
  position: relative;
  padding: 12px 25px;
  display: flex;
  align-items: center;
  color: ${(props) => (props.active ? "var(--nb-white)" : "var(--nb-ink)")};
  cursor: pointer;
  transition: background-color var(--nb-transition), color var(--nb-transition);
  border-left: 4px solid
    ${(props) => (props.active ? "var(--nb-orange)" : "transparent")};
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

    @media (max-width: 768px) {
      display: none;
    }
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
    background: var(--nb-muted);
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
  background: var(--nb-muted);

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 12px;
    border: 2px solid var(--nb-border);
  }

  div {
    @media (max-width: 768px) {
      display: none;
    }
  }
`;

const UserName = styled.div`
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--nb-ink);
`;

const UserRole = styled.div`
  font-size: 0.75rem;
  color: #333333;
  margin-top: 2px;
`;

const MainContent = styled.div`
  flex: 1;
  background: var(--nb-white);
  padding: 30px;
  overflow-x: hidden;
  position: relative;

  @media (max-width: 768px) {
    padding: 20px;
  }

  @media (min-width: 1200px) {
    padding: 40px;
  }
`;
export default Layout;
