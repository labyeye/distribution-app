export type RootStackParamList = {
  Login: undefined;
  AdminDashboard: undefined;
  StaffDashboard: undefined;
  BillAdd: undefined;
  BillAssignedToday: undefined;
  BillsPage: undefined;
  BillsHistory: undefined;
  CollectionHistory: undefined;
  DSRCollectionSummary: undefined;
  RetailerAdd: undefined;
  RetailerList: undefined;
  ProductAdd: undefined;
  ProductList: undefined;
  OrderCreate: undefined;
  OrderList: undefined;
  ReportPage: undefined;
  Users: undefined;
};

export type UserRole = 'admin' | 'staff';

export interface User {
  _id: string;
  username: string;
  role: UserRole;
  name: string;
}
