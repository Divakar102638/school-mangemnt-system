export type InstitutionType = 
  | 'School' 
  | 'Intermediate College' 
  | 'Degree College' 
  | 'Engineering College' 
  | 'Other';

export type SubscriptionTier = 
  | 'Starter' 
  | 'Standard' 
  | 'Premium' 
  | 'Enterprise';

export type SubscriptionStatus = 
  | 'Active' 
  | 'Inactive' 
  | 'Expired' 
  | 'Pending';

export type InstitutionStatus = 'Active' | 'Inactive';

export interface Institution {
  id: string; // e.g. SCH001, COL001, ENG001, DEG001, OTH001
  name: string;
  type: InstitutionType;
  logo: string;
  coverImage: string;
  establishedYear: number;
  
  // Contact Info
  principalName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  
  // Subscription Info
  subscriptionPlan: SubscriptionTier;
  studentCapacity: number;
  studentCount: number;
  staffCount: number;
  classesCount: number;
  annualAmount: number;
  subscriptionStartDate: string;
  subscriptionExpiryDate: string;
  subscriptionStatus: SubscriptionStatus;
  
  // Status
  status: InstitutionStatus;
  
  // Primary Administrator Info
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface Administrator {
  id: string;
  name: string;
  email: string;
  phone: string;
  institutionId: string;
  institutionName: string;
  status: 'Active' | 'Disabled';
  role: string;
  createdAt: string;
  lastLogin: string;
}

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  studentLimitRange: string;
  maxStudents: number;
  pricePerYear: number;
  description: string;
  features: string[];
  popular?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  targetInstitutionId: string; // 'ALL' or specific institutionId
  targetInstitutionName: string;
  priority: 'Info' | 'Important' | 'Urgent';
  createdAt: string;
  read: boolean;
}

export interface Advertisement {
  id: string;
  advertiserName: string;
  title: string;
  imageUrl: string;
  targetInstitutionId: string; // 'ALL' or specific institutionId
  targetInstitutionName: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Inactive';
  clickUrl?: string;
}

export interface UserSession {
  email: string;
  name: string;
  role: string;
  avatar: string;
  isAuthenticated: boolean;
  loginTime: string;
}

export interface DashboardStats {
  totalInstitutions: number;
  activeInstitutions: number;
  inactiveInstitutions: number;
  totalStudents: number;
  totalStaff: number;
  totalAdministrators: number;
  activeSubscriptions: number;
  annualRevenue: number;
}
