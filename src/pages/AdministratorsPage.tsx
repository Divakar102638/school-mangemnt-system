import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Administrator } from '../types';
import { 
  Users, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Building2, 
  Mail, 
  Phone, 
  CheckCircle2, 
  XCircle,
  Filter,
  ShieldCheck
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmptyState } from '../components/common/EmptyState';
import { validateAdministratorForm } from '../utils/validators';
import { formatDate } from '../utils/formatters';

export const AdministratorsPage: React.FC = () => {
  const { 
    administrators, 
    institutions, 
    addAdministrator, 
    updateAdministrator, 
    toggleAdministratorStatus, 
    deleteAdministrator 
  } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Active' | 'Disabled'>('ALL');
  const [institutionFilter, setInstitutionFilter] = useState<string>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminToEdit, setAdminToEdit] = useState<Administrator | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [institutionId, setInstitutionId] = useState('');
  const [role, setRole] = useState('Campus Head Admin');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Confirm delete
  const [adminToDelete, setAdminToDelete] = useState<Administrator | null>(null);

  const filteredAdmins = useMemo(() => {
    return administrators.filter(admin => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = admin.name.toLowerCase().includes(q);
        const matchEmail = admin.email.toLowerCase().includes(q);
        const matchInst = admin.institutionName.toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchInst) return false;
      }
      if (statusFilter !== 'ALL' && admin.status !== statusFilter) return false;
      if (institutionFilter !== 'ALL' && admin.institutionId !== institutionFilter) return false;
      return true;
    });
  }, [administrators, searchQuery, statusFilter, institutionFilter]);

  const openAddModal = () => {
    setAdminToEdit(null);
    setName('');
    setEmail('');
    setPhone('');
    setInstitutionId(institutions[0]?.id || '');
    setRole('Campus Head Admin');
    setErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (admin: Administrator) => {
    setAdminToEdit(admin);
    setName(admin.name);
    setEmail(admin.email);
    setPhone(admin.phone);
    setInstitutionId(admin.institutionId);
    setRole(admin.role);
    setErrors({});
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const existingEmails = administrators.map(a => a.email);
    const validation = validateAdministratorForm(
      { name, email, phone, institutionId },
      existingEmails,
      !!adminToEdit,
      adminToEdit?.email
    );

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    const assignedInst = institutions.find(i => i.id === institutionId);
    const instName = assignedInst ? assignedInst.name : 'Unknown Campus';

    if (adminToEdit) {
      updateAdministrator(adminToEdit.id, {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        institutionId,
        institutionName: instName,
        role: role.trim()
      });
    } else {
      addAdministrator({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        institutionId,
        institutionName: instName,
        role: role.trim(),
        status: 'Active'
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-600" />
            Institution Administrators
          </h2>
          <p className="text-xs text-slate-500">
            Assigned campus principals, deans, and IT administrators across all institutions.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md shadow-teal-600/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Assign Administrator
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or campus..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full text-xs px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              <option value="ALL">All Account Statuses</option>
              <option value="Active">Active Accounts</option>
              <option value="Disabled">Disabled Accounts</option>
            </select>
          </div>

          <div>
            <select
              value={institutionFilter}
              onChange={(e) => setInstitutionFilter(e.target.value)}
              className="w-full text-xs px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              <option value="ALL">All Associated Campuses</option>
              {institutions.map(inst => (
                <option key={inst.id} value={inst.id}>
                  {inst.name} ({inst.id})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Total Administrators: <strong className="text-slate-900">{filteredAdmins.length}</strong></span>
          {(searchQuery || statusFilter !== 'ALL' || institutionFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('ALL');
                setInstitutionFilter('ALL');
              }}
              className="text-teal-600 hover:text-teal-700 font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Admin Table */}
      {filteredAdmins.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No administrators found"
          description="No campus administrator records match your filters."
          actionLabel="Add Administrator"
          onAction={openAddModal}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Administrator</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Associated Institution</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Last Login</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAdmins.map(admin => (
                  <tr key={admin.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center font-bold text-xs shrink-0">
                          {admin.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-xs sm:text-sm">{admin.name}</p>
                          <span className="text-[10px] text-slate-400 font-mono">{admin.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 font-medium">{admin.email}</div>
                      <div className="text-[11px] text-slate-400">+91 {admin.phone}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                        <Building2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>{admin.institutionName}</span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400">ID: {admin.institutionId}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">
                        {admin.role}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => toggleAdministratorStatus(admin.id)}
                        title="Toggle Active/Disabled"
                        className="cursor-pointer"
                      >
                        <Badge variant={admin.status === 'Active' ? 'success' : 'neutral'} dot size="sm">
                          {admin.status}
                        </Badge>
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {admin.lastLogin === 'Never' ? 'Never logged in' : formatDate(admin.lastLogin)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => openEditModal(admin)}
                          title="Edit Administrator"
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setAdminToDelete(admin)}
                          title="Delete Administrator"
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
        </div>
      )}

      {/* Add / Edit Administrator Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={adminToEdit ? `Edit Administrator: ${adminToEdit.name}` : 'Assign New Campus Administrator'}
        subtitle="Associate an administrator account with an existing institution campus."
        maxWidth="lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Administrator Full Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Suresh Varma"
              className={`w-full text-xs sm:text-sm px-3 py-2 rounded-lg border focus:ring-2 focus:outline-none ${
                errors.name ? 'border-rose-400 bg-rose-50' : 'bg-slate-50 border-slate-200 focus:ring-teal-500'
              }`}
            />
            {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Official Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@school.edu"
                className={`w-full text-xs sm:text-sm px-3 py-2 rounded-lg border focus:ring-2 focus:outline-none ${
                  errors.email ? 'border-rose-400 bg-rose-50' : 'bg-slate-50 border-slate-200 focus:ring-teal-500'
                }`}
              />
              {errors.email && <p className="text-[11px] text-rose-600 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9849012346"
                className={`w-full text-xs sm:text-sm px-3 py-2 rounded-lg border focus:ring-2 focus:outline-none ${
                  errors.phone ? 'border-rose-400 bg-rose-50' : 'bg-slate-50 border-slate-200 focus:ring-teal-500'
                }`}
              />
              {errors.phone && <p className="text-[11px] text-rose-600 mt-1">{errors.phone}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Assigned Institution *
            </label>
            <select
              value={institutionId}
              onChange={(e) => setInstitutionId(e.target.value)}
              className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
            >
              {institutions.map(inst => (
                <option key={inst.id} value={inst.id}>
                  {inst.name} ({inst.id}) - {inst.city}
                </option>
              ))}
            </select>
            {errors.institutionId && <p className="text-[11px] text-rose-600 mt-1">{errors.institutionId}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Role / Designation
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Campus Head Admin, Academic Dean"
              className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm"
            >
              {adminToEdit ? 'Save Changes' : 'Assign Administrator'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!adminToDelete}
        title={`Delete Administrator: ${adminToDelete?.name}?`}
        message={`Are you sure you want to remove ${adminToDelete?.name} from ${adminToDelete?.institutionName}? This user will no longer be able to log in to their campus portal.`}
        confirmLabel="Yes, Remove Admin"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={() => {
          if (adminToDelete) {
            deleteAdministrator(adminToDelete.id);
            setAdminToDelete(null);
          }
        }}
        onCancel={() => setAdminToDelete(null)}
      />
    </div>
  );
};
