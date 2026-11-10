import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Advertisement } from '../types';
import { 
  Megaphone, 
  Plus, 
  Eye, 
  Trash2, 
  Building2, 
  Calendar, 
  ExternalLink,
  ShieldAlert,
  Image as ImageIcon
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { formatDate } from '../utils/formatters';

export const AdvertisementsPage: React.FC = () => {
  const { advertisements, institutions, addAdvertisement, toggleAdvertisementStatus, deleteAdvertisement } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewAd, setPreviewAd] = useState<Advertisement | null>(null);

  // Form State
  const [advertiserName, setAdvertiserName] = useState('');
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [targetId, setTargetId] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [clickUrl, setClickUrl] = useState('');
  const [error, setError] = useState('');

  const openAddModal = () => {
    setAdvertiserName('');
    setTitle('');
    setImageUrl('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80');
    setTargetId('ALL');
    const today = new Date().toISOString().split('T')[0];
    const nextMonth = new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0];
    setStartDate(today);
    setEndDate(nextMonth);
    setClickUrl('https://example.com/promo');
    setError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!advertiserName.trim() || !title.trim() || !startDate || !endDate) {
      setError('Please fill in all required fields.');
      return;
    }

    const targetInst = institutions.find(i => i.id === targetId);
    const targetName = targetId === 'ALL' ? 'All Campuses' : (targetInst ? targetInst.name : 'Selected Campus');

    addAdvertisement({
      advertiserName: advertiserName.trim(),
      title: title.trim(),
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
      targetInstitutionId: targetId,
      targetInstitutionName: targetName,
      startDate,
      endDate,
      status: 'Active',
      clickUrl: clickUrl.trim() || undefined
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-teal-600" />
            Sponsored Educational Campaigns
          </h2>
          <p className="text-xs text-slate-500">
            Manage institutional sponsor banners, STEM equipment promos, and publisher discounts.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md shadow-teal-600/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Advertisement
        </button>
      </div>

      {/* Notice */}
      <div className="p-3 bg-slate-100/80 border border-slate-200 rounded-xl flex items-center gap-2 text-xs text-slate-600">
        <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
        <span>
          <strong>Prototype Notice:</strong> These ad placements are managed for internal demonstration. No real third-party ad networks (e.g. Google AdSense) are active.
        </span>
      </div>

      {/* Ads Grid */}
      {advertisements.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="No advertisements created"
          description="Create your first sponsored campaign banner for campus portals."
          actionLabel="Add Advertisement"
          onAction={openAddModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advertisements.map(ad => (
            <div
              key={ad.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                {/* Banner Thumbnail */}
                <div className="h-40 w-full relative bg-slate-900 overflow-hidden group">
                  <img
                    src={ad.imageUrl}
                    alt={ad.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute top-3 right-3">
                    <Badge variant={ad.status === 'Active' ? 'success' : 'neutral'} dot size="sm">
                      {ad.status}
                    </Badge>
                  </div>
                  <div className="absolute bottom-2 left-3 text-[10px] bg-slate-900/80 text-white px-2 py-0.5 rounded backdrop-blur-xs">
                    {ad.advertiserName}
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 space-y-2">
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-2">{ad.title}</h4>
                  
                  <div className="space-y-1 text-xs text-slate-500 pt-1">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span className="truncate">Target: {ad.targetInstitutionName}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{formatDate(ad.startDate)} – {formatDate(ad.endDate)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => toggleAdvertisementStatus(ad.id)}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  {ad.status === 'Active' ? 'Pause Campaign' : 'Resume Campaign'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewAd(ad)}
                    className="p-1.5 text-slate-500 hover:text-teal-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                    title="Live Banner Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteAdvertisement(ad.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                    title="Delete Ad"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Advertisement Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Sponsored Advertisement"
        subtitle="Configure banner visuals and campaign duration."
        maxWidth="lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Advertiser / Sponsor Name *
            </label>
            <input
              type="text"
              value={advertiserName}
              onChange={(e) => setAdvertiserName(e.target.value)}
              placeholder="e.g. Pearson Academic Publications"
              className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Advertisement Title / Tagline *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 2027 STEM Curriculum Kits for Science Labs"
              className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Banner Image URL *
            </label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Institution *
              </label>
              <select
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="ALL">All Institutions</option>
                {institutions.map(inst => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name} ({inst.id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Click URL
              </label>
              <input
                type="text"
                value={clickUrl}
                onChange={(e) => setClickUrl(e.target.value)}
                placeholder="https://..."
                className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Campaign Start Date *
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Campaign End Date *
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
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
              Publish Campaign
            </button>
          </div>
        </form>
      </Modal>

      {/* Live Preview Modal */}
      {previewAd && (
        <Modal
          isOpen={!!previewAd}
          onClose={() => setPreviewAd(null)}
          title={`Campus Banner Preview: ${previewAd.advertiserName}`}
          subtitle="How this banner appears to students & faculty in campus portals."
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden border border-slate-300 shadow-md">
              <img
                src={previewAd.imageUrl}
                alt={previewAd.title}
                className="w-full h-56 object-cover"
              />
              <div className="p-4 bg-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block">
                    Sponsored By {previewAd.advertiserName}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-0.5">{previewAd.title}</h4>
                </div>
                {previewAd.clickUrl && (
                  <a
                    href={previewAd.clickUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-600 text-white rounded-lg text-xs font-semibold hover:bg-teal-700 shrink-0"
                  >
                    Visit Offer <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setPreviewAd(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Close Preview
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
