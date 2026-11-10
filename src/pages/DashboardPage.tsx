import React from 'react';
import { useData } from '../context/DataContext';
import { StatCard } from '../components/common/StatCard';
import { 
  Building2, 
  Users, 
  GraduationCap, 
  Briefcase, 
  CreditCard, 
  IndianRupee, 
  CheckCircle2, 
  XCircle,
  ArrowRight,
  TrendingUp,
  Plus,
  ShieldCheck,
  Calendar,
  Sparkles
} from 'lucide-react';
import { 
  TypeDistributionChart, 
  GrowthBarChart, 
  RevenueBreakdownChart 
} from '../components/charts/InteractiveCharts';
import { formatCurrencyINR, formatNumber, formatDate } from '../utils/formatters';
import { Badge } from '../components/common/Badge';
import { NavTab } from '../components/layout/Sidebar';

interface DashboardPageProps {
  setCurrentTab: (tab: NavTab) => void;
  onOpenAddInstitution: () => void;
  onSelectInstitution: (id: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  setCurrentTab,
  onOpenAddInstitution,
  onSelectInstitution
}) => {
  const { institutions, administrators, stats } = useData();

  // Recent 4 institutions
  const recentInstitutions = [...institutions]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-navy-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-slate-800">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            Central Super Admin Console
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            EduNexa Multi-Campus Command Center
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Real-time management for schools, intermediate colleges, and universities across India. Developed by <strong className="text-teal-300">L.Tech Solutions</strong>.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenAddInstitution}
              className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-teal-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Register New Campus
            </button>
            <button
              onClick={() => setCurrentTab('institutions')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm rounded-xl border border-slate-700 transition-all cursor-pointer"
            >
              Manage All Campuses
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Decorative Graphic element */}
        <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 opacity-15 pointer-events-none">
          <GraduationCap className="w-64 h-64 text-teal-400" />
        </div>
      </div>

      {/* Primary Statistics Grid - Dynamic from Demo Records */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Campuses"
          value={stats.totalInstitutions}
          icon={Building2}
          colorTheme="teal"
          change="+12% YoY"
          subtitle={`${stats.activeInstitutions} Active • ${stats.inactiveInstitutions} Inactive`}
          onClick={() => setCurrentTab('institutions')}
        />
        <StatCard
          title="Total Enrolled Students"
          value={formatNumber(stats.totalStudents)}
          icon={GraduationCap}
          colorTheme="blue"
          change="+8.4%"
          subtitle="Across all affiliated branches"
          onClick={() => setCurrentTab('reports')}
        />
        <StatCard
          title="Campus Faculty & Staff"
          value={formatNumber(stats.totalStaff)}
          icon={Briefcase}
          colorTheme="purple"
          subtitle={`${stats.totalAdministrators} Campus Administrators`}
          onClick={() => setCurrentTab('administrators')}
        />
        <StatCard
          title="Annual License Revenue"
          value={formatCurrencyINR(stats.annualRevenue)}
          icon={IndianRupee}
          colorTheme="emerald"
          change="100% ARR"
          subtitle={`${stats.activeSubscriptions} active annual subscriptions`}
          onClick={() => setCurrentTab('subscriptions')}
        />
      </div>

      {/* Secondary Status Badges Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-semibold text-slate-700">Active Campuses</span>
          </div>
          <span className="text-sm font-bold text-slate-900">{stats.activeInstitutions}</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-700">Inactive Campuses</span>
          </div>
          <span className="text-sm font-bold text-slate-600">{stats.inactiveInstitutions}</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-teal-600" />
            <span className="text-xs font-semibold text-slate-700">Active Subscriptions</span>
          </div>
          <span className="text-sm font-bold text-slate-900">{stats.activeSubscriptions}</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-semibold text-slate-700">Delegated Admins</span>
          </div>
          <span className="text-sm font-bold text-slate-900">{stats.totalAdministrators}</span>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campus Network Growth */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Institution Growth Trends</h3>
              <p className="text-xs text-slate-500">Monthly campus activations & student population scale</p>
            </div>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
              Live Network
            </span>
          </div>
          <GrowthBarChart institutions={institutions} />
        </div>

        {/* Institution Type Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Campus Category Distribution</h3>
              <p className="text-xs text-slate-500">Breakdown by school, junior, degree & engineering colleges</p>
            </div>
            <button
              onClick={() => setCurrentTab('institutions')}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              Filter list →
            </button>
          </div>
          <TypeDistributionChart institutions={institutions} />
        </div>
      </div>

      {/* Subscription & Recent Campuses Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subscription Revenue Overview */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Subscription ARR</h3>
              <p className="text-xs text-slate-500">Contracted revenue by tier</p>
            </div>
            <button
              onClick={() => setCurrentTab('subscriptions')}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700"
            >
              Manage →
            </button>
          </div>
          <RevenueBreakdownChart institutions={institutions} />
        </div>

        {/* Recent Registered Institutions */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Campus Onboardings</h3>
              <p className="text-xs text-slate-500">Latest institutions registered on EduNexa</p>
            </div>
            <button
              onClick={() => setCurrentTab('institutions')}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              View directory ({institutions.length}) →
            </button>
          </div>

          <div className="divide-y divide-slate-100 overflow-x-auto">
            {recentInstitutions.map((inst) => (
              <div 
                key={inst.id}
                onClick={() => onSelectInstitution(inst.id)}
                className="py-3 px-2 flex items-center justify-between hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={inst.logo}
                    alt={inst.name}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=128&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 group-hover:text-teal-700 transition-colors truncate">
                        {inst.name}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                        {inst.id}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span>{inst.type}</span>
                      <span>•</span>
                      <span>{inst.city}, {inst.state}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-slate-900">{formatNumber(inst.studentCount)} Students</p>
                    <p className="text-[11px] text-teal-700 font-medium">{inst.subscriptionPlan} Tier</p>
                  </div>
                  <Badge variant={inst.status === 'Active' ? 'success' : 'neutral'} dot size="sm">
                    {inst.status}
                  </Badge>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
