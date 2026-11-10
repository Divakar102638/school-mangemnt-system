export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

export function isValidPhone(phone: string): boolean {
  // Allow Indian and international phone formats (10-15 digits, optional + or dashes)
  const phoneRegex = /^(\+?[0-9]{1,4}[\s-]?)?[0-9]{10,12}$/;
  const clean = phone.replace(/[\s-]/g, '');
  return clean.length >= 10 && phoneRegex.test(phone.trim());
}

export function validateInstitutionForm(data: {
  id: string;
  name: string;
  type: string;
  principalName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  studentCapacity: number;
  studentCount?: number;
  annualAmount: number;
  subscriptionStartDate: string;
  subscriptionExpiryDate: string;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
}, existingIds: string[], isEditing = false, originalId?: string): ValidationResult {
  const errors: Record<string, string> = {};

  // ID validation
  if (!data.id || !data.id.trim()) {
    errors.id = 'Institution ID is required';
  } else if (!isEditing || (originalId && data.id !== originalId)) {
    if (existingIds.includes(data.id.trim().toUpperCase())) {
      errors.id = `Institution ID "${data.id.trim().toUpperCase()}" already exists. IDs must be unique.`;
    }
  }

  // Name validation
  if (!data.name || data.name.trim().length < 3) {
    errors.name = 'Institution Name must be at least 3 characters';
  }

  // Principal Name
  if (!data.principalName || data.principalName.trim().length < 2) {
    errors.principalName = 'Principal Name is required';
  }

  // Email
  if (!data.email || !isValidEmail(data.email)) {
    errors.email = 'Please provide a valid institutional email (e.g. info@school.edu)';
  }

  // Phone
  if (!data.phone || !isValidPhone(data.phone)) {
    errors.phone = 'Please provide a valid 10-digit phone number';
  }

  // City & State
  if (!data.city || data.city.trim().length < 2) {
    errors.city = 'City is required';
  }
  if (!data.state || data.state.trim().length < 2) {
    errors.state = 'State is required';
  }

  // Numeric checks: student count and capacity
  if (data.studentCapacity < 1) {
    errors.studentCapacity = 'Student capacity must be greater than zero';
  }
  if (data.studentCount !== undefined && data.studentCount < 0) {
    errors.studentCount = 'Student count cannot be negative';
  }
  if (data.studentCount !== undefined && data.studentCount > data.studentCapacity) {
    errors.studentCount = 'Student count cannot exceed student capacity';
  }
  if (data.annualAmount < 0) {
    errors.annualAmount = 'Annual amount cannot be negative';
  }

  // Dates
  if (!data.subscriptionStartDate) {
    errors.subscriptionStartDate = 'Subscription start date is required';
  }
  if (!data.subscriptionExpiryDate) {
    errors.subscriptionExpiryDate = 'Subscription expiry date is required';
  } else if (data.subscriptionStartDate && data.subscriptionExpiryDate) {
    const start = new Date(data.subscriptionStartDate);
    const expiry = new Date(data.subscriptionExpiryDate);
    if (expiry <= start) {
      errors.subscriptionExpiryDate = 'Subscription expiry date must be after the start date';
    }
  }

  // Administrator Info
  if (!data.adminName || data.adminName.trim().length < 2) {
    errors.adminName = 'Administrator Name is required';
  }
  if (!data.adminEmail || !isValidEmail(data.adminEmail)) {
    errors.adminEmail = 'Valid administrator email is required';
  }
  if (!data.adminPhone || !isValidPhone(data.adminPhone)) {
    errors.adminPhone = 'Valid administrator phone number is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function validateAdministratorForm(data: {
  name: string;
  email: string;
  phone: string;
  institutionId: string;
}, existingEmails: string[], isEditing = false, originalEmail?: string): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Administrator Name is required';
  }
  if (!data.email || !isValidEmail(data.email)) {
    errors.email = 'Valid email is required';
  } else if (!isEditing || (originalEmail && data.email.toLowerCase() !== originalEmail.toLowerCase())) {
    if (existingEmails.map(e => e.toLowerCase()).includes(data.email.trim().toLowerCase())) {
      errors.email = 'An administrator with this email already exists';
    }
  }
  if (!data.phone || !isValidPhone(data.phone)) {
    errors.phone = 'Valid phone number is required (10 digits)';
  }
  if (!data.institutionId) {
    errors.institutionId = 'Please select an assigned institution';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
