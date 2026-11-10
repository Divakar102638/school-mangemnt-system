import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Institution, 
  Administrator, 
  SubscriptionPlan, 
  NotificationItem, 
  Advertisement, 
  DashboardStats,
  SubscriptionTier
} from '../types';
import { 
  INITIAL_INSTITUTIONS, 
  INITIAL_ADMINISTRATORS, 
  INITIAL_SUBSCRIPTION_PLANS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_ADVERTISEMENTS 
} from '../data/initialData';
import { initIdSequencesFromData, generateNextInstitutionId } from '../utils/idGenerator';

const STORAGE_SCHEMA_VERSION_KEY = 'edunexa_schema_version';
const CURRENT_VERSION = 'v1.0';

const STORAGE_KEYS = {
  INSTITUTIONS: 'edunexa_institutions_v1',
  ADMINS: 'edunexa_admins_v1',
  PLANS: 'edunexa_plans_v1',
  NOTIFICATIONS: 'edunexa_notifications_v1',
  ADS: 'edunexa_ads_v1',
};

interface DataContextType {
  institutions: Institution[];
  administrators: Administrator[];
  subscriptionPlans: SubscriptionPlan[];
  notifications: NotificationItem[];
  advertisements: Advertisement[];
  stats: DashboardStats;
  
  // Institution Actions
  addInstitution: (data: Omit<Institution, 'createdAt' | 'updatedAt'>) => { success: boolean; id?: string; error?: string };
  updateInstitution: (id: string, data: Partial<Institution>) => { success: boolean; error?: string };
  deleteInstitution: (id: string) => { success: boolean; error?: string };
  toggleInstitutionStatus: (id: string) => void;
  getNextIdForType: (type: Institution['type']) => string;
  
  // Administrator Actions
  addAdministrator: (data: Omit<Administrator, 'id' | 'createdAt' | 'lastLogin'>) => { success: boolean; error?: string };
  updateAdministrator: (id: string, data: Partial<Administrator>) => { success: boolean; error?: string };
  toggleAdministratorStatus: (id: string) => void;
  deleteAdministrator: (id: string) => void;
  
  // Subscription Actions
  assignSubscriptionPlan: (institutionId: string, planTier: SubscriptionTier, customPrice?: number) => void;
  
  // Notification Actions
  addNotification: (data: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;
  
  // Advertisement Actions
  addAdvertisement: (data: Omit<Advertisement, 'id'>) => void;
  toggleAdvertisementStatus: (id: string) => void;
  deleteAdvertisement: (id: string) => void;
  
  // Demo Reset
  resetDemoData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

function safeGetItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.warn(`Failed to parse localStorage key ${key}, falling back to default`, e);
    return fallback;
  }
}

