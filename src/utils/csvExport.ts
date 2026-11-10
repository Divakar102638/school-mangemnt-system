import { Institution } from '../types';

export function exportInstitutionsToCSV(institutions: Institution[], filename = 'EduNexa_Institutions_Report.csv') {
  if (!institutions || institutions.length === 0) {
    alert('No institution records to export.');
    return;
  }

  const headers = [
    'Institution ID',
    'Institution Name',
    'Type',
    'City',
    'State',
    'Postal Code',
    'Principal Name',
    'Official Email',
    'Phone',
    'Student Count',
    'Student Capacity',
    'Staff Count',
    'Subscription Plan',
    'Annual Amount (INR)',
    'Start Date',
    'Expiry Date',
    'Subscription Status',
    'Status',
    'Administrator Name',
    'Administrator Email',
    'Administrator Phone'
  ];

  const escapeCSV = (value: string | number | undefined | null): string => {
    if (value === undefined || value === null) return '""';
    const str = String(value).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = institutions.map(inst => [
    escapeCSV(inst.id),
    escapeCSV(inst.name),
    escapeCSV(inst.type),
    escapeCSV(inst.city),
    escapeCSV(inst.state),
    escapeCSV(inst.postalCode),
    escapeCSV(inst.principalName),
    escapeCSV(inst.email),
    escapeCSV(inst.phone),
    escapeCSV(inst.studentCount),
    escapeCSV(inst.studentCapacity),
    escapeCSV(inst.staffCount),
    escapeCSV(inst.subscriptionPlan),
    escapeCSV(inst.annualAmount),
    escapeCSV(inst.subscriptionStartDate),
    escapeCSV(inst.subscriptionExpiryDate),
    escapeCSV(inst.subscriptionStatus),
    escapeCSV(inst.status),
    escapeCSV(inst.adminName),
    escapeCSV(inst.adminEmail),
    escapeCSV(inst.adminPhone)
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
