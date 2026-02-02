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
            }&background=667eea&color=fff`}
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
  color: #547792;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  border-radius: 8px;
  margin: 0 3px;

  &:hover {
    background: rgba(26, 50, 99, 0.6);
    color: #FAB95B;
    transform: translateX(5px);

    svg {
      color: #FAB95B;
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
    color: #547792;
    flex-shrink: 0;
    transition: all 0.3s ease;
  }
`;

const ChevronIcon = styled.div`
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;

  svg {
    font-size: 0.75rem;
    color: #547792;
    transition: all 0.3s ease;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const DropdownMenu = styled.div`
  max-height: ${(props) => (props.isOpen ? "500px" : "0")};
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  padding-left: 15px;
  opacity: ${(props) => (props.isOpen ? "1" : "0")};
  transform: translateY(${(props) => (props.isOpen ? "0" : "-10px")});

  @media (max-width: 768px) {
    padding-left: 0;
  }
`;

// Styled Components
const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #1A3263 0%, #0F1B3D 100%);
  background-attachment: fixed;
`;

const Sidebar = styled.div`
  width: 280px;
  background: #0F1B3D;
  box-shadow: 2px 0 20px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  z-index: 10;
  transition: all 0.3s ease;
  border-right: 1px solid rgba(84, 119, 146, 0.2);

  @media (max-width: 768px) {
    width: 80px;

    span {
      display: none;
    }
  }
`;

const LogoContainer = styled.div`
  padding: 25px 20px;
  border-bottom: 1px solid rgba(84, 119, 146, 0.2);
  text-align: center;
  background: rgba(26, 50, 99, 0.3);

  h2 {
    color: #E8E2DB;
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    text-shadow: 0 2px 10px rgba(250, 185, 91, 0.2);
    animation: fadeIn 0.6s ease;
  }

  @media (max-width: 768px) {
    h2 {
      display: none;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
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
    background: rgba(84, 119, 146, 0.3);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(250, 185, 91, 0.5);
  }
`;

const NavItem = styled.li`
  position: relative;
  padding: 12px 25px;
  display: flex;
  align-items: center;
  color: ${(props) => (props.active ? "#FAB95B" : "#547792")};
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 4px solid ${(props) => (props.active ? "#FAB95B" : "transparent")};
  background: ${(props) =>
    props.active
      ? "rgba(26, 50, 99, 0.8)"
      : "transparent"};
  margin: 2px 0;

  svg {
    margin-right: 15px;
    font-size: 1rem;
    color: ${(props) => (props.active ? "#FAB95B" : "#547792")};
    flex-shrink: 0;
    transition: all 0.3s ease;
  }

  span {
    font-size: 0.95rem;
    font-weight: 500;
    transition: all 0.3s ease;

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
    background: rgba(26, 50, 99, 0.6);
    color: #FAB95B;
    transform: translateX(5px);

    svg {
      color: #FAB95B;
      transform: scale(1.1);
    }

    span {
      color: #FAB95B;
    }
  }

  /* Ripple effect on click */
  &:active::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(250, 185, 91, 0.3);
    transform: translate(-50%, -50%);
    animation: ripple 0.6s ease-out;
  }

  @keyframes ripple {
    to {
      width: 300px;
      height: 300px;
      opacity: 0;
    }
  }
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-top: 1px solid rgba(84, 119, 146, 0.2);
  margin-top: auto;
  background: rgba(26, 50, 99, 0.3);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(26, 50, 99, 0.5);
  }

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 12px;
    border: 2px solid #FAB95B;
    box-shadow: 0 0 15px rgba(250, 185, 91, 0.3);
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.1);
      box-shadow: 0 0 20px rgba(250, 185, 91, 0.5);
    }
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
  color: #E8E2DB;
`;

const UserRole = styled.div`
  font-size: 0.75rem;
  color: #547792;
  margin-top: 2px;
`;

const MainContent = styled.div`
  flex: 1;
  background: linear-gradient(135deg, rgba(26, 50, 99, 0.3) 0%, rgba(15, 27, 61, 0.3) 100%);
  padding: 30px;
  overflow-x: hidden;
  position: relative;

  /* Radial gradient overlay */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(250, 185, 91, 0.05) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  /* All children above overlay */
  > * {
    position: relative;
    z-index: 1;
  }

  @media (max-width: 768px) {
    padding: 20px;
  }

  @media (min-width: 1200px) {
    padding: 40px;
  }
`;
export default Layout;
