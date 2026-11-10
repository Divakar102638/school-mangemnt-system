import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { Layout } from './components/layout/Layout';
import { NavTab } from './components/layout/Sidebar';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { InstitutionsPage } from './pages/InstitutionsPage';
import { InstitutionDetailPage } from './pages/InstitutionDetailPage';
import { AdministratorsPage } from './pages/AdministratorsPage';
import { SubscriptionsPage } from './pages/SubscriptionsPage';
import { ReportsPage } from './pages/ReportsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { AdvertisementsPage } from './pages/AdvertisementsPage';
import { SettingsPage } from './pages/SettingsPage';
import { InstitutionFormModal } from './components/institutions/InstitutionFormModal';
import { Institution } from './types';

const MainApp: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [institutionToEdit, setInstitutionToEdit] = useState<Institution | null>(null);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const handleOpenAddInstitution = () => {
    setInstitutionToEdit(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditInstitution = (institution: Institution) => {
    setInstitutionToEdit(institution);
    setIsAddModalOpen(true);
  };

  const handleSelectInstitution = (id: string) => {
    setSelectedInstitutionId(id);
    setCurrentTab('institutions');
  };

  const handleTabChange = (tab: NavTab) => {
    setCurrentTab(tab);
    setSelectedInstitutionId(null);
  };

  return (
    <>
      <Layout
        currentTab={currentTab}
        setCurrentTab={handleTabChange}
        onOpenAddInstitution={handleOpenAddInstitution}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      >
        {/* Route to Institution Detail View if an institution is selected */}
        {selectedInstitutionId && currentTab === 'institutions' ? (
          <InstitutionDetailPage
            institutionId={selectedInstitutionId}
            onBack={() => setSelectedInstitutionId(null)}
            onEdit={handleOpenEditInstitution}
          />
        ) : (
          <>
            {currentTab === 'dashboard' && (
              <DashboardPage
                setCurrentTab={handleTabChange}
                onOpenAddInstitution={handleOpenAddInstitution}
                onSelectInstitution={handleSelectInstitution}
              />
            )}

            {currentTab === 'institutions' && (
              <InstitutionsPage
                onOpenAddModal={handleOpenAddInstitution}
                onOpenEditModal={handleOpenEditInstitution}
                onSelectInstitution={handleSelectInstitution}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            )}

            {currentTab === 'administrators' && <AdministratorsPage />}

            {currentTab === 'subscriptions' && <SubscriptionsPage />}

            {currentTab === 'reports' && <ReportsPage />}

            {currentTab === 'advertisements' && <AdvertisementsPage />}

            {currentTab === 'notifications' && <NotificationsPage />}

            {currentTab === 'settings' && <SettingsPage />}
          </>
        )}
      </Layout>

      {/* Global Add/Edit Institution Modal */}
      <InstitutionFormModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setInstitutionToEdit(null);
        }}
        institutionToEdit={institutionToEdit}
      />
    </>
  );
};

export function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <MainApp />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
