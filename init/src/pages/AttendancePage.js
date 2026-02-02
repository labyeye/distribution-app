import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import Layout from "../components/Layout";
import {
  FaCalendarAlt,
  FaCheck,
  FaTimes,
  FaClock,
  FaFileExport,
  FaEdit,
  FaTrash,
  FaSave,
} from "react-icons/fa";

const AttendancePage = () => {
  const [view, setView] = useState("daily"); // daily or monthly
  const [users, setUsers] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [attendance, setAttendance] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form state for daily attendance
  const [formData, setFormData] = useState({
    status: "Present",
    inTime: "",
    outTime: "",
    remarks: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedStaff) {
      if (view === "daily") {
        fetchDailyAttendance();
      } else {
        fetchMonthlyAttendance();
      }
    }
  }, [selectedStaff, selectedDate, selectedMonth, selectedYear, view]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:2500/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const staffUsers = response.data.filter((user) => user.role === "staff");
      setUsers(staffUsers);
      if (staffUsers.length > 0) {
        setSelectedStaff(staffUsers[0]._id);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Failed to fetch staff list");
    }
  };

  const fetchDailyAttendance = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:2500/api/attendance/staff/${selectedStaff}/range/${selectedDate}/${selectedDate}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.length > 0) {
        const record = response.data[0];
        setFormData({
          status: record.status,
          inTime: record.inTime || "",
          outTime: record.outTime || "",
          remarks: record.remarks || "",
        });
        setEditingId(record._id);
      } else {
        setFormData({
          status: "Present",
          inTime: "",
          outTime: "",
          remarks: "",
        });
        setEditingId(null);
      }
    } catch (error) {
      console.error("Error fetching daily attendance:", error);
    }
  };

  const fetchMonthlyAttendance = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:2500/api/attendance/summary/${selectedStaff}/${selectedMonth}/${selectedYear}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setMonthlySummary(response.data);
      setAttendance(response.data.attendance || []);
    } catch (error) {
      console.error("Error fetching monthly attendance:", error);
      alert("Failed to fetch monthly attendance");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAttendance = async () => {
    try {
      const token = localStorage.getItem("token");
      const staffUser = users.find((u) => u._id === selectedStaff);

      const payload = {
        staffId: selectedStaff,
        staffName: staffUser?.name || "",
        attendanceDate: selectedDate,
        ...formData,
      };

      if (editingId) {
        // Update existing
        await axios.put(
          `http://localhost:2500/api/attendance/${editingId}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        alert("Attendance updated successfully!");
      } else {
        // Create new
        await axios.post("http://localhost:2500/api/attendance", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Attendance saved successfully!");
      }

      fetchDailyAttendance();
    } catch (error) {
      console.error("Error saving attendance:", error);
      alert(error.response?.data?.message || "Failed to save attendance");
    }
  };

  const handleDeleteAttendance = async (id) => {
    if (
      !window.confirm("Are you sure you want to delete this attendance record?")
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:2500/api/attendance/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Attendance deleted successfully!");

      if (view === "daily") {
        fetchDailyAttendance();
      } else {
        fetchMonthlyAttendance();
      }
    } catch (error) {
      console.error("Error deleting attendance:", error);
      alert(error.response?.data?.message || "Failed to delete attendance");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Present":
        return "#28a745";
      case "Absent":
        return "#dc3545";
      case "Half Day":
        return "#ffc107";
      case "Leave":
        return "#007bff";
      default:
        return "#6c757d";
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      Present: { bg: "#d4edda", text: "#155724", label: "P" },
      Absent: { bg: "#f8d7da", text: "#721c24", label: "A" },
      "Half Day": { bg: "#fff3cd", text: "#856404", label: "H" },
      Leave: { bg: "#d1ecf1", text: "#0c5460", label: "L" },
    };
    const color = colors[status] || colors.Present;
    return (
      <StatusBadge bg={color.bg} color={color.text}>
        {color.label}
      </StatusBadge>
    );
  };

  const exportToExcel = () => {
    if (!monthlySummary || attendance.length === 0) {
      alert("No data to export");
      return;
    }

    const staffUser = users.find((u) => u._id === selectedStaff);
    let csv = `Attendance Report - ${staffUser?.name || "Staff"}\n`;
    csv += `Month: ${monthlySummary.monthName} ${monthlySummary.year}\n\n`;
    csv += `Summary:\n`;
    csv += `Total Days,${monthlySummary.totalDays}\n`;
    csv += `Present Days,${monthlySummary.presentDays}\n`;
    csv += `Absent Days,${monthlySummary.absentDays}\n`;
    csv += `Half Days,${monthlySummary.halfDays}\n`;
    csv += `Leave Days,${monthlySummary.leaveDays}\n`;
    csv += `Total Working Hours,${monthlySummary.totalWorkingHours}\n\n`;
    csv += `Date,Status,In Time,Out Time,Working Hours,Remarks\n`;

    attendance.forEach((record) => {
      const date = new Date(record.attendanceDate).toLocaleDateString();
      csv += `${date},${record.status},${record.inTime || "-"},${record.outTime || "-"},${record.workingHours || 0},${record.remarks || ""}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Attendance_${staffUser?.name}_${monthlySummary.monthName}_${monthlySummary.year}.csv`;
    a.click();
  };

  return (
    <Layout>
      <Container>
        <Header>
          <Title>
            <FaCalendarAlt /> Attendance Management
          </Title>
          <ViewToggle>
            <ToggleButton
              active={view === "daily"}
              onClick={() => setView("daily")}
            >
              Daily Entry
            </ToggleButton>
            <ToggleButton
              active={view === "monthly"}
              onClick={() => setView("monthly")}
            >
              Monthly Summary
            </ToggleButton>
          </ViewToggle>
        </Header>

        <FiltersCard>
          <FilterGroup>
            <Label>Select Staff</Label>
            <Select
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
            >
              <option value="">-- Select Staff --</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </Select>
          </FilterGroup>

          {view === "daily" ? (
            <FilterGroup>
              <Label>Date</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </FilterGroup>
          ) : (
            <>
              <FilterGroup>
                <Label>Month</Label>
                <Select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                >
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(2000, i).toLocaleString("default", {
                        month: "long",
                      })}
                    </option>
                  ))}
                </Select>
              </FilterGroup>
              <FilterGroup>
                <Label>Year</Label>
                <Select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                >
                  {[...Array(5)].map((_, i) => {
                    const year = new Date().getFullYear() - 2 + i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </Select>
              </FilterGroup>
            </>
          )}
        </FiltersCard>

        {view === "daily" ? (
          <DailyEntryCard>
            <CardTitle>Daily Attendance Entry</CardTitle>
            <FormGrid>
              <FormGroup>
                <Label>Status *</Label>
                <StatusButtonGroup>
                  {["Present", "Absent", "Half Day", "Leave"].map((status) => (
                    <StatusButton
                      key={status}
                      active={formData.status === status}
                      color={getStatusColor(status)}
                      onClick={() => setFormData({ ...formData, status })}
                    >
                      {status === "Present" && <FaCheck />}
                      {status === "Absent" && <FaTimes />}
                      {status === "Half Day" && <FaClock />}
                      {status === "Leave" && <FaCalendarAlt />}
                      <span>{status}</span>
                    </StatusButton>
                  ))}
                </StatusButtonGroup>
              </FormGroup>

              <FormGroup>
                <Label>In Time (Optional)</Label>
                <Input
                  type="time"
                  value={formData.inTime}
                  onChange={(e) =>
                    setFormData({ ...formData, inTime: e.target.value })
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label>Out Time (Optional)</Label>
                <Input
                  type="time"
                  value={formData.outTime}
                  onChange={(e) =>
                    setFormData({ ...formData, outTime: e.target.value })
                  }
                />
              </FormGroup>

              <FormGroup fullWidth>
                <Label>Remarks / Notes</Label>
                <TextArea
                  rows="3"
                  value={formData.remarks}
                  onChange={(e) =>
                    setFormData({ ...formData, remarks: e.target.value })
                  }
                  placeholder="Enter any remarks or notes..."
                />
              </FormGroup>
            </FormGrid>

            <ButtonGroup>
              <SaveButton onClick={handleSaveAttendance}>
                <FaSave /> {editingId ? "Update" : "Save"} Attendance
              </SaveButton>
              {editingId && (
                <DeleteButton onClick={() => handleDeleteAttendance(editingId)}>
                  <FaTrash /> Delete
                </DeleteButton>
              )}
            </ButtonGroup>
          </DailyEntryCard>
        ) : (
          <>
            {monthlySummary && (
              <>
                <SummaryCards>
                  <SummaryCard color="#4e73df">
                    <CardValue>{monthlySummary.totalDays}</CardValue>
                    <CardLabel>Total Days</CardLabel>
                  </SummaryCard>
                  <SummaryCard color="#28a745">
                    <CardValue>{monthlySummary.presentDays}</CardValue>
                    <CardLabel>Present Days</CardLabel>
                  </SummaryCard>
                  <SummaryCard color="#dc3545">
                    <CardValue>{monthlySummary.absentDays}</CardValue>
                    <CardLabel>Absent Days</CardLabel>
                  </SummaryCard>
                  <SummaryCard color="#ffc107">
                    <CardValue>{monthlySummary.halfDays}</CardValue>
                    <CardLabel>Half Days</CardLabel>
                  </SummaryCard>
                  <SummaryCard color="#007bff">
                    <CardValue>{monthlySummary.leaveDays}</CardValue>
                    <CardLabel>Leave Days</CardLabel>
                  </SummaryCard>
                  <SummaryCard color="#17a2b8">
                    <CardValue>{monthlySummary.totalWorkingHours}</CardValue>
                    <CardLabel>Working Hours</CardLabel>
                  </SummaryCard>
                </SummaryCards>

                <TableCard>
                  <TableHeader>
                    <h3>
                      Monthly Attendance - {monthlySummary.monthName}{" "}
                      {monthlySummary.year}
                    </h3>
                    <ExportButton onClick={exportToExcel}>
                      <FaFileExport /> Export to Excel
                    </ExportButton>
                  </TableHeader>

                  <TableWrapper>
                    <Table>
                      <thead>
                        <tr>
                          <Th>Date</Th>
                          <Th>Day</Th>
                          <Th>Status</Th>
                          <Th>In Time</Th>
                          <Th>Out Time</Th>
                          <Th>Working Hours</Th>
                          <Th>Remarks</Th>
                          <Th>Actions</Th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendance.length > 0 ? (
                          attendance.map((record) => {
                            const date = new Date(record.attendanceDate);
                            return (
                              <tr key={record._id}>
                                <Td>{date.toLocaleDateString()}</Td>
                                <Td>
                                  {date.toLocaleDateString("en-US", {
                                    weekday: "short",
                                  })}
                                </Td>
                                <Td>{getStatusBadge(record.status)}</Td>
                                <Td>{record.inTime || "-"}</Td>
                                <Td>{record.outTime || "-"}</Td>
                                <Td>{record.workingHours || 0} hrs</Td>
                                <Td>{record.remarks || "-"}</Td>
                                <Td>
                                  <ActionButtons>
                                    <ActionButton
                                      color="#4e73df"
                                      onClick={() => {
                                        setView("daily");
                                        setSelectedDate(
                                          new Date(record.attendanceDate)
                                            .toISOString()
                                            .split("T")[0],
                                        );
                                      }}
                                    >
                                      <FaEdit />
                                    </ActionButton>
                                    <ActionButton
                                      color="#dc3545"
                                      onClick={() =>
                                        handleDeleteAttendance(record._id)
                                      }
                                      disabled={record.isLocked}
                                    >
                                      <FaTrash />
                                    </ActionButton>
                                  </ActionButtons>
                                </Td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <Td colSpan="8" style={{ textAlign: "center" }}>
                              No attendance records found for this month
                            </Td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </TableWrapper>
                </TableCard>
              </>
            )}
          </>
        )}
      </Container>
    </Layout>
  );
};

// Styled Components
const Container = styled.div`
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  flex-wrap: wrap;
  gap: 15px;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  color: #2e3a59;
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;

  svg {
    color: #4e73df;
  }
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 10px;
  background: #f8f9fc;
  padding: 5px;
  border-radius: 8px;
`;

const ToggleButton = styled.button`
  padding: 10px 20px;
  border: none;
  background: ${(props) => (props.active ? "#4e73df" : "transparent")};
  color: ${(props) => (props.active ? "#fff" : "#6e707e")};
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: ${(props) => (props.active ? "#3a5bc7" : "#e9ecef")};
  }
`;

const FiltersCard = styled.div`
  background: #fff;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 25px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #2e3a59;
  font-size: 0.9rem;
`;

const Select = styled.select`
  padding: 10px 12px;
  border: 1px solid #d1d3e2;
  border-radius: 6px;
  font-size: 0.95rem;
  color: #2e3a59;
  background: #fff;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4e73df;
    box-shadow: 0 0 0 3px rgba(78, 115, 223, 0.1);
  }
`;

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #d1d3e2;
  border-radius: 6px;
  font-size: 0.95rem;
  color: #2e3a59;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4e73df;
    box-shadow: 0 0 0 3px rgba(78, 115, 223, 0.1);
  }
`;

const DailyEntryCard = styled.div`
  background: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const CardTitle = styled.h2`
  font-size: 1.4rem;
  color: #2e3a59;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 25px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  grid-column: ${(props) => (props.fullWidth ? "1 / -1" : "auto")};
`;

const StatusButtonGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
`;

const StatusButton = styled.button`
  padding: 12px 16px;
  border: 2px solid ${(props) => (props.active ? props.color : "#d1d3e2")};
  background: ${(props) => (props.active ? props.color : "#fff")};
  color: ${(props) => (props.active ? "#fff" : "#6e707e")};
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  svg {
    font-size: 1rem;
  }
`;

const TextArea = styled.textarea`
  padding: 10px 12px;
  border: 1px solid #d1d3e2;
  border-radius: 6px;
  font-size: 0.95rem;
  color: #2e3a59;
  font-family: inherit;
  resize: vertical;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4e73df;
    box-shadow: 0 0 0 3px rgba(78, 115, 223, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
`;

const SaveButton = styled.button`
  padding: 12px 30px;
  background: #28a745;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: #218838;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
  }
`;

const DeleteButton = styled.button`
  padding: 12px 30px;
  background: #dc3545;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: #c82333;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
  }
`;

const SummaryCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
  margin-bottom: 25px;
`;

const SummaryCard = styled.div`
  background: #fff;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-left: 4px solid ${(props) => props.color};
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  }
`;

const CardValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #2e3a59;
  margin-bottom: 8px;
`;

const CardLabel = styled.div`
  font-size: 0.9rem;
  color: #6e707e;
  font-weight: 500;
`;

const TableCard = styled.div`
  background: #fff;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;

  h3 {
    font-size: 1.3rem;
    color: #2e3a59;
    margin: 0;
  }
`;

const ExportButton = styled.button`
  padding: 10px 20px;
  background: #17a2b8;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: #138496;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(23, 162, 184, 0.3);
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
`;

const Th = styled.th`
  background: #f8f9fc;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #2e3a59;
  border-bottom: 2px solid #e3e6f0;
  white-space: nowrap;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #e3e6f0;
  color: #5a5c69;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 6px 12px;
  background: ${(props) => props.bg};
  color: ${(props) => props.color};
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.85rem;
  min-width: 35px;
  text-align: center;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  padding: 8px 12px;
  background: ${(props) => props.color};
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

  &:hover {
    opacity: ${(props) => (props.disabled ? 0.5 : 0.8)};
    transform: ${(props) => (props.disabled ? "none" : "scale(1.05)")};
  }

  svg {
    font-size: 0.9rem;
  }
`;

export default AttendancePage;
