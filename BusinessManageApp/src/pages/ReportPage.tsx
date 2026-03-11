import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../components/Header';
import AdBanner from '../components/AdBanner';
import ApiService from '../services/api';
import { API_ENDPOINTS } from '../config/api';
import { MaterialIcons } from '@expo/vector-icons';

// ─── Types ───────────────────────────────────────────────────────────────────
type ReportType = 'retailer' | 'staff' | 'collection' | 'delivery';

interface SelectItem { _id: string; name: string; }

const fmt = (d: string | Date) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';

const INR = (n: number) =>
  '₹' + (n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ─── Sub-components ──────────────────────────────────────────────────────────

const TallyRow = ({ label, value, bold }: { label: string; value: string; bold?: boolean }) => (
  <View style={T.tallyRow}>
    <Text style={[T.tallyLabel, bold && T.boldText]}>{label}</Text>
    <Text style={[T.tallyValue, bold && T.boldText]}>{value}</Text>
  </View>
);

const SectionHeader = ({ title }: { title: string }) => (
  <View style={T.sectionHeader}>
    <Text style={T.sectionHeaderText}>{title}</Text>
  </View>
);

const Divider = () => <View style={T.divider} />;

const SummaryBox = ({ items }: { items: { label: string; value: string; accent?: string }[] }) => (
  <View style={T.summaryBox}>
    {items.map((item, i) => (
      <View key={i} style={T.summaryItem}>
        <Text style={T.summaryLabel}>{item.label}</Text>
        <Text style={[T.summaryValue, item.accent ? { color: item.accent } : {}]}>{item.value}</Text>
      </View>
    ))}
  </View>
);

// ─── DatePicker (simple text-field style for React Native) ───────────────────
const DateField = ({
  label,
  value,
  onPress,
}: {
  label: string;
  value: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={T.dateField} onPress={onPress}>
    <Text style={T.dateFieldLabel}>{label}</Text>
    <Text style={T.dateFieldValue}>{value || 'Select Date'}</Text>
    <MaterialIcons name="calendar-today" size={16} color="#475569" />
  </TouchableOpacity>
);

// Simple date bump buttons
const DatePicker = ({
  label,
  date,
  onChange,
}: {
  label: string;
  date: Date;
  onChange: (d: Date) => void;
}) => {
  const bump = (days: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    onChange(d);
  };
  return (
    <View style={T.datePicker}>
      <Text style={T.datePickerLabel}>{label}</Text>
      <View style={T.datePickerRow}>
        <TouchableOpacity onPress={() => bump(-1)} style={T.dateBtn}>
          <MaterialIcons name="chevron-left" size={20} color="#2563eb" />
        </TouchableOpacity>
        <Text style={T.datePickerValue}>{date.toLocaleDateString('en-IN')}</Text>
        <TouchableOpacity onPress={() => bump(1)} style={T.dateBtn}>
          <MaterialIcons name="chevron-right" size={20} color="#2563eb" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ─── Main ReportPage ─────────────────────────────────────────────────────────
const ReportPage: React.FC = () => {
  const router = useRouter();

  const [reportType, setReportType] = useState<ReportType | null>(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  // Retailer selector
  const [retailers, setRetailers] = useState<SelectItem[]>([]);
  const [selectedRetailer, setSelectedRetailer] = useState<SelectItem | null>(null);
  const [retailerModal, setRetailerModal] = useState(false);

  // Staff selector
  const [staffList, setStaffList] = useState<SelectItem[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<SelectItem | null>(null);
  const [staffModal, setStaffModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);

  // Fetch selectors when type changes
  useEffect(() => {
    if (reportType === 'retailer' && retailers.length === 0) {
      ApiService.get<any>(`${API_ENDPOINTS.REPORTS}/tally/retailers`)
        .then((r) => setRetailers(r.data || []))
        .catch(() => Alert.alert('Error', 'Failed to load retailers'));
    }
    if (reportType === 'staff' && staffList.length === 0) {
      ApiService.get<any>(`${API_ENDPOINTS.REPORTS}/tally/staff`)
        .then((r) => setStaffList(r.data || []))
        .catch(() => Alert.alert('Error', 'Failed to load staff'));
    }
    setReportData(null);
  }, [reportType]);

  const generateReport = useCallback(async () => {
    setLoading(true);
    setReportData(null);
    try {
      const s = startDate.toISOString().split('T')[0];
      const e = endDate.toISOString().split('T')[0];
      let url = '';
      if (reportType === 'retailer') {
        if (!selectedRetailer) return Alert.alert('Select a retailer first');
        url = `${API_ENDPOINTS.REPORTS}/tally/retailer-report?retailerId=${selectedRetailer._id}&startDate=${s}&endDate=${e}`;
      } else if (reportType === 'staff') {
        if (!selectedStaff) return Alert.alert('Select a staff member first');
        url = `${API_ENDPOINTS.REPORTS}/tally/staff-report?staffId=${selectedStaff._id}&startDate=${s}&endDate=${e}`;
      } else if (reportType === 'collection') {
        url = `${API_ENDPOINTS.REPORTS}/tally/collection-report?startDate=${s}&endDate=${e}`;
      } else if (reportType === 'delivery') {
        url = `${API_ENDPOINTS.REPORTS}/tally/delivery-report?startDate=${s}&endDate=${e}`;
      }
      const res = await ApiService.get<any>(url);
      setReportData(res);
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  }, [reportType, selectedRetailer, selectedStaff, startDate, endDate]);

  // ─ Report Type Cards ───────────────────────────────────────────────────────
  const reportTypes: { type: ReportType; label: string; icon: any; color: string }[] = [
    { type: 'retailer',   label: 'Retailer Report',   icon: 'store',             color: '#2563eb' },
    { type: 'staff',      label: 'Staff Report',       icon: 'badge',             color: '#7c3aed' },
    { type: 'collection', label: 'Collection Report',  icon: 'account-balance-wallet', color: '#059669' },
    { type: 'delivery',   label: 'Delivery Report',    icon: 'local-shipping',    color: '#dc2626' },
  ];

  // ─ Selector Modal ──────────────────────────────────────────────────────────
  const SelectorModal = ({
    visible,
    items,
    onClose,
    onSelect,
    title,
  }: {
    visible: boolean;
    items: SelectItem[];
    onClose: () => void;
    onSelect: (i: SelectItem) => void;
    title: string;
  }) => (
    <Modal visible={visible} transparent animationType="slide">
      <View style={T.modalOverlay}>
        <View style={T.modalBox}>
          <View style={T.modalHeader}>
            <Text style={T.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={22} color="#1e293b" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={items}
            keyExtractor={(i) => i._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={T.modalItem}
                onPress={() => { onSelect(item); onClose(); }}
              >
                <MaterialIcons name="chevron-right" size={18} color="#94a3b8" />
                <Text style={T.modalItemText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );

  // ─ Retailer Report View ────────────────────────────────────────────────────
  const RetailerReportView = ({ data }: { data: any }) => (
    <View>
      <View style={T.reportHeader}>
        <Text style={T.reportTitle}>RETAILER LEDGER</Text>
        <Text style={T.reportSubtitle}>{data.retailer?.name}</Text>
        <Text style={T.reportAddress}>{data.retailer?.address}</Text>
        <Text style={T.reportPeriod}>
          {fmt(data.period?.start)} — {fmt(data.period?.end)}
        </Text>
      </View>
      <SummaryBox items={[
        { label: 'Total Bill Amount', value: INR(data.summary?.totalBillAmount), accent: '#1e293b' },
        { label: 'Total Collected',   value: INR(data.summary?.totalCollected),  accent: '#059669' },
        { label: 'Balance Due',       value: INR(data.summary?.totalDue),        accent: '#dc2626' },
      ]} />
      <SectionHeader title="Invoice-wise Ledger" />
      {/* Table Header */}
      <View style={[T.tableRow, T.tableHeaderRow]}>
        <Text style={[T.tableCell, T.tableHeaderCell, { flex: 1.4 }]}>Inv No</Text>
        <Text style={[T.tableCell, T.tableHeaderCell, { flex: 1.2 }]}>Date</Text>
        <Text style={[T.tableCell, T.tableHeaderCell, T.textRight, { flex: 1.2 }]}>Amount</Text>
        <Text style={[T.tableCell, T.tableHeaderCell, T.textRight, { flex: 1.2 }]}>Collected</Text>
        <Text style={[T.tableCell, T.tableHeaderCell, T.textRight, { flex: 1 }]}>Due</Text>
        <Text style={[T.tableCell, T.tableHeaderCell, { flex: 1 }]}>Status</Text>
      </View>
      {(data.data || []).map((row: any, i: number) => (
        <View key={i}>
          <View style={[T.tableRow, i % 2 === 0 ? T.rowEven : T.rowOdd]}>
            <Text style={[T.tableCell, { flex: 1.4, fontWeight: '600' }]}>{row.billNumber}</Text>
            <Text style={[T.tableCell, { flex: 1.2 }]}>{fmt(row.billDate)}</Text>
            <Text style={[T.tableCell, T.textRight, { flex: 1.2 }]}>{INR(row.amount)}</Text>
            <Text style={[T.tableCell, T.textRight, { flex: 1.2, color: '#059669' }]}>{INR(row.collected)}</Text>
            <Text style={[T.tableCell, T.textRight, { flex: 1, color: '#dc2626' }]}>{INR(row.dueAmount)}</Text>
            <Text style={[T.tableCell, { flex: 1 }]}>{row.status}</Text>
          </View>
          {(row.collections || []).map((c: any, j: number) => (
            <View key={j} style={T.subRow}>
              <MaterialIcons name="subdirectory-arrow-right" size={14} color="#94a3b8" />
              <Text style={T.subRowText}>{fmt(c.date)}  •  {c.mode}  •  {INR(c.amount)}  •  by {c.collectedBy}</Text>
            </View>
          ))}
        </View>
      ))}
      {/* Grand Total */}
      <View style={[T.tableRow, T.totalRow]}>
        <Text style={[T.tableCell, { flex: 2.6, fontWeight: '700' }]}>GRAND TOTAL</Text>
        <Text style={[T.tableCell, T.textRight, { flex: 1.2, fontWeight: '700' }]}>{INR(data.summary?.totalBillAmount)}</Text>
        <Text style={[T.tableCell, T.textRight, { flex: 1.2, fontWeight: '700', color: '#059669' }]}>{INR(data.summary?.totalCollected)}</Text>
        <Text style={[T.tableCell, T.textRight, { flex: 2, fontWeight: '700', color: '#dc2626' }]}>{INR(data.summary?.totalDue)}</Text>
      </View>
    </View>
  );

  // ─ Staff Report View ───────────────────────────────────────────────────────
  const StaffReportView = ({ data }: { data: any }) => (
    <View>
      <View style={T.reportHeader}>
        <Text style={T.reportTitle}>STAFF COLLECTION REPORT</Text>
        <Text style={T.reportSubtitle}>{data.staff?.name}</Text>
        <Text style={T.reportAddress}>{data.staff?.email}</Text>
        <Text style={T.reportPeriod}>
          {fmt(data.period?.start)} — {fmt(data.period?.end)}
        </Text>
      </View>
      <SummaryBox items={[
        { label: 'Bills Assigned',   value: String(data.summary?.totalAssigned || 0) },
        { label: 'Total Collected',  value: INR(data.summary?.totalCollectedAmount), accent: '#059669' },
        { label: 'Cash',             value: INR(data.summary?.cash) },
        { label: 'UPI',              value: INR(data.summary?.upi) },
        { label: 'Cheque',           value: INR(data.summary?.cheque) },
        { label: 'Bank Transfer',    value: INR(data.summary?.bankTransfer) },
      ]} />

      <SectionHeader title="Collections Made" />
      <View style={[T.tableRow, T.tableHeaderRow]}>
        <Text style={[T.tableCell, T.tableHeaderCell, { flex: 1.1 }]}>Date</Text>
        <Text style={[T.tableCell, T.tableHeaderCell, { flex: 1.6 }]}>Retailer</Text>
        <Text style={[T.tableCell, T.tableHeaderCell, { flex: 1 }]}>Inv</Text>
        <Text style={[T.tableCell, T.tableHeaderCell, T.textRight, { flex: 1.2 }]}>Amount</Text>
        <Text style={[T.tableCell, T.tableHeaderCell, { flex: 1 }]}>Mode</Text>
      </View>
      {(data.collections || []).map((c: any, i: number) => (
        <View key={i} style={[T.tableRow, i % 2 === 0 ? T.rowEven : T.rowOdd]}>
          <Text style={[T.tableCell, { flex: 1.1 }]}>{fmt(c.date)}</Text>
          <Text style={[T.tableCell, { flex: 1.6 }]} numberOfLines={1}>{c.retailer}</Text>
          <Text style={[T.tableCell, { flex: 1 }]}>{c.billNumber}</Text>
          <Text style={[T.tableCell, T.textRight, { flex: 1.2, color: '#059669', fontWeight: '600' }]}>{INR(c.amount)}</Text>
          <Text style={[T.tableCell, { flex: 1 }]}>{c.mode}</Text>
        </View>
      ))}
      <View style={[T.tableRow, T.totalRow]}>
        <Text style={[T.tableCell, { flex: 4.7, fontWeight: '700' }]}>TOTAL</Text>
        <Text style={[T.tableCell, T.textRight, { flex: 1.2, fontWeight: '700', color: '#059669' }]}>{INR(data.summary?.totalCollectedAmount)}</Text>
        <Text style={[T.tableCell, { flex: 1 }]} />
      </View>

      <SectionHeader title="Assigned Bills" />
      <View style={[T.tableRow, T.tableHeaderRow]}>
        <Text style={[T.tableCell, T.tableHeaderCell, { flex: 1 }]}>Inv No</Text>
        <Text style={[T.tableCell, T.tableHeaderCell, { flex: 1.6 }]}>Retailer</Text>
        <Text style={[T.tableCell, T.tableHeaderCell, T.textRight, { flex: 1.2 }]}>Amount</Text>
        <Text style={[T.tableCell, T.tableHeaderCell, T.textRight, { flex: 1.2 }]}>Due</Text>
        <Text style={[T.tableCell, T.tableHeaderCell, { flex: 1 }]}>Status</Text>
      </View>
      {(data.bills || []).map((b: any, i: number) => (
        <View key={i} style={[T.tableRow, i % 2 === 0 ? T.rowEven : T.rowOdd]}>
          <Text style={[T.tableCell, { flex: 1 }]}>{b.billNumber}</Text>
          <Text style={[T.tableCell, { flex: 1.6 }]} numberOfLines={1}>{b.retailer}</Text>
          <Text style={[T.tableCell, T.textRight, { flex: 1.2 }]}>{INR(b.amount)}</Text>
          <Text style={[T.tableCell, T.textRight, { flex: 1.2, color: '#dc2626' }]}>{INR(b.dueAmount)}</Text>
          <Text style={[T.tableCell, { flex: 1 }]}>{b.status}</Text>
        </View>
      ))}
    </View>
  );

  // ─ Collection Report View ──────────────────────────────────────────────────
  const CollectionReportView = ({ data }: { data: any }) => (
    <View>
      <View style={T.reportHeader}>
        <Text style={T.reportTitle}>COLLECTION REPORT</Text>
        <Text style={T.reportPeriod}>
          {fmt(data.period?.start)} — {fmt(data.period?.end)}
        </Text>
      </View>
      <SummaryBox items={[
        { label: 'Total Entries',    value: String(data.summary?.count || 0) },
        { label: 'Total Collected',  value: INR(data.summary?.totalAmount), accent: '#059669' },
        { label: 'Cash',             value: INR(data.summary?.cash) },
        { label: 'UPI',              value: INR(data.summary?.upi) },
        { label: 'Cheque',           value: INR(data.summary?.cheque) },
        { label: 'Bank Transfer',    value: INR(data.summary?.bankTransfer) },
      ]} />
      <SectionHeader title="Collection Ledger" />
      <View style={[T.tableRow, T.tableHeaderRow]}>
        <Text style={[T.tableCell, T.tableHeaderCell, { flex: 1.1 }]}>Date</Text>
        <Text style={[T.tableCell, T.tableHeaderCell, { flex: 1.5 }]}>Retailer</Text>
        <Text style={[T.tableCell, T.tableHeaderCell, { flex: 0.9 }]}>Inv</Text>
        <Text style={[T.tableCell, T.tableHeaderCell, T.textRight, { flex: 1.2 }]}>Amount</Text>
        <Text style={[T.tableCell, T.tableHeaderCell, { flex: 0.9 }]}>Mode</Text>
        <Text style={[T.tableCell, T.tableHeaderCell, { flex: 1.2 }]}>By</Text>
      </View>
      {(data.data || []).map((c: any, i: number) => (
        <View key={i} style={[T.tableRow, i % 2 === 0 ? T.rowEven : T.rowOdd]}>
          <Text style={[T.tableCell, { flex: 1.1 }]}>{fmt(c.date)}</Text>
          <Text style={[T.tableCell, { flex: 1.5 }]} numberOfLines={1}>{c.retailer}</Text>
          <Text style={[T.tableCell, { flex: 0.9 }]}>{c.billNumber}</Text>
          <Text style={[T.tableCell, T.textRight, { flex: 1.2, color: '#059669', fontWeight: '600' }]}>{INR(c.amount)}</Text>
          <Text style={[T.tableCell, { flex: 0.9 }]}>{c.mode}</Text>
          <Text style={[T.tableCell, { flex: 1.2 }]} numberOfLines={1}>{c.collectedBy}</Text>
        </View>
      ))}
      <View style={[T.tableRow, T.totalRow]}>
        <Text style={[T.tableCell, { flex: 4.5, fontWeight: '700' }]}>GRAND TOTAL</Text>
        <Text style={[T.tableCell, T.textRight, { flex: 1.2, fontWeight: '700', color: '#059669' }]}>{INR(data.summary?.totalAmount)}</Text>
        <Text style={[T.tableCell, { flex: 2.1 }]} />
      </View>
    </View>
  );

  // ─ Delivery Report View ────────────────────────────────────────────────────
  const statusColor: Record<string, string> = {
    Delivered: '#059669',
    'In Transit': '#d97706',
    Pending: '#2563eb',
    Cancelled: '#dc2626',
  };

  const DeliveryReportView = ({ data }: { data: any }) => (
    <View>
      <View style={T.reportHeader}>
        <Text style={T.reportTitle}>DELIVERY REPORT</Text>
        <Text style={T.reportPeriod}>
          {fmt(data.period?.start)} — {fmt(data.period?.end)}
        </Text>
      </View>
      <SummaryBox items={[
        { label: 'Total Deliveries', value: String(data.summary?.totalDeliveries || 0) },
        { label: 'Delivered',        value: String(data.summary?.delivered || 0),  accent: '#059669' },
        { label: 'In Transit',       value: String(data.summary?.inTransit || 0),  accent: '#d97706' },
        { label: 'Pending',          value: String(data.summary?.pending || 0),    accent: '#2563eb' },
        { label: 'Cancelled',        value: String(data.summary?.cancelled || 0),  accent: '#dc2626' },
        { label: 'Total Order Value',value: INR(data.summary?.totalOrderAmount),   accent: '#1e293b' },
      ]} />
      <SectionHeader title="Delivery Register" />
      {(data.data || []).map((d: any, i: number) => (
        <View key={i} style={[T.deliveryCard, i % 2 === 0 ? T.rowEven : T.rowOdd]}>
          <View style={T.deliveryCardHeader}>
            <View style={{ flex: 1 }}>
              <Text style={T.deliveryRetailer}>{d.retailer}</Text>
              <Text style={T.deliveryAddress} numberOfLines={1}>{d.retailerAddress}</Text>
            </View>
            <View style={[T.statusBadge, { backgroundColor: (statusColor[d.status] || '#94a3b8') + '20' }]}>
              <Text style={[T.statusText, { color: statusColor[d.status] || '#94a3b8' }]}>{d.status}</Text>
            </View>
          </View>
          <Divider />
          <TallyRow label="Driver"        value={d.driverName} />
          <TallyRow label="Vehicle"       value={`${d.vehicleNumber} (${d.vehicleType})`} />
          <TallyRow label="Dispatch"      value={fmt(d.dispatchDate)} />
          <TallyRow label="Expected"      value={fmt(d.expectedDate)} />
          {d.actualDate && <TallyRow label="Delivered On" value={fmt(d.actualDate)} />}
          <TallyRow label="Order Amount"  value={INR(d.totalOrderAmount)} bold />
          {(d.orders || []).length > 0 && (
            <View style={T.orderList}>
              {d.orders.map((o: any, j: number) => (
                <Text key={j} style={T.orderItem}>  • {o.orderNumber}  –  {INR(o.amount)}</Text>
              ))}
            </View>
          )}
          {d.remarks ? <Text style={T.remarks}>Remarks: {d.remarks}</Text> : null}
        </View>
      ))}
    </View>
  );

  // ─ Render ──────────────────────────────────────────────────────────────────
  return (
    <View style={T.container}>
      <Header title="Reports" showBack />

      {/* Report Type Selector */}
      <View style={T.typeGrid}>
        {reportTypes.map((rt) => (
          <TouchableOpacity
            key={rt.type}
            style={[T.typeCard, reportType === rt.type && { borderColor: rt.color, backgroundColor: rt.color + '15' }]}
            onPress={() => { setReportType(rt.type); setReportData(null); }}
          >
            <MaterialIcons name={rt.icon} size={26} color={reportType === rt.type ? rt.color : '#64748b'} />
            <Text style={[T.typeLabel, reportType === rt.type && { color: rt.color }]}>{rt.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {reportType && (
        <ScrollView style={T.body} showsVerticalScrollIndicator={false}>
          {/* Filters */}
          <View style={T.filterBox}>
            {/* Retailer selector */}
            {reportType === 'retailer' && (
              <TouchableOpacity style={T.selectButton} onPress={() => setRetailerModal(true)}>
                <MaterialIcons name="store" size={18} color="#2563eb" />
                <Text style={T.selectButtonText}>
                  {selectedRetailer ? selectedRetailer.name : 'Select Retailer'}
                </Text>
                <MaterialIcons name="arrow-drop-down" size={20} color="#2563eb" />
              </TouchableOpacity>
            )}
            {/* Staff selector */}
            {reportType === 'staff' && (
              <TouchableOpacity style={T.selectButton} onPress={() => setStaffModal(true)}>
                <MaterialIcons name="badge" size={18} color="#7c3aed" />
                <Text style={T.selectButtonText}>
                  {selectedStaff ? selectedStaff.name : 'Select Staff'}
                </Text>
                <MaterialIcons name="arrow-drop-down" size={20} color="#7c3aed" />
              </TouchableOpacity>
            )}
            {/* Date range */}
            <View style={T.dateRow}>
              <DatePicker label="From" date={startDate} onChange={setStartDate} />
              <DatePicker label="To"   date={endDate}   onChange={setEndDate} />
            </View>
            <TouchableOpacity
              style={[T.generateBtn, loading && { opacity: 0.6 }]}
              onPress={generateReport}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="#fff" size="small" />
                : <><MaterialIcons name="print" size={18} color="#fff" />
                    <Text style={T.generateBtnText}>Generate Report</Text></>
              }
            </TouchableOpacity>
          </View>

          {/* Report Output */}
          {reportData && (
            <View style={T.reportOutput}>
              {reportType === 'retailer'   && <RetailerReportView   data={reportData} />}
              {reportType === 'staff'      && <StaffReportView      data={reportData} />}
              {reportType === 'collection' && <CollectionReportView data={reportData} />}
              {reportType === 'delivery'   && <DeliveryReportView   data={reportData} />}
            </View>
          )}

          <View style={{ height: 80 }} />
        </ScrollView>
      )}

      {!reportType && (
        <View style={T.emptyState}>
          <MaterialIcons name="description" size={60} color="#cbd5e1" />
          <Text style={T.emptyText}>Select a report type above{'\n'}to get started</Text>
        </View>
      )}

      {/* Modals */}
      <SelectorModal
        visible={retailerModal}
        items={retailers}
        onClose={() => setRetailerModal(false)}
        onSelect={setSelectedRetailer}
        title="Select Retailer"
      />
      <SelectorModal
        visible={staffModal}
        items={staffList}
        onClose={() => setStaffModal(false)}
        onSelect={setSelectedStaff}
        title="Select Staff Member"
      />

      <AdBanner />
    </View>
  );
};

// ─── Styles ──────────────────────────────────────────────────────────────────
const T = StyleSheet.create({
  container:         { flex: 1, backgroundColor: '#f1f5f9' },
  body:              { flex: 1 },

  // Type grid
  typeGrid:          { flexDirection: 'row', flexWrap: 'wrap', padding: 12, gap: 8, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  typeCard:          { flex: 1, minWidth: '45%', alignItems: 'center', padding: 12, borderRadius: 10, borderWidth: 1.5, borderColor: '#e2e8f0', backgroundColor: '#f8fafc', gap: 4 },
  typeLabel:         { fontSize: 12, fontWeight: '600', color: '#64748b', textAlign: 'center' },

  // Filter box
  filterBox:         { margin: 12, backgroundColor: '#fff', borderRadius: 10, padding: 14, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 3 },
  selectButton:      { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, padding: 12, marginBottom: 10, gap: 8, backgroundColor: '#f8fafc' },
  selectButtonText:  { flex: 1, fontSize: 15, color: '#1e293b', fontWeight: '500' },

  // Date
  dateRow:           { flexDirection: 'row', gap: 8, marginBottom: 12 },
  datePicker:        { flex: 1, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, padding: 8, backgroundColor: '#f8fafc' },
  datePickerLabel:   { fontSize: 11, color: '#94a3b8', fontWeight: '600', marginBottom: 4 },
  datePickerRow:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  datePickerValue:   { fontSize: 13, color: '#1e293b', fontWeight: '600' },
  dateBtn:           { padding: 2 },
  dateField:         { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dateFieldLabel:    { fontSize: 12, color: '#94a3b8' },
  dateFieldValue:    { flex: 1, fontSize: 14, color: '#1e293b', fontWeight: '500' },

  // Generate button
  generateBtn:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1e293b', borderRadius: 8, paddingVertical: 13, gap: 8 },
  generateBtnText:   { color: '#fff', fontSize: 15, fontWeight: '700' },

  // Report output container
  reportOutput:      { margin: 12, backgroundColor: '#fff', borderRadius: 10, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 3 },

  // Report header (Tally style)
  reportHeader:      { backgroundColor: '#1e293b', padding: 16, alignItems: 'center' },
  reportTitle:       { fontSize: 16, fontWeight: '800', color: '#fff', letterSpacing: 2 },
  reportSubtitle:    { fontSize: 14, fontWeight: '700', color: '#94a3b8', marginTop: 2 },
  reportAddress:     { fontSize: 12, color: '#64748b', marginTop: 2 },
  reportPeriod:      { fontSize: 12, color: '#7dd3fc', marginTop: 4 },

  // Summary box
  summaryBox:        { flexDirection: 'row', flexWrap: 'wrap', padding: 12, borderBottomWidth: 1, borderBottomColor: '#e2e8f0', backgroundColor: '#f8fafc' },
  summaryItem:       { width: '50%', paddingVertical: 6, paddingHorizontal: 8 },
  summaryLabel:      { fontSize: 11, color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' },
  summaryValue:      { fontSize: 14, fontWeight: '700', color: '#1e293b', marginTop: 2 },

  // Section header
  sectionHeader:     { backgroundColor: '#e2e8f0', paddingHorizontal: 12, paddingVertical: 6 },
  sectionHeaderText: { fontSize: 12, fontWeight: '700', color: '#475569', letterSpacing: 1, textTransform: 'uppercase' },

  // Table
  tableRow:          { flexDirection: 'row', paddingHorizontal: 8, paddingVertical: 7, alignItems: 'center' },
  tableHeaderRow:    { backgroundColor: '#334155' },
  tableHeaderCell:   { color: '#e2e8f0', fontWeight: '700', fontSize: 11 },
  tableCell:         { fontSize: 11, color: '#334155', paddingHorizontal: 2 },
  textRight:         { textAlign: 'right' },
  rowEven:           { backgroundColor: '#fff' },
  rowOdd:            { backgroundColor: '#f8fafc' },
  totalRow:          { backgroundColor: '#1e293b', borderTopWidth: 2, borderTopColor: '#334155' },

  // Sub row
  subRow:            { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 3, backgroundColor: '#f0fdf4' },
  subRowText:        { fontSize: 10, color: '#059669', marginLeft: 4 },

  // Delivery card
  deliveryCard:      { margin: 8, borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0', overflow: 'hidden' },
  deliveryCardHeader:{ flexDirection: 'row', alignItems: 'flex-start', padding: 10 },
  deliveryRetailer:  { fontSize: 14, fontWeight: '700', color: '#1e293b' },
  deliveryAddress:   { fontSize: 11, color: '#94a3b8', marginTop: 2 },
  statusBadge:       { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, marginLeft: 8 },
  statusText:        { fontSize: 11, fontWeight: '700' },

  // Tally row
  tallyRow:          { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  tallyLabel:        { fontSize: 12, color: '#64748b' },
  tallyValue:        { fontSize: 12, color: '#1e293b', fontWeight: '500' },
  boldText:          { fontWeight: '700', fontSize: 13 },

  // Misc
  divider:           { height: 1, backgroundColor: '#e2e8f0', marginVertical: 4 },
  orderList:         { paddingHorizontal: 10, paddingBottom: 4 },
  orderItem:         { fontSize: 11, color: '#64748b', paddingVertical: 2 },
  remarks:           { fontSize: 11, color: '#7c3aed', fontStyle: 'italic', padding: 8 },

  // Empty state
  emptyState:        { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyText:         { fontSize: 15, color: '#94a3b8', textAlign: 'center', lineHeight: 22 },

  // Modal
  modalOverlay:      { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalBox:          { backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: '70%' },
  modalHeader:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  modalTitle:        { fontSize: 16, fontWeight: '700', color: '#1e293b' },
  modalItem:         { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', gap: 8 },
  modalItemText:     { fontSize: 15, color: '#1e293b' },
});

export default ReportPage;
