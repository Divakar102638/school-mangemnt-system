import React, { useState, useEffect } from 'react';
import { Institution, InstitutionType, SubscriptionTier, SubscriptionStatus } from '../../types';
import { useData } from '../../context/DataContext';
import { Modal } from '../common/Modal';
import { validateInstitutionForm } from '../../utils/validators';
import { Building2, User, CreditCard, MapPin, Image as ImageIcon, Sparkles } from 'lucide-react';

interface InstitutionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  institutionToEdit?: Institution | null;
}

export const InstitutionFormModal: React.FC<InstitutionFormModalProps> = ({
  isOpen,
  onClose,
  institutionToEdit
}) => {
  const { institutions, addInstitution, updateInstitution, getNextIdForType, subscriptionPlans } = useData();

  const isEditing = !!institutionToEdit;

  // Form State
  const [activeTab, setActiveTab] = useState<'basic' | 'contact' | 'subscription' | 'admin'>('basic');
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState<InstitutionType>('School');
  const [logo, setLogo] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [establishedYear, setEstablishedYear] = useState<number>(new Date().getFullYear());

  const [principalName, setPrincipalName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Telangana');
  const [postalCode, setPostalCode] = useState('');

  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionTier>('Standard');
  const [studentCapacity, setStudentCapacity] = useState<number>(800);
  const [studentCount, setStudentCount] = useState<number>(0);
  const [staffCount, setStaffCount] = useState<number>(25);
  const [classesCount, setClassesCount] = useState<number>(10);
  const [annualAmount, setAnnualAmount] = useState<number>(49999);
  const [subscriptionStartDate, setSubscriptionStartDate] = useState('');
  const [subscriptionExpiryDate, setSubscriptionExpiryDate] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>('Active');

  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset or Populate form when modal opens
  useEffect(() => {
    if (isOpen) {
      setErrors({});
      setActiveTab('basic');

      if (institutionToEdit) {
        setId(institutionToEdit.id);
        setName(institutionToEdit.name);
        setType(institutionToEdit.type);
        setLogo(institutionToEdit.logo);
        setCoverImage(institutionToEdit.coverImage);
        setEstablishedYear(institutionToEdit.establishedYear);
        setPrincipalName(institutionToEdit.principalName);
        setEmail(institutionToEdit.email);
        setPhone(institutionToEdit.phone);
        setAddress(institutionToEdit.address);
        setCity(institutionToEdit.city);
        setState(institutionToEdit.state);
        setPostalCode(institutionToEdit.postalCode);
        setSubscriptionPlan(institutionToEdit.subscriptionPlan);
        setStudentCapacity(institutionToEdit.studentCapacity);
        setStudentCount(institutionToEdit.studentCount);
        setStaffCount(institutionToEdit.staffCount);
        setClassesCount(institutionToEdit.classesCount);
        setAnnualAmount(institutionToEdit.annualAmount);
        setSubscriptionStartDate(institutionToEdit.subscriptionStartDate);
        setSubscriptionExpiryDate(institutionToEdit.subscriptionExpiryDate);
        setSubscriptionStatus(institutionToEdit.subscriptionStatus);
        setAdminName(institutionToEdit.adminName);
        setAdminEmail(institutionToEdit.adminEmail);
        setAdminPhone(institutionToEdit.adminPhone);
      } else {
        // Auto-generate fresh unique sequential ID for the default type
        const newId = getNextIdForType('School');
        setId(newId);
        setName('');
        setType('School');
        setLogo('https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=128&auto=format&fit=crop&q=80');
        setCoverImage('https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&auto=format&fit=crop&q=80');
        setEstablishedYear(2015);
        setPrincipalName('');
        setEmail('');
        setPhone('');
        setAddress('');
        setCity('');
        setState('Telangana');
        setPostalCode('');
        
        // Subscription defaults
        setSubscriptionPlan('Standard');
        setStudentCapacity(800);
        setStudentCount(0);
        setStaffCount(25);
        setClassesCount(12);
        setAnnualAmount(49999);
        
        const today = new Date();
        const start = today.toISOString().split('T')[0];
        const nextYear = new Date(today);
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        const expiry = nextYear.toISOString().split('T')[0];
        setSubscriptionStartDate(start);
        setSubscriptionExpiryDate(expiry);
        setSubscriptionStatus('Active');

        setAdminName('');
        setAdminEmail('');
        setAdminPhone('');
      }
    }
  }, [isOpen, institutionToEdit]);

  // When type changes on a new institution, re-generate appropriate prefix ID
  const handleTypeChange = (newType: InstitutionType) => {
    setType(newType);
    if (!isEditing) {
      const generatedId = getNextIdForType(newType);
      setId(generatedId);
    }
  };

  // When subscription plan changes, update capacity and pricing defaults
  const handlePlanChange = (planId: SubscriptionTier) => {
    setSubscriptionPlan(planId);
    const plan = subscriptionPlans.find(p => p.id === planId);
    if (plan) {
      setAnnualAmount(plan.pricePerYear);
      setStudentCapacity(plan.maxStudents);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const existingIds = institutions.map(i => i.id);
    const validation = validateInstitutionForm(
      {
        id,
        name,
        type,
        principalName,
        email,
        phone,
        city,
        state,
        studentCapacity,
        studentCount,
        annualAmount,
        subscriptionStartDate,
        subscriptionExpiryDate,
        adminName,
        adminEmail,
        adminPhone
      },
      existingIds,
      isEditing,
      institutionToEdit?.id
    );

    if (!validation.isValid) {
      setErrors(validation.errors);
      // Auto-navigate to tab containing the error
      if (validation.errors.name || validation.errors.id) {
        setActiveTab('basic');
      } else if (validation.errors.principalName || validation.errors.email || validation.errors.phone || validation.errors.city || validation.errors.state) {
        setActiveTab('contact');
      } else if (validation.errors.studentCapacity || validation.errors.studentCount || validation.errors.subscriptionStartDate || validation.errors.subscriptionExpiryDate || validation.errors.annualAmount) {
        setActiveTab('subscription');
      } else if (validation.errors.adminName || validation.errors.adminEmail || validation.errors.adminPhone) {
        setActiveTab('admin');
      }
      return;
    }

    if (isEditing && institutionToEdit) {
      const res = updateInstitution(institutionToEdit.id, {
        name: name.trim(),
        type,
        logo: logo.trim() || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=128&auto=format&fit=crop&q=80',
        coverImage: coverImage.trim() || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&auto=format&fit=crop&q=80',
        establishedYear: Number(establishedYear),
        principalName: principalName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        postalCode: postalCode.trim(),
        subscriptionPlan,
        studentCapacity: Number(studentCapacity),
        studentCount: Number(studentCount),
        staffCount: Number(staffCount),
        classesCount: Number(classesCount),
        annualAmount: Number(annualAmount),
        subscriptionStartDate,
        subscriptionExpiryDate,
        subscriptionStatus,
        adminName: adminName.trim(),
        adminEmail: adminEmail.trim().toLowerCase(),
        adminPhone: adminPhone.trim()
      });

      if (!res.success) {
        setErrors({ general: res.error || 'Failed to update institution' });
        return;
      }
    } else {
      const res = addInstitution({
        id: id.trim().toUpperCase(),
        name: name.trim(),
        type,
        logo: logo.trim() || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=128&auto=format&fit=crop&q=80',
        coverImage: coverImage.trim() || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&auto=format&fit=crop&q=80',
        establishedYear: Number(establishedYear),
        principalName: principalName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        postalCode: postalCode.trim(),
        subscriptionPlan,
        studentCapacity: Number(studentCapacity),
        studentCount: Number(studentCount),
        staffCount: Number(staffCount),
        classesCount: Number(classesCount),
        annualAmount: Number(annualAmount),
        subscriptionStartDate,
        subscriptionExpiryDate,
        subscriptionStatus,
        status: 'Active',
        adminName: adminName.trim(),
        adminEmail: adminEmail.trim().toLowerCase(),
        adminPhone: adminPhone.trim()
      });

      if (!res.success) {
        setErrors({ general: res.error || 'Failed to register institution' });
        return;
      }
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Institution — ${institutionToEdit?.name}` : 'Register New Institution Campus'}
      subtitle="Complete the required institutional, subscription, and administrative credentials."
      maxWidth="3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error banner */}
        {errors.general && (
          <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-xl">
            {errors.general}
          </div>
        )}

        {/* Tab navigation within modal */}
        <div className="flex border-b border-slate-200 overflow-x-auto gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`pb-2.5 px-3 text-xs font-semibold whitespace-nowrap border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'basic'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            1. Basic Information
            {(errors.name || errors.id) && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('contact')}
            className={`pb-2.5 px-3 text-xs font-semibold whitespace-nowrap border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'contact'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            2. Contact & Address
            {(errors.principalName || errors.email || errors.phone || errors.city) && (
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('subscription')}
            className={`pb-2.5 px-3 text-xs font-semibold whitespace-nowrap border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'subscription'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            3. Subscription & Capacity
            {(errors.studentCapacity || errors.studentCount || errors.subscriptionExpiryDate) && (
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('admin')}
            className={`pb-2.5 px-3 text-xs font-semibold whitespace-nowrap border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'admin'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            4. Campus Administrator
            {(errors.adminName || errors.adminEmail || errors.adminPhone) && (
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            )}
          </button>
        </div>

        {/* Tab 1: Basic Information */}
        {activeTab === 'basic' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Institution Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Institution Type *
                </label>
                <select
                  value={type}
                  onChange={(e) => handleTypeChange(e.target.value as InstitutionType)}
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="School">School (SCH)</option>
                  <option value="Intermediate College">Intermediate College (COL)</option>
                  <option value="Degree College">Degree College (DEG)</option>
                  <option value="Engineering College">Engineering College (ENG)</option>
                  <option value="Other">Other (OTH)</option>
                </select>
              </div>

              {/* Unique Institution ID */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Institution ID *
                  </label>
                  {!isEditing && (
                    <span className="text-[10px] text-teal-700 font-medium flex items-center gap-0.5">
                      <Sparkles className="w-3 h-3" /> Auto-Generated
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value.toUpperCase())}
                  disabled={isEditing} // keep ID stable during edit
                  placeholder="SCH001"
                  className={`w-full text-xs sm:text-sm px-3 py-2 font-mono font-bold tracking-wider rounded-lg border focus:ring-2 focus:outline-none uppercase ${
                    isEditing ? 'bg-slate-100 text-slate-500 cursor-not-allowed border-slate-200' :
                    errors.id ? 'border-rose-400 bg-rose-50 text-rose-800' : 'bg-slate-50 border-slate-200 focus:ring-teal-500'
                  }`}
                />
                {errors.id && <p className="text-[11px] text-rose-600 mt-1">{errors.id}</p>}
              </div>

              {/* Established Year */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Established Year *
                </label>
                <input
                  type="number"
                  min="1800"
                  max={new Date().getFullYear()}
                  value={establishedYear}
                  onChange={(e) => setEstablishedYear(parseInt(e.target.value) || 2020)}
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Institution Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Institution Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sunrise International School"
                className={`w-full text-xs sm:text-sm px-3 py-2 rounded-lg border focus:ring-2 focus:outline-none ${
                  errors.name ? 'border-rose-400 bg-rose-50' : 'bg-slate-50 border-slate-200 focus:ring-teal-500'
                }`}
              />
              {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>}
            </div>

            {/* Logo & Cover Photo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Logo Image URL
                </label>
                <input
                  type="text"
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                  placeholder="https://... logo image url"
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none truncate"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Campus Cover Photo URL
                </label>
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://... campus banner image url"
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none truncate"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Contact & Location */}
        {activeTab === 'contact' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Principal / Dean Name *
                </label>
                <input
                  type="text"
                  value={principalName}
                  onChange={(e) => setPrincipalName(e.target.value)}
                  placeholder="Dr. Rajeshwar Rao"
                  className={`w-full text-xs sm:text-sm px-3 py-2 rounded-lg border focus:ring-2 focus:outline-none ${
                    errors.principalName ? 'border-rose-400 bg-rose-50' : 'bg-slate-50 border-slate-200 focus:ring-teal-500'
                  }`}
                />
                {errors.principalName && <p className="text-[11px] text-rose-600 mt-1">{errors.principalName}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="info@institution.edu.in"
                  className={`w-full text-xs sm:text-sm px-3 py-2 rounded-lg border focus:ring-2 focus:outline-none ${
                    errors.email ? 'border-rose-400 bg-rose-50' : 'bg-slate-50 border-slate-200 focus:ring-teal-500'
                  }`}
                />
                {errors.email && <p className="text-[11px] text-rose-600 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Phone Number *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9849012345"
                  className={`w-full text-xs sm:text-sm px-3 py-2 rounded-lg border focus:ring-2 focus:outline-none ${
                    errors.phone ? 'border-rose-400 bg-rose-50' : 'bg-slate-50 border-slate-200 focus:ring-teal-500'
                  }`}
                />
                {errors.phone && <p className="text-[11px] text-rose-600 mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Street Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Plot 42, Hitec City Road, Madhapur"
                className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Hyderabad"
                  className={`w-full text-xs sm:text-sm px-3 py-2 rounded-lg border focus:ring-2 focus:outline-none ${
                    errors.city ? 'border-rose-400 bg-rose-50' : 'bg-slate-50 border-slate-200 focus:ring-teal-500'
                  }`}
                />
                {errors.city && <p className="text-[11px] text-rose-600 mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="Telangana"
                  className={`w-full text-xs sm:text-sm px-3 py-2 rounded-lg border focus:ring-2 focus:outline-none ${
                    errors.state ? 'border-rose-400 bg-rose-50' : 'bg-slate-50 border-slate-200 focus:ring-teal-500'
                  }`}
                />
                {errors.state && <p className="text-[11px] text-rose-600 mt-1">{errors.state}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="500081"
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Subscription & Quota */}
        {activeTab === 'subscription' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subscription Tier *
                </label>
                <select
                  value={subscriptionPlan}
                  onChange={(e) => handlePlanChange(e.target.value as SubscriptionTier)}
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="Starter">Starter (Up to 300 students - ₹24,999/yr)</option>
                  <option value="Standard">Standard (301–800 students - ₹49,999/yr)</option>
                  <option value="Premium">Premium (801–1,500 students - ₹79,999/yr)</option>
                  <option value="Enterprise">Enterprise (1,501–2,500+ students - ₹1,19,999/yr)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Annual Subscription Fee (INR ₹) *
                </label>
                <input
                  type="number"
                  min="0"
                  value={annualAmount}
                  onChange={(e) => setAnnualAmount(Number(e.target.value))}
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Student Capacity *
                </label>
                <input
                  type="number"
                  min="1"
                  value={studentCapacity}
                  onChange={(e) => setStudentCapacity(Number(e.target.value))}
                  className={`w-full text-xs sm:text-sm px-3 py-2 rounded-lg border focus:ring-2 focus:outline-none ${
                    errors.studentCapacity ? 'border-rose-400 bg-rose-50' : 'bg-slate-50 border-slate-200 focus:ring-teal-500'
                  }`}
                />
                {errors.studentCapacity && <p className="text-[11px] text-rose-600 mt-1">{errors.studentCapacity}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Enrolled Students
                </label>
                <input
                  type="number"
                  min="0"
                  max={studentCapacity}
                  value={studentCount}
                  onChange={(e) => setStudentCount(Number(e.target.value))}
                  className={`w-full text-xs sm:text-sm px-3 py-2 rounded-lg border focus:ring-2 focus:outline-none ${
                    errors.studentCount ? 'border-rose-400 bg-rose-50' : 'bg-slate-50 border-slate-200 focus:ring-teal-500'
                  }`}
                />
                {errors.studentCount && <p className="text-[11px] text-rose-600 mt-1">{errors.studentCount}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Staff Count
                </label>
                <input
                  type="number"
                  min="0"
                  value={staffCount}
                  onChange={(e) => setStaffCount(Number(e.target.value))}
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Classes / Sections
                </label>
                <input
                  type="number"
                  min="0"
                  value={classesCount}
                  onChange={(e) => setClassesCount(Number(e.target.value))}
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subscription Start Date *
                </label>
                <input
                  type="date"
                  value={subscriptionStartDate}
                  onChange={(e) => setSubscriptionStartDate(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subscription Expiry Date *
                </label>
                <input
                  type="date"
                  value={subscriptionExpiryDate}
                  onChange={(e) => setSubscriptionExpiryDate(e.target.value)}
                  className={`w-full text-xs sm:text-sm px-3 py-2 rounded-lg border focus:ring-2 focus:outline-none ${
                    errors.subscriptionExpiryDate ? 'border-rose-400 bg-rose-50' : 'bg-slate-50 border-slate-200 focus:ring-teal-500'
                  }`}
                />
                {errors.subscriptionExpiryDate && (
                  <p className="text-[11px] text-rose-600 mt-1">{errors.subscriptionExpiryDate}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  License Status
                </label>
                <select
                  value={subscriptionStatus}
                  onChange={(e) => setSubscriptionStatus(e.target.value as SubscriptionStatus)}
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Expired">Expired</option>
                  <option value="Pending">Pending Payment</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Campus Primary Administrator */}
        {activeTab === 'admin' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="p-3.5 bg-teal-50/70 border border-teal-200 rounded-xl text-xs text-teal-800">
              Every institution must have a designated primary administrator account. A linked record in <strong>Institution Administrators</strong> will automatically be created/updated with these credentials.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Administrator Full Name *
                </label>
                <input
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  placeholder="Suresh Varma"
                  className={`w-full text-xs sm:text-sm px-3 py-2 rounded-lg border focus:ring-2 focus:outline-none ${
                    errors.adminName ? 'border-rose-400 bg-rose-50' : 'bg-slate-50 border-slate-200 focus:ring-teal-500'
                  }`}
                />
                {errors.adminName && <p className="text-[11px] text-rose-600 mt-1">{errors.adminName}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Administrator Email *
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@institution.edu"
                  className={`w-full text-xs sm:text-sm px-3 py-2 rounded-lg border focus:ring-2 focus:outline-none ${
                    errors.adminEmail ? 'border-rose-400 bg-rose-50' : 'bg-slate-50 border-slate-200 focus:ring-teal-500'
                  }`}
                />
                {errors.adminEmail && <p className="text-[11px] text-rose-600 mt-1">{errors.adminEmail}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Administrator Phone *
                </label>
                <input
                  type="tel"
                  value={adminPhone}
                  onChange={(e) => setAdminPhone(e.target.value)}
                  placeholder="9849012346"
                  className={`w-full text-xs sm:text-sm px-3 py-2 rounded-lg border focus:ring-2 focus:outline-none ${
                    errors.adminPhone ? 'border-rose-400 bg-rose-50' : 'bg-slate-50 border-slate-200 focus:ring-teal-500'
                  }`}
                />
                {errors.adminPhone && <p className="text-[11px] text-rose-600 mt-1">{errors.adminPhone}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer Controls */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            * Fields are validated before saving
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm shadow-teal-600/30 transition-all cursor-pointer"
            >
              {isEditing ? 'Save Changes' : 'Register Institution'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
