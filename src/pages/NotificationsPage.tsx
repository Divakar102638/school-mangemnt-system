import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { NotificationItem } from '../types';
import { 
  Bell, 
  Plus, 
  CheckCheck, 
  Trash2, 
  Building2, 
  AlertCircle, 
  Info, 
  AlertTriangle,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { formatDate } from '../utils/formatters';
import { EmptyState } from '../components/common/EmptyState';

export const NotificationsPage: React.FC = () => {
  const { 
    notifications, 
    institutions, 
    addNotification, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    deleteNotification 
  } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetId, setTargetId] = useState('ALL');
  const [priority, setPriority] = useState<'Info' | 'Important' | 'Urgent'>('Info');
  const [error, setError] = useState('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      setError('Title and message are required.');
      return;
    }

    const targetInst = institutions.find(i => i.id === targetId);
    const targetName = targetId === 'ALL' ? 'All Campuses' : (targetInst ? targetInst.name : 'Selected Campus');

    addNotification({
      title: title.trim(),
      message: message.trim(),
      targetInstitutionId: targetId,
      targetInstitutionName: targetName,
      priority
    });

    setTitle('');
    setMessage('');
    setTargetId('ALL');
    setPriority('Info');
    setError('');
    setIsModalOpen(false);
  };

  const priorityBadge = (p: string) => {
    if (p === 'Urgent') return 'danger';
    if (p === 'Important') return 'warning';
    return 'info';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="w-5 h-5 text-teal-600" />
            Central Broadcast & Campus Notifications
          </h2>
          <p className="text-xs text-slate-500">
            Send platform announcements, maintenance notices, and regulatory alerts to campus administrators.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {notifications.some(n => !n.read) && (
            <button
              onClick={markAllNotificationsAsRead}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-2xs transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5 text-teal-600" />
              Mark All Read
            </button>
          )}

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md shadow-teal-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Announcement
          </button>
        </div>
      </div>

      {/* Prototype Disclaimer Banner */}
      <div className="p-3 bg-slate-100/80 border border-slate-200 rounded-xl flex items-center gap-2 text-xs text-slate-600">
        <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
        <span>
          <strong>Local Prototype Notice:</strong> These announcements are simulated within your browser session. No real SMS, email, or push notifications are dispatched in Phase 1.
        </span>
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No broadcast notifications"
          description="You haven't dispatched any announcements yet. Create one to test campus notifications."
          actionLabel="Create Announcement"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="space-y-3">
          {notifications.map(item => (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all ${
                !item.read
                  ? 'bg-white border-teal-300 shadow-sm shadow-teal-500/5 ring-1 ring-teal-500/10'
                  : 'bg-white border-slate-200 opacity-90'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{item.title}</span>
                    <Badge variant={priorityBadge(item.priority) as any} size="sm">
                      {item.priority}
                    </Badge>
                    {!item.read && (
                      <span className="text-[10px] font-bold bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full border border-teal-200">
                        Unread
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{item.message}</p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1 font-medium text-slate-600">
                      <Building2 className="w-3.5 h-3.5 text-teal-600" />
                      Target: {item.targetInstitutionName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
                  {!item.read && (
                    <button
                      onClick={() => markNotificationAsRead(item.id)}
                      className="px-2.5 py-1 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors cursor-pointer"
                    >
                      Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Announcement Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Broadcast Campus Announcement"
        subtitle="Compose a platform dispatch for all or designated institutions."
        maxWidth="lg"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Announcement Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Scheduled System Maintenance / Board Exam Updates"
              className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Detailed Message *
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter announcement details for school administrators..."
              className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Audience *
              </label>
              <select
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="ALL">All Institutions (Network Broadcast)</option>
                {institutions.map(inst => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name} ({inst.id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Priority Level *
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="Info">Info (Standard Announcement)</option>
                <option value="Important">Important (Action Needed)</option>
                <option value="Urgent">Urgent (Immediate Attention)</option>
              </select>
            </div>
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
              Dispatch Announcement
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
