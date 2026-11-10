import React, { useState } from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  Plus, 
  Download, 
  CheckCheck,
  ChevronDown,
  Building2,
  ExternalLink
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { exportInstitutionsToCSV } from '../../utils/csvExport';
import { NavTab } from './Sidebar';

interface HeaderProps {
  currentTab: NavTab;
  setCurrentTab: (tab: NavTab) => void;
  onOpenSidebar: () => void;
  onOpenAddInstitution: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  onOpenSidebar,
  onOpenAddInstitution,
  searchQuery,
  setSearchQuery
}) => {
  const { institutions, notifications, markAllNotificationsAsRead } = useData();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.read);

  const tabTitles: Record<NavTab, { title: string; subtitle: string }> = {
    dashboard: { title: 'Executive Overview', subtitle: 'Central monitoring & multi-campus SaaS metrics' },
    institutions: { title: 'Institutions Directory', subtitle: 'Comprehensive registry of schools & colleges' },
    administrators: { title: 'Institution Administrators', subtitle: 'Account management & campus head delegation' },
    subscriptions: { title: 'Subscription Plans', subtitle: 'Tiered license tiers, pricing & ARR summaries' },
    reports: { title: 'Reports & Analytics', subtitle: 'Student rosters, campus capacity & financial audits' },
    advertisements: { title: 'Sponsored Campaigns', subtitle: 'In-app promotional banners across campus portals' },
    notifications: { title: 'Broadcast Notifications', subtitle: 'System-wide announcements & campus dispatches' },
    settings: { title: 'Platform Settings', subtitle: 'L.Tech Solutions SaaS configurations & demo storage' },
  };

  const currentInfo = tabTitles[currentTab] || { title: 'EduNexa Portal', subtitle: '' };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="truncate">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight truncate">
              {currentInfo.title}
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block truncate">
              {currentInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Center: Quick Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Quick search campus, ID, or city..."
              className="w-full pl-9 pr-4 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Right: Action Buttons & Notification Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Export CSV */}
          <button
            onClick={() => exportInstitutionsToCSV(institutions)}
            title="Export Institutions CSV"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Export CSV
          </button>

          {/* Add Institution Primary CTA */}
          <button
            onClick={onOpenAddInstitution}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm shadow-teal-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Institution</span>
            <span className="sm:hidden">Add</span>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl relative transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
              )}
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowNotifications(false)} 
                />
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">Notifications</h4>
                      {unreadNotifications.length > 0 && (
                        <span className="text-[10px] font-bold bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full border border-rose-200">
                          {unreadNotifications.length} New
                        </span>
                      )}
                    </div>
                    {unreadNotifications.length > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-xs text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="py-2 max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <p className="text-center py-6 text-xs text-slate-400">No recent notifications</p>
                    ) : (
                      notifications.slice(0, 5).map(n => (
                        <div 
                          key={n.id} 
                          className={`py-2.5 px-2 rounded-lg transition-colors ${
                            !n.read ? 'bg-teal-50/40' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs font-semibold text-slate-900">{n.title}</p>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                              n.priority === 'Urgent' ? 'bg-rose-100 text-rose-700' :
                              n.priority === 'Important' ? 'bg-amber-100 text-amber-700' :
                              'bg-slate-100 text-slate-600'
                            }`}>
                              {n.priority}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{n.message}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            Target: {n.targetInstitutionName}
                          </span>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-center">
                    <button
                      onClick={() => {
                        setCurrentTab('notifications');
                        setShowNotifications(false);
                      }}
                      className="text-xs font-semibold text-teal-600 hover:text-teal-700"
                    >
                      View all broadcast logs →
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
