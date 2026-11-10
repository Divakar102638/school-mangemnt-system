import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Institution, InstitutionType, InstitutionStatus } from '../types';
import { 
  Building2, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight,
  Download,
  AlertCircle
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmptyState } from '../components/common/EmptyState';
import { formatNumber, formatCurrencyINR } from '../utils/formatters';
import { exportInstitutionsToCSV } from '../utils/csvExport';

interface InstitutionsPageProps {
  onOpenAddModal: () => void;
  onOpenEditModal: (institution: Institution) => void;
  onSelectInstitution: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const InstitutionsPage: React.FC<InstitutionsPageProps> = ({
  onOpenAddModal,
  onOpenEditModal,
  onSelectInstitution,
  searchQuery,
  setSearchQuery
}) => {
  const { institutions, deleteInstitution, toggleInstitutionStatus } = useData();

  // Filters & Sorting state
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'name-asc' | 'name-desc' | 'students-desc' | 'students-asc' | 'newest'>('newest');

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 5;

  // Confirm Delete Dialog state
  const [institutionToDelete, setInstitutionToDelete] = useState<Institution | null>(null);

  // Filtered & Sorted Institutions
  const filteredInstitutions = useMemo(() => {
    return institutions
      .filter((inst) => {
        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = inst.name.toLowerCase().includes(q);
          const matchId = inst.id.toLowerCase().includes(q);
          const matchCity = inst.city.toLowerCase().includes(q);
          const matchPrincipal = inst.principalName.toLowerCase().includes(q);
          if (!matchName && !matchId && !matchCity && !matchPrincipal) return false;
        }

        // Type filter
        if (typeFilter !== 'ALL' && inst.type !== typeFilter) {
          return false;
        }

        // Status filter
        if (statusFilter !== 'ALL' && inst.status !== statusFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
        if (sortBy === 'students-desc') return (b.studentCount || 0) - (a.studentCount || 0);
        if (sortBy === 'students-asc') return (a.studentCount || 0) - (b.studentCount || 0);
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return 0;
      });
  }, [institutions, searchQuery, typeFilter, statusFilter, sortBy]);

  // Pagination slicing
  const totalPages = Math.ceil(filteredInstitutions.length / pageSize) || 1;
  const paginatedInstitutions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredInstitutions.slice(start, start + pageSize);
  }, [filteredInstitutions, currentPage, pageSize]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const planBadgeVariant = (plan: string) => {
    if (plan === 'Enterprise') return 'enterprise';
    if (plan === 'Premium') return 'premium';
    if (plan === 'Standard') return 'standard';
    return 'starter';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-5 h-5 text-teal-600" />
            Institution Campuses Directory
          </h2>
          <p className="text-xs text-slate-500">
            Registered schools, junior colleges, degree colleges, and engineering academies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => exportInstitutionsToCSV(filteredInstitutions)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            Export Filtered CSV
          </button>
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md shadow-teal-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Institution
          </button>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search name, ID, city..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              <option value="ALL">All Campus Types</option>
              <option value="School">School</option>
              <option value="Intermediate College">Intermediate College</option>
              <option value="Degree College">Degree College</option>
              <option value="Engineering College">Engineering College</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              <option value="ALL">All Statuses (Active & Inactive)</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full text-xs px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              <option value="newest">Sort: Newly Registered First</option>
              <option value="name-asc">Sort: Name (A to Z)</option>
              <option value="name-desc">Sort: Name (Z to A)</option>
              <option value="students-desc">Sort: Students (High to Low)</option>
              <option value="students-asc">Sort: Students (Low to High)</option>
            </select>
          </div>
        </div>

        {/* Filter Summary Tags */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div>
            Showing <strong className="text-slate-900">{filteredInstitutions.length}</strong> of{' '}
            <strong className="text-slate-900">{institutions.length}</strong> total institutions
          </div>
          {(typeFilter !== 'ALL' || statusFilter !== 'ALL' || searchQuery) && (
            <button
              onClick={() => {
                setTypeFilter('ALL');
                setStatusFilter('ALL');
                setSearchQuery('');
                setCurrentPage(1);
              }}
              className="text-teal-600 hover:text-teal-700 font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Table or Empty State */}
      {filteredInstitutions.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No institutions found"
          description={
            institutions.length === 0
              ? 'No campuses have been registered yet. Click below to add your first institution.'
              : 'No campuses match your current search and filter criteria. Try clearing filters.'
          }
          actionLabel={institutions.length === 0 ? 'Register First Institution' : 'Clear Filters'}
          onAction={() => {
            if (institutions.length === 0) {
              onOpenAddModal();
            } else {
              setTypeFilter('ALL');
              setStatusFilter('ALL');
              setSearchQuery('');
            }
          }}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Campus & ID</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Enrollment</th>
                  <th className="py-3.5 px-4">Subscription Plan</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedInstitutions.map((inst) => (
                  <tr 
                    key={inst.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    {/* Logo, Name, ID */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={inst.logo}
                          alt={inst.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=128&auto=format&fit=crop&q=80';
                          }}
                        />
                        <div>
                          <button
                            onClick={() => onSelectInstitution(inst.id)}
                            className="font-bold text-slate-900 group-hover:text-teal-700 hover:underline text-left block text-xs sm:text-sm"
                          >
                            {inst.name}
                          </button>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-bold border border-slate-200">
                              {inst.id}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              Est. {inst.establishedYear}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-700 bg-slate-100/70 px-2 py-0.5 rounded text-[11px]">
                        {inst.type}
                      </span>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 font-medium">{inst.city}</div>
                      <div className="text-[11px] text-slate-400">{inst.state}</div>
                    </td>

                    {/* Student count & capacity */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">
                        {formatNumber(inst.studentCount)}
                        <span className="font-normal text-slate-400 text-[11px]"> / {formatNumber(inst.studentCapacity)}</span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {Math.round(((inst.studentCount || 0) / inst.studentCapacity) * 100)}% capacity
                      </div>
                    </td>

                    {/* Subscription Plan */}
                    <td className="py-3.5 px-4">
                      <Badge variant={planBadgeVariant(inst.subscriptionPlan) as any} size="sm">
                        {inst.subscriptionPlan}
                      </Badge>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {formatCurrencyINR(inst.annualAmount)}/yr
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => toggleInstitutionStatus(inst.id)}
                        title="Click to toggle Active/Inactive"
                        className="cursor-pointer"
                      >
                        <Badge variant={inst.status === 'Active' ? 'success' : 'neutral'} dot size="sm">
                          {inst.status}
                        </Badge>
                      </button>
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {/* View Details */}
                        <button
                          onClick={() => onSelectInstitution(inst.id)}
                          title="View Campus Profile"
                          className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => onOpenEditModal(inst)}
                          title="Edit Institution"
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* Delete with warning */}
                        <button
                          onClick={() => setInstitutionToDelete(inst)}
                          title="Delete Institution"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50 text-xs text-slate-600">
            <div>
              Page <strong className="text-slate-900">{currentPage}</strong> of <strong className="text-slate-900">{totalPages}</strong>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className={`p-1.5 rounded-lg border border-slate-200 bg-white flex items-center justify-center ${
                  currentPage === 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-100 cursor-pointer'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePageChange(idx + 1)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold ${
                    currentPage === idx + 1
                      ? 'bg-teal-600 text-white'
                      : 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className={`p-1.5 rounded-lg border border-slate-200 bg-white flex items-center justify-center ${
                  currentPage === totalPages ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-100 cursor-pointer'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Deleting Institution */}
      <ConfirmDialog
        isOpen={!!institutionToDelete}
        title={`Delete "${institutionToDelete?.name}"?`}
        message={`Are you sure you want to delete ${institutionToDelete?.name} (${institutionToDelete?.id})? This will permanently remove its campus configuration, primary admin links, and associated records from this demo. Note: In compliance with enterprise rules, ID "${institutionToDelete?.id}" will NEVER be reused.`}
        confirmLabel="Yes, Delete Campus"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={() => {
          if (institutionToDelete) {
            deleteInstitution(institutionToDelete.id);
            setInstitutionToDelete(null);
          }
        }}
        onCancel={() => setInstitutionToDelete(null)}
      />
    </div>
  );
};