function safeSetItem<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to write to localStorage key ${key}`, e);
  }
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check schema version or initial run
  const [isInitialized, setIsInitialized] = useState(false);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [administrators, setAdministrators] = useState<Administrator[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);

  useEffect(() => {
    const version = localStorage.getItem(STORAGE_SCHEMA_VERSION_KEY);
    if (version !== CURRENT_VERSION) {
      // First boot or schema migration: Seed initial data
      safeSetItem(STORAGE_KEYS.INSTITUTIONS, INITIAL_INSTITUTIONS);
      safeSetItem(STORAGE_KEYS.ADMINS, INITIAL_ADMINISTRATORS);
      safeSetItem(STORAGE_KEYS.PLANS, INITIAL_SUBSCRIPTION_PLANS);
      safeSetItem(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
      safeSetItem(STORAGE_KEYS.ADS, INITIAL_ADVERTISEMENTS);
      localStorage.setItem(STORAGE_SCHEMA_VERSION_KEY, CURRENT_VERSION);
      initIdSequencesFromData(INITIAL_INSTITUTIONS);

      setInstitutions(INITIAL_INSTITUTIONS);
      setAdministrators(INITIAL_ADMINISTRATORS);
      setSubscriptionPlans(INITIAL_SUBSCRIPTION_PLANS);
      setNotifications(INITIAL_NOTIFICATIONS);
      setAdvertisements(INITIAL_ADVERTISEMENTS);
    } else {
      const storedInsts = safeGetItem<Institution[]>(STORAGE_KEYS.INSTITUTIONS, INITIAL_INSTITUTIONS);
      const storedAdmins = safeGetItem<Administrator[]>(STORAGE_KEYS.ADMINS, INITIAL_ADMINISTRATORS);
      const storedPlans = safeGetItem<SubscriptionPlan[]>(STORAGE_KEYS.PLANS, INITIAL_SUBSCRIPTION_PLANS);
      const storedNotifs = safeGetItem<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
      const storedAds = safeGetItem<Advertisement[]>(STORAGE_KEYS.ADS, INITIAL_ADVERTISEMENTS);

      setInstitutions(storedInsts);
      setAdministrators(storedAdmins);
      setSubscriptionPlans(storedPlans);
      setNotifications(storedNotifs);
      setAdvertisements(storedAds);
      initIdSequencesFromData(storedInsts);
    }
    setIsInitialized(true);
  }, []);

  // Save changes to localStorage whenever state changes after initialization
  useEffect(() => {
    if (!isInitialized) return;
    safeSetItem(STORAGE_KEYS.INSTITUTIONS, institutions);
  }, [institutions, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    safeSetItem(STORAGE_KEYS.ADMINS, administrators);
  }, [administrators, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    safeSetItem(STORAGE_KEYS.PLANS, subscriptionPlans);
  }, [subscriptionPlans, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    safeSetItem(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }, [notifications, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    safeSetItem(STORAGE_KEYS.ADS, advertisements);
  }, [advertisements, isInitialized]);

  // Dynamic Dashboard Stats directly derived from stored demo records
  const stats: DashboardStats = {
    totalInstitutions: institutions.length,
    activeInstitutions: institutions.filter(i => i.status === 'Active').length,
    inactiveInstitutions: institutions.filter(i => i.status === 'Inactive').length,
    totalStudents: institutions.reduce((acc, curr) => acc + (curr.studentCount || 0), 0),
    totalStaff: institutions.reduce((acc, curr) => acc + (curr.staffCount || 0), 0),
    totalAdministrators: administrators.length,
    activeSubscriptions: institutions.filter(i => i.subscriptionStatus === 'Active').length,
    annualRevenue: institutions.reduce((acc, curr) => acc + (curr.annualAmount || 0), 0),
  };

  const getNextIdForType = (type: Institution['type']): string => {
    const existingIds = institutions.map(i => i.id);
    return generateNextInstitutionId(type, existingIds);
  };

  const addInstitution = (data: Omit<Institution, 'createdAt' | 'updatedAt'>) => {
    // Prevent duplicate ID
    if (institutions.some(i => i.id.toUpperCase() === data.id.toUpperCase())) {
      return { success: false, error: `Institution ID ${data.id} is already in use. IDs must be unique.` };
    }

    const now = new Date().toISOString();
    const newInstitution: Institution = {
      ...data,
      id: data.id.toUpperCase().trim(),
      createdAt: now,
      updatedAt: now
    };

    // Also auto-create or associate an Administrator record if admin details are provided
    if (data.adminEmail) {
      const newAdmin: Administrator = {
        id: `ADM${String(administrators.length + 1).padStart(3, '0')}`,
        name: data.adminName || 'Campus Administrator',
        email: data.adminEmail,
        phone: data.adminPhone || data.phone || '9999999999',
        institutionId: newInstitution.id,
        institutionName: newInstitution.name,
        status: 'Active',
        role: 'Primary Campus Administrator',
        createdAt: now,
        lastLogin: 'Never'
      };
      setAdministrators(prev => [newAdmin, ...prev]);
    }

    setInstitutions(prev => [newInstitution, ...prev]);
    return { success: true, id: newInstitution.id };
  };

  const updateInstitution = (id: string, data: Partial<Institution>) => {
    const exists = institutions.some(i => i.id === id);
    if (!exists) {
      return { success: false, error: `Institution with ID ${id} not found.` };
    }

    const now = new Date().toISOString();
    setInstitutions(prev =>
      prev.map(item => (item.id === id ? { ...item, ...data, updatedAt: now } : item))
    );

    // Sync admin record if name, email or phone changed
    if (data.adminName || data.adminEmail || data.adminPhone || data.name) {
      setAdministrators(prev =>
        prev.map(admin => {
          if (admin.institutionId === id) {
            return {
              ...admin,
              name: data.adminName || admin.name,
              email: data.adminEmail || admin.email,
              phone: data.adminPhone || admin.phone,
              institutionName: data.name || admin.institutionName
            };
          }
          return admin;
        })
      );
    }

    return { success: true };
  };

  const deleteInstitution = (id: string) => {
    // Delete institution
    setInstitutions(prev => prev.filter(i => i.id !== id));
    // Also remove associated administrator records
    setAdministrators(prev => prev.filter(a => a.institutionId !== id));
    // Note: The ID is NEVER reused because our ID generator tracks the high-water sequence mark!
    return { success: true };
  };

  const toggleInstitutionStatus = (id: string) => {
    setInstitutions(prev =>
      prev.map(inst => {
        if (inst.id === id) {
          const nextStatus = inst.status === 'Active' ? 'Inactive' : 'Active';
          return { ...inst, status: nextStatus, updatedAt: new Date().toISOString() };
        }
        return inst;
      })
    );
  };

  const addAdministrator = (data: Omit<Administrator, 'id' | 'createdAt' | 'lastLogin'>) => {
    if (administrators.some(a => a.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, error: 'An administrator with this email already exists.' };
    }

    const now = new Date().toISOString();
    const newAdmin: Administrator = {
      ...data,
      id: `ADM${String(administrators.length + 1).padStart(3, '0')}`,
      createdAt: now,
      lastLogin: 'Never'
    };

    setAdministrators(prev => [newAdmin, ...prev]);
    return { success: true };
  };

  const updateAdministrator = (id: string, data: Partial<Administrator>) => {
    setAdministrators(prev =>
      prev.map(admin => (admin.id === id ? { ...admin, ...data } : admin))
    );
    return { success: true };
  };

  const toggleAdministratorStatus = (id: string) => {
    setAdministrators(prev =>
      prev.map(admin => {
        if (admin.id === id) {
          const nextStatus = admin.status === 'Active' ? 'Disabled' : 'Active';
          return { ...admin, status: nextStatus };
        }
        return admin;
      })
    );
  };

  const deleteAdministrator = (id: string) => {
    setAdministrators(prev => prev.filter(admin => admin.id !== id));
  };

  const assignSubscriptionPlan = (institutionId: string, planTier: SubscriptionTier, customPrice?: number) => {
    const plan = subscriptionPlans.find(p => p.id === planTier);
    const amount = customPrice !== undefined ? customPrice : (plan ? plan.pricePerYear : 49999);
    const capacity = plan ? plan.maxStudents : 1000;

    // Calculate dates: 1 year from today
    const now = new Date();
    const startDate = now.toISOString().split('T')[0];
    const expiry = new Date(now);
    expiry.setFullYear(expiry.getFullYear() + 1);
    const expiryDate = expiry.toISOString().split('T')[0];

    updateInstitution(institutionId, {
      subscriptionPlan: planTier,
      annualAmount: amount,
      studentCapacity: capacity,
      subscriptionStartDate: startDate,
      subscriptionExpiryDate: expiryDate,
      subscriptionStatus: 'Active'
    });
  };

  const addNotification = (data: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) => {
    const newNotif: NotificationItem = {
      ...data,
      id: `NOTIF${String(Date.now()).slice(-5)}`,
      createdAt: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const addAdvertisement = (data: Omit<Advertisement, 'id'>) => {
    const newAd: Advertisement = {
      ...data,
      id: `AD${String(Date.now()).slice(-4)}`
    };
    setAdvertisements(prev => [newAd, ...prev]);
  };

  const toggleAdvertisementStatus = (id: string) => {
    setAdvertisements(prev =>
      prev.map(ad => (ad.id === id ? { ...ad, status: ad.status === 'Active' ? 'Inactive' : 'Active' } : ad))
    );
  };

  const deleteAdvertisement = (id: string) => {
    setAdvertisements(prev => prev.filter(ad => ad.id !== id));
  };

  const resetDemoData = () => {
    safeSetItem(STORAGE_KEYS.INSTITUTIONS, INITIAL_INSTITUTIONS);
    safeSetItem(STORAGE_KEYS.ADMINS, INITIAL_ADMINISTRATORS);
    safeSetItem(STORAGE_KEYS.PLANS, INITIAL_SUBSCRIPTION_PLANS);
    safeSetItem(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    safeSetItem(STORAGE_KEYS.ADS, INITIAL_ADVERTISEMENTS);
    localStorage.setItem(STORAGE_SCHEMA_VERSION_KEY, CURRENT_VERSION);
    initIdSequencesFromData(INITIAL_INSTITUTIONS);

    setInstitutions(INITIAL_INSTITUTIONS);
    setAdministrators(INITIAL_ADMINISTRATORS);
    setSubscriptionPlans(INITIAL_SUBSCRIPTION_PLANS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAdvertisements(INITIAL_ADVERTISEMENTS);
  };

  return (
    <DataContext.Provider
      value={{
        institutions,
        administrators,
        subscriptionPlans,
        notifications,
        advertisements,
        stats,
        addInstitution,
        updateInstitution,
        deleteInstitution,
        toggleInstitutionStatus,
        getNextIdForType,
        addAdministrator,
        updateAdministrator,
        toggleAdministratorStatus,
        deleteAdministrator,
        assignSubscriptionPlan,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,
        addAdvertisement,
        toggleAdvertisementStatus,
        deleteAdvertisement,
        resetDemoData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
